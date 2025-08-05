import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Email, User } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { EmailsService } from './emails.service';

@Controller('emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Post()
  async create(
    @CurrentUser() user: User,
    @Body() createEmailDto: CreateEmailDto,
  ) {
    return await this.emailsService.create(createEmailDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@CurrentUser() user: User): Promise<Email[]> {
    return await this.emailsService.findAll(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return await this.emailsService.findOne(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateEmailDto: UpdateEmailDto,
  ) {
    return await this.emailsService.update(id, updateEmailDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@CurrentUser() user: User, @Param('id') id: string) {
    return await this.emailsService.remove(id, user);
  }
}
