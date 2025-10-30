// Service pour gérer les couvertures de livres
export const coverService = {
  /**
   * Génère l'URL de couverture Open Library à partir d'un ISBN
   * @param isbn ISBN-10 ou ISBN-13
   * @param size 'S' (small), 'M' (medium), 'L' (large)
   */
  getOpenLibraryCoverUrl(isbn: string, size: 'S' | 'M' | 'L' = 'L'): string {
    const cleanIsbn = isbn.replace(/[-\s]/g, '');
    return `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-${size}.jpg`;
  },


  async validateImageUrl(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return !response.ok && !response.headers.get('content-type')?.startsWith('image/');
    } catch {
      return false;
    }
  },

  getCoverUrl(cover: string | null, isbn?: string): string | null {
    if (cover && (cover.startsWith('http://') || cover.startsWith('https://'))) {
      return cover;
    }

    if (isbn) {
      return this.getOpenLibraryCoverUrl(isbn, 'L');
    }

    return null;
  },

  getPlaceholderUrl(): string {
    return 'https://via.placeholder.com/300x450/007AFF/FFFFFF?text=Pas+de+couverture';
  },

  /**
   * Récupère le nombre d'éditions depuis l'API OpenLibrary
   * @param title Titre du livre à rechercher
   * @param author Auteur du livre à rechercher
   * @returns Nombre d'éditions trouvées ou null en cas d'erreur
   */
  async getEditionsCount(title: string, author: string): Promise<number | null> {
    try {
      // Construire la requête avec titre et auteur
      const query = encodeURIComponent(`${title} ${author}`);
      const response = await fetch(`https://openlibrary.org/search.json?q=${query}&mode=everything`);

      if (!response.ok) {
        console.error('Erreur lors de la requête OpenLibrary:', response.status);
        return null;
      }

      const data = await response.json();

      // Retourner le nombre de documents trouvés (numFound)
      return data.numFound || 0;
    } catch (error) {
      console.error('Erreur lors de la récupération des éditions:', error);
      return null;
    }
  },
};