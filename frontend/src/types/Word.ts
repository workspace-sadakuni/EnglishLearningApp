export interface Word {
    id: number;
    word: string;
    meaning: string;
    categoryId: number;
    categoryName: string | null;
    imagePath: string | null;
    audioPath: string | null;
    createdAt: string;
    updatedAt: string;
  }