exports.up = knex => {
  return Promise.all([

    knex.schema.createTable('pull_requests', table => {
      table.increments('id').primary()
      table.string('owner').notNullable()
      table.string('repo').notNullable()
      table.integer('number').notNullable()
    }),

    knex.schema.createTable('prrrs', table => {
      table.increments('id').primary()
      table.integer('pull_request_id').notNullable()
      table.timestamp('archived_at')
      table.timestamps()
    }),

    knex.schema.createTable('requesters', table => {
      table.integer('prrr_id').notNullable()
      table.string('github_username').notNullable()
    }),

    knex.schema.createTable('reviews', table => {
      table.increments('id').primary()
      table.integer('prrr_id').notNullable()
      table.string('github_username').notNullable()
      table.timestamp('completed_at')
      table.timestamp('skipped_at')
      table.timestamps()
    })

  ])
  .then(_ => knex.select('*').from('pull_request_review_requests'))
  .then(oldPrrrs => {

    const queries1 = oldPrrrs.map(oldPrrr => {
      return knex.table('pull_requests')
        .insert({
          owner: oldPrrr.owner,
          repo: oldPrrr.repo,
          number: oldPrrr.number
        })
        .returning('id')
        .then(returnedPRArray => {
          const pullRequestId = returnedPRArray[0]

          return Promise.all([
            knex.table('prrrs')
              .insert({
                pull_request_id: pullRequestId,
                created_at: oldPrrr.created_at,
                archived_at: oldPrrr.archived_at
              })
              .returning('id'),

            knex.select('*').from('skipped_prrrs')
          ])
        })
        .then(resultsArray => {
          const returnedPrrrArray = resultsArray[0]
          const returnedSkipArray = resultsArray[1]

          const newPrrrId = returnedPrrrArray[0]

          const filteredSkippedArray = returnedSkipArray.filter(skipped =>
            skipped.prrr_id === oldPrrr.id
          )

          const queries2 = []

          filteredSkippedArray.forEach(skipped =>
            queries2.push(knex.table('reviews')
              .insert({
                prrr_id: newPrrrId,
                github_username: skipped.github_username,
                skipped_at: skipped.skipped_at,
                created_at: skipped.skipped_at
              })
            )
          )

          queries2.push(knex.table('requesters')
            .insert({
              prrr_id: newPrrrId,
              github_username: oldPrrr.owner
            })
          )

          if (oldPrrr.owner !== oldPrrr.requested_by) {
            queries2.push(
              knex.table('requesters')
              .insert({
                prrr_id: newPrrrId,
                github_username: oldPrrr.requested_by
              })
            )
          }

          if (oldPrrr.claimed_by) {
            queries2.push(
              knex.table('reviews')
                .insert({
                  prrr_id: newPrrrId,
                  github_username: oldPrrr.claimed_by,
                  created_at: oldPrrr.claimed_at,
                  completed_at: oldPrrr.completed_at
                })
            )
          }

          return Promise.all(queries2)
        })

    })

    return Promise.all(queries1)
  })
  .then(_ => Promise.all([
    knex.schema.dropTable('pull_request_review_requests'),
    knex.schema.dropTable('skipped_prrrs')
  ]))
  .catch(error => console.error('ERROR:', error))
}

exports.down = knex => {
  throw new Error('Irreversable migration')
}
