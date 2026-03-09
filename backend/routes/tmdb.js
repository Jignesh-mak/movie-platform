const express = require('express');
const router = express.Router();
const { MOVIES, TV_SHOWS, PEOPLE, GENRES, TV_GENRES, paginate, addVideos, addCredits, addSimilar } = require('../data/fakeData');

// TRENDING
router.get('/trending/:media/:window', (req, res) => {
  const { media } = req.params;
  let results = [];
  if (media === 'movie') results = [...MOVIES];
  else if (media === 'tv') results = [...TV_SHOWS];
  else results = [...MOVIES, ...TV_SHOWS].sort(() => Math.random() - 0.5);
  results = results.sort((a, b) => b.vote_average - a.vote_average);
  res.json(paginate(results, req.query.page, 20));
});

// MOVIES
router.get('/movie/popular',    (req, res) => res.json(paginate([...MOVIES].sort((a,b) => b.popularity - a.popularity), req.query.page)));
router.get('/movie/top_rated',  (req, res) => res.json(paginate([...MOVIES].sort((a,b) => b.vote_average - a.vote_average), req.query.page)));
router.get('/movie/now_playing',(req, res) => res.json(paginate([...MOVIES].sort((a,b) => b.release_date.localeCompare(a.release_date)), req.query.page)));
router.get('/movie/upcoming',   (req, res) => res.json(paginate([...MOVIES].slice(10).reverse(), req.query.page)));

router.get('/movie/:id/videos', (req, res) => res.json({ results: [{ id:'v1', key:'dQw4w9WgXcQ', name:'Official Trailer', type:'Trailer', site:'YouTube' }, { id:'v2', key:'ScMzIvxBSi4', name:'Teaser', type:'Teaser', site:'YouTube' }] }));
router.get('/movie/:id/credits',(req, res) => { const m = MOVIES.find(m => m.id === parseInt(req.params.id)); res.json(m ? addCredits(m).credits : { cast:[], crew:[] }); });
router.get('/movie/:id', (req, res) => {
  const movie = MOVIES.find(m => m.id === parseInt(req.params.id));
  if (!movie) return res.status(404).json({ message: 'Not found' });
  res.json(addVideos(addCredits({ ...movie, similar: addSimilar(MOVIES, movie.id) })));
});

// TV
router.get('/tv/popular',     (req, res) => res.json(paginate([...TV_SHOWS].sort((a,b) => b.popularity - a.popularity), req.query.page)));
router.get('/tv/top_rated',   (req, res) => res.json(paginate([...TV_SHOWS].sort((a,b) => b.vote_average - a.vote_average), req.query.page)));
router.get('/tv/airing_today',(req, res) => res.json(paginate([...TV_SHOWS].reverse(), req.query.page)));
router.get('/tv/on_the_air',  (req, res) => res.json(paginate(TV_SHOWS, req.query.page)));
router.get('/tv/:id/videos',  (req, res) => res.json({ results: [{ id:'v1', key:'2LqzF5WauAw', name:'Official Trailer', type:'Trailer', site:'YouTube' }] }));
router.get('/tv/:id', (req, res) => {
  const show = TV_SHOWS.find(t => t.id === parseInt(req.params.id));
  if (!show) return res.status(404).json({ message: 'Not found' });
  res.json(addVideos(addCredits({ ...show, similar: addSimilar(TV_SHOWS, show.id) })));
});

// PEOPLE
router.get('/person/popular', (req, res) => res.json(paginate([...PEOPLE].sort((a,b) => b.popularity - a.popularity), req.query.page)));
router.get('/person/:id', (req, res) => {
  const person = PEOPLE.find(p => p.id === parseInt(req.params.id));
  if (!person) return res.status(404).json({ message: 'Not found' });
  res.json({ ...person, movie_credits: { cast: MOVIES.slice(0,12).map((m,i) => ({ ...m, character: ['Lead','Supporting','Villain','Hero','Cameo'][i%5] })) }, tv_credits: { cast: TV_SHOWS.slice(0,6).map((t,i) => ({ ...t, character: ['Main Cast','Guest Star','Recurring'][i%3] })) }, images: { profiles: [{ file_path: person.profile_path }] } });
});

// SEARCH
router.get('/search/multi', (req, res) => {
  const q = (req.query.query || '').toLowerCase();
  if (!q) return res.json(paginate([], req.query.page));
  const movies = MOVIES.filter(m => m.title.toLowerCase().includes(q) || m.overview.toLowerCase().includes(q)).map(m => ({ ...m, media_type:'movie' }));
  const tv = TV_SHOWS.filter(t => t.name.toLowerCase().includes(q) || t.overview.toLowerCase().includes(q)).map(t => ({ ...t, media_type:'tv' }));
  const people = PEOPLE.filter(p => p.name.toLowerCase().includes(q)).map(p => ({ ...p, media_type:'person' }));
  res.json(paginate([...movies, ...tv, ...people], req.query.page));
});
router.get('/search/movie',  (req, res) => { const q=(req.query.query||'').toLowerCase(); res.json(paginate(MOVIES.filter(m=>m.title.toLowerCase().includes(q)||m.overview.toLowerCase().includes(q)), req.query.page)); });
router.get('/search/tv',     (req, res) => { const q=(req.query.query||'').toLowerCase(); res.json(paginate(TV_SHOWS.filter(t=>t.name.toLowerCase().includes(q)||t.overview.toLowerCase().includes(q)), req.query.page)); });
router.get('/search/person', (req, res) => { const q=(req.query.query||'').toLowerCase(); res.json(paginate(PEOPLE.filter(p=>p.name.toLowerCase().includes(q)), req.query.page)); });

// GENRES
router.get('/genre/movie/list', (req, res) => res.json({ genres: Object.entries(GENRES).map(([id,name]) => ({ id:parseInt(id), name })) }));
router.get('/genre/tv/list',    (req, res) => res.json({ genres: Object.entries(TV_GENRES).map(([id,name]) => ({ id:parseInt(id), name })) }));

// DISCOVER
router.get('/discover/movie', (req, res) => {
  let results = [...MOVIES];
  if (req.query.with_genres) results = results.filter(m => m.genre_ids?.includes(parseInt(req.query.with_genres)));
  if (req.query.sort_by === 'vote_average.desc') results.sort((a,b) => b.vote_average - a.vote_average);
  else results.sort((a,b) => b.popularity - a.popularity);
  res.json(paginate(results, req.query.page));
});
router.get('/discover/tv', (req, res) => {
  let results = [...TV_SHOWS];
  if (req.query.with_genres) results = results.filter(t => t.genre_ids?.includes(parseInt(req.query.with_genres)));
  results.sort((a,b) => b.popularity - a.popularity);
  res.json(paginate(results, req.query.page));
});

module.exports = router;
