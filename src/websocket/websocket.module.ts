import { Module } from '@nestjs/common';
import { ChatGateway } from './websocket.gateway';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessagesController } from 'src/messages/messages.controller';

@Module({
  imports:[    JwtModule.register({
    secret: process.env.JWT_SECRET_KEY, // Ensure this is set
    signOptions: { expiresIn: '60m' },
  }),],
  controllers:[MessagesController],
  providers: [ChatGateway,JwtService,PrismaService],
})
export class WebsocketModule {}
