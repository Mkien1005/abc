import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Notification } from './entities/notification.entity';
import * as jwt from 'jsonwebtoken';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  transports: ['websocket'],
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private userSockets: Map<string, Socket[]> = new Map();

  handleConnection(client: Socket) {
    try {
      const accessToken = client.handshake.auth.accessToken;
      if (!accessToken) {
        client.disconnect();
        return;
      }
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY) as {
        sub: string;
      };

      if (!this.userSockets.has(decoded.sub)) {
        this.userSockets.set(decoded.sub, []);
      }
      this.userSockets.get(decoded.sub).push(client);
    } catch (error) {
      console.error('Connection error:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    try {
      const accessToken = client.handshake.auth.accessToken;
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY) as {
        sub: string;
      };
      const userId = decoded.sub;

      if (this.userSockets.has(userId)) {
        const sockets = this.userSockets.get(userId);
        const index = sockets.indexOf(client);
        if (index > -1) {
          sockets.splice(index, 1);
        }
        if (sockets.length === 0) {
          this.userSockets.delete(userId);
        }
      }
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  }

  async sendNotification(userId: string, notification: Notification) {
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      sockets.forEach((socket) => {
        socket.emit('newNotification', notification);
      });
    }
  }

  async sendUnreadCount(userId: string, count: number) {
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      sockets.forEach((socket) => {
        socket.emit('unreadCount', count);
      });
    }
  }
}
