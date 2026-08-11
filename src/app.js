// importamos la funcion que muestra el estado inicial (sin busqueda todavia)
import { renderEmptyState } from "./js/render.js";

// importamos la funcion que activa el formulario de busqueda
import { initSearch } from "./js/search.js";

// importamos las funciones de los filtros: selects, grilla de letras y orden
import {
  initFilters,
  populateLetterFilterGrid,
  initLetterFilter,
  initSortButtons,
} from "./js/filters.js";

// importamos la funcion que activa los botones de paginacion
import { initPagination } from "./js/pagination.js";

// importamos la funcion que activa el modal de detalle del heroe
import { initModal } from "./js/modal.js";

// importamos la funcion que activa el boton para mostrar/ocultar el sidebar en mobile
import { initSidebarToggle } from "./js/sidebar.js";

// la API no tiene forma de traer "todos los heroes" de entrada (solo busqueda
// por nombre), asi que arrancamos mostrando el mensaje de bienvenida en vez
// de disparar un fetch automatico
renderEmptyState();

// activamos el formulario de busqueda
initSearch();

// activamos los selects de filtros
initFilters();

// la grilla de letras no depende de la API, se arma al cargar la pagina
populateLetterFilterGrid();
initLetterFilter();
initSortButtons();

// activamos los botones de paginacion
initPagination();

// activamos el modal para abrir y cerrar con click
initModal();

// activamos el boton que muestra/oculta el sidebar en mobile
initSidebarToggle();
