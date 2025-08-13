import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { FileSizeValidationPipe } from './file-validation.pipe';
import { SubmissionsService } from './submissions.service';

@Controller('submissions')
export class SubmissionsController {
  constructor(
    private readonly submissionsService: SubmissionsService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile(new FileSizeValidationPipe()) file: Express.Multer.File,
    @Body() createSubmissionDto: CreateSubmissionDto,
  ) {
    try {
      await this.submissionsService.sendSubmissionEmail(
        file,
        createSubmissionDto,
      );
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
    return { message: 'Submission email sent' };
  }
}
