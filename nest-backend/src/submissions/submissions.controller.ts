import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { FileSizeValidationPipe } from './file-validation.pipe';
import { SubmissionsService } from './submissions.service';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile(new FileSizeValidationPipe()) file: Express.Multer.File,
    @Body() createSubmissionDto: CreateSubmissionDto,
  ) {
    console.log('createSubmissionDto', createSubmissionDto);
    console.log('file', file);
    try {
      await this.submissionsService.sendSubmissionEmail(
        file,
        createSubmissionDto,
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
    return { message: 'Submission email sent' };
  }
}
