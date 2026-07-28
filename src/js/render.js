// Buscamos el contenedor donde van a aparecer las cards, una sola vez
const heroGrid = document.getElementById("hero-grid");

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
    card.className = "bg-white rounded-lg shadow p-3 cursor-pointer hover:shadow-lg transition";

    // Guardamos el id del héroe en el elemento, para usarlo después en el modal
    card.dataset.heroId = hero.id;

    // Insertamos la imagen, el nombre y la editorial usando template strings
    card.innerHTML = `
      <img src="${hero.images.sm}" alt="${hero.name}" class="w-full h-40 object-cover rounded" />
      <h2 class="text-lg font-semibold mt-2">${hero.name}</h2>
      <p class="text-sm text-gray-500">${hero.biography.publisher}</p>
    `;

    // Agregamos la card ya armada dentro del contenedor
    heroGrid.appendChild(card);
  });
}