// este objeto guarda toda la informacion que se comparte entre los archivos
// es como una "caja central" de datos del proyecto
export const state = {
  allHeroes: [], // aca se guardan todos los heroes que trae la API
  filteredHeroes: [], // aca se guardan los heroes ya buscados/filtrados
  currentPage: 1, // en que pagina de resultados esta el usuario
  heroesPerPage: 20, // cuantos heroes se muestran por pagina
  searchQuery: "", // texto que el usuario escribio en la busqueda
  selectedPublisher: "all", // editorial elegida en el filtro ("all" = todas)
  selectedAlignment: "all", // alineacion elegida en el filtro ("all" = todas)
  selectedLetter: "all", // letra inicial del nombre elegida en el filtro ("all" = todas)
  selectedGender: "all", // genero elegido en el filtro ("all" = todos)
  selectedRace: "all", // raza elegida en el filtro ("all" = todas)
  sortOrder: "none", // orden alfabetico por nombre: "none" | "asc" | "desc"
};
