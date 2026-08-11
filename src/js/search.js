// traemos el estado global, la funcion que aplica todos los filtros
// combinados, y las que arman las opciones de los selects segun los
// resultados de la busqueda actual
import { state } from "./state.js";
import {
  applyFilters,
  populatePublisherFilterOptions,
  populateGenderAndRaceFilterOptions,
} from "./filters.js";
import { searchHeroes } from "./api.js";
import { renderLoadingState, renderErrorState, renderEmptyState } from "./render.js";

// los selects de editorial/genero/raza se llenan de nuevo en cada busqueda
// (mas abajo), asi que hay que sacar las opciones de la busqueda anterior
// antes de repoblar, o si no se van duplicando. dejamos solo la primera
// opcion ("Todas las...", ya fija en el HTML)
function resetDynamicFilterOptions() {
  ["filter-publisher", "filter-gender", "filter-race"].forEach((id) => {
    document.getElementById(id).length = 1;
  });
}

// pide a la API los heroes que coinciden con el nombre buscado y actualiza
// toda la pantalla en base al resultado
async function performSearch(rawQuery) {
  const query = rawQuery.trim();

  // sin texto no hay nada que buscar (la API tampoco tiene un endpoint para
  // "traer todos los heroes"), volvemos al estado inicial
  if (!query) {
    renderEmptyState();
    return;
  }

  renderLoadingState();
  const results = await searchHeroes(query);

  // si la API fallo de verdad (token invalido, sin internet, etc.)
  if (results === null) {
    renderErrorState();
    return;
  }

  state.searchQuery = query;
  state.allHeroes = results;

  // las opciones de los filtros dependen de que heroes hay cargados, asi
  // que se recalculan con cada busqueda nueva
  resetDynamicFilterOptions();
  populatePublisherFilterOptions();
  populateGenderAndRaceFilterOptions();

  // aplica ordenamiento/filtros ya activos sobre los nuevos resultados y
  // redibuja heroes + paginacion
  applyFilters();
}

// conecta el formulario de busqueda: se dispara al enviar (enter o click en
// el boton), no en cada tecla, para no gastar de mas la cuota diaria de la API
export function initSearch() {
  const searchForm = document.getElementById("search-form");

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const searchInput = document.getElementById("search-input");
    performSearch(searchInput.value);
  });
}
