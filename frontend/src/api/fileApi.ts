import { directApiClient } from './apiClient';

// imageやaudioなどのURLアクセス時に認証(JWT)を必要とするため、axiosでアクセスし、Blobとして扱うようにする。
export const getFileAsBlob = async (filePath: string): Promise<Blob> => {
  const response = await directApiClient.get(`/files/${filePath}`, {
    responseType: 'blob', // レスポンスをBlobとして扱う
  });
  return response.data;
};