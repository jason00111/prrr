COMMANDS:

reopenPrrr:

createPrrr:
  createPr:
    check with github to ensure pr exists

    select * from pull_requests where owner = 'git2' and repo = '/url2' and number = 2;

    if that returned something, return what it returned

    otherwise,
    insert into pull_requests(owner, repo, number) values ('git2', '/url', 2) returning *;

  createRr:
  insert into review_requests(pull_request_id, created_at) values (1, '1998-01-08 04:05:06') returning *;

markPullRequestAsClaimed:

claimPrrr:

unclaimPrrr:

unclaimStalePrrrs:

archivePrrr:

completePrrr:
