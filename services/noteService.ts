import { Note, CreateNoteDTO } from '../types/Note';

/* Si l'API actuelle ne fonctionne plus, remplacer par cette version locale:

import { Platform } from 'react-native';


const API_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:3000/books'
    : 'http://localhost:3000/books';

*/

const API_URL = 'https://api.books.tristan-renard.com/books';

export const noteService = {
  // GET - Récupérer toutes les notes d'un livre
  async getNotesByBookId(bookId: number): Promise<Note[]> {
    try {
      const response = await fetch(`${API_URL}/${bookId}/notes`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des notes');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur getNotesByBookId:', error);
      throw error;
    }
  },

  // POST - Créer une nouvelle note
  async createNote(bookId: number, noteData: CreateNoteDTO): Promise<Note> {
    try {
      const response = await fetch(`${API_URL}/${bookId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la création de la note');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur createNote:', error);
      throw error;
    }
  },
};