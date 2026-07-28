// Traemos el estado global y la función que aplica todos los filtros combinados
import { state } from "./state.js";
import { applyFilters } from "./filters.js";

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

// Se ejecuta cada vez que el usuario escribe: guarda el texto buscado y
// aplica todos los filtros juntos (búsqueda + editorial + alineación)
function handleSearchInput(event) {
  state.searchQuery = event.target.value;
  applyFilters();
}

// Versión "demorada" del manejador de búsqueda, para no filtrar en cada tecla
const debouncedSearchInput = debounce(handleSearchInput, DEBOUNCE_DELAY);

// Conecta el input de búsqueda del HTML con la lógica de filtrado
export function initSearch() {
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", debouncedSearchInput);
}
