import { Injectable } from '@nestjs/common';
import { PrismaClient, Session, User, Message } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super();
  }

  // Create a new message
  async createMessage(userId: number, content: string): Promise<Message> {
    return this.message.create({
      data: {
        content,
        userId,
      },
    });
  }

  // Retrieve all messages with user information
  async getMessages(): Promise<Message[]> {
    return this.message.findMany({
      include: {
        user: true, // Include user information with each message
      },
    });
  }

  // Create a new session
  async createSession(userId: number, socketId: string): Promise<Session> {
    return this.session.create({
      data: {
        userId,
        socketId,
      },
    });
  }

  // Update existing session with new socketId
  async updateSession(userId: number, socketId: string): Promise<void> {
    await this.session.updateMany({
      where: { userId },
      data: { socketId },
    });
  }

  // Delete session by socketId
  async deleteSession(socketId: string): Promise<void> {
    await this.session.deleteMany({
      where: { socketId },
    });
  }

  // Find session by userId
  async findSessionByUser(userId: number): Promise<Session | null> {
    return this.session.findFirst({
      where: { userId },
    });
  }
}
