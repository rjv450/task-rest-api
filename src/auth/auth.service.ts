import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && bcrypt.compareSync(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(data: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !bcrypt.compareSync(data.password, user.password)) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Handle existing sessions
    await this.prisma.session.deleteMany({ where: { userId: user.id } });

    const payload = { username: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: '60m',
    });

    // Create new session
    await this.prisma.session.create({
      data: {
        userId: user.id,
        socketId: '', // The socketId will be updated on WebSocket connection
      },
    });

    return {
      access_token: accessToken,
    };
  }

  async register(data: { email: string; password: string }) {
    // Check if the email already exists
    const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Create new user
    const hashedPassword = bcrypt.hashSync(data.password, 8);
    const newUser = await this.prisma.user.create({
      data: { email: data.email, password: hashedPassword },
    });
    return newUser;
  }

  async logout(userId: number) {
    await this.prisma.session.deleteMany({ where: { userId } });
  }
}
