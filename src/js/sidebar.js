// chrome de ui para mobile (mostrar/ocultar el panel de filtros); no es logica
// de filtrado, por eso vive aparte de filters.js
const toggleFiltersButton = document.getElementById("toggle-filters-button");
const filtersSidebar = document.getElementById("filters-sidebar");

// conecta el boton de filtros para mostrar/ocultar el sidebar
export function initSidebarToggle() {
  toggleFiltersButton.addEventListener("click", () => {
    const isNowHidden = filtersSidebar.classList.toggle("hidden");
    toggleFiltersButton.setAttribute("aria-expanded", String(!isNowHidden));
  });
}
