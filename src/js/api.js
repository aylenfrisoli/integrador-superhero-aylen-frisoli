// token personal de superheroapi.com, cargado desde el .env (no se versiona)
const ACCESS_TOKEN = import.meta.env.VITE_SUPERHERO_ACCESS_TOKEN;

// ojo: la URL "documentada" (superheroapi.com/api/TOKEN/...) redirige (302) a
// www.superheroapi.com/api.php/TOKEN/..., y esa respuesta intermedia del
// redirect no trae cabecera CORS -> el browser bloquea todo el fetch. Pegamos
// directo contra el destino final del redirect, que si responde con
// "access-control-allow-origin: *" en una respuesta 200 directa.
const API_URL = `https://www.superheroapi.com/api.php/${ACCESS_TOKEN}`;

// mensaje exacto que devuelve la API cuando la busqueda no encuentra a nadie
// (a diferencia de un token invalido o una cuota agotada, esto no es un error real)
const NOT_FOUND_MESSAGE = "character with given name not found";

// busca heroes por nombre en la API. es "async" porque tarda en responder
export async function searchHeroes(query) {
  try {
    // "await" hace que el codigo espere la respuesta del servidor antes de seguir
    const response = await fetch(`${API_URL}/search/${encodeURIComponent(query)}`);

    // si la respuesta no fue exitosa (por ejemplo, error 5xx), lanzamos un error
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    // la API responde 200 aunque falle: usa "response: error" tanto para
    // "no encontrado" como para token invalido o cuota agotada, hay que
    // distinguirlos por el mensaje
    if (data.response === "error") {
      if (data.error === NOT_FOUND_MESSAGE) {
        return []; // busqueda valida, simplemente sin resultados
      }
      throw new Error(data.error);
    }

    // devolvemos el array de heroes que coinciden con la busqueda
    return data.results;
  } catch (error) {
    // si algo sale mal (sin internet, token invalido, cuota agotada, etc.)
    console.error("Failed to search heroes:", error);

    // devolvemos null (en vez de un array vacio) para poder distinguir
    // "la API fallo" de "la busqueda no encontro resultados"
    return null;
  }
}
