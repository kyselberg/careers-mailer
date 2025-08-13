import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { UsersService } from 'src/users/users.service';
import { Logger } from 'winston';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<{ email: string; id: string } | null> {
    try {
      const user = await this.usersService.findOne(email);

      if (user && (await bcrypt.compare(password, user.password))) {
        return { email: user.email, id: user.id };
      }

      return null;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  login(user: { email: string; id: string }) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    try {
      const { email, password } = registerDto;

      await this.usersService.create(email, password);

      return {
        message: 'User created successfully',
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
