import { Book, CreateBookDTO, UpdateBookDTO } from '../types/Book';

const API_URL = 'https://api.books.tristan-renard.com/books';

export const bookService = {
  // GET - Récupérer tous les livres
  async getAllBooks(): Promise<Book[]> {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des livres');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur getAllBooks:', error);
      throw error;
    }
  },

  // GET - Récupérer un livre par ID
  async getBookById(id: number): Promise<Book> {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du livre');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur getBookById:', error);
      throw error;
    }
  },

  // POST - Créer un nouveau livre
  async createBook(bookData: CreateBookDTO): Promise<Book> {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la création du livre');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur createBook:', error);
      throw error;
    }
  },

  // PUT - Mettre à jour un livre
  async updateBook(id: number, bookData: UpdateBookDTO): Promise<Book> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du livre');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur updateBook:', error);
      throw error;
    }
  },

  // DELETE - Supprimer un livre
  async deleteBook(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du livre');
      }
    } catch (error) {
      console.error('Erreur deleteBook:', error);
      throw error;
    }
  },
};
