const API_BASE = '/api';

// helper for auth header
const authHeader = (token: string) => ({ 'Authorization': `Bearer ${token}` });

// response types
export interface HomeResponse {
  message: string;
  version: string;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_url: string | null;
  backdrop_url: string | null;
  release_date: string;
  rating: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
}

export interface SearchResponse {
  query: string;
  results: Movie[];
}

export interface AuthResponse {
  access_token: string;
  message?: string;
  user?: {
    id: number;
    nickname: string;
  };
}

export interface User {
  id: number;
  nickname: string;
}

export interface List {
  id: number;
  name: string;
  user_id: number;
}

export interface Club {
  id: number;
  name: string;
  description: string;
  creator_id: number;
}

// home
export const getHome = (): Promise<HomeResponse> =>
  fetch(`${API_BASE}/`).then(r => r.json());

// search
export const searchMovies = (search: string): Promise<SearchResponse> =>
  fetch(`${API_BASE}/search?query=${encodeURIComponent(search)}`).then(r => r.json());

// auth
// Note: Backend uses 'nickname' as the username field for both login and signup
export const login = (nickname: string): Promise<AuthResponse> =>
  fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nickname }),
  }).then(r => r.json());

export const signup = (nickname: string): Promise<AuthResponse> =>
  fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nickname }),
  }).then(r => r.json());

export const logout = (token: string): Promise<{ message: string }> =>
  fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers: authHeader(token)
  }).then(r => r.json());

export const getMe = (token: string): Promise<User> =>
  fetch(`${API_BASE}/auth/me`, {
    headers: authHeader(token)
  }).then(r => r.json());

// movies
export const addMovie = (
  title: string, 
  tmdbId: number, 
  poster: string | null, 
  listIds: number[], 
  token: string
): Promise<{ message: string }> =>
  fetch(`${API_BASE}/movies/add`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...authHeader(token)
    },
    body: JSON.stringify({ title, tmdb_id: tmdbId, poster, list_ids: listIds }),
  }).then(r => r.json());

export const removeMovie = (movieId: number, listId: number, token: string): Promise<{ message: string }> =>
  fetch(`${API_BASE}/movies/remove/${movieId}`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...authHeader(token)
    },
    body: JSON.stringify({ list_id: listId }),
  }).then(r => r.json());

export const getMyMovies = (token: string): Promise<Movie[]> =>
  fetch(`${API_BASE}/movies/my-movies`, {
    headers: authHeader(token)
  }).then(r => r.json());

// lists
export const getLists = (token: string): Promise<List[]> =>
  fetch(`${API_BASE}/lists`, {
    headers: authHeader(token)
  }).then(r => r.json());

export const createList = (name: string, token: string): Promise<{ message: string; list_id: number }> =>
  fetch(`${API_BASE}/lists`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...authHeader(token)
    },
    body: JSON.stringify({ name }),
  }).then(r => r.json());

export const deleteList = (listId: number, token: string): Promise<{ message: string }> =>
  fetch(`${API_BASE}/lists/${listId}`, {
    method: 'DELETE',
    headers: authHeader(token)
  }).then(r => r.json());

export const getList = (listId: number, token: string): Promise<List & { movies: Movie[] }> =>
  fetch(`${API_BASE}/lists/${listId}`, {
    headers: authHeader(token)
  }).then(r => r.json());

// clubs
export const getClubs = (token: string): Promise<Club[]> =>
  fetch(`${API_BASE}/clubs`, {
    headers: authHeader(token)
  }).then(r => r.json());

export const getClub = (clubId: number, token: string): Promise<Club & { members: User[]; lists: List[] }> =>
  fetch(`${API_BASE}/clubs/${clubId}`, {
    headers: authHeader(token)
  }).then(r => r.json());

export const createClub = (name: string, description: string, token: string): Promise<{ message: string; club_id: number }> =>
  fetch(`${API_BASE}/clubs`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...authHeader(token)
    },
    body: JSON.stringify({ name, description }),
  }).then(r => r.json());

export const deleteClub = (clubId: number, token: string): Promise<{ message: string }> =>
  fetch(`${API_BASE}/clubs/${clubId}`, {
    method: 'DELETE',
    headers: authHeader(token)
  }).then(r => r.json());

export const joinClub = (clubId: number, token: string): Promise<{ message: string }> =>
  fetch(`${API_BASE}/clubs/${clubId}/join`, {
    method: 'POST',
    headers: authHeader(token)
  }).then(r => r.json());

export const leaveClub = (clubId: number, token: string): Promise<{ message: string }> =>
  fetch(`${API_BASE}/clubs/${clubId}/leave`, {
    method: 'POST',
    headers: authHeader(token)
  }).then(r => r.json());

export const createClubList = (clubId: number, name: string, token: string): Promise<{ message: string; list_id: number }> =>
  fetch(`${API_BASE}/clubs/${clubId}/lists`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...authHeader(token)
    },
    body: JSON.stringify({ name }),
  }).then(r => r.json());

export const deleteClubList = (clubId: number, listId: number, token: string): Promise<{ message: string }> =>
  fetch(`${API_BASE}/clubs/${clubId}/lists/${listId}`, {
    method: 'DELETE',
    headers: authHeader(token)
  }).then(r => r.json());