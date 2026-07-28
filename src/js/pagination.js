import { state } from "./state.js";

// Devuelve solo los héroes que corresponden a la página actual
// (por ahora usamos esto para mostrar los primeros 20; los botones de
// paginado los agregamos en la próxima rama)
export function getHeroesForCurrentPage() {
  const startIndex = (state.currentPage - 1) * state.heroesPerPage;
  const endIndex = startIndex + state.heroesPerPage;

  // .slice() "recorta" el array sin modificar el original
  return state.filteredHeroes.slice(startIndex, endIndex);
}