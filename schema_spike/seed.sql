INSERT INTO
  users(github_username, name)
VALUES
  ('Jaredatron', 'Jared'),
  ('Jasonatron', 'Jason'),
  ('Brianaatron', 'Briana'),
  ('Carlaatron', 'Carla');


INSERT INTO
  pull_requests(id, owner, repo, number)
VALUES
  (1, 'Jaredatron', 'thingatron', 10),
  (2, 'Jasonatron', 'magicstuff', 20),
  (3, 'Brianaatron', 'bashfiles', 30),
  (4, 'GuildCrafts', 'suppertivethings', 40);


INSERT INTO
  prrrs(pull_request_id, created_at)
VALUES
  (1, '2017-01-01 04:05:06'),
  (2, '2017-01-02 04:05:06'),
  (3, '2017-01-03 04:05:06'),
  (4, '2017-01-04 04:05:06');

INSERT INTO
  requesters(prrr_id, github_username)
VALUES
  (1, 'Jaredatron'),
  (1, 'Jasonatron'),
  (2, 'Jasonatron'),
  (3, 'Brianaatron'),
  (4, 'Carlaatron');

INSERT INTO
  reviews(prrr_id, github_username, created_at, completed_at, skipped_at)
VALUES
  (1, 'Brianaatron', '1999-01-08 04:00:06', '2000-01-08 04:05:06', NULL),
  (2, 'Carlaatron', '1999-01-08 04:05:06', NULL, '2000-02-08 04:15:06'),
  (2, 'Jaredatron', '1999-01-08 05:05:06', NULL, NULL),
  (3, 'Jasonatron', '1999-01-08 04:05:06', NULL, '2000-02-08 04:05:06'),
  (3, 'Jaredatron', '1999-01-08 05:05:06', NULL, '1999-01-08 05:10:06');
