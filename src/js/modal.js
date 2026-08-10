// Traemos el estado global para poder buscar al héroe seleccionado por su id
import { state } from "./state.js";

// Buscamos los elementos del modal una sola vez, apenas se carga el archivo
const heroModal = document.getElementById("hero-modal");
const modalContent = document.getElementById("modal-content");
const closeModalButton = document.getElementById("close-modal-button");
const heroGrid = document.getElementById("hero-grid");

// Nombre "lindo" para mostrar de cada una de las 6 estadísticas de poder
const POWERSTATS_LABELS = {
  intelligence: "Inteligencia",
  strength: "Fuerza",
  speed: "Velocidad",
  durability: "Resistencia",
  power: "Poder",
  combat: "Combate",
};

// Si el dato viene vacío, null o undefined, mostramos "Desconocido" en vez de dejarlo en blanco
function orUnknown(value) {
  return value ? value : "Desconocido";
}

// Los alias vienen como un array (ej: ["Bruce Wayne", "The Caped Crusader"]).
// Los unimos en un solo texto separado por comas, o mostramos "Desconocido" si no hay ninguno
function formatAliases(aliases) {
  if (!Array.isArray(aliases) || aliases.length === 0) return "Desconocido";
  return aliases.join(", ");
}

// Arma el HTML de una sola barra de progreso (ej: "Strength" con una barra al 90%)
function buildStatBarHTML(label, value) {
  // Algunos héroes tienen el valor como "null", por eso forzamos a que sea un número válido
  const numericValue = Number(value) || 0;

  return `
    <div class="mb-2">
      <div class="flex justify-between text-sm text-gray-600">
        <span>${label}</span>
        <span>${numericValue}</span>
      </div>
      <div class="w-full h-2 bg-gray-200 rounded-full">
        <div class="h-2 bg-comic-blue rounded-full" style="width: ${numericValue}%"></div>
      </div>
    </div>
  `;
}

// Recorre las 6 estadísticas de poder y arma todas las barras juntas
function buildPowerstatsHTML(powerstats) {
  return Object.entries(POWERSTATS_LABELS)
    .map(([key, label]) => buildStatBarHTML(label, powerstats[key]))
    .join("");
}

// Busca al héroe por id, arma todo el contenido del modal y lo muestra en pantalla
export function openHeroModal(heroId) {
  // El id que llega de la card es un string (viene del dataset), pero hero.id es un número.
  // Por eso convertimos con Number() antes de comparar
  const hero = state.allHeroes.find((h) => h.id === Number(heroId));
  if (!hero) return;

  // Altura y peso vienen como arrays: [imperial, métrico]
  const [heightImperial, heightMetric] = hero.appearance.height;
  const [weightImperial, weightMetric] = hero.appearance.weight;

  // Armamos todo el HTML del detalle del héroe con template strings
  modalContent.innerHTML = `
    <img src="${hero.images.lg}" alt="${hero.name}" class="w-full h-64 object-cover rounded-lg" />

    <h2 class="text-2xl font-heading tracking-wide mt-4">${hero.name}</h2>
    <p class="text-sm text-gray-500 mb-4">${hero.biography.publisher}</p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-700 mb-4">
      <p><span class="font-semibold">Nombre completo:</span> ${orUnknown(hero.biography.fullName)}</p>
      <p><span class="font-semibold">Alias:</span> ${formatAliases(hero.biography.aliases)}</p>
      <p><span class="font-semibold">Lugar de nacimiento:</span> ${orUnknown(hero.biography.placeOfBirth)}</p>
      <p><span class="font-semibold">Ocupación:</span> ${orUnknown(hero.work.occupation)}</p>
      <p><span class="font-semibold">Altura:</span> ${orUnknown(heightImperial)} / ${orUnknown(heightMetric)}</p>
      <p><span class="font-semibold">Peso:</span> ${orUnknown(weightImperial)} / ${orUnknown(weightMetric)}</p>
      <p><span class="font-semibold">Afiliación grupal:</span> ${orUnknown(hero.connections.groupAffiliation)}</p>
      <p><span class="font-semibold">Familiares:</span> ${orUnknown(hero.connections.relatives)}</p>
    </div>

    <h3 class="text-lg font-semibold mb-2">Estadísticas de poder</h3>
    ${buildPowerstatsHTML(hero.powerstats)}
  `;

  // showModal() abre el <dialog> como modal nativo: bloquea el resto de la página hasta que se cierre
  heroModal.showModal();
}

// Cierra el modal usando el método nativo de <dialog>
export function closeHeroModal() {
  heroModal.close();
}

// Conecta los eventos del modal: un solo listener en el grid (delegación de eventos, porque
// las cards se recrean todo el tiempo con la búsqueda/filtros/paginación) y otro en el botón de cerrar
export function initModal() {
  heroGrid.addEventListener("click", (event) => {
    // Buscamos el ancestro más cercano que tenga el atributo data-hero-id
    const card = event.target.closest("[data-hero-id]");
    if (!card) return;

    openHeroModal(card.dataset.heroId);
  });

  // Permite abrir el modal con teclado (Enter o Space), igual que un botón nativo,
  // ya que las cards ahora son enfocables (tabindex + role="button" en render.js)
  heroGrid.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    const card = event.target.closest("[data-hero-id]");
    if (!card) return;

    // Evitamos que Space haga scroll de la página al usarlo sobre la card
    event.preventDefault();
    openHeroModal(card.dataset.heroId);
  });

  closeModalButton.addEventListener("click", closeHeroModal);

  // Si el click fue justo sobre el <dialog> (el fondo/backdrop) y no sobre algo
  // de adentro, el target del evento es el propio dialog. Si el click fue sobre
  // el contenido interno, el target es ese elemento hijo, no el dialog. Por eso
  // comparar event.target === heroModal nos dice si el click fue "afuera"
  heroModal.addEventListener("click", (event) => {
    if (event.target === heroModal) {
      closeHeroModal();
    }
  });
}
