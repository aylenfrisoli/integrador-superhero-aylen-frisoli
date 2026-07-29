// Traemos el estado global y la función que vuelve a dibujar héroes + paginación juntos
import { state } from "./state.js";
import { refreshHeroList } from "./pagination.js";

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

// Compara la letra inicial del nombre del héroe con la elegida en el filtro
function matchesSelectedLetter(hero) {
  return (
    state.selectedLetter === "all" ||
    hero.name.charAt(0).toUpperCase() === state.selectedLetter
  );
}

// Etiqueta común para agrupar valores faltantes de gender/race, compartida entre
// el filtrado (acá abajo) y la generación de opciones de los selects
const UNKNOWN_LABEL = "Unknown";

// Algunos héroes tienen gender/race vacío, "-" o null (race puede venir como null
// directo, no solo como "-"). Agrupamos todos esos casos bajo "Unknown" para que
// tanto el filtro como el select los traten como un solo valor
function normalizeOrUnknown(rawValue) {
  return !rawValue || rawValue === "-" ? UNKNOWN_LABEL : rawValue;
}

// Compara el género del héroe con el elegido en el filtro ("all" = no filtrar)
function matchesSelectedGender(hero) {
  return (
    state.selectedGender === "all" ||
    normalizeOrUnknown(hero.appearance.gender) === state.selectedGender
  );
}

// Compara la raza del héroe con la elegida en el filtro ("all" = no filtrar)
function matchesSelectedRace(hero) {
  return (
    state.selectedRace === "all" ||
    normalizeOrUnknown(hero.appearance.race) === state.selectedRace
  );
}

// Ordena una lista de héroes por nombre sin modificar el array original
function sortHeroesByName(heroes, direction) {
  const sortedHeroes = [...heroes].sort((a, b) => a.name.localeCompare(b.name));
  return direction === "desc" ? sortedHeroes.reverse() : sortedHeroes;
}

// Función central: combina búsqueda + editorial + alineación + letra + género + raza
// en un solo filtrado, y ordena alfabéticamente si corresponde.
// Siempre parte de state.allHeroes para que ningún filtro borre a los demás.
export function applyFilters() {
  let result = state.allHeroes.filter(
    (hero) =>
      matchesSearchQuery(hero) &&
      matchesSelectedPublisher(hero) &&
      matchesSelectedAlignment(hero) &&
      matchesSelectedLetter(hero) &&
      matchesSelectedGender(hero) &&
      matchesSelectedRace(hero)
  );

  // El orden se aplica después de filtrar y antes de paginar; "none" deja
  // el resultado tal cual viene de la API
  if (state.sortOrder !== "none") {
    result = sortHeroesByName(result, state.sortOrder);
  }

  state.filteredHeroes = result;
  state.currentPage = 1;

  // Vuelve a dibujar los héroes de la nueva página 1 junto con los botones
  // de paginación y el resumen de resultados según el nuevo filtro
  refreshHeroList();
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

// Refleja visualmente si un filtro está "activo" (valor distinto de "all") con el
// color de acento comic-blue. Es solo estético: no cambia el estado ni el filtrado.
// border-black se saca mientras está activo: si conviviera con border-comic-blue
// ambas clases tienen la misma especificidad y el borde negro ganaría el empate
function updateFilterActiveStyle(selectElement) {
  const isActive = selectElement.value !== "all";
  selectElement.classList.toggle("border-comic-blue", isActive);
  selectElement.classList.toggle("bg-comic-blue/10", isActive);
  selectElement.classList.toggle("border-black", !isActive);
}

// Conecta los selects de editorial y alineación: al cambiar, actualizan el estado
// y vuelven a aplicar todos los filtros juntos
export function initFilters() {
  const publisherSelect = document.getElementById("filter-publisher");
  const alignmentSelect = document.getElementById("filter-alignment");

  publisherSelect.addEventListener("change", (event) => {
    state.selectedPublisher = event.target.value;
    updateFilterActiveStyle(publisherSelect);
    applyFilters();
  });

  alignmentSelect.addEventListener("change", (event) => {
    state.selectedAlignment = event.target.value;
    updateFilterActiveStyle(alignmentSelect);
    applyFilters();
  });
}
