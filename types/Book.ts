export interface Book {
  id: number;
  name: string;
  author: string;
  editor: string;
  year: number;
  read: boolean;
  favorite: boolean;
  rating: number;
  cover: string | null;
  theme: string;
}

export interface CreateBookDTO {
  name: string;
  author: string;
  editor: string;
  year: number;
  read: boolean;
  favorite: boolean;
  rating: number;
  cover: string | null;
  theme: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateBookDTO extends Partial<CreateBookDTO> {}