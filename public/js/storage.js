const STORAGE_KEY = "flixmovies:favorites";

export const getFavorites = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const salvarFilme = (movie) => {
  const favorites = getFavorites();
  if (favorites.some(fav => fav.id === movie.id)) return;
  favorites.push(movie);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
};

export const removerFilme = (id) => {
  const favorites = getFavorites().filter(movie => movie.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
};
