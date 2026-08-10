import { state } from "./state.js";
import { renderHeroes } from "./render.js";

// Devuelve solo los héroes que corresponden a la página actual
export function getHeroesForCurrentPage() {
  const startIndex = (state.currentPage - 1) * state.heroesPerPage;
  const endIndex = startIndex + state.heroesPerPage;

  // .slice() "recorta" el array sin modificar el original
  return state.filteredHeroes.slice(startIndex, endIndex);
}

// Calcula cuántas páginas hay en total según los héroes filtrados.
// Si no hay resultados, igual devolvemos 1 para no mostrar "Página 1 de 0"
export function getTotalPages() {
  return Math.max(
    1,
    Math.ceil(state.filteredHeroes.length / state.heroesPerPage)
  );
}

// Vuelve a dibujar la página actual de héroes y los controles de paginación juntos.
// La usan goToPage, applyFilters y el arranque de la app, para no repetir este mismo
// par de llamadas en cada lugar que cambia qué héroes hay que mostrar
export function refreshHeroList() {
  renderHeroes(getHeroesForCurrentPage());
  renderPaginationControls();
}

// Cambia de página: valida que el número esté entre 1 y el total de páginas,
// actualiza el estado y vuelve a dibujar tanto los héroes como los controles
export function goToPage(pageNumber) {
  const totalPages = getTotalPages();
  const validPage = Math.min(Math.max(pageNumber, 1), totalPages);

  state.currentPage = validPage;
  refreshHeroList();
}

// Atajos de navegación: van directo a la primera, anterior, siguiente o última página
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

// Clases de Tailwind que comparten los 4 botones de paginación: mismo lenguaje
// visual que cards/modal (borde negro grueso + sombra dura) y efecto de "empuje"
// al hacer click (el botón se desplaza y pierde la sombra, simulando que se hunde).
// Incluye también el estilo "apagado" cuando el botón está disabled
const BUTTON_CLASSES =
  "rounded-lg border-4 border-black bg-white px-3 py-1.5 text-sm font-bold uppercase comic-shadow transition hover:bg-comic-gold/10 hover:border-comic-gold active:translate-x-1 active:translate-y-1 active:shadow-none focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-black";

// Actualiza el texto "Showing X of Y results":
// X = héroes que se ven en la página actual, Y = total de resultados filtrados
function updateResultsSummary() {
  const resultsSummary = document.getElementById("results-summary");
  if (!resultsSummary) return;

  const shownCount = getHeroesForCurrentPage().length;
  resultsSummary.textContent = `Mostrando ${shownCount} de ${state.filteredHeroes.length} resultados`;
}

// Dibuja los botones First/Previous/Next/Last y el texto "Page X of Y" dentro de #pagination-controls.
// Cada botón se deshabilita solo cuando no corresponde usarlo (ej: Previous en la página 1)
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

  // Cada vez que se redibujan los controles, actualizamos también el resumen
  updateResultsSummary();
}

// Relaciona cada botón (por su data-action) con la función que tiene que ejecutar
const PAGE_ACTIONS = {
  first: goToFirstPage,
  previous: goToPreviousPage,
  next: goToNextPage,
  last: goToLastPage,
};

// Conecta un solo listener en el contenedor (delegación de eventos), porque los
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