import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

// This pipe is used to validate the size of the file
@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File): Express.Multer.File {
    const twoMb = 2 * 1024 * 1024; // 2MB limit
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (value.size > twoMb) {
      throw new BadRequestException('File size exceeds 2MB limit');
    }
    if (!allowedMimeTypes.includes(value.mimetype as string)) {
      throw new BadRequestException('Invalid file type');
    }
    return value;
  }
}
