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

// Ordena una lista de valores alfabéticamente dejando "Unknown" siempre al final
function sortWithUnknownLast(values) {
  return values.sort((a, b) => {
    if (a === UNKNOWN_LABEL) return 1;
    if (b === UNKNOWN_LABEL) return -1;
    return a.localeCompare(b);
  });
}

// Recorre state.allHeroes UNA sola vez para juntar los valores crudos de gender
// y race, y arma las dos listas únicas (sin repetidos, "Unknown" agrupado y al final)
// que se usan para llenar los selects correspondientes
function buildGenderAndRaceOptionLists() {
  const genderValues = [];
  const raceValues = [];

  state.allHeroes.forEach((hero) => {
    genderValues.push(normalizeOrUnknown(hero.appearance.gender));
    raceValues.push(normalizeOrUnknown(hero.appearance.race));
  });

  return {
    genderOptions: sortWithUnknownLast([...new Set(genderValues)]),
    raceOptions: sortWithUnknownLast([...new Set(raceValues)]),
  };
}

// Agrega una opción <option> al select por cada valor de la lista
function appendOptionsToSelect(selectElement, values) {
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    selectElement.appendChild(option);
  });
}

// Llena los selects de género y raza con las opciones armadas a partir de los
// héroes ya cargados (se llama una sola vez, al iniciar la app)
export function populateGenderAndRaceFilterOptions() {
  const genderSelect = document.getElementById("filter-gender");
  const raceSelect = document.getElementById("filter-race");
  const { genderOptions, raceOptions } = buildGenderAndRaceOptionLists();

  appendOptionsToSelect(genderSelect, genderOptions);
  appendOptionsToSelect(raceSelect, raceOptions);
}

// Refleja visualmente si un filtro está "activo" (valor distinto de "all") con el
// color de acento comic-blue. Es solo estético: no cambia el estado ni el filtrado.
// border-black y bg-white se sacan mientras está activo: si convivieran con
// border-comic-blue/bg-comic-blue ambas clases tienen la misma especificidad, y al
// tener la misma especificidad gana la que Tailwind generó después en el CSS (bg-white
// le gana a bg-comic-blue), tapando el color de acento
function updateFilterActiveStyle(selectElement) {
  const isActive = selectElement.value !== "all";
  selectElement.classList.toggle("border-comic-blue", isActive);
  selectElement.classList.toggle("bg-comic-blue/10", isActive);
  selectElement.classList.toggle("border-black", !isActive);
  selectElement.classList.toggle("bg-white", !isActive);
}

// Conecta los selects de editorial y alineación: al cambiar, actualizan el estado
// y vuelven a aplicar todos los filtros juntos
export function initFilters() {
  const publisherSelect = document.getElementById("filter-publisher");
  const alignmentSelect = document.getElementById("filter-alignment");
  const genderSelect = document.getElementById("filter-gender");
  const raceSelect = document.getElementById("filter-race");

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

  genderSelect.addEventListener("change", (event) => {
    state.selectedGender = event.target.value;
    updateFilterActiveStyle(genderSelect);
    applyFilters();
  });

  raceSelect.addEventListener("change", (event) => {
    state.selectedRace = event.target.value;
    updateFilterActiveStyle(raceSelect);
    applyFilters();
  });
}

// Letras del alfabeto para armar la grilla de botones. No sale de los datos:
// lo que se genera dinámicamente son los 26 elementos <button>, no el alfabeto en sí
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// border-2 sin comic-shadow: con 26 botones juntos, un borde de 4px + sombra dura
// de 6px por celda se vería recargado. El gap del grid ya separa cada botón
const LETTER_BUTTON_CLASSES =
  "rounded border-2 border-black bg-white text-xs font-bold py-1 transition hover:bg-comic-gold/20 hover:border-comic-gold focus:outline-none focus:ring-2 focus:ring-blue-400";

// Crea los 26 botones A-Z dentro de la grilla. Se llama una sola vez al iniciar
// la app: si se llamara de nuevo duplicaría los botones
export function populateLetterFilterGrid() {
  const letterGrid = document.getElementById("letter-filter-grid");

  ALPHABET.forEach((letter) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = letter;
    button.dataset.letter = letter;
    button.setAttribute("aria-label", `Filter heroes starting with ${letter}`);
    button.className = LETTER_BUTTON_CLASSES;
    letterGrid.appendChild(button);
  });
}

// Resalta con el acento comic-blue el botón de la letra activa (o ninguno si
// selectedLetter es "all"), mismo criterio de swap de borde/fondo que updateFilterActiveStyle.
// bg-white se saca mientras está activo: si no, tapa a bg-comic-blue (misma especificidad,
// pero bg-white queda después en el CSS generado) y el texto blanco queda ilegible
function updateActiveLetterStyle() {
  const letterButtons = document.querySelectorAll("#letter-filter-grid button[data-letter]");

  letterButtons.forEach((button) => {
    const isActive = button.dataset.letter === state.selectedLetter;
    button.classList.toggle("bg-comic-blue", isActive);
    button.classList.toggle("text-white", isActive);
    button.classList.toggle("border-comic-blue", isActive);
    button.classList.toggle("border-black", !isActive);
    button.classList.toggle("bg-white", !isActive);
  });
}

// Conecta un solo listener delegado en la grilla (los 26 botones no se recrean
// nunca, pero se mantiene el mismo patrón de delegación que usa pagination.js)
export function initLetterFilter() {
  const letterGrid = document.getElementById("letter-filter-grid");

  letterGrid.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-letter]");
    if (!button) return;

    // Un segundo click sobre la misma letra la desactiva (vuelve a "all")
    const clickedLetter = button.dataset.letter;
    state.selectedLetter = state.selectedLetter === clickedLetter ? "all" : clickedLetter;

    updateActiveLetterStyle();
    applyFilters();
  });
}

// Resalta con el acento comic-blue el botón de sort activo (o ninguno si sortOrder es "none").
// bg-white se saca mientras está activo por el mismo motivo que en updateActiveLetterStyle
function updateSortButtonsActiveStyle() {
  const ascButton = document.getElementById("sort-asc-button");
  const descButton = document.getElementById("sort-desc-button");

  [ascButton, descButton].forEach((button) => {
    const buttonOrder = button === ascButton ? "asc" : "desc";
    const isActive = state.sortOrder === buttonOrder;
    button.classList.toggle("bg-comic-blue", isActive);
    button.classList.toggle("text-white", isActive);
    button.classList.toggle("border-comic-blue", isActive);
    button.classList.toggle("border-black", !isActive);
    button.classList.toggle("bg-white", !isActive);
  });
}

// Un segundo click sobre el mismo orden lo apaga (vuelve a "none")
function setSortOrder(newOrder) {
  state.sortOrder = state.sortOrder === newOrder ? "none" : newOrder;
  updateSortButtonsActiveStyle();
  applyFilters();
}

// Conecta los dos botones de orden alfabético
export function initSortButtons() {
  document.getElementById("sort-asc-button").addEventListener("click", () => setSortOrder("asc"));
  document.getElementById("sort-desc-button").addEventListener("click", () => setSortOrder("desc"));
}
