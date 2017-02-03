import knex from '../knex'
import Queries from '../queries'
import Github from '../Github'
import request from 'request-promise'
import logger from '../logger'

export default class Commands {

  constructor(currentUser, _knex=knex){
    this.currentUser = currentUser
    this.knex = _knex
    this.queries = new Queries(currentUser, _knex)
    if (this.currentUser)
      this.github = new Github(this.currentUser.github_access_token)
  }

  as(user){
    return new this.constructor(user, this.knex)
  }

  createRecord(table, attributes){
    return this.knex
      .table(table)
      .insert(attributes)
      .returning('*')
      .then(firstRecord)
  }

  createUser(attributes){
    attributes.created_at = attributes.updated_at = new Date
    return this.createRecord('users', attributes)
  }

  findOrCreateUserFromGithubProfile({accessToken, refreshToken, profile}){
    const userAttributes = {
      name: profile.displayName || profile.username,
      email: profile.emails[0].value,
      avatar_url: (
        profile.photos &&
        profile.photos[0] &&
        profile.photos[0].value
      ),
      github_id: profile.id,
      github_username: profile.username,
      github_access_token: accessToken,
      github_refresh_token: refreshToken,
    }
    return this.knex
      .table('users')
      .where('github_id', profile.id)
      .first('*')
      .then(user => user ? user : this.createUser(userAttributes))
  }

  createPrrr({owner, repo, number}){
    return this.github.pullRequests.get({owner, repo, number})
      .catch(originalError => {
        const error = new Error('Pull Request Not Found')
        error.originalError = originalError
        error.status = 400
        throw error
      })
      .then(() =>
        this.knex
          .select('id')
          .from('pull_requests')
          .where('owner', '=', owner)
          .where('repo', '=', repo)
          .where('number', '=', number)
      )
      .then(prArray => {
        if (prArray[0]) return prArray
        else return this.knex
          .table('pull_requests')
          .insert({
            owner,
            repo,
            number
          })
          .returning('id')
      })
      .then(prIdArray => {
        const pull_request_id = prIdArray[0].id

        return this.knex
          .table('prrrs')
          .insert({
            pull_request_id: pull_request_id,
            created_at: new Date
          })
      })
  }

  markPullRequestAsClaimed(prrrId) { //rename to newPullReview
    return this.knex
      .table('reviews')
      .insert({
        prrr_id: prrrId,
        github_username: this.currentUser.github_username,
        created_at: new Date
      })
      .then(() => this.queries.getPrrrById(prrrId))
  }

  claimPrrr(){
    return this.queries.getNextPendingPrrr()
      .then(prrr =>
        prrr
          ? this.markPullRequestAsClaimed(prrr.id)
          : null
      )
  }

  unclaimPrrr(prrrId){
    return this.knex('reviews')
      .where('id', prrrId)
      .where('github_username', this.currentUser.github_username)
      .del()
      .then(() => this.queries.getPrrrById(prrr_id))
  }

  skipPrrr(prrrId){
    logger.debug('skipPrrr', {prrrId})

    return this.knex
      .table('reviews')
      .where('id', prrrId)
      .where('github_username', this.currentUser.github_username)
      .update({
        skipped_at: new Date
      })
      .then(() => this.queries.getPrrrById(prrr_id))
      .then(skippedPrrr => {
        skippedPrrr.skipped = true

        return ({
          newClaimedPrrr: this.claimPrrr(prrr_id),
          skippedPrrr
        })
      })
  }

  unclaimStalePrrrs(prrr){
    return this.knex
      .table('reviews')
      .whereRaw(`created_at <= NOW() - '1 hour'::INTERVAL`)
      .whereNull('completed_at')
      .whereNull('skipped_at')
      .del()
  }

  archivePrrr(prrrId){
    return this.knex
      .table('prrrs')
      .update({
        archived_at: new Date,
      })
      .where('id', prrrId)
      .returning('*')
      .then(firstRecord)
  }

  completePrrr(prrrId){
    return this.knex
    .table('reviews')
    .update({
      completed_at: new Date,
    })
    .where('id', prrrId)
    .returning('*')
    .then(firstRecord)
  }
}

const firstRecord = records => records[0]
