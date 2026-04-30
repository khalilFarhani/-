-- Seed some likes for forum posts
-- Assumes users 1, 2, 3 and posts 1, 2, 3 exist

INSERT INTO likes (post_id, user_id, created_at) 
VALUES (1, 2, NOW());

INSERT INTO likes (post_id, user_id, created_at) 
VALUES (1, 3, NOW());

INSERT INTO likes (post_id, user_id, created_at) 
VALUES (2, 1, NOW());
