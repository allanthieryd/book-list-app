export interface Note {
  id: number;
  bookId: number;
  content: string;
  dateISO: string;
}

export interface CreateNoteDTO {
  content: string;
}