exports.up = knex => {
  knex.schema.createTable('pull_requests', table => {
    table.integer('id').primary()
    table.string('owner').notNullable()
    table.string('repo').notNullable()
    table.integer('number').notNullable()
  })

  knex.schema.createTable('review_requests', table => {
    table.integer('id').primary()
    table.integer('pull_request_id')
         .references('id').inTable('pull_requests')
    table.timestamp('created_at')
    table.timestamp('archived_at')
  })

  knex.schema.createTable('requesters', table => {
    table.number('review_request_id')
         .references('id').inTable('review_requests')
    table.number('user_github_name')
         .references('github_username').inTable('users')
  })

  knex.schema.createTable('reviews', table => {
    table.integer('id').primary()
    table.integer('review_request_id')
         .references('id').inTable('review_requests')
    table.integer('user_github_name')
         .references('github_username').inTable('users')
    table.timestamp('created_at')
    table.timestamp('completed_at')
    table.timestamp('abandoned_at')
  })

  const prrrs = knex.select('*').from('pull_request_review_requests')

  prrrs.forEach(prrr => {
    knex.table('pull_requests')
        .insert({
          owner: prrr.owner
          repo: prrr.repo
          number: prrr.number
        })
        .returning(['id', 'created_at', 'archived_at'])
        .then(returnedPRArray => {
          const pullRequest = returnedArray[0]

          return knex.table('review_requests')
              .insert({
                pull_request_id: pullRequest.id,
                created_at: pullRequest.created_at,
                archived_at: pullRequest.archived_at
              })
              .returning('id')
        })
        .then(returnedReviewRequestArray => {
          const reviewRequestId = returnedReviewRequestArray[0].id

          knex.table('requesters')
              .insert({
                review_request_id: reviewRequestId,
                user_github_name: prrr.owner
              })

          if (prrr.owner !== prrr.requested_by) {
            knex.table('requesters')
                .insert({
                  review_request_id: reviewRequestId,
                  user_github_name: prrr.requested_by
                })
          }

          knex.table('reviews')
              .insert({
                review_request_id: reviewRequestId,
                user_github_name: prrr.claimed_by,
                created_at: prrr.claimed_at,
                completed_at: prrr.completed_at
              })
        })

  })

  knex.schema.dropTable('pull_request_review_requests')
}

exports.down = knex => {
  knex.schema.createTable('pull_request_review_requests', table => {
    table.increments('id').primary()
    table.string('owner').notNullable()
    table.string('repo').notNullable()
    table.integer('number').notNullable()
    table.string('requested_by').notNullable() // github_username
    table.string('claimed_by') // github_username
    table.timestamp('claimed_at')
    table.timestamps()
    table.unique(['owner', 'repo', 'number'])
    table.string('completed_at')
    table.timestamp('archived_at')
  })



}
