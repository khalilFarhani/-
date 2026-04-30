-- Advanced Chat Seed V2
-- Assumes users 1, 2, 3 exist

INSERT INTO chat_messages (user_id, content, type, created_at) 
VALUES (2, 'السلام عليكم زملائي، كيف كانت حصة اليوم مع الكتيب الرقمي؟', 'text', NOW() - INTERVAL '1 hour');

INSERT INTO chat_messages (user_id, content, type, created_at) 
VALUES (3, 'وعليكم السلام! كانت رائعة، التلاميذ تفاعلوا جداً مع التمارين التفاعلية.', 'text', NOW() - INTERVAL '45 minutes');

INSERT INTO chat_messages (user_id, content, type, created_at) 
VALUES (1, 'يسرني سماع ذلك. قمت بإضافة بعض المصادر الجديدة في المنتدى أيضاً.', 'text', NOW() - INTERVAL '30 minutes');

INSERT INTO chat_messages (user_id, content, type, created_at) 
VALUES (2, 'هل يمكننا مشاركة بعض الصور لتفاعل التلاميذ؟', 'text', NOW() - INTERVAL '10 minutes');

INSERT INTO chat_messages (user_id, content, type, file_url, created_at) 
VALUES (3, 'صورة من حصتي اليوم', 'image', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000&auto=format&fit=crop', NOW() - INTERVAL '5 minutes');
