// Funciones de traducción para valores de la API de Rick and Morty

export type Status = "Alive" | "Dead" | "unknown";
export type Gender = "Male" | "Female" | "unknown";
export type Species = "Human" | "Alien" | "Humanoid";

/**
 * Traduce el estado del personaje de inglés a español
 */
export const translateStatus = (status: Status): string => {
  const translations: Record<Status, string> = {
    Alive: "Vivo",
    Dead: "Muerto",
    unknown: "Desconocido",
  };
  return translations[status] || status;
};

/**
 * Traduce el género del personaje de inglés a español
 */
export const translateGender = (gender: Gender): string => {
  const translations: Record<Gender, string> = {
    Male: "Masculino",
    Female: "Femenino",
    unknown: "Desconocido",
  };
  return translations[gender] || gender;
};

/**
 * Traduce la especie del personaje de inglés a español
 */
export const translateSpecies = (species: string): string => {
  const translations: Record<string, string> = {
    Human: "Humano",
    Alien: "Alienígena",
    Humanoid: "Humanoide",
  };
  return translations[species] || species;
};

/**
 * Traduce de español a inglés (para mantener compatibilidad con la API)
 */
export const reverseTranslateStatus = (estado: string): Status => {
  const reverse: Record<string, Status> = {
    Vivo: "Alive",
    Muerto: "Dead",
    Desconocido: "unknown",
  };
  return reverse[estado] || (estado as Status);
};

export const reverseTranslateGender = (genero: string): Gender => {
  const reverse: Record<string, Gender> = {
    Masculino: "Male",
    Femenino: "Female",
    Desconocido: "unknown",
  };
  return reverse[genero] || (genero as Gender);
};

export const reverseTranslateSpecies = (especie: string): string => {
  const reverse: Record<string, string> = {
    Humano: "Human",
    Alienígena: "Alien",
    Humanoide: "Humanoid",
  };
  return reverse[especie] || especie;
};
