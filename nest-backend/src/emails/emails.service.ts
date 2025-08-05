import { BadRequestException, Injectable } from '@nestjs/common';
import * as crypto from 'node:crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';

@Injectable()
export class EmailsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEmailDto: CreateEmailDto) {
    const { email, title } = createEmailDto;

    const emailExists = await this.prisma.email.findUnique({
      where: {
        email,
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
        userId: '1',
      },
    });

    return {
      message: 'Email created successfully',
    };
  }

  findAll() {
    return `This action returns all emails`;
  }

  findOne(id: number) {
    return `This action returns a #${id} email`;
  }

  update(id: number, updateEmailDto: UpdateEmailDto) {
    return `This action updates a #${id} email`;
  }

  remove(id: number) {
    return `This action removes a #${id} email`;
  }
}
