// guardamos la url de la API en una constante para no repetirla en el codigo
const API_URL = "https://akabab.github.io/superhero-api/api/all.json";

// esta funcion busca todos los heroes en la API
// es "async" porque tarda en responder (hace una peticion a internet)
export async function fetchHeroes() {
  try {
    // "await" hace que el codigo espere la respuesta del servidor antes de seguir
    const response = await fetch(API_URL);

    // si la respuesta no fue exitosa (por ejemplo, error 404), lanzamos un error
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    // convertimos la respuesta en un array de objetos JS (formato JSON)
    const heroes = await response.json();

    // devolvemos el array con todos los heroes
    return heroes;

  } catch (error) {
    // si algo sale mal (sin internet, servidor caido, etc.) lo mostramos en consola
    console.error("Failed to fetch heroes:", error);

    // devolvemos null (en vez de un array vacio) para poder distinguir
    // "la API fallo" de "la busqueda no encontro resultados"
    return null;
  }
}