QUERIES:

getAllPrrrs:

select * from review_requests join pull_requests on review_requests.pull_request_id = pull_requests.id;



getPrrrs:

select * from review_requests join pull_requests on review_requests.pull_request_id = pull_requests.id where owner = 'git1';



getNextPendingPrrr:

select * from review_requests
	join pull_requests on review_requests.pull_request_id = pull_requests.id
	join reviews on reviews.review_request_id = review_requests.id
	where reviews.abandoned_at is null or not reviews.user_id = ***currentUserId***
	order by review_requests.created_at asc limit 1;


getPrrrById:

by pr id:
select * from review_requests join pull_requests on review_requests.pull_request_id = pull_requests.id where pull_requests.id = 2;

by rr id:
select * from review_requests join pull_requests on review_requests.pull_request_id = pull_requests.id where review_requests.id = 2;



getPrrrForPullRequest:

select * from review_requests join pull_requests on review_requests.pull_request_id = pull_requests.id  where owner = 'git3' and repo = '/url3' and number = 3;



getPullRequest: ****

select * from pull_requests where owner = 'git3' and repo = '/url3' and number = 3;



getRequestorForPrrr:

select name from pull_requests
	join review_requests on review_requests.pull_request_id = pull_requests.id
	join requesters on requesters.review_request_id = review_requests.id
	join users on requesters.user_id = users.id
		where owner = 'git1';
