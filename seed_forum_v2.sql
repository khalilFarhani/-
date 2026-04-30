-- New Forum Seed with updated categories
-- Assumes users 1, 2, 3 exist

INSERT INTO forum_posts (user_id, title, content, category, image_url, created_at) 
VALUES (
  1, 
  'تجربتي مع تفعيل مشاركة البنات في حصة التربية البدنية', 
  'لاحظت في البداية أن البنات ينسحبن للخلف أثناء التمارين الجماعية. قمت بتغيير قواعد اللعبة لتكون التعاونية هي الأساس بدلاً من التنافس البدني الصرف. النتيجة كانت مذهلة! أصبح الجميع يشارك بحماس.', 
  '⚧️ ممارسات جندرية', 
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800', 
  NOW()
);

INSERT INTO forum_posts (user_id, title, content, category, created_at) 
VALUES (
  2, 
  'قصة طفل خجول وجد صوته من خلال المسرح', 
  'كان لدي تلميذ لا يكاد ينطق بكلمة واحدة. من خلال محور "القيم والتواصل"، أعطيته دوراً قيادياً في مسرحية مدرسية. اليوم هو من يقود النقاشات داخل القسم. القصص هي التي تغير النفوس.', 
  '🌟 قصص من القلب', 
  NOW() - INTERVAL '2 hours'
);

INSERT INTO forum_posts (user_id, title, content, category, image_url, created_at) 
VALUES (
  3, 
  'كيف نتعامل مع التنمر الجندري في ساحة المدرسة؟', 
  'سؤال يطرح نفسه دائماً. لقد طبقت ميثاق "الاحترام المتبادل" وخصصنا حصة أسبوعية لمناقشة المواقف التي يواجهها التلاميذ. هل لديكم استراتيجيات أخرى؟', 
  '🎯 حلول تربوية', 
  'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800', 
  NOW() - INTERVAL '1 day'
);

INSERT INTO forum_posts (user_id, title, content, category, image_url, created_at) 
VALUES (
  1, 
  'رسومات تلاميذي حول مفهوم المساواة', 
  'أردت مشاركتكم بعض الأعمال الفنية التي قام بها تلاميذي اليوم. الإبداع وسيلة قوية لترسيخ القيم الجندرية في سن مبكرة.', 
  '📸 ركن الإبداع', 
  'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800', 
  NOW() - INTERVAL '2 days'
);
