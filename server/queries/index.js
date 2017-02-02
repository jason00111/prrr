import knex from '../knex'
import moment from 'moment'
import Github from '../Github'
import Metrics from './metrics'

export default class Queries {

  constructor(currentUser, _knex=knex){
    this.currentUser = currentUser
    this.knex = _knex
    if (this.currentUser)
      this.github = new Github(this.currentUser.github_access_token)
  }

  getUserByGithubId(githubId){
    return this.knex
      .select('*')
      .from('users')
      .where('github_id', githubId)
      .first()
  }

  getUserByGithubUsername(githubUsername){
    return this.knex
      .select('*')
      .from('users')
      .where('github_username', githubUsername)
      .first()
  }

  getAllPrrrs(){
    return this.knex
      .select('*')
      .from('prrrs')
      .join('pull_requests')
      .on('prrrs.pull_request_id', '=', 'pull_requestas.id')
      .then(convertArrayOfPrrrsIntoHashById)
  }

  getPrrrs(){
    return this.knex
      .select('*')
      .from('prrrs')
      .join('pull_requests')
      .on('prrrs.pull_request_id', '=', 'pull_requests.id')
      .where('skipped_at', null)
      .andWhere('owner', this.currentUser.github_username)
      .orderBy('created_at')
      .then(convertArrayOfPrrrsIntoHashById)

  }

  getNextPendingPrrr(){
    return this.knex
      .select('*')
      .from('prrrs')
      .join('pull_requests')
      .on('prrrs.pull_request_id', '=', 'pull_request_id')
      .whereNotIn('prrrs.id', {
        .select('prrrs.id')
        .from('prrrs')
        .join('reviews')
        .on('reviews.prrr_id = prrrs.id')
        .whereNot('reviews.created_at', null)
        .where('reviews.skipped_at', null)
        .where('reviews.completed_at', null)
      })
      .whereNotIn('prrrs.id',{
        .select('prrrs.id')
        .from('prrrs')
        .join('reviews')
        .on('reviews.prrr_id', '=', 'pull_request_id')
        .whereNot('reviews.prrr_id', null)
      })
      .whereNot('prrrs.id', {
        .select('prrrs.id')
        .from('prrrs')
        .join('reviews')
        .on('reviews.prrr_id', '=', 'prrrs.id')
        .whereNot('reviews.skipped_at', null)
        .where('reviews.github_username', this.currentUser.github_username)
      })


  }

  getPrrrForPullRequest(pullRequest){
    return this.knex
      .select('*')
      .from('pull_request_review_requests')
      .where({
        owner: pullRequest.base.repo.owner.login,
        repo: pullRequest.base.repo.name,
        number: pullRequest.number,
      })
      .first()
  }

  metricsForWeek(week){
    return new Metrics({week, queries: this}).load()
  }
}

const convertArrayOfPrrrsIntoHashById = prrrs =>
  prrrs.reduce((prrrs, prrr) => {
    prrrs[prrr.id] = prrr
    return prrrs
  }, {})
