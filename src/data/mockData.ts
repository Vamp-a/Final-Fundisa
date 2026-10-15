import type { User, Module, Quiz, StudentProgress, UploadedContent } from '../types';

/* ─── USERS ────────────────────────────────────────────────────────────────── */
export const MOCK_USERS: User[] = [
  { id: 'u1', email: 'student@fundisa.co.za', name: 'Sipho Ndlovu', role: 'student' },
  { id: 'u2', email: 'amahle@fundisa.co.za', name: 'Amahle Dlamini', role: 'student' },
  { id: 'u3', email: 'tebogo@fundisa.co.za', name: 'Tebogo Mokoena', role: 'student' },
  { id: 'u4', email: 'lecturer@fundisa.co.za', name: 'Dr. Naledi Khumalo', role: 'lecturer' },
  { id: 'u5', email: 'prof@fundisa.co.za', name: 'Prof. David Botha', role: 'lecturer' },
];

/* ─── MODULES ──────────────────────────────────────────────────────────────── */
export const MOCK_MODULES: Module[] = [
  {
    id: 'm1',
    title: 'Introduction to Mathematics',
    description: 'Number systems, basic algebra, and arithmetic operations.',
    subject: 'Mathematics',
    duration: '45 min',
    progress: 0,
    locked: false,
    quizId: 'q1',
    content: [
      {
        id: 's1',
        heading: 'What are Number Systems?',
        body: 'A number system is a way of representing numbers using a set of symbols and rules. The most common system we use daily is the decimal system, which uses ten digits: 0 through 9. Other systems include binary (base-2), used in computers, and hexadecimal (base-16), used in programming. Understanding number systems helps us understand how data is stored and processed in the digital world.',
      },
      {
        id: 's2',
        heading: 'Basic Algebra',
        body: 'Algebra is the branch of mathematics dealing with symbols and the rules for manipulating those symbols. In algebra, letters represent numbers, allowing us to write rules and formulas that work for all numbers. For example, the formula for the area of a rectangle is A = l × w, where l is the length and w is the width. This formula works regardless of the specific measurements used.',
      },
      {
        id: 's3',
        heading: 'Arithmetic Operations',
        body: 'The four fundamental arithmetic operations are addition, subtraction, multiplication, and division. These operations follow specific rules such as the order of operations (BODMAS/PEMDAS): Brackets, Orders (powers), Division and Multiplication (left to right), Addition and Subtraction (left to right). Mastering these rules ensures accurate calculations in all areas of mathematics.',
      },
    ],
  },
  {
    id: 'm2',
    title: 'Life Sciences: Cell Biology',
    description: 'The structure and function of cells, the building blocks of life.',
    subject: 'Life Sciences',
    duration: '60 min',
    progress: 0,
    locked: false,
    quizId: 'q2',
    content: [
      {
        id: 's4',
        heading: 'The Cell: Basic Unit of Life',
        body: 'All living organisms are made up of cells. The cell is the smallest unit of life that can perform all the necessary functions to sustain itself. There are two main types of cells: prokaryotic cells, which lack a membrane-bound nucleus, and eukaryotic cells, which have a well-defined nucleus enclosed by a nuclear membrane. Plants, animals, fungi, and protists are all made of eukaryotic cells.',
      },
      {
        id: 's5',
        heading: 'Cell Organelles',
        body: 'Organelles are specialized structures within a cell that perform specific functions, much like organs in the human body. The nucleus contains the cell\'s genetic material (DNA) and controls cell activities. Mitochondria produce energy through cellular respiration. The endoplasmic reticulum manufactures proteins and lipids. The Golgi apparatus packages and distributes proteins. Chloroplasts (in plant cells) perform photosynthesis.',
      },
      {
        id: 's6',
        heading: 'Cell Division',
        body: 'Cells reproduce through a process called cell division. In mitosis, a cell divides to produce two genetically identical daughter cells, essential for growth and repair. In meiosis, a cell divides twice to produce four cells each with half the original number of chromosomes — these become sex cells (sperm and eggs). Understanding cell division is crucial in fields ranging from medicine to agriculture.',
      },
    ],
  },
  {
    id: 'm3',
    title: 'Physical Sciences: Forces',
    description: "Newton's Laws and the principles of motion.",
    subject: 'Physical Sciences',
    duration: '50 min',
    progress: 0,
    locked: false,
    quizId: 'q3',
    content: [
      {
        id: 's7',
        heading: "Newton's First Law",
        body: "Newton's First Law of Motion states that an object at rest stays at rest, and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force. This property of matter is called inertia. A heavy truck requires more force to stop than a bicycle moving at the same speed because the truck has greater inertia due to its larger mass.",
      },
      {
        id: 's8',
        heading: "Newton's Second Law",
        body: "Newton's Second Law states that the acceleration of an object depends on two variables: the net force acting upon the object and the mass of the object. The relationship is expressed as F = ma (Force equals mass times acceleration). This means that if you apply a greater force to an object, it will accelerate more. Conversely, a heavier object requires more force to achieve the same acceleration as a lighter one.",
      },
      {
        id: 's9',
        heading: "Newton's Third Law",
        body: "Newton's Third Law states that for every action there is an equal and opposite reaction. When you push against a wall, the wall pushes back with exactly the same force. This law explains how rockets work: gas is expelled downward with great force, and the rocket is propelled upward with an equal and opposite force. It also explains why a gun recoils when fired — the bullet goes forward and the gun pushes backward.",
      },
    ],
  },
  {
    id: 'm4',
    title: 'History: The Apartheid Era',
    description: 'South African history from 1948 to the democratic transition.',
    subject: 'History',
    duration: '55 min',
    progress: 0,
    locked: false,
    quizId: 'q4',
    content: [
      {
        id: 's10',
        heading: 'Origins of Apartheid',
        body: 'Apartheid, meaning "separateness" in Afrikaans, was a system of institutionalised racial segregation enforced by the National Party government in South Africa from 1948 to 1994. The system classified citizens into racial groups and segregated them in all aspects of life including housing, education, healthcare, and employment. The Population Registration Act of 1950 required every South African to be registered as White, Coloured, Indian, or Black.',
      },
      {
        id: 's11',
        heading: 'Resistance and the Liberation Struggle',
        body: 'The African National Congress (ANC), founded in 1912, led much of the resistance to apartheid. Key events include the Defiance Campaign of 1952, the Freedom Charter adopted at Kliptown in 1955, and the Sharpeville Massacre of 1960, where 69 peaceful protesters were killed by police. After the ANC was banned, Nelson Mandela co-founded Umkhonto we Sizwe. Mandela was imprisoned for 27 years, becoming a global symbol of the anti-apartheid struggle.',
      },
      {
        id: 's12',
        heading: 'The Transition to Democracy',
        body: "The unbanning of political organisations in 1990 and the release of Nelson Mandela marked the beginning of the negotiated transition to democracy. The Convention for a Democratic South Africa (CODESA) negotiations led to the first non-racial democratic elections on 27 April 1994. Nelson Mandela became South Africa's first democratically elected president. The date is now celebrated as Freedom Day, a national holiday.",
      },
    ],
  },
  {
    id: 'm5',
    title: 'Geography: Climate Zones',
    description: 'Understanding global and Southern African climate patterns.',
    subject: 'Geography',
    duration: '40 min',
    progress: 0,
    locked: false,
    quizId: 'q5',
    content: [
      {
        id: 's13',
        heading: 'What is Climate?',
        body: "Climate refers to the long-term average of weather patterns in a specific region, typically measured over 30 years. It is different from weather, which describes short-term atmospheric conditions. Climate is determined by factors including latitude, altitude, proximity to the ocean, ocean currents, and prevailing winds. South Africa's climate is diverse, ranging from the arid Namib and Kalahari deserts in the west to the subtropical east coast.",
      },
      {
        id: 's14',
        heading: 'The Six Major Climate Zones',
        body: 'Earth is divided into six major climate zones: tropical (hot and wet year-round), dry (arid and semi-arid), temperate (mild with seasonal changes), continental (large temperature swings), polar (extremely cold), and highland (varies by altitude). South Africa primarily experiences subtropical, semi-arid, and Mediterranean (Western Cape) climates. Understanding these zones is vital for agriculture, urban planning, and environmental conservation.',
      },
    ],
  },
  {
    id: 'm6',
    title: 'English: Analytical Writing',
    description: 'How to structure arguments and write analytical essays.',
    subject: 'English',
    duration: '50 min',
    progress: 0,
    locked: false,
    quizId: 'q6',
    content: [
      {
        id: 's15',
        heading: 'The Structure of an Analytical Essay',
        body: 'An analytical essay breaks down a topic into its components to evaluate them. The standard structure includes an introduction with a clear thesis statement, body paragraphs that each present one main argument supported by evidence, and a conclusion that synthesises the key points. Unlike a descriptive essay, an analytical essay goes beyond summarising — it critically examines how and why something works the way it does.',
      },
      {
        id: 's16',
        heading: 'Crafting a Thesis Statement',
        body: 'A thesis statement is the central claim of your essay — a single sentence that tells the reader what you will argue and why it matters. A strong thesis is specific, debatable, and supported by evidence. For example: "The use of symbolism in Chinua Achebe\'s Things Fall Apart effectively illustrates the destructive impact of colonialism on Igbo society." This is specific, makes a claim, and sets up a line of argument.',
      },
    ],
  },
  {
    id: 'm7',
    title: 'Accounting: Financial Statements',
    description: 'Reading and preparing income statements and balance sheets.',
    subject: 'Accounting',
    duration: '65 min',
    progress: 0,
    locked: false,
    quizId: 'q7',
    content: [
      {
        id: 's17',
        heading: 'The Income Statement',
        body: 'An income statement (also called a profit and loss statement) shows a company\'s revenues and expenses over a specific period, resulting in a net profit or net loss. The basic formula is: Revenue − Cost of Goods Sold = Gross Profit, then Gross Profit − Operating Expenses = Operating Income. The income statement is a key tool for stakeholders to assess a business\'s financial performance over time.',
      },
    ],
  },
  {
    id: 'm8',
    title: 'Computer Applications Technology',
    description: 'Spreadsheets, databases, and information management.',
    subject: 'CAT',
    duration: '55 min',
    progress: 0,
    locked: false,
    quizId: 'q8',
    content: [
      {
        id: 's18',
        heading: 'Spreadsheet Fundamentals',
        body: 'A spreadsheet is a grid of cells arranged in rows and columns used to organise, calculate, and analyse data. Each cell can contain text, numbers, or formulas. Formulas always start with an equals sign (=) and can reference other cells. For example, =SUM(A1:A10) adds all values in cells A1 through A10. Spreadsheet software such as Microsoft Excel and Google Sheets is widely used in business, science, and education.',
      },
    ],
  },
  {
    id: 'm9',
    title: 'Mathematics: Statistics & Probability',
    description: 'Data handling, measures of central tendency, and probability.',
    subject: 'Mathematics',
    duration: '50 min',
    progress: 0,
    locked: false,
    quizId: 'q9',
    content: [
      {
        id: 's19',
        heading: 'Measures of Central Tendency',
        body: 'Measures of central tendency describe the centre of a data set. The mean is the arithmetic average, calculated by summing all values and dividing by the count. The median is the middle value when data is ordered from smallest to largest. The mode is the most frequently occurring value. Each measure has different strengths: the mean uses all data points but is sensitive to outliers, while the median is more robust for skewed distributions.',
      },
    ],
  },
  {
    id: 'm10',
    title: 'Life Orientation: Career Planning',
    description: 'Self-assessment, career paths, and post-school options.',
    subject: 'Life Orientation',
    duration: '35 min',
    progress: 0,
    locked: false,
    quizId: 'q10',
    content: [
      {
        id: 's20',
        heading: 'Knowing Your Strengths',
        body: 'Career planning starts with self-awareness. A personal SWOT analysis helps identify your Strengths (what you do well), Weaknesses (areas to improve), Opportunities (external chances to grow), and Threats (obstacles you may face). Tools such as the Holland Occupational Themes (RIASEC) model categorise interests into Realistic, Investigative, Artistic, Social, Enterprising, and Conventional types, helping match interests to career fields.',
      },
    ],
  },
];

/* ─── QUIZZES ──────────────────────────────────────────────────────────────── */
export const MOCK_QUIZZES: Quiz[] = [
  {
    id: 'q1',
    moduleId: 'm1',
    title: 'Mathematics Quiz',
    questions: [
      { id: 'qq1', question: 'What is the base of the decimal number system?', options: ['2', '8', '10', '16'], correctIndex: 2, explanation: 'The decimal system uses 10 digits (0–9), making its base 10.' },
      { id: 'qq2', question: 'Which formula gives the area of a rectangle?', options: ['A = l + w', 'A = l × w', 'A = 2(l + w)', 'A = l²'], correctIndex: 1, explanation: 'Area = length × width.' },
      { id: 'qq3', question: 'In the expression 3 + 4 × 2, what is the correct result?', options: ['14', '11', '10', '24'], correctIndex: 1, explanation: 'Multiplication before addition: 4×2=8, then 3+8=11.' },
      { id: 'qq4', question: 'What does the variable x represent in algebra?', options: ['Always a fixed value of 10', 'An unknown or changing number', 'Only whole numbers', 'The base of a triangle'], correctIndex: 1, explanation: 'In algebra, a variable like x represents an unknown or changing quantity.' },
      { id: 'qq5', question: 'What is the binary system\'s base?', options: ['10', '16', '2', '8'], correctIndex: 2, explanation: 'Binary (base-2) uses only the digits 0 and 1, making its base 2.' },
    ],
  },
  {
    id: 'q2',
    moduleId: 'm2',
    title: 'Cell Biology Quiz',
    questions: [
      { id: 'qq6', question: 'What is the smallest unit of life?', options: ['Atom', 'Molecule', 'Cell', 'Tissue'], correctIndex: 2, explanation: 'The cell is the basic structural and functional unit of all living organisms.' },
      { id: 'qq7', question: 'Which organelle produces energy for the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Vacuole'], correctIndex: 1, explanation: 'Mitochondria are the "powerhouses" of the cell, producing ATP through cellular respiration.' },
      { id: 'qq8', question: 'What type of cell division produces sex cells?', options: ['Mitosis', 'Binary fission', 'Meiosis', 'Budding'], correctIndex: 2, explanation: 'Meiosis produces gametes (sex cells) with half the normal chromosome number.' },
      { id: 'qq9', question: 'Which organelle performs photosynthesis?', options: ['Mitochondria', 'Nucleus', 'Chloroplast', 'Golgi apparatus'], correctIndex: 2, explanation: 'Chloroplasts, found in plant cells, convert sunlight into glucose through photosynthesis.' },
      { id: 'qq10', question: 'Prokaryotic cells differ from eukaryotic cells because they lack a...', options: ['Cell membrane', 'Nucleus', 'DNA', 'Cytoplasm'], correctIndex: 1, explanation: 'Prokaryotic cells have no membrane-bound nucleus; their DNA floats freely in the cytoplasm.' },
    ],
  },
  {
    id: 'q3',
    moduleId: 'm3',
    title: 'Forces & Motion Quiz',
    questions: [
      { id: 'qq11', question: 'What property of matter describes resistance to change in motion?', options: ['Gravity', 'Inertia', 'Friction', 'Momentum'], correctIndex: 1, explanation: "Inertia is the tendency of an object to resist changes in its state of motion — the basis of Newton's First Law." },
      { id: 'qq12', question: 'F = ma is the formula for which law?', options: ["Newton's 1st Law", "Newton's 2nd Law", "Newton's 3rd Law", 'Law of Gravitation'], correctIndex: 1, explanation: "Newton's Second Law: Force = mass × acceleration." },
      { id: 'qq13', question: 'If you push a wall with 50N of force, how much force does the wall push back?', options: ['0N', '25N', '50N', '100N'], correctIndex: 2, explanation: "Newton's Third Law: equal and opposite reaction — the wall pushes back with exactly 50N." },
      { id: 'qq14', question: 'Which has more inertia — a truck or a bicycle moving at the same speed?', options: ['Bicycle', 'Truck', 'Both the same', 'Depends on speed'], correctIndex: 1, explanation: 'A truck has greater mass, therefore greater inertia.' },
      { id: 'qq15', question: 'A rocket moves forward because exhaust gases are expelled backwards. Which law explains this?', options: ["Newton's 1st", "Newton's 2nd", "Newton's 3rd", 'Hooke\'s Law'], correctIndex: 2, explanation: "Newton's Third Law: every action has an equal and opposite reaction." },
    ],
  },
  {
    id: 'q4', moduleId: 'm4', title: 'Apartheid Era Quiz',
    questions: [
      { id: 'qq16', question: 'What does "apartheid" mean in Afrikaans?', options: ['Freedom', 'Separateness', 'Justice', 'Division'], correctIndex: 1, explanation: 'Apartheid means "separateness" in Afrikaans.' },
      { id: 'qq17', question: 'In which year did apartheid officially begin?', options: ['1944', '1948', '1952', '1960'], correctIndex: 1, explanation: 'The National Party came to power in 1948, beginning the official apartheid era.' },
      { id: 'qq18', question: 'How many years was Nelson Mandela imprisoned?', options: ['18', '21', '27', '30'], correctIndex: 2, explanation: 'Mandela was imprisoned from 1964 to 1990 — 27 years.' },
      { id: 'qq19', question: 'When were South Africa\'s first democratic elections held?', options: ['1990', '1992', '1994', '1996'], correctIndex: 2, explanation: 'The first non-racial democratic elections were held on 27 April 1994.' },
      { id: 'qq20', question: 'What is the Freedom Charter?', options: ['The apartheid constitution', 'A document adopted at Kliptown in 1955 outlining democratic rights', 'The 1994 constitution', 'A NP policy document'], correctIndex: 1, explanation: 'The Freedom Charter was adopted by the Congress Alliance in Kliptown in 1955, calling for equal rights for all South Africans.' },
    ],
  },
  {
    id: 'q5', moduleId: 'm5', title: 'Climate Zones Quiz',
    questions: [
      { id: 'qq21', question: 'Climate is measured over how many years on average?', options: ['10', '20', '30', '50'], correctIndex: 2, explanation: 'Climate is typically defined as the average weather over a 30-year period.' },
      { id: 'qq22', question: 'Which climate zone characterises the Western Cape of South Africa?', options: ['Tropical', 'Mediterranean', 'Semi-arid', 'Polar'], correctIndex: 1, explanation: "The Western Cape has a Mediterranean climate with wet winters and dry summers." },
    ],
  },
  {
    id: 'q6', moduleId: 'm6', title: 'Analytical Writing Quiz',
    questions: [
      { id: 'qq23', question: 'What is the central claim of an essay called?', options: ['Topic sentence', 'Thesis statement', 'Introduction', 'Conclusion'], correctIndex: 1, explanation: "The thesis statement is the main argument of the entire essay." },
      { id: 'qq24', question: 'A strong thesis statement must be...', options: ['Vague and general', 'Specific and debatable', 'A question', 'One word'], correctIndex: 1, explanation: 'A thesis must be specific, arguable, and supported by evidence.' },
    ],
  },
  { id: 'q7', moduleId: 'm7', title: 'Financial Statements Quiz', questions: [{ id: 'qq25', question: 'What is Revenue − Cost of Goods Sold equal to?', options: ['Net Profit', 'Gross Profit', 'Operating Income', 'Total Equity'], correctIndex: 1, explanation: 'Revenue − COGS = Gross Profit, before deducting operating expenses.' }] },
  { id: 'q8', moduleId: 'm8', title: 'Spreadsheets Quiz', questions: [{ id: 'qq26', question: 'What must every spreadsheet formula begin with?', options: ['+', '#', '=', '@'], correctIndex: 2, explanation: 'All spreadsheet formulas start with the equals sign (=).' }] },
  { id: 'q9', moduleId: 'm9', title: 'Statistics Quiz', questions: [{ id: 'qq27', question: 'Which measure of central tendency is most affected by extreme values (outliers)?', options: ['Mode', 'Median', 'Mean', 'Range'], correctIndex: 2, explanation: 'The mean uses all values, so a very high or low value pulls it significantly.' }] },
  { id: 'q10', moduleId: 'm10', title: 'Career Planning Quiz', questions: [{ id: 'qq28', question: 'What does SWOT stand for?', options: ['Skills, Work, Options, Targets', 'Strengths, Weaknesses, Opportunities, Threats', 'Study, Write, Organise, Think', 'Strategy, Workplace, Output, Time'], correctIndex: 1, explanation: 'SWOT = Strengths, Weaknesses, Opportunities, Threats.' }] },
];

/* ─── STUDENT PROGRESS ─────────────────────────────────────────────────────── */
export const MOCK_STUDENT_PROGRESS: StudentProgress[] = [
  { studentId: 'u1', studentName: 'Sipho Ndlovu', studentEmail: 'student@fundisa.co.za', modulesCompleted: 4, totalModules: 10, quizScores: { m1: 80, m2: 60, m3: 100, m4: 40 }, lastActive: '2026-10-05' },
  { studentId: 'u2', studentName: 'Amahle Dlamini', studentEmail: 'amahle@fundisa.co.za', modulesCompleted: 7, totalModules: 10, quizScores: { m1: 100, m2: 80, m3: 60, m4: 80, m5: 100, m6: 60, m7: 40 }, lastActive: '2026-10-04' },
  { studentId: 'u3', studentName: 'Tebogo Mokoena', studentEmail: 'tebogo@fundisa.co.za', modulesCompleted: 2, totalModules: 10, quizScores: { m1: 40, m2: 80 }, lastActive: '2026-10-03' },
];

/* ─── UPLOADED CONTENT ─────────────────────────────────────────────────────── */
export const MOCK_UPLOADED_CONTENT: UploadedContent[] = [
  { id: 'c1', title: 'Grade 12 Maths Study Guide', type: 'pdf', moduleId: 'm1', uploadedAt: '2026-09-15', size: '2.4 MB' },
  { id: 'c2', title: 'Cell Biology Video Lecture', type: 'video', moduleId: 'm2', uploadedAt: '2026-09-20', size: '128 MB' },
  { id: 'c3', title: "Newton's Laws Practice Problems", type: 'document', moduleId: 'm3', uploadedAt: '2026-09-22', size: '380 KB' },
  { id: 'c4', title: 'Term 3 History Test', type: 'test', moduleId: 'm4', uploadedAt: '2026-09-28', size: '156 KB' },
];

/* ─── TRANSLATION MOCK ─────────────────────────────────────────────────────── */
// Simulated translations for a few key sentences (real app would use AI API)
export const MOCK_TRANSLATIONS: Record<string, Record<string, string>> = {
  zulu: {
    'What are Number Systems?': 'Yini Izinhlelo Zamanani?',
    'A number system is a way of representing numbers using a set of symbols and rules. The most common system we use daily is the decimal system, which uses ten digits: 0 through 9. Other systems include binary (base-2), used in computers, and hexadecimal (base-16), used in programming. Understanding number systems helps us understand how data is stored and processed in the digital world.':
      'Uhlelo lwamanani indlela yokumela amanani kusetshenziswa izimpawu nezimiso. Uhlelo oluvamile esilusebenzisayo nsuku zonke uhlelo lwezinombolo eziyishumi, olusetshenziswa izinombolo eziyishumi: kusukela ku-0 kuya ku-9. Ezinye izinhlelo zihlanganisa binary (isigaba-2), esetshenziswa kumakompyutha, ne-hexadecimal (isigaba-16), esetshenziswa ukuhlela. Ukuqonda izinhlelo zamanani kusisiza ukuqonda ukuthi idatha igcinwa futhi iphathwa kanjani emhlabeni wedijithali.',
    'The Cell: Basic Unit of Life': 'Iseli: Iyunithi Eyisisekelo Yokuphila',
    'Newton\'s First Law': 'Umthetho Wokuqala KaNtoni',
  },
  xhosa: {
    'What are Number Systems?': 'Zintoni iNkqubo zeNombolo?',
    'The Cell: Basic Unit of Life': 'ISeli: Iyunithi Eyisiseko Yobomi',
    'Newton\'s First Law': 'Umthetho Wokuqala KaNiwtoni',
  },
  sotho: {
    'What are Number Systems?': 'Ke Eng Tsamaiso ya Dinomoro?',
    'The Cell: Basic Unit of Life': 'Sele: Yuniti ea Motheo ea Bophelo',
    'Newton\'s First Law': 'Molao oa Pele oa Newton',
  },
  afrikaans: {
    'What are Number Systems?': 'Wat is Getalstelsels?',
    'A number system is a way of representing numbers using a set of symbols and rules. The most common system we use daily is the decimal system, which uses ten digits: 0 through 9. Other systems include binary (base-2), used in computers, and hexadecimal (base-16), used in programming. Understanding number systems helps us understand how data is stored and processed in the digital world.':
      "'n Getalstelsel is 'n manier om getalle voor te stel deur 'n stel simbole en reëls te gebruik. Die mees algemene stelsel wat ons daagliks gebruik, is die desimale stelsel, wat tien syfers gebruik: 0 tot 9. Ander stelsels sluit binêre (basis-2), wat in rekenaars gebruik word, en heksadesimale (basis-16), wat in programmering gebruik word, in. Begrip van getalstelsels help ons verstaan hoe data in die digitale wêreld gestoor en verwerk word.",
    'The Cell: Basic Unit of Life': 'Die Sel: Basiese Eenheid van Lewe',
    'Newton\'s First Law': "Newton se Eerste Wet",
  },
};
