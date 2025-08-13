import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EmailsModule } from './emails/emails.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { SendgridModule } from './sendgrid/sendgrid.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
      ],
    }),
    AuthModule,
    UsersModule,
    PrismaModule,
    EmailsModule,
    SendgridModule,
    SubmissionsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
