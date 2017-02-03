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
      .join('pull_requests', 'prrrs.pull_request_id', '=', 'pull_requestas.id')
      .then(convertArrayOfPrrrsIntoHashById)
  }

  getPrrrs(){
    const github_username = this.currentUser.github_username
    return this.knex
      .select(
        'prrrs.archived_at',
        'reviews.created_at as claimed_at',
        'reviews.github_username as claimed_by',
        'reviews.completed_at',
        'prrrs.created_at',
        'prrrs.id',
        'pull_requests.number',
        'pull_requests.owner',
        'pull_requests.repo',
        'requesters.github_username as requested_by')
      .from('pull_requests')
      .fullOuterJoin('prrrs', 'pull_requests.id', '=', 'prrrs.pull_request_id')
      .fullOuterJoin('requesters', 'requesters.prrr_id', '=', 'prrrs.id')
      .fullOuterJoin('reviews', 'reviews.prrr_id', '=', 'prrrs.id')
      .where('requesters.github_username', github_username)
      .orWhere(function() {
        this
          .where('reviews.github_username', github_username)
          .where('reviews.skipped_at', null)
      })
      .then(convertArrayOfPrrrsIntoHashById)
  }

  getPrrrById(prrrId){  //this may need to return more information
    return this.knex
      .select('*')
      .from('pull_requests')
      .join('prrrs', 'pull_requests.id', '=', 'prrrs.pull_request_id')
      .where('prrrs.id', prrrId)
      .then(firstRecord)
  }

  getNextPendingPrrr(){
    return this.knex
      .select('*')
      .from('prrrs')
      .join('pull_requests', 'prrrs.pull_request_id', '=', 'pull_requests.id')
      .whereNotIn('prrrs.id',
        this.knex
          .select('prrrs.id')
          .from('prrrs')
          .join('reviews', 'reviews.prrr_id', '=', 'prrrs.id')
          .whereNot('reviews.created_at', null)
          .where('reviews.skipped_at', null)
          .where('reviews.completed_at', null)
      )
      .whereNotIn('prrrs.id',
        this.knex
          .select('prrrs.id')
          .from('prrrs')
          .join('reviews', 'reviews.prrr_id', '=', 'prrrs.id')
          .whereNot('reviews.completed_at', null)
      )
      .whereNotIn('prrrs.id',
        this.knex
          .select('prrrs.id')
          .from('prrrs')
          .join('reviews', 'reviews.prrr_id', '=', 'prrrs.id')
          .whereNot('reviews.skipped_at', null)
          .where('reviews.github_username', this.currentUser.github_username)
      )
      .orderBy('prrrs.created_at')
      .then(firstRecord)
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

const firstRecord = records => records[0]
