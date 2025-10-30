export interface UploadImageResponse {
  url: string;
  filename?: string;
  success?: boolean;
  error?: string;
}

export const uploadCoverService = {
  uploadImage: async (uri: string): Promise<UploadImageResponse> => {
    try {
      const formData = new FormData();

      const filename = uri.split('/').pop() || 'image.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('image', {
        uri,
        name: filename,
        type,
      } as any);

      const response = await fetch('https://api.books.tristan-renard.com/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },
};