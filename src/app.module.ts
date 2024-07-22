import { MessagesController } from './messages/messages.controller';
import { WebsocketModule } from './websocket/websocket.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ChatGateway } from './websocket/websocket.gateway';

@Module({
  imports: [
    WebsocketModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY, // Ensure this is set
      signOptions: { expiresIn: '60m' },
    }),
    PrismaModule, AuthModule, UserModule, PassportModule],
  controllers: [
    MessagesController, AppController],
  providers: [
    PrismaService, AppService,ChatGateway],
})
export class AppModule { }
