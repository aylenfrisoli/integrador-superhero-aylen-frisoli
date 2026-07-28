// Traemos el estado global, la función que dibuja las cards y la que recorta la página actual
import { state } from "./state.js";
import { renderHeroes } from "./render.js";
import {
  getHeroesForCurrentPage,
  renderPaginationControls,
} from "./pagination.js";

// Compara el nombre del héroe con el texto buscado, sin importar mayúsculas/minúsculas
function matchesSearchQuery(hero) {
  const normalizedQuery = state.searchQuery.trim().toLowerCase();
  return hero.name.toLowerCase().includes(normalizedQuery);
}

// Compara la editorial del héroe con la elegida en el filtro ("all" = no filtrar)
function matchesSelectedPublisher(hero) {
  return (
    state.selectedPublisher === "all" ||
    hero.biography.publisher === state.selectedPublisher
  );
}

// Compara la alineación del héroe con la elegida en el filtro ("all" = no filtrar)
function matchesSelectedAlignment(hero) {
  return (
    state.selectedAlignment === "all" ||
    hero.biography.alignment === state.selectedAlignment
  );
}

// Función central: combina búsqueda + editorial + alineación en un solo filtrado.
// Siempre parte de state.allHeroes para que ningún filtro borre a los demás.
export function applyFilters() {
  state.filteredHeroes = state.allHeroes.filter(
    (hero) =>
      matchesSearchQuery(hero) &&
      matchesSelectedPublisher(hero) &&
      matchesSelectedAlignment(hero)
  );

  state.currentPage = 1;
  renderHeroes(getHeroesForCurrentPage());

  // Actualiza los botones de paginación y el resumen de resultados según el nuevo filtro
  renderPaginationControls();
}

// Genera las opciones del select de editoriales a partir de los héroes ya cargados,
// para no tener que escribirlas a mano (se ordenan alfabéticamente, sin repetidos)
export function populatePublisherFilterOptions() {
  const publisherSelect = document.getElementById("filter-publisher");

  const uniquePublishers = [
    ...new Set(
      state.allHeroes
        .map((hero) => hero.biography.publisher)
        .filter(Boolean)
    ),
  ].sort();

  uniquePublishers.forEach((publisher) => {
    const option = document.createElement("option");
    option.value = publisher;
    option.textContent = publisher;
    publisherSelect.appendChild(option);
  });
}

// Conecta los selects de editorial y alineación: al cambiar, actualizan el estado
// y vuelven a aplicar todos los filtros juntos
export function initFilters() {
  const publisherSelect = document.getElementById("filter-publisher");
  const alignmentSelect = document.getElementById("filter-alignment");

  publisherSelect.addEventListener("change", (event) => {
    state.selectedPublisher = event.target.value;
    applyFilters();
  });

  alignmentSelect.addEventListener("change", (event) => {
    state.selectedAlignment = event.target.value;
    applyFilters();
  });
}
