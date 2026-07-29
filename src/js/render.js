// Buscamos el contenedor donde van a aparecer las cards, una sola vez
const heroGrid = document.getElementById("hero-grid");

// Se muestra mientras se espera la respuesta de la API, para que la grilla
// no se vea vacía/rota mientras carga
export function renderLoadingState() {
  heroGrid.innerHTML = `<p class="col-span-full text-center text-gray-500">Loading heroes...</p>`;
}

// Se muestra si la API falla, para distinguirlo de una búsqueda sin resultados
export function renderErrorState() {
  heroGrid.innerHTML = `<p class="col-span-full text-center text-red-500">We couldn't load the heroes. Please try again later.</p>`;
}

// Esta función recibe un array de héroes y los dibuja en pantalla
export function renderHeroes(heroes) {
  // Vaciamos el contenedor antes de pintar los nuevos resultados
  heroGrid.innerHTML = "";

  // Si no hay resultados (por ejemplo, una búsqueda sin coincidencias)
  if (heroes.length === 0) {
    heroGrid.innerHTML = `<p class="col-span-full text-center text-gray-500">No results found</p>`;
    return;
  }

  // Recorremos cada héroe del array
  heroes.forEach((hero) => {
    // Creamos un elemento HTML nuevo para cada héroe (la "card")
    const card = document.createElement("article");
    // Estilo "panel de cómic": borde negro grueso + sombra dura sin blur (comic-shadow,
    // definida en app.css). En hover la card "se levanta" y la sombra crece (comic-shadow-lg)
    card.className =
      "bg-white rounded-lg border-4 border-black comic-shadow p-3 cursor-pointer transition hover:-translate-y-1 hover:comic-shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400";

    // Guardamos el id del héroe en el elemento, para usarlo después en el modal
    card.dataset.heroId = hero.id;

    // Hacemos que la card sea accesible por teclado: tabindex la vuelve enfocable
    // con Tab, y role="button" + aria-label le avisan a los lectores de pantalla
    // que actúa como un botón que abre el detalle de este héroe
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `View details for ${hero.name}`);

    // Insertamos la imagen, el nombre y la editorial usando template strings
    // line-clamp-2 corta nombres largos a 2 líneas y truncate corta la editorial a 1 línea,
    // así ninguna card se estira ni rompe el grid, sea de 1, 2 o 4 columnas
    card.innerHTML = `
      <img src="${hero.images.sm}" alt="${hero.name}" class="w-full h-40 object-cover rounded" />
      <h2 class="text-lg font-heading tracking-wide mt-2 line-clamp-2">${hero.name}</h2>
      <p class="text-sm text-gray-500 truncate">${hero.biography.publisher}</p>
    `;

    // Agregamos la card ya armada dentro del contenedor
    heroGrid.appendChild(card);
  });
}