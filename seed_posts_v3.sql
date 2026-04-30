-- Restore original forum posts with original categories
-- Assumes users 1, 2, 3 exist

TRUNCATE TABLE forum_posts CASCADE;

INSERT INTO forum_posts (user_id, title, content, category, created_at) 
VALUES (
  1, 
  'موقف صعب في حصة الرياضيات اليوم', 
  'لاحظت أن البنات يشاركن أقل بكثير من البنين في حل المسائل على السبورة. كيف يمكنني تشجيعهن دون إحراجهن؟', 
  'مواقف من الفصل', 
  NOW()
);

INSERT INTO forum_posts (user_id, title, content, category, created_at) 
VALUES (
  2, 
  'طريقة ناجحة لتقسيم المجموعات', 
  'جربت اليوم تقسيم القسم إلى مجموعات مختلطة بناءً على المهارات وليس الصداقات. التفاعل كان ممتازاً وكسر الكثير من الحواجز.', 
  'تجارب ناجحة', 
  NOW() - INTERVAL '1 hour'
);

INSERT INTO forum_posts (user_id, title, content, category, created_at) 
VALUES (
  3, 
  'هل الأدوار في القصص المدرسية عادلة؟', 
  'أثناء قراءة الكتيب الرقمي، سألني تلميذ: لماذا دائماً الرجل هو من يسافر والمرأة هي من تطبخ؟ كان سؤالاً جندرياً ذكياً جداً.', 
  'أسئلة جندرية', 
  NOW() - INTERVAL '3 hours'
);

INSERT INTO forum_posts (user_id, title, content, category, image_url, created_at) 
VALUES (
  1, 
  'رأيكم في الوحدة الثالثة من الكتيب؟', 
  'لقد أنهيت للتو محور "المساواة في الفضاء المدرسي". المحتوى غني جداً، ما هو الجزء الذي أعجب تلاميذكم أكثر؟', 
  'نقاشات الكتيب', 
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800',
  NOW() - INTERVAL '1 day'
);
