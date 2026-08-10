// buscamos el contenedor donde van a aparecer las cards, una sola vez
const heroGrid = document.getElementById("hero-grid");

// se muestra mientras se espera la respuesta de la API, para que la grilla
// no se vea vacia/rota mientras carga
export function renderLoadingState() {
  heroGrid.innerHTML = `<p class="col-span-full text-center text-gray-500">Cargando héroes...</p>`;
}

// se muestra si la API falla, para distinguirlo de una busqueda sin resultados
export function renderErrorState() {
  heroGrid.innerHTML = `<p class="col-span-full text-center text-red-500">No pudimos cargar los héroes. Probá de nuevo más tarde.</p>`;
}

// esta funcion recibe un array de heroes y los dibuja en pantalla
export function renderHeroes(heroes) {
  // vaciamos el contenedor antes de pintar los nuevos resultados
  heroGrid.innerHTML = "";

  // si no hay resultados (por ejemplo, una busqueda sin coincidencias)
  if (heroes.length === 0) {
    heroGrid.innerHTML = `<p class="col-span-full text-center text-gray-500">No se encontraron resultados</p>`;
    return;
  }

  // recorremos cada heroe del array
  heroes.forEach((hero) => {
    // creamos un elemento HTML nuevo para cada heroe (la "card")
    const card = document.createElement("article");
    card.className =
      "bg-white rounded-lg border-4 border-black comic-shadow p-3 cursor-pointer transition hover:-translate-y-1 hover:comic-shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400";

    // guardamos el id del heroe en el elemento, para usarlo despues en el modal
    card.dataset.heroId = hero.id;

    // hacemos que la card sea accesible por teclado: tabindex la vuelve enfocable
    // con tab, y role="button" + aria-label le avisan a los lectores de pantalla
    // que actua como un boton que abre el detalle de este heroe
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Ver detalle de ${hero.name}`);

    // insertamos la imagen, el nombre y la editorial usando template strings
    card.innerHTML = `
      <img src="${hero.images.sm}" alt="${hero.name}" class="w-full h-40 object-cover rounded" />
      <h2 class="text-lg font-heading tracking-wide mt-2 line-clamp-2">${hero.name}</h2>
      <p class="text-sm text-gray-500 truncate">${hero.biography.publisher}</p>
    `;

    // agregamos la card ya armada dentro del contenedor
    heroGrid.appendChild(card);
  });
}