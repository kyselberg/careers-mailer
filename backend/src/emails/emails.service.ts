import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Email, User } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as crypto from 'node:crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Logger } from 'winston';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';

@Injectable()
export class EmailsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(createEmailDto: CreateEmailDto, user: User) {
    try {
      const { email, title } = createEmailDto;

      const emailExists = await this.prisma.email.findUnique({
        where: {
          email,
          userId: user.id,
        },
      });

      if (emailExists) {
        throw new BadRequestException('Email already exists');
      }

      const hash = crypto.randomBytes(32).toString('hex');

      await this.prisma.email.create({
        data: {
          email,
          title,
          hash,
          userId: user.id,
        },
      });

      return {
        message: 'Email created successfully',
      };
    } catch (error) {
      this.logger.error('Error in create method:', error);
      throw error;
    }
  }

  async findAll(user: User): Promise<Email[]> {
    try {
      return await this.prisma.email.findMany({
        where: {
          userId: user.id,
        },
      });
    } catch (error) {
      this.logger.error('Error in findAll method:', error);
      throw error;
    }
  }

  async findOne(id: string, user: User): Promise<Email> {
    try {
      const email = await this.prisma.email.findUnique({
        where: {
          id,
          userId: user.id,
        },
      });

      if (!email) {
        throw new NotFoundException('Email not found');
      }

      return email;
    } catch (error) {
      this.logger.error('Error in findOne method:', error);
      throw error;
    }
  }

  async update(id: string, updateEmailDto: UpdateEmailDto, user: User) {
    try {
      const { email, title } = updateEmailDto;

      const emailExists = await this.prisma.email.findUnique({
        where: {
          email,
          userId: user.id,
        },
      });

      if (!emailExists) {
        throw new NotFoundException('Email not found');
      }

      return await this.prisma.email.update({
        where: {
          id,
          userId: user.id,
        },
        data: {
          email,
          title,
        },
      });
    } catch (error) {
      this.logger.error('Error in update method:', error);
      throw error;
    }
  }

  async remove(id: string, user: User) {
    try {
      const email = await this.prisma.email.findUnique({
        where: {
          id,
          userId: user.id,
        },
      });

      if (!email) {
        throw new NotFoundException('Email not found');
      }

      return await this.prisma.email.delete({
        where: {
          id,
          userId: user.id,
        },
      });
    } catch (error) {
      this.logger.error('Error in remove method:', error);
      throw error;
    }
  }

  async getEmailByFormId(formId: string) {
    try {
      const email = await this.prisma.email.findUnique({
        where: {
          hash: formId,
        },
      });

      if (!email) {
        throw new NotFoundException('Email not found');
      }

      return email.email;
    } catch (error) {
      this.logger.error('Error in getEmailByFormId method:', error);
      throw error;
    }
  }

  async getEmailPositionTitle(formId: string) {
    try {
      const email = await this.prisma.email.findUnique({
        where: {
          hash: formId,
        },
      });

      if (!email) {
        throw new NotFoundException('Email not found');
      }

      return email.title;
    } catch (error) {
      this.logger.error('Error in getEmailPositionTitle method:', error);
      throw error;
    }
  }
}
