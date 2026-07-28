// Importamos la función que trae los héroes desde la API
import { fetchHeroes } from "./js/api.js";

// Importamos el objeto de estado global
import { state } from "./js/state.js";

// Función principal que arranca la aplicación
async function init() {
  // Esperamos a que la API nos devuelva los héroes...
  state.allHeroes = await fetchHeroes();

  // ...y los guardamos también como "filtrados" (por ahora son los mismos)
  state.filteredHeroes = state.allHeroes;

  // Mostramos en consola cuántos héroes se cargaron, para comprobar que funciona
  console.log(`Loaded ${state.allHeroes.length} heroes`, state.allHeroes);
}

// Llamamos a la función para que arranque apenas carga la página
init();