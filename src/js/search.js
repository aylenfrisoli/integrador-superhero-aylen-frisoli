// traemos el estado global y la funcion que aplica todos los filtros combinados
import { state } from "./state.js";
import { applyFilters } from "./filters.js";

// tiempo de espera (en ms) antes de ejecutar la busqueda luego de la ultima tecla
const DEBOUNCE_DELAY = 300;

// "debounce" espera a que el usuario deje de tipear antes de ejecutar la funcion.
// asi evitamos filtrar en cada tecla presionada.
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// se ejecuta cada vez que el usuario escribe: guarda el texto buscado y
// aplica todos los filtros juntos (busqueda + editorial + alineacion)
function handleSearchInput(event) {
  state.searchQuery = event.target.value;
  applyFilters();
}

// version "demorada" del manejador de busqueda, para no filtrar en cada tecla
const debouncedSearchInput = debounce(handleSearchInput, DEBOUNCE_DELAY);

// conecta el input de busqueda del HTML con la logica de filtrado
export function initSearch() {
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", debouncedSearchInput);
}
