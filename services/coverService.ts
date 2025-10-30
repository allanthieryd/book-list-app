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
};