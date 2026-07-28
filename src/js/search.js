// Traemos el estado global, la función que dibuja las cards y la que recorta la página actual
import { state } from "./state.js";
import { renderHeroes } from "./render.js";
import { getHeroesForCurrentPage } from "./pagination.js";

// Tiempo de espera (en ms) antes de ejecutar la búsqueda luego de la última tecla
const DEBOUNCE_DELAY = 300;

// "debounce" espera a que el usuario deje de tipear antes de ejecutar la función.
// Así evitamos filtrar en cada tecla presionada.
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Filtra TODOS los héroes (state.allHeroes) por nombre, sin importar mayúsculas/minúsculas.
// Buscamos siempre sobre la lista completa para no perder resultados de búsquedas anteriores.
function filterHeroesByName(searchTerm) {
  const normalizedTerm = searchTerm.trim().toLowerCase();
  return state.allHeroes.filter((hero) =>
    hero.name.toLowerCase().includes(normalizedTerm)
  );
}

// Se ejecuta cada vez que el usuario escribe: filtra, vuelve a la página 1 y repinta las cards
function handleSearchInput(event) {
  const searchTerm = event.target.value;

  state.filteredHeroes = filterHeroesByName(searchTerm);
  state.currentPage = 1;

  renderHeroes(getHeroesForCurrentPage());
}

// Versión "demorada" del manejador de búsqueda, para no filtrar en cada tecla
const debouncedSearchInput = debounce(handleSearchInput, DEBOUNCE_DELAY);

// Conecta el input de búsqueda del HTML con la lógica de filtrado
export function initSearch() {
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", debouncedSearchInput);
}
