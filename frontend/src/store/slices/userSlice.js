import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';

export const fetchFavorites = createAsyncThunk('user/fetchFavorites', async () => {
  const res = await api.getFavorites();
  return res.data.favorites;
});

export const addToFavorites = createAsyncThunk('user/addFavorite', async (item, { rejectWithValue }) => {
  try {
    const res = await api.addFavorite(item);
    return res.data.favorites;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add favorite');
  }
});

export const removeFromFavorites = createAsyncThunk('user/removeFavorite', async (movieId) => {
  const res = await api.removeFavorite(movieId);
  return res.data.favorites;
});

export const fetchHistory = createAsyncThunk('user/fetchHistory', async () => {
  const res = await api.getHistory();
  return res.data.history;
});

export const addToHistory = createAsyncThunk('user/addHistory', async (item) => {
  const res = await api.addHistory(item);
  return res.data.history;
});

export const removeFromHistory = createAsyncThunk('user/removeHistory', async (movieId) => {
  const res = await api.removeHistory(movieId);
  return res.data.history;
});

export const fetchWatchlist = createAsyncThunk('user/fetchWatchlist', async () => {
  const res = await api.getWatchlist();
  return res.data.watchlist;
});

export const addToWatchlist = createAsyncThunk('user/addWatchlist', async (item, { rejectWithValue }) => {
  try {
    const res = await api.addWatchlist(item);
    return res.data.watchlist;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add to watchlist');
  }
});

export const removeFromWatchlist = createAsyncThunk('user/removeWatchlist', async (movieId) => {
  const res = await api.removeWatchlist(movieId);
  return res.data.watchlist;
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    favorites: [],
    history: [],
    watchlist: [],
    loading: false,
    error: null
  },
  reducers: {
    clearUserData: (state) => {
      state.favorites = [];
      state.history = [];
      state.watchlist = [];
    }
  },
  extraReducers: (builder) => {
    const setList = (field) => (state, action) => { state[field] = action.payload; state.loading = false; };
    builder
      .addCase(fetchFavorites.fulfilled, setList('favorites'))
      .addCase(addToFavorites.fulfilled, setList('favorites'))
      .addCase(removeFromFavorites.fulfilled, setList('favorites'))
      .addCase(fetchHistory.fulfilled, setList('history'))
      .addCase(addToHistory.fulfilled, setList('history'))
      .addCase(removeFromHistory.fulfilled, setList('history'))
      .addCase(fetchWatchlist.fulfilled, setList('watchlist'))
      .addCase(addToWatchlist.fulfilled, setList('watchlist'))
      .addCase(removeFromWatchlist.fulfilled, setList('watchlist'));
  }
});

export const { clearUserData } = userSlice.actions;
export default userSlice.reducer;
