// Chrome de UI para mobile (mostrar/ocultar el panel de filtros); no es lógica
// de filtrado, por eso vive aparte de filters.js
const toggleFiltersButton = document.getElementById("toggle-filters-button");
const filtersSidebar = document.getElementById("filters-sidebar");

// Conecta el botón "Filters" (solo visible en mobile) para mostrar/ocultar el sidebar
export function initSidebarToggle() {
  toggleFiltersButton.addEventListener("click", () => {
    const isNowHidden = filtersSidebar.classList.toggle("hidden");
    toggleFiltersButton.setAttribute("aria-expanded", String(!isNowHidden));
  });
}
