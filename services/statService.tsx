/* Si l'API actuelle ne fonctionne plus, remplacer par cette version locale:

import { Platform } from 'react-native';


const API_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:3000/stats'
    : 'http://localhost:3000/stats';

*/

const API_URL = 'https://api.books.tristan-renard.com/stats';

export interface BookStats {
  totalBooks: number;
  readCount: number;
  unreadCount: number;
  favoritesCount: number;
  averageRating: number;
}

export const statService = {
  /**
   * Récupère les statistiques des livres depuis l'API
   */
  async getStats(): Promise<BookStats> {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data: BookStats = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  },
};