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
        if (!validMimeTypes.includes(file.mimetype)) {
          return cb(
            new BadRequestException(
              'Invalid file type! Only PNG, JPG, and JPEG are allowed.',
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
    let filePath = fullFilePath;

    if (
      fullFilePath.startsWith('http://') ||
      fullFilePath.startsWith('https://')
    ) {
      const relativePath = fullFilePath.split('/uploads/')[1];
      filePath = path.resolve(
        __dirname,
        '../../../public/uploads',
        relativePath,
      );

      console.log('file path to be removed from the folder...', filePath);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error removing file: ${err.message}`);
        }
      });
    } else {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error removing file: ${err.message}`);
        }
      });
    }
  }
}
