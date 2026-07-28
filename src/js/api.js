// Guardamos la URL de la API en una constante para no repetirla en el código
const API_URL = "https://akabab.github.io/superhero-api/api/all.json";

// Esta función busca todos los héroes en la API
// Es "async" porque tarda en responder (hace una petición a internet)
export async function fetchHeroes() {
  try {
    // "await" hace que el código espere la respuesta del servidor antes de seguir
    const response = await fetch(API_URL);

    // Si la respuesta no fue exitosa (por ejemplo, error 404), lanzamos un error
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    // Convertimos la respuesta en un array de objetos JavaScript (formato JSON)
    const heroes = await response.json();

    // Devolvemos el array con todos los héroes
    return heroes;

  } catch (error) {
    // Si algo sale mal (sin internet, servidor caído, etc.) lo mostramos en consola
    console.error("Failed to fetch heroes:", error);

    // Devolvemos null (en vez de un array vacío) para poder distinguir
    // "la API falló" de "la búsqueda no encontró resultados"
    return null;
  }
}