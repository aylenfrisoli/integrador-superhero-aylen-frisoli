// importamos la funcion que trae los heroes desde la API
import { fetchHeroes } from "./js/api.js";

// importamos el objeto de estado global
import { state } from "./js/state.js";

// importamos las funciones que muestran el estado de carga y de error de la API
import { renderLoadingState, renderErrorState } from "./js/render.js";

// importamos las funciones de paginacion: refrescar heroes y activar los botones
import { refreshHeroList, initPagination } from "./js/pagination.js";

// importamos la funcion que activa la barra de busqueda
import { initSearch } from "./js/search.js";

// importamos las funciones de los filtros: selects, opciones y grilla de letras
import {
  initFilters,
  populatePublisherFilterOptions,
  populateGenderAndRaceFilterOptions,
  populateLetterFilterGrid,
  initLetterFilter,
  initSortButtons,
} from "./js/filters.js";

// importamos la funcion que activa el modal de detalle del heroe
import { initModal } from "./js/modal.js";

// importamos la funcion que activa el boton para mostrar/ocultar el sidebar en mobile
import { initSidebarToggle } from "./js/sidebar.js";

// funcion principal que arranca la aplicacion
async function init() {
  // mostramos un aviso de carga mientras esperamos la respuesta de la API
  renderLoadingState();

  // esperamos a que la API devuelva los heroes
  const heroes = await fetchHeroes();

  // si la API fallo, mostramos error y cortamos aca
  if (heroes === null) {
    renderErrorState();
    return;
  }

  state.allHeroes = heroes;

  // tambien los guardamos como filtrados, por ahora son los mismos
  state.filteredHeroes = state.allHeroes;

  // actualizamos el badge con la cantidad de heroes que trajo la API
  document.getElementById("hero-count-badge").textContent =
    `${state.allHeroes.length} héroes y sumando`;

  // armamos las opciones de los filtros que dependen de los datos: editorial, genero y raza
  populatePublisherFilterOptions();
  populateGenderAndRaceFilterOptions();

  // mostramos los heroes de la pagina actual con la paginacion y el resumen
  refreshHeroList();
}

// llamamos a la funcion para que arranque apenas carga la pagina
init();

// activamos la barra de busqueda
initSearch();

// activamos los selects de filtros
initFilters();

// la grilla de letras no depende de la API, se arma antes de init()
populateLetterFilterGrid();
initLetterFilter();
initSortButtons();

// activamos los botones de paginacion
initPagination();

// activamos el modal para abrir y cerrar con click
initModal();

// activamos el boton que muestra/oculta el sidebar en mobile
initSidebarToggle();
