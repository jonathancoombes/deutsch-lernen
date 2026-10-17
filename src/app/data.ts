export interface Word { de: string; en: string; type: 'noun' | 'verb' | 'adj' | 'other'; article?: 'der' | 'die' | 'das'; }
export interface Challenge { en: string; words: string[]; }
export interface Topic { id: string; name: string; icon: string; words: Word[]; challenges: Challenge[]; }

export const TOPICS: Topic[] = [
  { id: 'greetings', name: 'Greetings', icon: '👋',
    words: [
      { de: 'Hallo', en: 'Hello', type: 'other' }, { de: 'Guten Morgen', en: 'Good morning', type: 'other' },
      { de: 'Gute Nacht', en: 'Good night', type: 'other' }, { de: 'Danke', en: 'Thank you', type: 'other' },
      { de: 'Bitte', en: 'Please / You\'re welcome', type: 'other' }, { de: 'Tschüss', en: 'Bye', type: 'other' },
      { de: 'heißen', en: 'to be called', type: 'verb' }, { de: 'gehen', en: 'to go / to be doing', type: 'verb' },
    ],
    challenges: [
      { en: 'My name is Jamie.', words: ['Ich', 'heiße', 'Jamie'] },
      { en: 'How are you?', words: ['Wie', 'geht', 'es', 'dir'] },
      { en: 'I am fine, thank you.', words: ['Mir', 'geht', 'es', 'gut', 'danke'] },
      { en: 'Where are you from?', words: ['Woher', 'kommst', 'du'] },
    ] },
  { id: 'family', name: 'Family', icon: '👨‍👩‍👦',
    words: [
      { de: 'Mutter', en: 'mother', type: 'noun', article: 'die' }, { de: 'Vater', en: 'father', type: 'noun', article: 'der' },
      { de: 'Sohn', en: 'son', type: 'noun', article: 'der' }, { de: 'Tochter', en: 'daughter', type: 'noun', article: 'die' },
      { de: 'Bruder', en: 'brother', type: 'noun', article: 'der' }, { de: 'Schwester', en: 'sister', type: 'noun', article: 'die' },
      { de: 'Kind', en: 'child', type: 'noun', article: 'das' }, { de: 'Familie', en: 'family', type: 'noun', article: 'die' },
    ],
    challenges: [
      { en: 'This is my mother.', words: ['Das', 'ist', 'meine', 'Mutter'] },
      { en: 'My father is nice.', words: ['Mein', 'Vater', 'ist', 'nett'] },
      { en: 'I have a sister.', words: ['Ich', 'habe', 'eine', 'Schwester'] },
      { en: 'The child is small.', words: ['Das', 'Kind', 'ist', 'klein'] },
    ] },
  { id: 'food', name: 'Food & Drink', icon: '🍎',
    words: [
      { de: 'Apfel', en: 'apple', type: 'noun', article: 'der' }, { de: 'Brot', en: 'bread', type: 'noun', article: 'das' },
      { de: 'Wasser', en: 'water', type: 'noun', article: 'das' }, { de: 'Milch', en: 'milk', type: 'noun', article: 'die' },
      { de: 'Käse', en: 'cheese', type: 'noun', article: 'der' }, { de: 'essen', en: 'to eat', type: 'verb' },
      { de: 'trinken', en: 'to drink', type: 'verb' }, { de: 'lecker', en: 'tasty', type: 'adj' },
    ],
    challenges: [
      { en: 'I eat an apple.', words: ['Ich', 'esse', 'einen', 'Apfel'] },
      { en: 'I drink water.', words: ['Ich', 'trinke', 'Wasser'] },
      { en: 'The bread is tasty.', words: ['Das', 'Brot', 'ist', 'lecker'] },
      { en: 'Dad drinks milk.', words: ['Papa', 'trinkt', 'Milch'] },
    ] },
  { id: 'home', name: 'Home & Daily Life', icon: '🏠',
    words: [
      { de: 'Haus', en: 'house', type: 'noun', article: 'das' }, { de: 'Tisch', en: 'table', type: 'noun', article: 'der' },
      { de: 'Küche', en: 'kitchen', type: 'noun', article: 'die' }, { de: 'Hund', en: 'dog', type: 'noun', article: 'der' },
      { de: 'Katze', en: 'cat', type: 'noun', article: 'die' }, { de: 'wohnen', en: 'to live', type: 'verb' },
      { de: 'schlafen', en: 'to sleep', type: 'verb' }, { de: 'spielen', en: 'to play', type: 'verb' },
    ],
    challenges: [
      { en: 'We live in a house.', words: ['Wir', 'wohnen', 'in', 'einem', 'Haus'] },
      { en: 'The dog is sleeping.', words: ['Der', 'Hund', 'schläft'] },
      { en: 'The cat plays in the kitchen.', words: ['Die', 'Katze', 'spielt', 'in', 'der', 'Küche'] },
      { en: 'I like the house.', words: ['Ich', 'mag', 'das', 'Haus'] },
    ] },
  { id: 'nature', name: 'Nature', icon: '🌳',
    words: [
      { de: 'Baum', en: 'tree', type: 'noun', article: 'der' }, { de: 'Blume', en: 'flower', type: 'noun', article: 'die' },
      { de: 'Sonne', en: 'sun', type: 'noun', article: 'die' }, { de: 'Vogel', en: 'bird', type: 'noun', article: 'der' },
      { de: 'Wald', en: 'forest', type: 'noun', article: 'der' }, { de: 'wachsen', en: 'to grow', type: 'verb' },
      { de: 'scheinen', en: 'to shine', type: 'verb' }, { de: 'grün', en: 'green', type: 'adj' },
      { de: 'groß', en: 'big', type: 'adj' }, { de: 'schön', en: 'beautiful', type: 'adj' },
    ],
    challenges: [
      { en: 'The tree is big.', words: ['Der', 'Baum', 'ist', 'groß'] },
      { en: 'The flower is beautiful.', words: ['Die', 'Blume', 'ist', 'schön'] },
      { en: 'The sun is shining.', words: ['Die', 'Sonne', 'scheint'] },
      { en: 'The forest is green.', words: ['Der', 'Wald', 'ist', 'grün'] },
    ] },
  { id: 'gaming', name: 'Gaming', icon: '🎮',
    words: [
      { de: 'Spiel', en: 'game', type: 'noun', article: 'das' }, { de: 'Computer', en: 'computer', type: 'noun', article: 'der' },
      { de: 'Controller', en: 'controller', type: 'noun', article: 'der' }, { de: 'spielen', en: 'to play', type: 'verb' },
      { de: 'gewinnen', en: 'to win', type: 'verb' }, { de: 'verlieren', en: 'to lose', type: 'verb' },
      { de: 'toll', en: 'great', type: 'adj' }, { de: 'spannend', en: 'exciting', type: 'adj' },
    ],
    challenges: [
      { en: 'I am playing a game.', words: ['Ich', 'spiele', 'ein', 'Spiel'] },
      { en: 'The game is exciting.', words: ['Das', 'Spiel', 'ist', 'spannend'] },
      { en: 'We are playing on the computer.', words: ['Wir', 'spielen', 'am', 'Computer'] },
      { en: 'I win the game.', words: ['Ich', 'gewinne', 'das', 'Spiel'] },
    ] },
  { id: 'dinosaurs', name: 'Dinosaurs', icon: '🦖',
    words: [
      { de: 'Dinosaurier', en: 'dinosaur', type: 'noun', article: 'der' }, { de: 'T-Rex', en: 'T. rex', type: 'noun', article: 'der' },
      { de: 'Fossil', en: 'fossil', type: 'noun', article: 'das' }, { de: 'Ei', en: 'egg', type: 'noun', article: 'das' },
      { de: 'leben', en: 'to live', type: 'verb' }, { de: 'brüllen', en: 'to roar', type: 'verb' },
      { de: 'groß', en: 'big', type: 'adj' }, { de: 'stark', en: 'strong', type: 'adj' },
      { de: 'alt', en: 'old', type: 'adj' },
    ],
    challenges: [
      { en: 'The dinosaur is big.', words: ['Der', 'Dinosaurier', 'ist', 'groß'] },
      { en: 'The T. rex is strong.', words: ['Der', 'T-Rex', 'ist', 'stark'] },
      { en: 'The fossil is old.', words: ['Das', 'Fossil', 'ist', 'alt'] },
      { en: 'The dinosaur is roaring.', words: ['Der', 'Dinosaurier', 'brüllt'] },
    ] },
  { id: 'travel', name: 'Travel', icon: '✈️',
    words: [
      { de: 'Bahnhof', en: 'train station', type: 'noun', article: 'der' }, { de: 'Zug', en: 'train', type: 'noun', article: 'der' },
      { de: 'Hotel', en: 'hotel', type: 'noun', article: 'das' }, { de: 'Stadt', en: 'city', type: 'noun', article: 'die' },
      { de: 'fahren', en: 'to drive / travel', type: 'verb' }, { de: 'kaufen', en: 'to buy', type: 'verb' },
      { de: 'sprechen', en: 'to speak', type: 'verb' }, { de: 'Wo', en: 'where', type: 'other' },
    ],
    challenges: [
      { en: 'Where is the train station?', words: ['Wo', 'ist', 'der', 'Bahnhof'] },
      { en: 'I am travelling to the city.', words: ['Ich', 'fahre', 'in', 'die', 'Stadt'] },
      { en: 'I speak a little German.', words: ['Ich', 'spreche', 'ein', 'bisschen', 'Deutsch'] },
      { en: 'I would like a ticket.', words: ['Ich', 'möchte', 'eine', 'Fahrkarte'] },
    ] },
];

export interface Rule { title: string; text: string; examples: string[]; }
export const RULES: Rule[] = [
  { title: 'Verb in second position', text: 'In a normal statement the conjugated verb is always the second element.', examples: ['Ich trinke Wasser.', 'Heute trinke ich Wasser.'] },
  { title: 'Three genders', text: 'Nouns are der (masculine), die (feminine) or das (neuter). Always learn a noun with its article.', examples: ['der Vater', 'die Mutter', 'das Kind'] },
  { title: 'Nouns are capitalised', text: 'Every noun in German starts with a capital letter.', examples: ['Das Haus ist klein.'] },
  { title: 'Questions', text: 'Yes/no questions start with the verb. W-questions start with the question word, then the verb.', examples: ['Hast du Hunger?', 'Wo wohnst du?'] },
  { title: 'Verb endings', text: 'ich -e, du -st, er/sie/es -t, wir -en, ihr -t, sie/Sie -en.', examples: ['ich spiele', 'du spielst', 'er spielt', 'wir spielen'] },
  { title: 'Accusative case', text: 'The direct object changes der to den (masculine only). ein becomes einen.', examples: ['Ich esse den Apfel.', 'Ich habe einen Hund.'] },
  { title: 'Negation', text: 'Use nicht to negate verbs/adjectives and kein to negate nouns.', examples: ['Ich habe keinen Hund.', 'Das ist nicht gut.'] },
];
