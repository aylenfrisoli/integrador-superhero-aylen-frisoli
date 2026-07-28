// Este objeto guarda toda la información que se comparte entre los archivos
// Es como una "caja central" de datos del proyecto
export const state = {
  allHeroes: [],        // acá se guardan TODOS los héroes que trae la API
  filteredHeroes: [],    // acá se guardan los héroes ya buscados/filtrados
  currentPage: 1,       // en qué página de resultados está el usuario
  heroesPerPage: 20,     // cuántos héroes se muestran por página
};