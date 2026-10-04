import Database from 'better-sqlite3';
import { client } from './index';
import path from 'path';

interface PassageRule {
  packageId: string;
  prefix: string;
  startNum: number;
  endNum: number;
  title: string;
  passageText: string;
}

const PASSAGE_RULES: PassageRule[] = [
  // 1. Olimpiade Bahasa Inggris Level 2 — Babak Penyisihan (pkg_bing_lvl2_peny)
  {
    packageId: 'pkg_bing_lvl2_peny',
    prefix: 'q_bing_l2_peny_',
    startNum: 1,
    endNum: 5,
    title: 'Teks Bacaan (Soal No. 1 – 5)',
    passageText: `*The following text is for question number 1 to 5.*

My name is Raihan. I am 10 years old, and I am now in 5th grade of elementary school. I am the oldest student in my class. I have a younger brother named Fajar. He is small.
He is still 3 years old, he has chubby cheeks and curly hair. He will be having his fourth birthday next week, on August 9th.`,
  },
  {
    packageId: 'pkg_bing_lvl2_peny',
    prefix: 'q_bing_l2_peny_',
    startNum: 33,
    endNum: 34,
    title: 'Dialog (Soal No. 33 – 34)',
    passageText: `*The following dialog is for question number 33 and 34:*

**Bella :** “Hi Kevin, what are you eating?”
**Kevin :** “A few slices of watermelon. My mom prepared them in my lunch box.”
**Bella :** “Do you like watermelon?”
**Kevin :** “Yes, I love it, it's so juicy and sweet, especially on a hot day.”`,
  },
  {
    packageId: 'pkg_bing_lvl2_peny',
    prefix: 'q_bing_l2_peny_',
    startNum: 35,
    endNum: 37,
    title: 'Teks Bacaan (Soal No. 35 – 37)',
    passageText: `*Read the text below to answer number 35 to 37!*

In Miss Rani's classroom, there are five students: Yoga, Clarissa, Fikri, Naya, and Denis. Yoga sits in the front row, between Clarissa and Fikri. Denis sits in the back row, beside Naya. There is a globe on the shelf, and a calendar next to the clock.`,
  },
  {
    packageId: 'pkg_bing_lvl2_peny',
    prefix: 'q_bing_l2_peny_',
    startNum: 38,
    endNum: 39,
    title: 'Teks Bacaan (Soal No. 38 – 39)',
    passageText: `*The following text is for question number 38 and 39:*

Hello, my name is Salsa Amelia. I live in Malang, East Java. I am the youngest in my family. My oldest sister is Vania Amelia. She is 15 years old and studies in SMP Nusantara. My older brother is Rafi Amelia. He is 11 years old. He studies in SD Nusantara. I am the only one who is still in kindergarten.`,
  },

  // 2. Olimpiade Bahasa Inggris Level 2 — Babak Final Provinsi (pkg_bing_lvl2_prov)
  {
    packageId: 'pkg_bing_lvl2_prov',
    prefix: 'q_bing_l2_prov_',
    startNum: 4,
    endNum: 9,
    title: 'Petunjuk Arah (Soal No. 4 – 9)',
    passageText: `*Read the passage below to answer questions number 4-9:*

Rian wants to invite his friend Bayu over to study together. Rian's dad writes out the following directions for Bayu to give to his father. Read the directions and use them to answer the questions.

**Directions from school to Rian's house:**
- When coming out of the school gate, turn right.
- Make an immediate left turn onto Melati Street.
- At the traffic light, turn left on Mawar Street.
- Go two blocks until you turn right on Anggrek Road.
- Our house is the third house on the left, number 12 Anggrek Road.`,
  },
  {
    packageId: 'pkg_bing_lvl2_prov',
    prefix: 'q_bing_l2_prov_',
    startNum: 26,
    endNum: 30,
    title: 'Teks Bacaan (Soal No. 26 – 30)',
    passageText: `*Read the text below to answer questions 26-30!*

Mr. and Mrs. Wijaya have one son and one daughter. The son's name is Dimas. The daughter's name is Putri.
The Wijayas live in a house. They have a living room. They read books and watch TV there. The mother cooks food in the kitchen. They eat together in the dining room. The house has three bedrooms. They sleep in the bedrooms. They keep their clothes in the wardrobe. There are two bathrooms. They take a bath and brush their teeth there.
The house has a small garden. Dimas and Putri play badminton in the garden. They have a cat. Dimas and Putri like to play with the cat there.`,
  },
  {
    packageId: 'pkg_bing_lvl2_prov',
    prefix: 'q_bing_l2_prov_',
    startNum: 33,
    endNum: 36,
    title: 'Teks Cerita (Soal No. 33 – 36)',
    passageText: `*The following text is for question number 33 to 36:*

Hi! My name is Vino Curious. I live on the second floor of an apartment in a busy city. I'm a very curious boy and I always want to know what my neighbors are doing. Right now, I'm watching the park across the street through my binoculars.
Let me look at the playground on Melur Street. It's full of children as always. Sarah is jumping rope and Tia is playing with her ball. Iqbal and Reza are walking their dogs, they love animals so much. Kevin is playing on the slide while his sister is on the swing.
Made, Dodi, and Ayu are chasing each other and laughing. Nisa is playing badminton with a group of kids, but she isn't very good at it. Mr. and Mrs. Hartono are sitting on a bench, chatting and enjoying the sun. A few teenagers are sitting under a big tree, talking. Aji is running while flying his kite, and his friend Toni is clapping happily.
It's so nice to watch people from my window, but I must go now.`,
  },
  {
    packageId: 'pkg_bing_lvl2_prov',
    prefix: 'q_bing_l2_prov_',
    startNum: 37,
    endNum: 40,
    title: 'Teks Cerita (Soal No. 37 – 40)',
    passageText: `*The following text is for question number 37 to 40:*

Mom just came home from Batu to Surabaya. She brought us 6 kilograms of oranges. When I counted them, there were 48 oranges in total. Mom made four packs of oranges, each pack has 6 oranges. One for the neighbor, one for aunt Ratih, one for grandpa, and one for our teacher. I saw my sister had already eaten two oranges, while I hadn't taken any yet. Mom saved a dozen and kept them in the fridge. She said she would make orange juice tomorrow. She asked me to put the rest on a plate.`,
  },

  // 3. Olimpiade Bahasa Inggris Level 1 — Babak Final Provinsi (pkg_bing_lvl1_prov)
  {
    packageId: 'pkg_bing_lvl1_prov',
    prefix: 'q_bing_l1_prov_',
    startNum: 1,
    endNum: 5,
    title: 'Cerita Fabel (Soal No. 1 – 5)',
    passageText: `*Read the short story below thoroughly to answer number 1 to 5!*

**THE ANT AND THE GRASSHOPPER**
One summer day, an ant was busy collecting food for the winter. A grasshopper was playing and singing all day long. The grasshopper laughed at the ant and said, “Why are you working so hard? Come and play with me!” The ant replied, “I am saving food for the cold winter. You should do the same.” The grasshopper ignored the advice. When winter came, the ant had plenty of food, but the grasshopper had nothing to eat and was freezing. The grasshopper learned a lesson: work hard today to prepare for tomorrow.`,
  },
  {
    packageId: 'pkg_bing_lvl1_prov',
    prefix: 'q_bing_l1_prov_',
    startNum: 8,
    endNum: 10,
    title: 'Percakapan Liburan (Soal No. 8 – 10)',
    passageText: `*Read the text to answer question number 8 – 10!*

**Dina :** “Hi, Fira! Where did you go for the holiday?”
**Fira :** “I went to my grandma's house near the beach! How about your holiday?”
**Dina :** “My family and I visited my uncle in Bali for three days. It was so much fun!”
**Fira :** “That sounds great! What did you do there?”
**Dina :** “We swam at Kuta Beach and ate delicious seafood.”`,
  },
  {
    packageId: 'pkg_bing_lvl1_prov',
    prefix: 'q_bing_l1_prov_',
    startNum: 26,
    endNum: 30,
    title: 'Teks Cerita (Soal No. 26 – 30)',
    passageText: `*Read the text below to answer number 26-30!*

Every weekend, my family and I go to the countryside. We like to visit my grandfather's farm.
My favorite spot is called Green Hill. It has tall trees and colorful flowers. It is very peaceful there.
My brother and I often help grandfather feed the chickens and rabbits. We also pick fresh apples from the orchard.
In the afternoon, we sit under a big shady tree and drink cold lemonade. I love going to the farm because it makes me happy.`,
  },
  {
    packageId: 'pkg_bing_lvl1_prov',
    prefix: 'q_bing_l1_prov_',
    startNum: 33,
    endNum: 34,
    title: 'Dialog (Soal No. 33 – 34)',
    passageText: `*The following dialog is for question number 33 and 34:*

**Sinta :** “Hi Doni, what are you eating?”
**Doni :** “A slice of watermelon. My mom cut it for me after lunch.”
**Sinta :** “Do you like watermelon?”
**Doni :** “Yes, very much! It is sweet and refreshing.”`,
  },
  {
    packageId: 'pkg_bing_lvl1_prov',
    prefix: 'q_bing_l1_prov_',
    startNum: 35,
    endNum: 37,
    title: 'Teks Ruang Kelas (Soal No. 35 – 37)',
    passageText: `*Read the text below to answer number 35 to 37!*

In Mrs. Tanti's classroom, there are five students: Dita, Farel, Nadia, Bima, and Wulan. Dita sits in the front row, between Farel and Nadia. Bima sits in the back row, beside Wulan. There is a clock on the wall, and a bookcase next to the teacher's desk.`,
  },
  {
    packageId: 'pkg_bing_lvl1_prov',
    prefix: 'q_bing_l1_prov_',
    startNum: 38,
    endNum: 39,
    title: 'Teks Perkenalan (Soal No. 38 – 39)',
    passageText: `*The following text is for question number 38 and 39:*

Hello, my name is Raka Pradana. I live in Semarang, Central Java. I am the oldest in my family. My younger sister is Kirana Pradana. She is 9 years old and studies in SD Tunas Bangsa. I am 12 years old and in 6th grade. My father is Mr. Hendra and my mother is Mrs. Dewi.`,
  },

  // 4. KMSI 2024 Level 2 (pkg_kmsi_2024_ing_2)
  {
    packageId: 'pkg_kmsi_2024_ing_2',
    prefix: 'pkg_kmsi_2024_ing_2_q',
    startNum: 4,
    endNum: 9,
    title: 'Petunjuk Arah (Soal No. 4 – 9)',
    passageText: `*Read the passage below to answer questions 4 to 9!*

“Marla wants to invite her friend Kara over for a sleepover. Marla's mom writes out the following directions for Kara to give to her mother:
**Directions from school to Marla's house:**
1. When coming out of the school parking lot, turn left.
2. Make an immediate right turn onto Chapel Street.
3. At the stop sign, turn right on Oak Street.
4. Go three blocks and turn left on Marble Road.
5. Our house is five houses down on the right, 305 Marble Road.”`,
  },
  {
    packageId: 'pkg_kmsi_2024_ing_2',
    prefix: 'pkg_kmsi_2024_ing_2_q',
    startNum: 26,
    endNum: 30,
    title: 'Teks Cerita Keluarga (Soal No. 26 – 30)',
    passageText: `*Read the passage about The Smiths to answer questions 26 - 30!*

“The Smith family lives in a cozy two-story house. There are four people in the family: Mr. Smith, Mrs. Smith, and their two children, John and Sarah. Mrs. Smith usually cooks delicious meals in the kitchen. In the evening, the family gathers in the living room to watch TV. In the bathroom, John and Sarah brush their teeth before going to bed. They also have a lovely garden where John and Sarah play fetch with their dog, Max. The house has three bedrooms upstairs.”`,
  },
  {
    packageId: 'pkg_kmsi_2024_ing_2',
    prefix: 'pkg_kmsi_2024_ing_2_q',
    startNum: 33,
    endNum: 36,
    title: 'Teks Pengamatan (Soal No. 33 – 36)',
    passageText: `*Read the passage to answer questions 33 to 36!*

“It is Saturday morning. Janet is standing on her apartment balcony. She says, 'Now I’m watching people in my neighbourhood through my binoculars. The park across the street is crowded today. Many families are spending their weekend there. Terry is riding his bicycle, while Pamela is happily playing on the swing. Her little brother is playing with a red ball. The weather is so sunny and warm.'”`,
  },
  {
    packageId: 'pkg_kmsi_2024_ing_2',
    prefix: 'pkg_kmsi_2024_ing_2_q',
    startNum: 37,
    endNum: 40,
    title: 'Teks Cerita: Buah Apel Malang (Soal No. 37 – 40)',
    passageText: `*Read the story to answer questions 37 to 40!*

“Yesterday Dad returned from his business trip to Malang. He brought a large box containing 24 fresh apples. Mom gave 8 apples to our neighbor, Mrs. Tina. Then Mom saved 12 apples in the refrigerator to make an apple pie for dinner tomorrow. My brother and I each ate 2 apples in the afternoon. All the apples are so sweet and crunchy!”`,
  },

  // 5. KMSI 2024 Level 1 (pkg_kmsi_2024_ing_1)
  {
    packageId: 'pkg_kmsi_2024_ing_1',
    prefix: 'pkg_kmsi_2024_ing_1_q',
    startNum: 1,
    endNum: 5,
    title: 'Cerita Fabel (Soal No. 1 – 5)',
    passageText: `*Read the short story below to answer questions 1 to 5!*

“One afternoon, a sleeping lion was woken up by a tiny mouse running across his nose. The lion caught the mouse with his huge paw and was about to eat it.
'Please, King of the Jungle, spare my life!' cried the mouse. 'Someday I may be able to help you!'
The lion laughed at the idea of a tiny mouse helping him, but he let the mouse go.
A few days later, the lion was caught in a hunter's strong rope net. Hearing the lion's roar, the mouse rushed to help. With its sharp teeth, the mouse chewed through the ropes until the lion was free.
The lion smiled and thanked the mouse, knowing that even small friends can be great helpers.”`,
  },
  {
    packageId: 'pkg_kmsi_2024_ing_1',
    prefix: 'pkg_kmsi_2024_ing_1_q',
    startNum: 8,
    endNum: 10,
    title: 'Percakapan Liburan (Soal No. 8 – 10)',
    passageText: `*Read the text to answer questions 8 – 10!*

**Mei-mei :** “Hi, Nana! Where did you go for the holiday?”
**Nana :** “I went to my grandmother’s house in the countryside! How about you?”
**Mei-mei :** “My family and I visited Bandung for three days. We picked fresh strawberries and visited the floating market.”
**Nana :** “That sounds delicious and wonderful!”`,
  },
  {
    packageId: 'pkg_kmsi_2024_ing_1',
    prefix: 'pkg_kmsi_2024_ing_1_q',
    startNum: 26,
    endNum: 30,
    title: 'Teks Cerita (Soal No. 26 – 30)',
    passageText: `*Read the text to answer numbers 26 - 30!*

“Every year we go to Florida for a beach vacation. We like to stay near sunny beaches. My favorite spot is Sunshine Beach. It has soft white sand and palm trees. It is very beautiful.
My brother and I build sandcastles every morning. We also collect colorful sea shells.
In the afternoon, we eat cold ice cream under a giant sun umbrella. I love Florida beaches because playing there brings so much joy!”`,
  },
  {
    packageId: 'pkg_kmsi_2024_ing_1',
    prefix: 'pkg_kmsi_2024_ing_1_q',
    startNum: 33,
    endNum: 34,
    title: 'Dialog (Soal No. 33 – 34)',
    passageText: `*The following dialog is for questions number 33 and 34:*

**Anisa :** “Hi Budi, what are you eating?”
**Budi :** “A slice of honeydew melon. My mother prepared it for me after school.”
**Anisa :** “Do you like melon?”
**Budi :** “Yes, I like it very much! It is very sweet and juicy.”`,
  },
  {
    packageId: 'pkg_kmsi_2024_ing_1',
    prefix: 'pkg_kmsi_2024_ing_1_q',
    startNum: 38,
    endNum: 39,
    title: 'Teks Perkenalan (Soal No. 38 – 39)',
    passageText: `*Read the text to answer questions 38 and 39!*

“Hello, my name is Helen Kusuma. I live in Denpasar, Bali. I am the youngest child in my family. My older sister is Maya Kusuma. She is 10 years old and studies at SD Harapan. My older brother is Dion Kusuma. He is 14 years old and studies at SMP Harapan. I am 7 years old and in grade 1.”`,
  },

  // 6. CEO 2025 Level 1 (pkg_ceo_2025_ing_1)
  {
    packageId: 'pkg_ceo_2025_ing_1',
    prefix: 'pkg_ceo_2025_ing_1_q',
    startNum: 3,
    endNum: 4,
    title: 'Teks Cerita: Tom\'s Mountain Trip (Soal No. 3 – 4)',
    passageText: `*The text is for questions number 3 and 4:*

“Tom is going on a trip to the mountains. Tom needs to take his bag. The bag is small and brown. Tom opens the bag. Tom wants to put things in the bag. But the bag cannot close! Tom takes the boots out of the bag.”`,
  },
  {
    packageId: 'pkg_ceo_2025_ing_1',
    prefix: 'pkg_ceo_2025_ing_1_q',
    startNum: 13,
    endNum: 15,
    title: 'Teks Cerita: Rainy Day Trip to School (Soal No. 13 – 15)',
    passageText: `*Read the text below to answer questions 13 to 15!*

“It’s raining heavily today. Tora goes to school by car with her father. Usually Tora goes to school with Ryan by bicycle. Tora saw Ryan waiting for a taxi in front of the bus stop with his mother. Tora asked her father to stop the car at the bus stop. Tora opened the window...”`,
  },

  // 7. CEO 2025 Level 2 (pkg_ceo_2025_ing_2)
  {
    packageId: 'pkg_ceo_2025_ing_2',
    prefix: 'pkg_ceo_2025_ing_2_q',
    startNum: 11,
    endNum: 15,
    title: 'Teks Cerita: Purple Car (Soal No. 11 – 15)',
    passageText: `*The text is for number 11 - 15:*

**Purple Car**
Ms. Gita had a purple car. She loved her purple car. It was light purple. It had four doors. It was not a new car. It was an old car. But it had new tires. All four black tires were new. She felt safe with her new tires. They would not blow out. She could drive everywhere with her new tires.
Her car was dirty. She needed to wash it. The windows were dirty. The doors were dirty. The hood was dirty. The trunk was dirty. The bumpers were dirty. The tires weren't dirty. They were new tires. They were black and shiny. They looked good. She did not have to wash her tires. But she did have to wash her car.
She put water into a bucket. She put a sponge into the bucket. She washed her car with the sponge. She dried her car with a towel. Her car was shiny purple now. It looked like new. Now her old car was as shiny as her new tires.`,
  },
  {
    packageId: 'pkg_ceo_2025_ing_2',
    prefix: 'pkg_ceo_2025_ing_2_q',
    startNum: 17,
    endNum: 18,
    title: 'Teks Deskriptif: Ginny\'s Submarine (Soal No. 17 – 18)',
    passageText: `*Read the text and answer question number 17 – 18!*

“Hello, my name is Ginny. I want to tell you about one of my favorite transportation. It’s name is submarine. Well, it is water transportation. It is modern and sophisticated. It can dive in the water and float on the water too. It’s a naval warfare weapon.”`,
  },
  {
    packageId: 'pkg_ceo_2025_ing_2',
    prefix: 'pkg_ceo_2025_ing_2_q',
    startNum: 19,
    endNum: 21,
    title: 'Teks Cerita: Beach Holiday (Soal No. 19 – 21)',
    passageText: `*The text is for questions number 19 to 21:*

“John and Dhoni go to the beach on holiday. At the beach, they play volleyball, swim in the sea, and build a sandcastle. There are many seashells and crabs at the beach. John sees a sea star when he swims in the sea. The sea star is blue. It looks beautiful.”`,
  },

  // 8. JSO 2025 Level 2 (pkg_jso_2025_ing_2)
  {
    packageId: 'pkg_jso_2025_ing_2',
    prefix: 'pkg_jso_2025_ing_2_q',
    startNum: 1,
    endNum: 5,
    title: 'Teks Bacaan: Lenna & Clara (Soal No. 1 – 5)',
    passageText: `*Read the text to answer questions 1 to 5!*

“Lenna is the smartest student in her class. She always gets the highest score in English and Mathematics. Lenna has a younger sister named Clara. Clara has round cheeks and tiny hands. Clara is so cute and smiley. Clara will be having her birthday on November 18th.”`,
  },

  // 9. PRISMA 2025 Level 1 (pkg_prisma_2025_ing_1)
  {
    packageId: 'pkg_prisma_2025_ing_1',
    prefix: 'pkg_prisma_2025_ing_1_q',
    startNum: 20,
    endNum: 22,
    title: 'Teks Bacaan: Miracle Goes to Market (Soal No. 20 – 22)',
    passageText: `*The following text is for questions number 20 to 22:*

“I am Miracle. My mother always goes to market on Sunday with me. We go there at six O’clock by pedicab. One hour before I usually sweep the yard. In the market, we buy Fresh Meat and fish, two kilos of egg and some vegetables.”`,
  },

  // 10. PRISMA 2025 Level 2 (pkg_prisma_2025_ing_2)
  {
    packageId: 'pkg_prisma_2025_ing_2',
    prefix: 'pkg_prisma_2025_ing_2_q',
    startNum: 1,
    endNum: 4,
    title: 'Teks Cerita: Scouts Camping in Cikoneng (Soal No. 1 – 4)',
    passageText: `*Read this text then answer the questions number 1 to 4!*

“Last weekend the girl scouts and the boy scouts of my school had their first fun camping Outside the school. They left for Cikoneng at 05. 00 am. After a long and thrilling drive they arrived at the village and found a good camping site. “Let’s set up our tents there,” said the Leader while pointing at the garden. Then, they started to work. In a short time, the tents were ready and they put a small flag on the top of each tent. After that, some girl scouts made a fire while some others cooked their lunch. The boys were busy working. The lunch was ready at 03.00 and they immediately started to eat. After that, they took a little rest. At 04.30 pm the leader blew his whistle and all the girl scouts and the boy scouts gathered around to start their fun camping programs.”`,
  },
  {
    packageId: 'pkg_prisma_2025_ing_2',
    prefix: 'pkg_prisma_2025_ing_2_q',
    startNum: 17,
    endNum: 20,
    title: 'Teks Rumpang: Exercising for Our Health (Soal No. 17 – 20)',
    passageText: `*Choose the correct words to complete the text below! (No. 17 - 20)*

“Exercising is very important for our health. When we do exercise, our body becomes strong and fresh. Many people like to run, swim, or play football. Exercise also makes our mind happy. That is why we should do exercise …. (17). Some students go jogging in the morning before school. Others like to play basketball in the afternoon. Exercising is not only for young people but also for …. (18). Doing sports regularly can prevent us from getting sick. It also helps us to have more …. (19). If we want to stay healthy, we need to spend some …. (20) for exercise every day.”`,
  },
];

// Single dialogue questions to wrap cleanly
const STANDALONE_DIALOGUES = [
  {
    id: 'q_bing_l2_peny_25',
    title: 'Dialog Soal: Buying Mangoes',
    passageText: `**Sari :** “Mom, I want to buy some mangoes.”\n**Mom :** “We have some bananas in the fridge, Sari.”\n**Sari :** “I don't want that, Mom, I like mangoes.”\n**Mom :** “Okay, let's go to the market and buy some.”\n**Sari :** “Alright, Mom.”`,
    questionPrompt: 'Which is the correct sentence based on the conversation above?',
  },
  {
    id: 'pkg_jso_2025_ing_2_q25',
    title: 'Dialog Soal: Buying Grapes',
    passageText: `**Harry :** “Mom, I want to buy some grapes.”\n**Mom :** “Okay, let's go to the fruit market.”`,
    questionPrompt: 'What can we conclude from the dialogue above?',
  },
];

function cleanOriginalQuestion(content: string): string {
  let q = content;
  // Strip existing :::passage if any
  q = q.replace(/:::passage(?:\[[\s\S]*?\])?\s*[\s\S]*?:::/g, '').trim();

  // Strip leading headers
  const patterns = [
    /^Read (?:this|the) (?:passage|text|short story|story)[^\n]*?(?:answer|number|questions)[^\n]*\n+/i,
    /^(?:The following|The) (?:text|dialog|dialogue|picture)[^\n]*?(?:question|number|questions)[^\n]*\n+/i,
    /^Choose the correct words to complete the text below![^\n]*\n+/i,
  ];

  for (const pat of patterns) {
    q = q.replace(pat, '').trim();
  }

  // Strip leading quoted passage if surrounded by double quotes followed by \n\n
  if (q.startsWith('"') && q.includes('"\n\n')) {
    q = q.split('"\n\n').slice(1).join('"\n\n').trim();
  }

  return q;
}

async function main() {
  console.log('=== ATTACHING READING PASSAGES TO ALL STORY QUESTIONS IN CERDASIFY ===\n');

  const sqlite = new Database(path.join(process.cwd(), 'data/cerdasify.db'));
  sqlite.pragma('journal_mode = WAL');

  let totalUpdated = 0;

  for (const rule of PASSAGE_RULES) {
    console.log(`Processing ${rule.packageId} (${rule.title}) for questions ${rule.startNum} to ${rule.endNum}...`);

    for (let num = rule.startNum; num <= rule.endNum; num++) {
      const qId = `${rule.prefix}${num < 10 ? '0' + num : num}`;

      const row = sqlite.prepare('SELECT id, content_markdown FROM questions WHERE id = ?').get(qId) as
        | { id: string; content_markdown: string }
        | undefined;
      if (!row) {
        console.warn(`  [WARN] Question ${qId} not found in SQLite!`);
        continue;
      }

      const pureQuestion = cleanOriginalQuestion(row.content_markdown);
      const newContent = `:::passage[${rule.title}]\n${rule.passageText}\n:::\n\n${pureQuestion}`;

      // Update SQLite
      sqlite.prepare('UPDATE questions SET content_markdown = ? WHERE id = ?').run(newContent, qId);

      // Update Postgres
      try {
        await client`
          UPDATE questions 
          SET content_markdown = ${newContent}
          WHERE id = ${qId}
        `;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`  [ERROR] Updating Postgres for ${qId}:`, message);
      }

      totalUpdated++;
    }
  }

  // Update standalone dialogues
  console.log('\nProcessing standalone dialogue questions...');
  for (const item of STANDALONE_DIALOGUES) {
    const row = sqlite.prepare('SELECT id, content_markdown FROM questions WHERE id = ?').get(item.id) as
      | { id: string; content_markdown: string }
      | undefined;
    if (row) {
      const newContent = `:::passage[${item.title}]\n${item.passageText}\n:::\n\n${item.questionPrompt}`;
      sqlite.prepare('UPDATE questions SET content_markdown = ? WHERE id = ?').run(newContent, item.id);
      try {
        await client`
          UPDATE questions 
          SET content_markdown = ${newContent}
          WHERE id = ${item.id}
        `;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`  [ERROR] Updating Postgres for ${item.id}:`, message);
      }
      totalUpdated++;
      console.log(`  Updated standalone dialogue: ${item.id}`);
    }
  }

  console.log(`\nSuccessfully attached reading passages to ${totalUpdated} questions in both SQLite and PostgreSQL!`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
