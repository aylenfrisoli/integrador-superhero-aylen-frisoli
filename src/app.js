// Importamos la función que trae los héroes desde la API
import { fetchHeroes } from "./js/api.js";

// Importamos el objeto de estado global
import { state } from "./js/state.js";

// Importamos las funciones de paginación: refrescar héroes + controles juntos,
// y activar los botones First/Previous/Next/Last
import { refreshHeroList, initPagination } from "./js/pagination.js";

// Importamos la función que activa la barra de búsqueda
import { initSearch } from "./js/search.js";

// Importamos las funciones de los filtros: activar los selects y armar las opciones de editorial
import { initFilters, populatePublisherFilterOptions } from "./js/filters.js";

// Importamos la función que activa el modal de detalle del héroe
import { initModal } from "./js/modal.js";

// Función principal que arranca la aplicación
async function init() {
  // Esperamos a que la API nos devuelva los héroes...
  state.allHeroes = await fetchHeroes();

  // ...y los guardamos también como "filtrados" (por ahora son los mismos)
  state.filteredHeroes = state.allHeroes;

  // Ahora que ya tenemos los héroes, armamos las opciones del filtro de editorial
  populatePublisherFilterOptions();

  // Mostramos en pantalla los héroes de la página actual junto con los controles
  // de paginación y el resumen de resultados por primera vez
  refreshHeroList();
}

// Llamamos a la función para que arranque apenas carga la página
init();

// Activamos la barra de búsqueda para que empiece a escuchar lo que se escribe
initSearch();

// Activamos los selects de filtros para que empiecen a escuchar los cambios
initFilters();

// Activamos los botones de paginación (First/Previous/Next/Last) para que respondan a los clicks
initPagination();

// Activamos el modal: escucha los clicks en las cards para abrirlo y en el botón para cerrarlo
initModal();