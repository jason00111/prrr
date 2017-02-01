exports.up = knex => {
  return Promise.all([



    knex.schema.createTable('pull_requests', table => {
      table.integer('id').primary()
      table.string('owner').notNullable()
      table.string('repo').notNullable()
      table.integer('number').notNullable()
    })

    knex.schema.createTable('prrrs', table => {
      table.integer('id').primary()
      table.integer('pull_request_id')
           .references('id').inTable('pull_requests') //remove
      table.timestamps()
      table.timestamp('archived_at')
    })

    knex.schema.createTable('requesters', table => {
      table.number('prrr_id')
           .references('id').inTable('prrrs')
      table.number('github_username')
           .references('github_username').inTable('users')
    })

    knex.schema.createTable('reviews', table => {
      table.integer('id').primary()
      table.integer('prrr_id')
           .references('id').inTable('prrrs')
      table.integer('github_username')
           .references('github_username').inTable('users')
      table.timestamps()
      table.timestamp('completed_at')
      table.timestamp('abandoned_at')
    })

  ])
  .then(_ => knex.select('*').from('pull_request_review_requests'))
  .then(prrrs => {

    const queries = prrrs.map(prrr => {
      return knext........
    })
    return Promise.all(queries)
  })
  .then(_ => {

  })

*****
  const prrrs = knex.select('*').from('pull_request_review_requests')

  prrrs.forEach(prrr => {
    return knex.table('pull_requests')
      .insert({
        owner: prrr.owner
        repo: prrr.repo
        number: prrr.number
      })
      .returning(['id', 'created_at', 'archived_at'])
      .then(returnedPRArray => {
        const pullRequest = returnedArray[0]

        return knex.table('prrrs')
          .insert({
            pull_request_id: pullRequest.id,
            created_at: prrr.created_at,
            archived_at: prrr.archived_at
          })
          .returning('id')
      })
      .then(returnedReviewRequestArray => {
        const reviewRequestId = returnedReviewRequestArray[0].id

        const queries = []
        queries.push(knex.table('requesters')
          .insert({
            prrr_id: reviewRequestId,
            github_username: prrr.owner
          })
        )

        if (prrr.owner !== prrr.requested_by) {
          queries.push(
            knex.table('requesters')
            .insert({
              prrr_id: reviewRequestId,
              github_username: prrr.requested_by
            })
          )
        }

        queries.push(
          knex.table('reviews')
            .insert({
              prrr_id: reviewRequestId,
              github_username: prrr.claimed_by,
              created_at: prrr.claimed_at,
              completed_at: prrr.completed_at
            })
        )

        return Primise.all(queries)
      })

  })

  knex.schema.dropTable('pull_request_review_requests')
}

exports.down = knex => {
  throw new Error('Irreversable migration')
}
