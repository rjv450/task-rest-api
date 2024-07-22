import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createMessage(@Body() body: { content: string }, @Req() req) {
    const userId = req.user.userId;
    return this.prisma.createMessage(userId, body.content);
  }
}
