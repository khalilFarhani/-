-- Insert initial chat messages for demo
-- Assumes users with IDs 1, 2, 3 exist from previous seeds

INSERT INTO chat_messages (user_id, content, type, created_at) 
VALUES (1, 'مرحباً زملائي، كيف كانت حصتكم اليوم؟', 'text', NOW());

INSERT INTO chat_messages (user_id, content, type, created_at) 
VALUES (2, 'كانت ممتازة! جربت طريقة المجموعات المختلطة ولاحظت تفاعلاً رائعاً من البنات.', 'text', NOW() + INTERVAL '1 minute');

INSERT INTO chat_messages (user_id, content, type, file_url, created_at) 
VALUES (3, 'صورة من تحضير اليوم', 'image', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800', NOW() + INTERVAL '2 minutes');

INSERT INTO chat_messages (user_id, content, type, created_at) 
VALUES (1, 'شكراً لمشاركتنا هذه الأفكار الملهمة 💡', 'text', NOW() + INTERVAL '3 minutes');
