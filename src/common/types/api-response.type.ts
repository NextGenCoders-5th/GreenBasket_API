export interface Metadata {
  itemsPerPage?: number;
  totalItems?: number;
  currentPage?: number;
  totalPages?: number;
  [key: string]: any;
}

export class ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  timestamp: string;
  metadata?: Metadata;
  data: T | null;

  constructor(
    status: 'success' | 'error',
    message: string,
    metadata?: Metadata,
    data: T | null = null,
  ) {
    this.status = status;
    this.message = message;
    this.timestamp = new Date().toISOString(); // Default timestamp
    this.metadata = metadata;
    this.data = data;
  }
}
