// Importamos la función que trae los héroes desde la API
import { fetchHeroes } from "./js/api.js";

// Importamos el objeto de estado global
import { state } from "./js/state.js";

// Importamos las funciones que muestran el estado de carga y de error de la API
import { renderLoadingState, renderErrorState } from "./js/render.js";

// Importamos las funciones de paginación: refrescar héroes + controles juntos,
// y activar los botones First/Previous/Next/Last
import { refreshHeroList, initPagination } from "./js/pagination.js";

// Importamos la función que activa la barra de búsqueda
import { initSearch } from "./js/search.js";

// Importamos las funciones de los filtros: activar los selects, armar las opciones
// de editorial/género/raza, y armar + activar la grilla de letras y los botones de orden
import {
  initFilters,
  populatePublisherFilterOptions,
  populateGenderAndRaceFilterOptions,
  populateLetterFilterGrid,
  initLetterFilter,
  initSortButtons,
} from "./js/filters.js";

// Importamos la función que activa el modal de detalle del héroe
import { initModal } from "./js/modal.js";

// Importamos la función que activa el botón "Filters" para mostrar/ocultar el sidebar en mobile
import { initSidebarToggle } from "./js/sidebar.js";

// Función principal que arranca la aplicación
async function init() {
  // Mostramos un aviso de carga mientras esperamos la respuesta de la API
  renderLoadingState();

  // Esperamos a que la API nos devuelva los héroes...
  const heroes = await fetchHeroes();

  // Si la API falló (fetchHeroes devuelve null), avisamos y cortamos acá:
  // no tiene sentido seguir armando filtros/paginación sin datos
  if (heroes === null) {
    renderErrorState();
    return;
  }

  state.allHeroes = heroes;

  // ...y los guardamos también como "filtrados" (por ahora son los mismos)
  state.filteredHeroes = state.allHeroes;

  // Actualizamos el badge del hero con la cantidad real de héroes que trajo la API
  document.getElementById("hero-count-badge").textContent =
    `${state.allHeroes.length} heroes and counting`;

  // Ahora que ya tenemos los héroes, armamos las opciones de los filtros que
  // dependen de los datos reales: editorial, género y raza
  populatePublisherFilterOptions();
  populateGenderAndRaceFilterOptions();

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

// La grilla de letras A-Z no depende de los héroes de la API (el alfabeto es fijo),
// así que se arma y se activa de una vez, sin esperar a init()
populateLetterFilterGrid();
initLetterFilter();
initSortButtons();

// Activamos los botones de paginación (First/Previous/Next/Last) para que respondan a los clicks
initPagination();

// Activamos el modal: escucha los clicks en las cards para abrirlo y en el botón para cerrarlo
initModal();

// Activamos el botón "Filters" que muestra/oculta el sidebar en mobile
initSidebarToggle();