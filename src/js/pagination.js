import { state } from "./state.js";
import { renderHeroes } from "./render.js";

// devuelve solo los heroes que corresponden a la pagina actual
export function getHeroesForCurrentPage() {
  const startIndex = (state.currentPage - 1) * state.heroesPerPage;
  const endIndex = startIndex + state.heroesPerPage;

  // .slice() "recorta" el array sin modificar el original
  return state.filteredHeroes.slice(startIndex, endIndex);
}

// calcula cuantas paginas hay en total segun los heroes filtrados.
// si no hay resultados, igual devolvemos 1 para no mostrar "pagina 1 de 0"
export function getTotalPages() {
  return Math.max(
    1,
    Math.ceil(state.filteredHeroes.length / state.heroesPerPage)
  );
}

// vuelve a dibujar la pagina actual de heroes y los controles de paginacion juntos.
// la usan goToPage, applyFilters y el arranque de la app para no repetir este llamado
export function refreshHeroList() {
  renderHeroes(getHeroesForCurrentPage());
  renderPaginationControls();
}

// cambia de pagina: valida que el numero este entre 1 y el total de paginas,
// actualiza el estado y vuelve a dibujar tanto los heroes como los controles
export function goToPage(pageNumber) {
  const totalPages = getTotalPages();
  const validPage = Math.min(Math.max(pageNumber, 1), totalPages);

  state.currentPage = validPage;
  refreshHeroList();
}

// atajos de navegacion: van directo a la primera, anterior, siguiente o ultima pagina
export function goToFirstPage() {
  goToPage(1);
}

export function goToPreviousPage() {
  goToPage(state.currentPage - 1);
}

export function goToNextPage() {
  goToPage(state.currentPage + 1);
}

export function goToLastPage() {
  goToPage(getTotalPages());
}

const BUTTON_CLASSES =
  "rounded-lg border-4 border-black bg-white px-3 py-1.5 text-sm font-bold uppercase comic-shadow transition hover:bg-comic-gold/10 hover:border-comic-gold active:translate-x-1 active:translate-y-1 active:shadow-none focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-black";

// actualiza el texto "mostrando x de y resultados":
// x = heroes que se ven en la pagina actual, y = total de resultados filtrados
function updateResultsSummary() {
  const resultsSummary = document.getElementById("results-summary");
  if (!resultsSummary) return;

  const shownCount = getHeroesForCurrentPage().length;
  resultsSummary.textContent = `Mostrando ${shownCount} de ${state.filteredHeroes.length} resultados`;
}

// dibuja los botones first/previous/next/last y el texto "pagina X de Y" dentro de #pagination-controls.
// cada boton se deshabilita solo cuando no corresponde usarlo (ej: previous en la pagina 1)
export function renderPaginationControls() {
  const paginationControls = document.getElementById("pagination-controls");
  const totalPages = getTotalPages();
  const isFirstPage = state.currentPage === 1;
  const isLastPage = state.currentPage === totalPages;

  paginationControls.innerHTML = `
    <button type="button" data-action="first" class="${BUTTON_CLASSES}" ${isFirstPage ? "disabled" : ""}>Primera</button>
    <button type="button" data-action="previous" class="${BUTTON_CLASSES}" ${isFirstPage ? "disabled" : ""}>Anterior</button>
    <span id="page-indicator" class="px-2 py-1.5 text-sm text-gray-600">Página ${state.currentPage} de ${totalPages}</span>
    <button type="button" data-action="next" class="${BUTTON_CLASSES}" ${isLastPage ? "disabled" : ""}>Siguiente</button>
    <button type="button" data-action="last" class="${BUTTON_CLASSES}" ${isLastPage ? "disabled" : ""}>Última</button>
  `;

  // cada vez que se redibujan los controles, actualizamos tambien el resumen
  updateResultsSummary();
}

// relaciona cada boton (por su data-action) con la funcion que tiene que ejecutar
const PAGE_ACTIONS = {
  first: goToFirstPage,
  previous: goToPreviousPage,
  next: goToNextPage,
  last: goToLastPage,
};

// conecta un solo listener en el contenedor (delegacion de eventos), porque los
// botones se recrean cada vez que renderPaginationControls redibuja el HTML
export function initPagination() {
  const paginationControls = document.getElementById("pagination-controls");

  paginationControls.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const action = PAGE_ACTIONS[button.dataset.action];
    if (action) action();
  });
}