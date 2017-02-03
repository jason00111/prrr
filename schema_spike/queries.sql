QUERIES:
getAllPrrrs: --done

select * from review_requests join pull_requests on review_requests.pull_request_id = pull_requests.id;



getPrrrs: --done wip

SELECT
	prrrs.archived_at,
	reviews.created_at as claimed_at,
	reviews.github_username as claimed_by,
	reviews.completed_at,
	prrrs.created_at,
	prrrs.id,
	pull_requests.number,
	pull_requests.owner,
	pull_requests.repo,
	requesters.github_username as requested_by
FROM
	pull_requests
FULL JOIN
	prrrs ON pull_requests.id = prrrs.pull_request_id
FULL JOIN
	requesters ON requesters.prrrs_id = prrrs.id
FULL JOIN
	reviews ON reviews.prrr_id = prrrs.id
WHERE
	requesters.github_username = 'Jaredatron'
OR
	(
		reviews.github_username = 'Jaredatron'
	AND
		reviews.skipped_at IS NULL
	);


getInProgressPrrrs:

SELECT
	prrrs.*
FROM
	prrrs
JOIN
	pull_requests on prrrs.pull_request_id = pull_requests.id
JOIN
	reviews on reviews.prrr_id = prrrs.id
WHERE
  reviews.created_at IS NOT NULL
AND
  reviews.abandoned_at IS NULL
AND
  reviews.completed_at IS NULL




getNextPendingPrrr: //done


SELECT
	*
FROM
	prrrs
JOIN
	pull_requests on prrrs.pull_request_id = pull_requests.id
WHERE
	prrrs.id NOT IN (
		SELECT
			prrrs.id
		FROM
			prrrs
		JOIN
			reviews on reviews.prrr_id = prrrs.id
		WHERE
		  reviews.created_at IS NOT NULL
		AND
		  reviews.skipped_at IS NULL
		AND
		  reviews.completed_at IS NULL
	)
AND
	prrrs.id NOT IN (
		SELECT
			prrrs.id
		FROM
			prrrs
		JOIN
			reviews on reviews.prrr_id = prrrs.id
		WHERE
		  reviews.completed_at IS NOT NULL
	)
AND
	prrrs.id NOT IN (
		SELECT
			prrrs.id
		FROM
			prrrs
		JOIN
			reviews on reviews.prrr_id = prrrs.id
		WHERE
		  reviews.skipped_at IS NOT NULL
		AND
          reviews.github_username = 'Jaredatron'
	)



-- ??

select * from prrrs
FULL OUTER join pull_requests on prrrs.pull_request_id = pull_requests.id
FULL OUTER join reviews on reviews.prrr_id = prrrs.id
WHERE
  reviews.created_at IS NULL
OR
(
  reviews.created_at IS NOT NULL
AND
  reviews.abandoned_at IS NOT NULL
AND NOT
  reviews.github_username = 'Jasonatron'
)
--WHERE reviews.abandoned_at IS NULL
--AND NOT reviews.github_username = 'Carlaatron'
--AND reviews.created_at IS NULL

-- ??

-- select * from review_requests
-- 	join pull_requests on review_requests.pull_request_id = pull_requests.id
-- 	join reviews on reviews.review_request_id = review_requests.id
-- 	where reviews.abandoned_at is null or not reviews.user_id = ***currentUserId***
-- 	order by review_requests.created_at asc limit 1;
--

getPrrrById:  not being used!!!

by rr id:
select * from prrrs join pull_requests on review_requests.pull_request_id = pull_requests.id where review_requests.id = 2;



getPrrrForPullRequest:  //this can be deleted after refactor

select * from review_requests join pull_requests on review_requests.pull_request_id = pull_requests.id  where owner = 'git3' and repo = '/url3' and number = 3;



getPullRequest: //this is never being used

select * from pull_requests where owner = 'git3' and repo = '/url3' and number = 3;



getRequestorForPrrr:  //this is never being used

select name from pull_requests
	join review_requests on review_requests.pull_request_id = pull_requests.id
	join requesters on requesters.review_request_id = review_requests.id
	join users on requesters.user_id = users.id
		where owner = 'git1';

		/////////////////












select
	*
from
	"prrrs"
inner join
	"pull_requests" on "prrrs"."pull_request_id" = "pull_request"."id"
where "prrrs"."id"
not in (
	select
		"prrrs"."id"
	from
		"prrrs"
	inner join
		"reviews" on "reviews"."prrr_id" = "prrrs"."id"
	where
		"reviews"."created_at" is not null
	and
		"reviews"."skipped_at" is null
	and
		"reviews"."completed_at" is null
)

and "prrrs"."id" not in (
	select
		"prrrs"."id"
	from
		"prrrs"
	inner join
		"reviews" on "reviews"."prrr_id" = "prrrs"."id"
	where
		"reviews"."completed_at" is not null
)

and "prrrs"."id" not in (
	select
		"prrrs"."id"
	from
		"prrrs"
	inner join
		"reviews" on "reviews"."prrr_id" = "prrrs"."id"
	where
		"reviews"."skipped_at" is not null
	and
		"reviews"."github_username" = ?
)
