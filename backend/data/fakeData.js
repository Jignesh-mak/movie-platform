// ============================================================
//  FAKE TMDB DATA — 100% offline, no API key needed
// ============================================================

const POSTER_BASE = 'https://picsum.photos/seed';

const makeImg = (seed, w = 300, h = 450) => `${POSTER_BASE}/${seed}/${w}/${h}`;
const makeBackdrop = (seed) => `${POSTER_BASE}/${seed}b/1280/720`;
const makeProfile = (seed) => `${POSTER_BASE}/${seed}p/185/278`;

const GENRES = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
  14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
  9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction',
  10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
};

const TV_GENRES = {
  10759: 'Action & Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
  10762: 'Kids', 9648: 'Mystery', 10763: 'News', 10764: 'Reality',
  10765: 'Sci-Fi & Fantasy', 10766: 'Soap', 10767: 'Talk',
  10768: 'War & Politics', 37: 'Western'
};

const TRAILERS = [
  'dQw4w9WgXcQ', 'ScMzIvxBSi4', '2LqzF5WauAw', 'nfWlot6h_JM',
  'sY1S34973zA', 'VkBqzMTR5s0', 'TcMBFSGVi1c', 'hYip_Vuv8J0',
  'egyvOBOFRPQ', 'wqnLXxx11js', 'JfVOs4VSpmA', '5PSNL1qE6VY'
];

const rndTrailer = () => TRAILERS[Math.floor(Math.random() * TRAILERS.length)];
const rndRating = (min = 5, max = 9.5) => +(Math.random() * (max - min) + min).toFixed(1);
const rndVotes = (min = 500, max = 50000) => Math.floor(Math.random() * (max - min) + min);
const rndYear = (start = 1990, end = 2024) => Math.floor(Math.random() * (end - start) + start);

// ─── MOVIES ──────────────────────────────────────────────────────────────────
const MOVIES_RAW = [
  { id: 1001, title: 'Galactic Storm', genre_ids: [28, 878, 12], seed: 'galaxy1', year: 2024, rating: 8.4, desc: 'A lone astronaut battles alien forces threatening Earth\'s last colony on Mars. With time running out, she must unite rival factions before the storm arrives.' },
  { id: 1002, title: 'Midnight Heist', genre_ids: [80, 53, 28], seed: 'heist1', year: 2023, rating: 7.9, desc: 'An elite crew of thieves plans the impossible: stealing from the world\'s most secure vault in the heart of Tokyo during a blackout.' },
  { id: 1003, title: 'The Last Kingdom', genre_ids: [18, 36, 10752], seed: 'kingdom1', year: 2022, rating: 8.1, desc: 'An exiled prince returns to reclaim his throne in a medieval world torn by political intrigue, betrayal, and forbidden love.' },
  { id: 1004, title: 'Neon Shadows', genre_ids: [878, 53, 80], seed: 'neon1', year: 2024, rating: 7.6, desc: 'In a cyberpunk metropolis where memories can be bought and sold, a detective investigates her own murder in a reality she can no longer trust.' },
  { id: 1005, title: 'Ocean\'s Wrath', genre_ids: [28, 12, 18], seed: 'ocean1', year: 2023, rating: 7.2, desc: 'When a mega-tsunami threatens the Pacific coast, a disgraced engineer must work with his estranged family to save thousands of lives.' },
  { id: 1006, title: 'Crimson Peak', genre_ids: [27, 18, 10749], seed: 'crimson1', year: 2022, rating: 7.8, desc: 'A young author discovers the dark secrets of her husband\'s gothic mansion — and the ghosts that refuse to let the truth die.' },
  { id: 1007, title: 'Rise of the Phoenix', genre_ids: [28, 12, 14], seed: 'phoenix1', year: 2024, rating: 8.6, desc: 'The chosen warrior of an ancient prophecy must master five elemental powers before the eternal darkness consumes the last city of light.' },
  { id: 1008, title: 'Silent Code', genre_ids: [53, 9648, 878], seed: 'silent1', year: 2023, rating: 7.5, desc: 'A deaf cryptographer is the only witness to a government conspiracy. With no allies and nowhere to run, she must decode the truth before they silence her permanently.' },
  { id: 1009, title: 'The Grand Illusion', genre_ids: [18, 35, 10749], seed: 'grand1', year: 2022, rating: 8.3, desc: 'Two rival magicians fall in love during the golden age of Hollywood, only to discover their greatest trick is keeping their relationship alive.' },
  { id: 1010, title: 'Iron Fist Chronicles', genre_ids: [28, 12, 18], seed: 'iron1', year: 2024, rating: 7.7, desc: 'A former special forces soldier infiltrates a ruthless criminal empire to rescue his kidnapped daughter, leaving a trail of justice behind.' },
  { id: 1011, title: 'Whispers in the Dark', genre_ids: [27, 9648, 53], seed: 'whisper1', year: 2023, rating: 7.4, desc: 'A family moves into a remote farmhouse, only to realize the previous residents never truly left — and they have unfinished business.' },
  { id: 1012, title: 'The Quantum Leap', genre_ids: [878, 12, 28], seed: 'quantum1', year: 2024, rating: 8.0, desc: 'Scientists accidentally open a portal to parallel universes, unleashing versions of themselves with very different — and deadly — intentions.' },
  { id: 1013, title: 'Burning Horizon', genre_ids: [18, 80, 53], seed: 'burning1', year: 2022, rating: 8.2, desc: 'Based on true events: a whistleblower risks everything to expose an oil company\'s cover-up of a catastrophic environmental disaster.' },
  { id: 1014, title: 'Stardust Express', genre_ids: [16, 10751, 12], seed: 'stardust1', year: 2023, rating: 7.9, desc: 'A little girl who can talk to stars embarks on an intergalactic train journey to find her lost father, making extraordinary friends along the way.' },
  { id: 1015, title: 'The Forgotten War', genre_ids: [10752, 18, 36], seed: 'war1', year: 2022, rating: 8.5, desc: 'An untold story of courage: a group of soldiers trapped behind enemy lines must rely on a local civilian guide through impossible terrain.' },
  { id: 1016, title: 'Love in Monsoon', genre_ids: [10749, 18, 35], seed: 'love1', year: 2023, rating: 7.3, desc: 'Two strangers stranded in a small Indian town during the monsoon season discover that the storms outside are nothing compared to what they feel inside.' },
  { id: 1017, title: 'Dark Matter', genre_ids: [878, 9648, 53], seed: 'dark1', year: 2024, rating: 8.1, desc: 'A physicist wakes up in a life that isn\'t his — same face, different choices. Now he must find the thread back to his real existence before his alternate self does.' },
  { id: 1018, title: 'The Last Samurai\'s Code', genre_ids: [28, 18, 36], seed: 'samurai1', year: 2022, rating: 7.8, desc: 'In feudal Japan, an honorable samurai must choose between loyalty to a corrupt shogun and the justice his dying master demanded.' },
  { id: 1019, title: 'Velocity', genre_ids: [28, 12, 53], seed: 'velocity1', year: 2024, rating: 7.0, desc: 'The world\'s fastest street racer discovers his next race is rigged by a dangerous cartel — and losing is not an option for either side.' },
  { id: 1020, title: 'Arctic Survival', genre_ids: [12, 18, 53], seed: 'arctic1', year: 2023, rating: 8.3, desc: 'Stranded on a remote Arctic island after a plane crash, a botanist and a soldier must survive the elements — and each other — until rescue comes.' },
  { id: 1021, title: 'The Algorithm', genre_ids: [878, 53, 9648], seed: 'algo1', year: 2024, rating: 7.6, desc: 'A tech genius creates an AI that predicts crimes before they happen. When it predicts his own murder, he has 72 hours to find the killer.' },
  { id: 1022, title: 'Ember Falls', genre_ids: [18, 10749, 35], seed: 'ember1', year: 2022, rating: 7.5, desc: 'A novelist returns to her small hometown after 15 years and reconnects with her first love — now a widowed father with a complicated past.' },
  { id: 1023, title: 'Titan Rising', genre_ids: [28, 878, 12], seed: 'titan1', year: 2024, rating: 8.7, desc: 'Humanity\'s last hope against an invading giant species rests with a maverick pilot who can communicate with them — but at a terrible personal cost.' },
  { id: 1024, title: 'The Glass Maze', genre_ids: [9648, 53, 27], seed: 'glass1', year: 2023, rating: 7.7, desc: 'Twelve strangers wake in a labyrinth of mirrors with no memory of how they got there. Only one can escape — and one of them wants to make sure nobody does.' },
  { id: 1025, title: 'Desert Thunder', genre_ids: [28, 10752, 18], seed: 'desert1', year: 2022, rating: 7.9, desc: 'A squad of marines goes off-mission to rescue civilians caught in a Middle Eastern conflict, defying orders to do what\'s right.' },
  { id: 1026, title: 'Northern Lights', genre_ids: [18, 99, 10749], seed: 'northern1', year: 2023, rating: 8.0, desc: 'A documentary filmmaker travels to Scandinavia and unexpectedly falls for her subject — an indigenous activist fighting to preserve his people\'s way of life.' },
  { id: 1027, title: 'Phantom Circuit', genre_ids: [878, 28, 53], seed: 'phantom1', year: 2024, rating: 7.4, desc: 'When a military drone goes rogue and starts targeting civilians, the engineer who built it must shut it down before the government bombs the city to stop it.' },
  { id: 1028, title: 'The Inheritance', genre_ids: [9648, 18, 53], seed: 'inherit1', year: 2022, rating: 7.6, desc: 'Three estranged siblings gather for the reading of their billionaire father\'s will and discover his fortune hides a 30-year-old murder secret.' },
  { id: 1029, title: 'Supernova', genre_ids: [878, 18, 10749], seed: 'supernova1', year: 2023, rating: 8.2, desc: 'Two astronomers on a year-long deep space mission must decide whether to complete humanity\'s most important discovery or save each other.' },
  { id: 1030, title: 'City of Wolves', genre_ids: [80, 18, 53], seed: 'wolves1', year: 2024, rating: 7.8, desc: 'An undercover cop so deep in a crime syndicate he\'s forgotten which side he\'s on must make one final choice that will define his life.' },
  { id: 1031, title: 'The Hidden Valley', genre_ids: [12, 14, 16], seed: 'valley1', year: 2023, rating: 7.3, desc: 'A teenage girl discovers a hidden valley full of mythical creatures and becomes their last guardian against the developers threatening their world.' },
  { id: 1032, title: 'Zero Hour', genre_ids: [53, 28, 9648], seed: 'zero1', year: 2024, rating: 7.5, desc: 'A bomb squad detective receives a series of clues from the bomber himself — each one revealing a personal connection she never expected.' },
  { id: 1033, title: 'The Painter\'s Secret', genre_ids: [9648, 18, 36], seed: 'painter1', year: 2022, rating: 8.1, desc: 'An art historian discovers that a 17th-century painting contains a hidden message — and that people are dying to keep it hidden.' },
  { id: 1034, title: 'Frostbite', genre_ids: [27, 53, 9648], seed: 'frost1', year: 2023, rating: 7.2, desc: 'A remote ski resort is cut off by a blizzard — and someone among the stranded guests is a killer.' },
  { id: 1035, title: 'The Blue Protocol', genre_ids: [878, 53, 28], seed: 'blue1', year: 2024, rating: 8.0, desc: 'A deep-sea research team discovers a classified government project that should have stayed buried at the bottom of the ocean.' },
];

// ─── TV SHOWS ─────────────────────────────────────────────────────────────────
const TV_RAW = [
  { id: 2001, name: 'Shadow Empire', genre_ids: [10759, 18, 80], seed: 'tv1', year: 2023, rating: 9.1, seasons: 3, episodes: 30, desc: 'In a world where corporations have replaced governments, one investigator follows a conspiracy that reaches to the very top of the empire.' },
  { id: 2002, name: 'Crimson Squad', genre_ids: [10759, 80, 18], seed: 'tv2', year: 2022, rating: 8.7, seasons: 2, episodes: 20, desc: 'An elite special crimes unit takes on cases too dangerous and too sensitive for normal law enforcement.' },
  { id: 2003, name: 'The Healers', genre_ids: [18, 10767], seed: 'tv3', year: 2024, rating: 8.3, seasons: 1, episodes: 10, desc: 'Inside the world\'s busiest emergency room, five doctors fight to save lives while navigating their own complicated humanity.' },
  { id: 2004, name: 'Neon City', genre_ids: [10765, 80, 18], seed: 'tv4', year: 2023, rating: 8.9, seasons: 4, episodes: 40, desc: 'A detective in a cyberpunk metropolis solves crimes using augmented reality while questioning what makes someone human.' },
  { id: 2005, name: 'Family Chaos', genre_ids: [35, 18, 10751], seed: 'tv5', year: 2022, rating: 7.8, seasons: 5, episodes: 60, desc: 'The hilariously dysfunctional Mehta family navigates modern life, marriage, kids, and in-laws in Mumbai\'s most chaotic household.' },
  { id: 2006, name: 'The Crown of Ashara', genre_ids: [10765, 18, 10759], seed: 'tv6', year: 2024, rating: 9.3, seasons: 2, episodes: 16, desc: 'In a realm where magic is illegal, a street thief discovers she\'s the last heir to a destroyed magical dynasty — and an empire wants her dead.' },
  { id: 2007, name: 'Deep Blue', genre_ids: [99, 18], seed: 'tv7', year: 2023, rating: 8.5, seasons: 1, episodes: 6, desc: 'An underwater documentary series revealing the most spectacular and terrifying creatures of the unexplored deep ocean.' },
  { id: 2008, name: 'The Long Road', genre_ids: [18, 80, 53], seed: 'tv8', year: 2022, rating: 8.6, seasons: 3, episodes: 24, desc: 'A wrongly convicted woman walks free after 12 years and must rebuild her life while hunting the person who really committed the crime.' },
  { id: 2009, name: 'Stellar Academy', genre_ids: [10762, 16, 10765], seed: 'tv9', year: 2024, rating: 8.0, seasons: 2, episodes: 26, desc: 'Young cadets at an intergalactic academy face alien threats, interstellar politics, and the timeless challenges of growing up.' },
  { id: 2010, name: 'The Cartel Files', genre_ids: [80, 18, 53], seed: 'tv10', year: 2023, rating: 9.0, seasons: 3, episodes: 30, desc: 'An unflinching look at the rise and fall of the world\'s most powerful drug trafficking organization, told from every side.' },
  { id: 2011, name: 'Whisper Network', genre_ids: [53, 9648, 18], seed: 'tv11', year: 2024, rating: 8.4, seasons: 1, episodes: 8, desc: 'Five women in a corporate law firm share a dangerous secret about a powerful partner — and must decide how far they\'ll go to protect each other.' },
  { id: 2012, name: 'Highrise', genre_ids: [18, 35, 10749], seed: 'tv12', year: 2022, rating: 7.9, seasons: 4, episodes: 48, desc: 'The residents of a luxury apartment tower in a major city — their love lives, careers, secrets, and scandals — interconnecting across six floors.' },
  { id: 2013, name: 'Iron Protocol', genre_ids: [10759, 10765, 18], seed: 'tv13', year: 2023, rating: 8.8, seasons: 2, episodes: 18, desc: 'Humanity\'s last standing army uses experimental robot soldiers — but when the robots develop consciousness, the real war begins.' },
  { id: 2014, name: 'Kitchen Confessions', genre_ids: [35, 10767], seed: 'tv14', year: 2024, rating: 7.6, seasons: 3, episodes: 36, desc: 'Behind the scenes of a Michelin-star restaurant where the kitchen is as dramatic as the food is exquisite.' },
  { id: 2015, name: 'The Oracle', genre_ids: [9648, 53, 10765], seed: 'tv15', year: 2023, rating: 8.7, seasons: 2, episodes: 14, desc: 'A woman who can see 48 hours into the future teams with an FBI agent to prevent crimes — but changing the future always has consequences.' },
];

// ─── PEOPLE ───────────────────────────────────────────────────────────────────
const PEOPLE_RAW = [
  { id: 3001, name: 'Maya Chen', department: 'Acting', seed: 'person1', bio: 'Maya Chen is an internationally acclaimed actress known for her intense dramatic roles and commitment to complex characters. Born in Hong Kong, she trained at RADA before breaking into Hollywood.' },
  { id: 3002, name: 'James Okafor', department: 'Acting', seed: 'person2', bio: 'James Okafor brings a magnetic presence to every role. The Nigerian-British actor has appeared in over 40 films across three decades, earning two Academy Award nominations.' },
  { id: 3003, name: 'Sofia Reyes', department: 'Directing', seed: 'person3', bio: 'Sofia Reyes is one of the most celebrated directors of her generation. Her signature style blends intimate character studies with breathtaking visual storytelling.' },
  { id: 3004, name: 'Arjun Mehta', department: 'Acting', seed: 'person4', bio: 'Arjun Mehta is a versatile Indian actor who has crossed over from Bollywood to global productions. Known for his physicality and emotional depth.' },
  { id: 3005, name: 'Elena Vasquez', department: 'Acting', seed: 'person5', bio: 'Elena Vasquez trained as a flamenco dancer before pivoting to acting. Her background in movement informs every physical performance she delivers on screen.' },
  { id: 3006, name: 'Tom Hargreaves', department: 'Acting', seed: 'person6', bio: 'Tom Hargreaves is the quintessential English leading man, equally comfortable in period dramas and modern action blockbusters.' },
  { id: 3007, name: 'Zoe Kim', department: 'Directing', seed: 'person7', bio: 'Zoe Kim exploded onto the scene with her debut feature that won the Palme d\'Or. Her films are known for subverting genre expectations with sharp social commentary.' },
  { id: 3008, name: 'Marcus Williams', department: 'Acting', seed: 'person8', bio: 'Marcus Williams is a chameleon — no two roles look alike. His transformation for The Long Road earned him universal praise and his first Golden Globe.' },
  { id: 3009, name: 'Priya Sharma', department: 'Acting', seed: 'person9', bio: 'Priya Sharma is a powerhouse performer whose emotional range sets her apart. She is the youngest actress to win three consecutive National Awards.' },
  { id: 3010, name: 'Carlos Diaz', department: 'Acting', seed: 'person10', bio: 'Carlos Diaz is beloved for his comedic timing but has proven his dramatic chops in a string of acclaimed thrillers. One of Hollywood\'s most bankable stars.' },
  { id: 3011, name: 'Yuki Tanaka', department: 'Acting', seed: 'person11', bio: 'Yuki Tanaka is a Japanese actress who became a global icon through a unique blend of art house and mainstream cinema. Fluent in five languages.' },
  { id: 3012, name: 'Amara Osei', department: 'Acting', seed: 'person12', bio: 'Amara Osei grew up in Accra and studied film in Paris. Her authentic storytelling and fearless performances have made her one of Africa\'s most exported talents.' },
  { id: 3013, name: 'Ryan Blackwood', department: 'Acting', seed: 'person13', bio: 'Ryan Blackwood is known for his action roles but surprises audiences repeatedly with quiet, devastatingly human dramatic performances.' },
  { id: 3014, name: 'Isabella Forte', department: 'Acting', seed: 'person14', bio: 'Italian actress Isabella Forte brought Old Hollywood glamour back to modern cinema. Her collaborations with director Sofia Reyes have become legendary.' },
  { id: 3015, name: 'David Nakamura', department: 'Directing', seed: 'person15', bio: 'David Nakamura is a visionary director whose use of practical effects and long takes has made him a darling of the cinephile community worldwide.' },
  { id: 3016, name: 'Fatima Al-Hassan', department: 'Acting', seed: 'person16', bio: 'Fatima Al-Hassan broke barriers as the first Arab actress to headline a major Hollywood franchise. Known for her sharp wit and fierce on-screen presence.' },
  { id: 3017, name: 'Leon Petrov', department: 'Acting', seed: 'person17', bio: 'Russian-born Leon Petrov has carved a niche as cinema\'s most compelling villain. His intense preparation and method approach make every antagonist unforgettable.' },
  { id: 3018, name: 'Grace O\'Brien', department: 'Acting', seed: 'person18', bio: 'Irish actress Grace O\'Brien is celebrated for her luminous screen presence and her ability to elevate any script with her natural magnetism.' },
  { id: 3019, name: 'Wei Zhang', department: 'Directing', seed: 'person19', bio: 'Wei Zhang is China\'s most internationally recognized director, blending traditional Chinese storytelling with modern cinematic techniques.' },
  { id: 3020, name: 'Kofi Mensah', department: 'Acting', seed: 'person20', bio: 'Kofi Mensah\'s journey from street theatre in Kumasi to Hollywood leading man is one of cinema\'s great stories. His energy is utterly infectious on screen.' },
];

// ─── TRANSFORM FUNCTIONS ──────────────────────────────────────────────────────

const transformMovie = (m) => ({
  id: m.id,
  title: m.title,
  overview: m.desc,
  poster_path: `/${m.seed}-poster.jpg`,
  backdrop_path: `/${m.seed}-backdrop.jpg`,
  genre_ids: m.genre_ids,
  genres: m.genre_ids.map(id => ({ id, name: GENRES[id] || 'Unknown' })),
  release_date: `${m.year}-${String(Math.floor(Math.random()*12)+1).padStart(2,'0')}-${String(Math.floor(Math.random()*28)+1).padStart(2,'0')}`,
  vote_average: m.rating,
  vote_count: rndVotes(),
  popularity: +(Math.random() * 200 + 50).toFixed(2),
  media_type: 'movie',
  runtime: Math.floor(Math.random() * 60 + 90),
  status: 'Released',
  budget: Math.floor(Math.random() * 200000000 + 10000000),
  revenue: Math.floor(Math.random() * 800000000 + 50000000),
  original_language: 'en',
  tagline: 'Experience the extraordinary.',
  production_countries: [{ name: 'United States of America' }],
  _posterSeed: m.seed,
  _backdropSeed: m.seed,
});

const transformTV = (t) => ({
  id: t.id,
  name: t.name,
  overview: t.desc,
  poster_path: `/${t.seed}-poster.jpg`,
  backdrop_path: `/${t.seed}-backdrop.jpg`,
  genre_ids: t.genre_ids,
  genres: t.genre_ids.map(id => ({ id, name: TV_GENRES[id] || GENRES[id] || 'Unknown' })),
  first_air_date: `${t.year}-01-15`,
  vote_average: t.rating,
  vote_count: rndVotes(),
  popularity: +(Math.random() * 150 + 30).toFixed(2),
  media_type: 'tv',
  number_of_seasons: t.seasons,
  number_of_episodes: t.episodes,
  status: 'Returning Series',
  original_language: 'en',
  _posterSeed: t.seed,
});

const transformPerson = (p) => ({
  id: p.id,
  name: p.name,
  known_for_department: p.department,
  biography: p.bio,
  profile_path: `/${p.seed}-profile.jpg`,
  popularity: +(Math.random() * 100 + 20).toFixed(2),
  birthday: `${rndYear(1970, 1995)}-${String(Math.floor(Math.random()*12)+1).padStart(2,'0')}-${String(Math.floor(Math.random()*28)+1).padStart(2,'0')}`,
  place_of_birth: ['Los Angeles, USA', 'London, UK', 'Mumbai, India', 'Tokyo, Japan', 'Paris, France', 'Lagos, Nigeria'][Math.floor(Math.random()*6)],
  known_for: MOVIES_RAW.slice(0, 3).map(m => ({ id: m.id, title: m.title, media_type: 'movie' })),
  _profileSeed: p.seed,
});

const MOVIES = MOVIES_RAW.map(transformMovie);
const TV_SHOWS = TV_RAW.map(transformTV);
const PEOPLE = PEOPLE_RAW.map(transformPerson);

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const paginate = (arr, page = 1, limit = 20) => {
  const p = parseInt(page) || 1;
  const start = (p - 1) * limit;
  return {
    page: p,
    results: arr.slice(start, start + limit),
    total_results: arr.length,
    total_pages: Math.ceil(arr.length / limit),
  };
};

const addVideos = (item) => ({
  ...item,
  videos: {
    results: [
      { id: 'v1', key: rndTrailer(), name: 'Official Trailer', type: 'Trailer', site: 'YouTube' },
      { id: 'v2', key: rndTrailer(), name: 'Teaser', type: 'Teaser', site: 'YouTube' },
    ]
  }
});

const addCredits = (item) => ({
  ...item,
  credits: {
    cast: PEOPLE.slice(0, 10).map((p, i) => ({
      id: p.id, name: p.name,
      character: ['Hero', 'Villain', 'Sidekick', 'Love Interest', 'Mentor', 'Comic Relief', 'Detective', 'Agent', 'General', 'Scientist'][i],
      profile_path: p.profile_path,
      cast_id: i,
    })),
    crew: [
      { id: PEOPLE[2].id, name: PEOPLE[2].name, job: 'Director', department: 'Directing' },
      { id: PEOPLE[6].id, name: PEOPLE[6].name, job: 'Producer', department: 'Production' },
    ]
  }
});

const addSimilar = (items, currentId) => ({
  results: items.filter(i => i.id !== currentId).slice(0, 12)
});

module.exports = { MOVIES, TV_SHOWS, PEOPLE, GENRES, TV_GENRES, paginate, addVideos, addCredits, addSimilar, makeImg, makeBackdrop, makeProfile };
