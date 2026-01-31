import { salvarFilme, removerFilme, getFavorites } from './storage.js';

const moviesList = document.querySelector("#movies-list");
const favoritesList = document.querySelector("#favorites-list");
const favoritesEmpty = document.getElementById("favorites-empty");

// Renderiza filmes na lista de resultados
export const renderMovieItem = (movie) => {
  const movieItem = document.createElement("li");
  movieItem.className = "bg-slate-800 p-3 rounded-lg flex flex-col gap-3 relative";

  const img = document.createElement("img");
  img.alt = movie.title;
  img.className = "w-full h-64 object-cover rounded bg-slate-700";
  // Fallback para imagem caso não exista poster
  img.src = movie.poster || "./assets/poster_path_null.gif";

  const title = document.createElement("h3");
  title.textContent = movie.title;
  title.className = "text-sm font-medium truncate";

  // Botão de favoritar
  const favButton = document.createElement("button");
  favButton.className = "absolute top-2 right-2 p-2 bg-red-600 rounded-full hover:bg-red-500 transition shadow-lg";
  favButton.title = "Adicionar aos favoritos";
  favButton.innerHTML = `<i class="bi bi-heart-fill text-white"></i>`;
  
  favButton.addEventListener("click", () => {
    salvarFilme(movie);
    renderFavorites(); // Atualiza a lista de favoritos abaixo
  });

  movieItem.append(img, title, favButton);
  moviesList.appendChild(movieItem);
};

// Renderiza favoritos
export const renderFavorites = (filters = {}) => {
  const { genre = "", order = "" } = filters;
  let favorites = getFavorites();

  // Aplicar filtros nos favoritos
  if (genre) {
    favorites = favorites.filter(fav => fav.genre_ids?.includes(parseInt(genre)));
  }

  if (order === "az") {
    favorites.sort((a, b) => a.title.localeCompare(b.title));
  } else if (order === "za") {
    favorites.sort((a, b) => b.title.localeCompare(a.title));
  }

  favoritesList.innerHTML = "";
  
  if (favorites.length === 0) {
    favoritesEmpty.classList.remove("hidden");
    return;
  } else {
    favoritesEmpty.classList.add("hidden");
  }

  favorites.forEach(movie => {
    const favItem = document.createElement("li");
    favItem.className = "bg-slate-800 p-3 rounded-lg flex flex-col gap-3 relative";

    const img = document.createElement("img");
    img.alt = movie.title;
    img.className = "w-full h-64 object-cover rounded bg-slate-700";
    img.src = movie.poster || "";

    const title = document.createElement("h3");
    title.textContent = movie.title;
    title.className = "text-sm font-medium truncate";

    // Botão de remover
    const removeButton = document.createElement("button");
    removeButton.className = "absolute top-2 right-2 p-2 bg-slate-700 rounded-full hover:bg-red-600 transition shadow-lg";
    removeButton.title = "Remover dos favoritos";
    removeButton.innerHTML = `<i class="bi bi-trash3-fill text-white"></i>`;
    
    removeButton.addEventListener("click", () => {
      removerFilme(movie.id);
      renderFavorites(filters); // Re-renderiza com os filtros atuais
    });

    favItem.append(img, title, removeButton);
    favoritesList.appendChild(favItem);
  });
};
