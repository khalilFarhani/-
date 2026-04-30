-- Seed recent comments
-- Assumes users 1, 2, 3 and posts 1, 2, 3 exist

INSERT INTO comments (post_id, user_id, content, created_at) 
VALUES (1, 2, 'شكراً لمشاركة هذا الموقف، واجهت نفس المشكلة وحلها كان في الصبر.', NOW() - INTERVAL '10 minutes');

INSERT INTO comments (post_id, user_id, content, created_at) 
VALUES (2, 3, 'فكرة رائعة! سأجربها في حصتي القادمة.', NOW() - INTERVAL '30 minutes');

INSERT INTO comments (post_id, user_id, content, created_at) 
VALUES (3, 1, 'هل يمكننا إضافة محور خاص بالألعاب التربوية؟', NOW() - INTERVAL '2 hours');
