// Importamos la función que trae los héroes desde la API
import { fetchHeroes } from "./js/api.js";

// Importamos el objeto de estado global
import { state } from "./js/state.js";

// Importamos la función que dibuja las cards en pantalla
import { renderHeroes } from "./js/render.js";

// Importamos la función que recorta los héroes de la página actual
import { getHeroesForCurrentPage } from "./js/pagination.js";

// Función principal que arranca la aplicación
async function init() {
  // Esperamos a que la API nos devuelva los héroes...
  state.allHeroes = await fetchHeroes();

  // ...y los guardamos también como "filtrados" (por ahora son los mismos)
  state.filteredHeroes = state.allHeroes;

  // Mostramos en pantalla solo los héroes de la página actual (los primeros 20)
  renderHeroes(getHeroesForCurrentPage());
}

// Llamamos a la función para que arranque apenas carga la página
init();