import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import * as path from 'path';
import { MaxImageFileSize } from 'src/lib/constants/max-image-file-size';
import { v4 as uuidv4 } from 'uuid';

type ValidMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

const validMimeTypes: ValidMimeType[] = [
  'image/png',
  'image/jpg',
  'image/jpeg',
];

@Injectable()
export class FileUploadService {
  constructor(private readonly configService: ConfigService) {}

  public getFilePath(file: Express.Multer.File) {
    let filePath =
      file.destination.split('/').slice(-2).join('/') + '/' + file.filename;

    filePath = `${this.configService.get('appConfig.backendUrl')}/${filePath}`;

    return filePath;
  }

  public static saveImageToStorage({ dirName }: { dirName: string }) {
    const uploadsDirRoot = path.join(
      process.cwd(),
      'public',
      'uploads',
      dirName,
    );

    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadsDirRoot)) {
      fs.mkdirSync(uploadsDirRoot, { recursive: true });
    }

    return {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          cb(null, uploadsDirRoot);
        },
        filename: async (_req, file, cb) => {
          const fileExtension = path.extname(file.originalname).toLowerCase();
          const fileName = `${dirName}-${uuidv4()}${fileExtension}`;
          cb(null, fileName);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image')) {
          return cb(
            new BadRequestException(
              'Invalid file type! only image can be uploaded',
            ),
            false,
          );
        }

        if (file.size > MaxImageFileSize) {
          return cb(
            new BadRequestException(
              `File size exceeds the ${MaxImageFileSize}MB limit.`,
            ),
            false,
          );
        }

        cb(null, true);
      },
    };
  }

  public removeFile(fullFilePath: string): void {
    try {
      if (!fullFilePath) {
        console.warn('No file path provided to remove');
        return;
      }

      let filePath: string;

      if (
        fullFilePath.startsWith('http://') ||
        fullFilePath.startsWith('https://')
      ) {
        // Extract the relative path after 'uploads/'
        const matches = fullFilePath.match(/\/uploads\/(.*)/);
        if (!matches || !matches[1]) {
          throw new Error('Invalid file path format');
        }

        filePath = path.join(process.cwd(), 'public', 'uploads', matches[1]);
      } else {
        // If it's already a local path
        filePath = fullFilePath;
      }

      // Check if file exists before attempting to delete
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Using sync version for simplicity
        console.log(`File successfully removed: ${filePath}`);
      } else {
        console.warn(`File not found: ${filePath}`);
      }
    } catch (error) {
      console.error('Error removing file:', error);
      throw new BadRequestException(`Failed to remove file: ${error.message}`);
    }
  }
}
