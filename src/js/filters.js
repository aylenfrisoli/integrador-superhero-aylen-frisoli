// traemos el estado global y la funcion para redibujar heroes y paginacion
import { state } from "./state.js";
import { refreshHeroList } from "./pagination.js";

// compara el nombre del heroe con el texto buscado, sin importar mayusculas o minusculas
function matchesSearchQuery(hero) {
  const normalizedQuery = state.searchQuery.trim().toLowerCase();
  return hero.name.toLowerCase().includes(normalizedQuery);
}

// compara la editorial del heroe con la elegida en el filtro ("all" = no filtrar)
function matchesSelectedPublisher(hero) {
  return (
    state.selectedPublisher === "all" ||
    hero.biography.publisher === state.selectedPublisher
  );
}

// compara la alineacion del heroe con la elegida en el filtro ("all" = no filtrar)
function matchesSelectedAlignment(hero) {
  return (
    state.selectedAlignment === "all" ||
    hero.biography.alignment === state.selectedAlignment
  );
}

// compara la letra inicial del nombre del heroe con la elegida en el filtro
function matchesSelectedLetter(hero) {
  return (
    state.selectedLetter === "all" ||
    hero.name.charAt(0).toUpperCase() === state.selectedLetter
  );
}

// etiqueta comun para agrupar valores faltantes de gender/race, se usa en el
// filtrado y en la generacion de opciones de los selects
const UNKNOWN_LABEL = "Desconocido";

// algunos heroes tienen gender/race vacio, "-" o null; agrupamos todos esos
// casos bajo "Desconocido" para que el filtro y el select los traten igual
function normalizeOrUnknown(rawValue) {
  return !rawValue || rawValue === "-" ? UNKNOWN_LABEL : rawValue;
}

// compara el genero del heroe con el elegido en el filtro ("all" = no filtrar)
function matchesSelectedGender(hero) {
  return (
    state.selectedGender === "all" ||
    normalizeOrUnknown(hero.appearance.gender) === state.selectedGender
  );
}

// compara la raza del heroe con la elegida en el filtro ("all" = no filtrar)
function matchesSelectedRace(hero) {
  return (
    state.selectedRace === "all" ||
    normalizeOrUnknown(hero.appearance.race) === state.selectedRace
  );
}

// ordena una lista de heroes por nombre sin modificar el array original
function sortHeroesByName(heroes, direction) {
  const sortedHeroes = [...heroes].sort((a, b) => a.name.localeCompare(b.name));
  return direction === "desc" ? sortedHeroes.reverse() : sortedHeroes;
}

// funcion central: combina busqueda + editorial + alineacion + letra + genero + raza
// en un solo filtrado, y ordena alfabeticamente si corresponde.
// siempre parte de state.allHeroes para no perder los demas filtros ya aplicados
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

  // el orden se aplica despues de filtrar y antes de paginar; "none" deja
  // el resultado tal cual viene de la API
  if (state.sortOrder !== "none") {
    result = sortHeroesByName(result, state.sortOrder);
  }

  state.filteredHeroes = result;
  state.currentPage = 1;

  // redibuja los heroes de la nueva pagina 1 junto con los botones
  // de paginacion y el resumen de resultados
  refreshHeroList();
}

// genera las opciones del select de editoriales a partir de los heroes ya
// cargados, para no tener que escribirlas a mano (ordenadas, sin repetidos)
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

// ordena una lista de valores alfabeticamente dejando "Desconocido" al final
function sortWithUnknownLast(values) {
  return values.sort((a, b) => {
    if (a === UNKNOWN_LABEL) return 1;
    if (b === UNKNOWN_LABEL) return -1;
    return a.localeCompare(b);
  });
}

// recorre state.allHeroes una sola vez para juntar los valores de gender y
// race, y arma las dos listas unicas que se usan para llenar los selects
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

// agrega una opcion <option> al select por cada valor de la lista
function appendOptionsToSelect(selectElement, values) {
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    selectElement.appendChild(option);
  });
}

// llena los selects de genero y raza con las opciones armadas a partir de
// los heroes ya cargados (se llama una sola vez, al iniciar la app)
export function populateGenderAndRaceFilterOptions() {
  const genderSelect = document.getElementById("filter-gender");
  const raceSelect = document.getElementById("filter-race");
  const { genderOptions, raceOptions } = buildGenderAndRaceOptionLists();

  appendOptionsToSelect(genderSelect, genderOptions);
  appendOptionsToSelect(raceSelect, raceOptions);
}

// cambia las clases del select para marcar visualmente que el filtro esta
// activo (valor distinto de "all"). es solo estetico, no cambia el filtrado
function updateFilterActiveStyle(selectElement) {
  const isActive = selectElement.value !== "all";
  selectElement.classList.toggle("border-comic-blue", isActive);
  selectElement.classList.toggle("bg-comic-blue/10", isActive);
  selectElement.classList.toggle("border-black", !isActive);
  selectElement.classList.toggle("bg-white", !isActive);
}

// conecta los selects de editorial y alineacion: al cambiar, actualizan el
// estado y vuelven a aplicar todos los filtros juntos
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

// letras del alfabeto para armar la grilla de botones (el alfabeto es fijo,
// lo que se genera dinamicamente son los 26 elementos <button>)
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const LETTER_BUTTON_CLASSES =
  "rounded border-2 border-black bg-white text-xs font-bold py-1 transition hover:bg-comic-gold/20 hover:border-comic-gold focus:outline-none focus:ring-2 focus:ring-blue-400";

// crea los 26 botones a-z dentro de la grilla. se llama una sola vez al
// iniciar la app: si se llamara de nuevo duplicaria los botones
export function populateLetterFilterGrid() {
  const letterGrid = document.getElementById("letter-filter-grid");

  ALPHABET.forEach((letter) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = letter;
    button.dataset.letter = letter;
    button.setAttribute("aria-label", `Filtrar héroes que empiezan con ${letter}`);
    button.className = LETTER_BUTTON_CLASSES;
    letterGrid.appendChild(button);
  });
}

// marca visualmente la letra activa cambiando sus clases (o ninguna si
// selectedLetter es "all")
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

// conecta un solo listener delegado en la grilla (los 26 botones no se
// recrean nunca, pero se mantiene el mismo patron que usa pagination.js)
export function initLetterFilter() {
  const letterGrid = document.getElementById("letter-filter-grid");

  letterGrid.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-letter]");
    if (!button) return;

    // un segundo click sobre la misma letra la desactiva (vuelve a "all")
    const clickedLetter = button.dataset.letter;
    state.selectedLetter = state.selectedLetter === clickedLetter ? "all" : clickedLetter;

    updateActiveLetterStyle();
    applyFilters();
  });
}

// marca visualmente el boton de orden activo cambiando sus clases (o
// ninguno si sortOrder es "none")
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

// un segundo click sobre el mismo orden lo apaga (vuelve a "none")
function setSortOrder(newOrder) {
  state.sortOrder = state.sortOrder === newOrder ? "none" : newOrder;
  updateSortButtonsActiveStyle();
  applyFilters();
}

// conecta los dos botones de orden alfabetico
export function initSortButtons() {
  document.getElementById("sort-asc-button").addEventListener("click", () => setSortOrder("asc"));
  document.getElementById("sort-desc-button").addEventListener("click", () => setSortOrder("desc"));
}
