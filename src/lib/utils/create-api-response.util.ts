import { Metadata, ApiResponse } from 'src/common/types/api-response.type';

export const CreateApiResponse = <T>({
  status,
  message,
  data = null,
  metadata,
  timestamp = new Date().toISOString(),
}: {
  status: 'success' | 'error';
  message: string;
  data?: T | null;
  metadata?: Metadata;
  timestamp?: string;
}): ApiResponse<T> => ({
  status,
  message,
  timestamp,
  data,
  metadata,
});
