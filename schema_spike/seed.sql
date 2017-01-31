INSERT INTO pull_requests(owner, repo, number)
  VALUES  ('git1', '/url1', 1),
          ('git2', '/url2', 2),
          ('git3', '/url3', 3),
          ('git4', '/url4', 4);

INSERT INTO users(name)
  VALUES ('Billy'), ('Bob'), ('Bro'), ('Dude');

INSERT  INTO review_requests(pull_request_id, created_at)
  VALUES  (1, '1999-01-08 04:05:06'),
          (2, '2000-01-08 04:05:06'),
          (3, '2001-01-08 04:05:09'),
          (4, '2002-01-08 03:05:06');

INSERT INTO requesters(review_request_id, user_id)
  VALUES (1, 2), (1, 3), (3, 1), (4, 3);

INSERT INTO reviews(review_request_id, user_id, created_at, completed_at, abandonded_at)
  VALUES  (1, 2, '1999-01-08 04:05:06', '2000-01-08 04:05:06', NULL),
          (2, 1, '1999-01-08 04:05:06', '1999-02-08 04:05:06', NULL),
          (3, 4, '1999-01-08 04:05:06', '2000-02-08 04:05:06', NULL),
          (4, 3, '1999-01-08 04:05:06', NULL, '1999-01-08 04:05:07');
