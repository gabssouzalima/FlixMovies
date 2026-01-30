import { buscarFilme } from './api.js';
import { renderMovieItem, renderFavorites } from './ui.js';

const searchInput = document.querySelector("#search-input");
const searchForm = document.querySelector("#search-form");
const feedbackMessage = document.getElementById("feedback-message");
const buttonPesquisar = document.getElementById("button-search");
const filterGenre = document.getElementById("filter-genre");
const filterOrder = document.getElementById("filter-order");
const filterFavs = document.getElementById("filter-favorites");

const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w300";

let currentMovies = [];

// Busca filmes
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const query = searchInput.value.trim();
  if (!query) return;

  document.querySelector("#movies-list").innerHTML = "";
  feedbackMessage.textContent = "Carregando...";
  buttonPesquisar.disabled = true;

  try {
    const filmes = await buscarFilme(query);
    
    if (!filmes || filmes.length === 0) {
      feedbackMessage.textContent = "Nenhum filme encontrado.";
      currentMovies = [];
    } else {
      feedbackMessage.textContent = "";
      currentMovies = filmes.map(f => ({
        id: f.id,
        title: f.title || f.original_title,
        poster: f.poster_path ? `${BASE_IMAGE_URL}${f.poster_path}` : null,
        genre_ids: f.genre_ids || []
      }));
    }

    renderFilteredMovies();

  } catch (err) {
    feedbackMessage.textContent = `Erro: ${err.message}`;
    console.error(err);
  } finally {
    buttonPesquisar.disabled = false;
  }
});

// Filtrar resultados ao mudar filtros
[filterGenre, filterOrder, filterFavs].forEach(el => {
  el.addEventListener("change", () => {
    renderFilteredMovies();
    // Atualiza a seção de favoritos também com os filtros globais
    renderFavorites({
      genre: filterGenre.value,
      order: filterOrder.value
    });
  });
});

// Aplica filtros na lista de busca
function renderFilteredMovies() {
  const genre = filterGenre.value;
  const order = filterOrder.value;
  const onlyFavs = filterFavs.checked;
  
  let movies = [...currentMovies];

  // Filtro de "Só favoritos" na lista de busca
  if (onlyFavs) {
    const favorites = JSON.parse(localStorage.getItem("flixmovies:favorites") || "[]");
    movies = movies.filter(m => favorites.some(f => f.id === m.id));
  }

  // Filtro de Gênero
  if (genre) {
    movies = movies.filter(m => m.genre_ids.includes(parseInt(genre)));
  }

  // Ordenação
  if (order === "az") {
    movies.sort((a, b) => a.title.localeCompare(b.title));
  } else if (order === "za") {
    movies.sort((a, b) => b.title.localeCompare(a.title));
  }

  const moviesList = document.querySelector("#movies-list");
  moviesList.innerHTML = "";
  
  if (movies.length === 0 && currentMovies.length > 0) {
    feedbackMessage.textContent = "Nenhum resultado para os filtros aplicados.";
  } else if (currentMovies.length > 0) {
    feedbackMessage.textContent = "";
  }

  movies.forEach(renderMovieItem);
}

// Inicializa favoritos ao carregar a página
renderFavorites();
