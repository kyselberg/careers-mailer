import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Email, User } from '@prisma/client';
import * as crypto from 'node:crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';

@Injectable()
export class EmailsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEmailDto: CreateEmailDto, user: User) {
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
  }

  async findAll(user: User): Promise<Email[]> {
    return await this.prisma.email.findMany({
      where: {
        userId: user.id,
      },
    });
  }

  async findOne(id: string, user: User): Promise<Email> {
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
  }

  async update(id: string, updateEmailDto: UpdateEmailDto, user: User) {
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
  }

  async remove(id: string, user: User) {
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
  }
}
