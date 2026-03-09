import axios from 'axios';

const BACKEND = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const IMAGE_SERVER = process.env.REACT_APP_IMAGE_URL || 'http://localhost:5000';

const tmdb = axios.create({ baseURL: `${BACKEND}/tmdb` });

// Images — served via our own backend image proxy
export const getPoster   = (path, size = 'w500')  => path ? `${IMAGE_SERVER}/image/${size}${path}` : `https://placehold.co/300x450/1a2235/e63946?text=No+Poster`;
export const getBackdrop = (path, size = 'w1280') => path ? `${IMAGE_SERVER}/image/${size}${path}` : `https://placehold.co/1280x720/1a2235/e63946?text=No+Backdrop`;
export const getProfile  = (path, size = 'w185')  => path ? `${IMAGE_SERVER}/image/${size}${path}` : `https://placehold.co/185x278/1a2235/e63946?text=No+Photo`;

// Trending
export const getTrending = (mediaType = 'all', timeWindow = 'week') =>
  tmdb.get(`/trending/${mediaType}/${timeWindow}`);

// Movies
export const getPopularMovies    = (page = 1) => tmdb.get('/movie/popular',     { params: { page } });
export const getTopRatedMovies   = (page = 1) => tmdb.get('/movie/top_rated',   { params: { page } });
export const getNowPlayingMovies = (page = 1) => tmdb.get('/movie/now_playing', { params: { page } });
export const getUpcomingMovies   = (page = 1) => tmdb.get('/movie/upcoming',    { params: { page } });
export const getMovieDetails     = (id)       => tmdb.get(`/movie/${id}`,       { params: { append_to_response: 'credits,videos,similar' } });
export const getMovieVideos      = (id)       => tmdb.get(`/movie/${id}/videos`);

// TV Shows
export const getPopularTV     = (page = 1) => tmdb.get('/tv/popular',      { params: { page } });
export const getTopRatedTV    = (page = 1) => tmdb.get('/tv/top_rated',    { params: { page } });
export const getAiringTodayTV = (page = 1) => tmdb.get('/tv/airing_today', { params: { page } });
export const getTVDetails     = (id)       => tmdb.get(`/tv/${id}`,        { params: { append_to_response: 'credits,videos,similar' } });

// People
export const getPopularPeople = (page = 1) => tmdb.get('/person/popular', { params: { page } });
export const getPersonDetails = (id)       => tmdb.get(`/person/${id}`,   { params: { append_to_response: 'movie_credits,tv_credits,images' } });

// Search
export const searchMulti  = (query, page = 1) => tmdb.get('/search/multi',  { params: { query, page, include_adult: false } });
export const searchMovies = (query, page = 1) => tmdb.get('/search/movie',  { params: { query, page } });
export const searchTV     = (query, page = 1) => tmdb.get('/search/tv',     { params: { query, page } });
export const searchPeople = (query, page = 1) => tmdb.get('/search/person', { params: { query, page } });

// Genres
export const getMovieGenres = () => tmdb.get('/genre/movie/list');
export const getTVGenres    = () => tmdb.get('/genre/tv/list');

// Discover
export const discoverMovies = (params = {}) => tmdb.get('/discover/movie', { params });
export const discoverTV     = (params = {}) => tmdb.get('/discover/tv',    { params });

export default tmdb;
