/**
 * Normalise une chaîne pour la recherche (enlève les accents et met en minuscules)
 */
export const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD') // Décompose les caractères accentués
    .replace(/[\u0300-\u036f]/g, ''); // Supprime les accents
};

/**
 * Vérifie si une chaîne contient une autre (insensible aux accents et à la casse)
 */
export const searchIncludes = (haystack: string, needle: string): boolean => {
  return normalizeString(haystack).includes(normalizeString(needle));
};