import type { Character } from "@/hooks/useCharacters";

// ============================================================================
// TIPOS
// ============================================================================

interface ApiResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface Episode {
  nombre: string;
  codigo: string;
}

interface EpisodeResponse {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: string;
}

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const API_BASE_URL = "https://rickandmortyapi.com/api";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos
const MIN_REQUEST_INTERVAL = 400; // 400ms entre requests para evitar rate limiting
const MAX_RETRIES = 3; // Número máximo de reintentos
const INITIAL_RETRY_DELAY = 2000; // Delay inicial para reintentos (2 segundos)

// ============================================================================
// CACHÉ EN MEMORIA
// ============================================================================

class ApiCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private lastRequestTime = 0;

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > CACHE_TTL;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }

  // Rate limiting: Espera el tiempo mínimo entre requests
  async waitForRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    this.lastRequestTime = Date.now();
  }
}

const cache = new ApiCache();

// ============================================================================
// FUNCIONES DE API
// ============================================================================

/**
 * Espera un tiempo determinado (en milisegundos)
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Realiza un fetch con caché, rate limiting y reintentos automáticos
 */
async function fetchWithCache<T>(url: string, retryCount = 0): Promise<T> {
  // Verificar caché
  const cached = cache.get<T>(url);
  if (cached) {
    return cached;
  }

  // Rate limiting
  await cache.waitForRateLimit();

  try {
    // Fetch
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 429) {
        // Error de rate limiting - reintentar con backoff exponencial
        if (retryCount < MAX_RETRIES) {
          const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
          // Solo mostrar el warning en desarrollo
          if (process.env.NODE_ENV === "development") {
            console.log(
              `⏳ Esperando rate limit... reintentando en ${delay}ms (${retryCount + 1}/${MAX_RETRIES})`,
            );
          }
          await sleep(delay);
          return fetchWithCache<T>(url, retryCount + 1);
        }
        throw new Error(
          "Demasiadas peticiones. Por favor, intenta de nuevo más tarde.",
        );
      }
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Guardar en caché
    cache.set(url, data);

    return data;
  } catch (error) {
    // Si es un error de red y todavía tenemos reintentos, intentar de nuevo
    if (retryCount < MAX_RETRIES && error instanceof TypeError) {
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
      console.warn(
        `⚠️ Error de red. Reintentando en ${delay}ms... (intento ${retryCount + 1}/${MAX_RETRIES})`,
      );
      await sleep(delay);
      return fetchWithCache<T>(url, retryCount + 1);
    }
    throw error;
  }
}

/**
 * Obtiene una página de personajes con filtros opcionales
 */
export async function fetchCharactersPage(
  page: number = 1,
  filters?: {
    name?: string;
    status?: string;
    species?: string;
    gender?: string;
  },
): Promise<ApiResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
  });

  if (filters?.name) params.append("name", filters.name);
  if (filters?.status) params.append("status", filters.status);
  if (filters?.species) params.append("species", filters.species);
  if (filters?.gender) params.append("gender", filters.gender);

  const url = `${API_BASE_URL}/character?${params.toString()}`;

  try {
    return await fetchWithCache<ApiResponse>(url);
  } catch (error) {
    // Si no hay resultados, la API devuelve 404
    if (error instanceof Error && error.message.includes("404")) {
      return {
        info: { count: 0, pages: 0, next: null, prev: null },
        results: [],
      };
    }
    throw error;
  }
}

/**
 * Obtiene TODOS los personajes de Rick & Morty (826 personajes en 42 páginas)
 * Esta función se llama una sola vez y cachea el resultado
 */
export async function fetchAllCharacters(): Promise<Character[]> {
  const cacheKey = "all-characters";
  const cached = cache.get<Character[]>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // Obtener la primera página para saber cuántas páginas hay
    const firstPageUrl = `${API_BASE_URL}/character`;
    const firstPage = await fetchWithCache<ApiResponse>(firstPageUrl);

    const allCharacters: Character[] = [...firstPage.results];
    const totalPages = firstPage.info.pages;

    // Obtener el resto de páginas en paralelo
    if (totalPages > 1) {
      const promises = [];
      for (let page = 2; page <= totalPages; page++) {
        const url = `${API_BASE_URL}/character?page=${page}`;
        promises.push(fetchWithCache<ApiResponse>(url));
      }

      const results = await Promise.all(promises);
      results.forEach((result) => {
        allCharacters.push(...result.results);
      });
    }

    // Cachear los personajes
    cache.set(cacheKey, allCharacters);

    return allCharacters;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("❌ Error cargando todos los personajes:", error);
    }
    throw error;
  }
}

/**
 * Obtiene TODOS los episodios de Rick & Morty (son 51 episodios en 3 páginas)
 * Esta función se llama una sola vez y cachea el resultado
 */
export async function fetchAllEpisodes(): Promise<EpisodeResponse[]> {
  const cacheKey = "all-episodes";
  const cached = cache.get<EpisodeResponse[]>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // Obtener la primera página para saber cuántas páginas hay
    const firstPageUrl = `${API_BASE_URL}/episode`;
    const firstPage = await fetchWithCache<{
      info: {
        count: number;
        pages: number;
        next: string | null;
        prev: string | null;
      };
      results: EpisodeResponse[];
    }>(firstPageUrl);

    const allEpisodes: EpisodeResponse[] = [...firstPage.results];
    const totalPages = firstPage.info.pages;

    // Obtener el resto de páginas en paralelo
    if (totalPages > 1) {
      const promises = [];
      for (let page = 2; page <= totalPages; page++) {
        const url = `${API_BASE_URL}/episode?page=${page}`;
        promises.push(
          fetchWithCache<{
            info: {
              count: number;
              pages: number;
              next: string | null;
              prev: string | null;
            };
            results: EpisodeResponse[];
          }>(url),
        );
      }

      const results = await Promise.all(promises);
      results.forEach((result) => {
        allEpisodes.push(...result.results);
      });
    }

    // Cachear los episodios
    cache.set(cacheKey, allEpisodes);

    return allEpisodes;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("❌ Error cargando todos los episodios:", error);
    }
    throw error;
  }
}

/**
 * Filtra episodios donde aparece un personaje específico
 * @param allEpisodes - Todos los episodios de la serie
 * @param characterId - ID del personaje a buscar
 * @returns Array de episodios donde aparece el personaje
 */
export function filterEpisodesByCharacter(
  allEpisodes: EpisodeResponse[],
  characterId: number,
): Episode[] {
  const characterUrl = `${API_BASE_URL}/character/${characterId}`;

  return allEpisodes
    .filter((episode) => episode.characters.includes(characterUrl))
    .map((episode) => ({
      nombre: episode.name,
      codigo: episode.episode,
    }));
}

/**
 * Obtiene los episodios de un personaje
 * Procesa de forma secuencial para evitar errores 429
 * @deprecated Usar fetchAllEpisodes() y filterEpisodesByCharacter() en su lugar
 */
export async function fetchCharacterEpisodes(
  episodeUrls: string[],
  onProgress?: (loaded: number, total: number) => void,
): Promise<Episode[]> {
  if (episodeUrls.length === 0) return [];

  const episodes: Episode[] = [];
  const total = episodeUrls.length;

  // Procesamiento secuencial para evitar sobrecarga de la API
  for (let i = 0; i < episodeUrls.length; i++) {
    try {
      const url = episodeUrls[i];
      const ep = await fetchWithCache<{ name: string; episode: string }>(url);
      episodes.push({ nombre: ep.name, codigo: ep.episode });

      // Reportar progreso
      if (onProgress) {
        onProgress(i + 1, total);
      }

      // Pequeña pausa entre cada episodio (excepto el último)
      if (i < episodeUrls.length - 1) {
        await sleep(MIN_REQUEST_INTERVAL);
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(`❌ Error cargando episodio:`, error);
      }
      // Continuar con el siguiente episodio en caso de error
    }
  }

  return episodes;
}

/**
 * Obtiene todos los personajes disponibles (solo IDs y nombres para búsqueda)
 * Esta función se usa para construir un índice de búsqueda sin cargar todos los detalles
 */
export async function fetchAllCharacterIds(): Promise<
  Array<{ id: number; name: string }>
> {
  const cacheKey = "all-character-ids";
  const cached = cache.get<Array<{ id: number; name: string }>>(cacheKey);
  if (cached) return cached;

  try {
    // Solo obtenemos la primera página para conocer el total
    const firstPage = await fetchCharactersPage(1);

    // Construir un índice ligero con solo IDs y nombres
    const allIds: Array<{ id: number; name: string }> = firstPage.results.map(
      (char) => ({
        id: char.id,
        name: char.name,
      }),
    );

    // Nota: Para evitar hacer todas las peticiones, solo retornamos la primera página
    // En producción real, esto se manejaría con buscar directamente en la API
    cache.set(cacheKey, allIds);
    return allIds;
  } catch (error) {
    console.error("Error fetching character IDs:", error);
    return [];
  }
}

/**
 * Limpia el caché (útil para testing o refresh manual)
 */
export function clearCache(): void {
  cache.clear();
}
