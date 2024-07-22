import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@WebSocketGateway({
  cors: {
    origin: '*', // Update this to restrict allowed origins
    methods: ['GET', 'POST'],
    allowedHeaders: ['authorization'],
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService
  ) {}

  async handleConnection(socket: Socket) {
    console.log('Client connected:', socket.id);

    const token = socket.handshake.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        console.log('Token received:', token);
        const payload = this.jwtService.verify(token);
        const userId = payload.sub;
        console.log('Payload:', payload);

        // Handle existing session
        const existingSession = await this.prismaService.findSessionByUser(userId);
        if (existingSession) {
          console.log('Existing session found:', existingSession);
          this.server.sockets.sockets.get(existingSession.socketId)?.disconnect();
          await this.prismaService.deleteSession(existingSession.socketId);
        }

        // Create new session
        console.log('Creating new session for:', userId);
        await this.prismaService.updateSession(userId, socket.id);
      } catch (error) {
        console.error('Error verifying token:', error);
        socket.disconnect();
      }
    } else {
      console.log('No token provided');
      socket.disconnect();
    }
  }

  async handleDisconnect(socket: Socket) {
    console.log('Client disconnected:', socket.id);
    await this.prismaService.deleteSession(socket.id);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: { content: string }, @ConnectedSocket() socket: Socket) {
    console.log('Message received:', data);
    this.server.emit('message', data);
  }
}
