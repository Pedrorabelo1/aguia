import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { SOCKET_EVENTS } from "@aguia/shared";
import type { SocketPayload } from "@aguia/shared";

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  },
  namespace: "/ws",
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger("SocketGateway");

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("join:org")
  handleJoinOrg(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { orgId: string },
  ) {
    if (data.orgId) {
      client.join(`org:${data.orgId}`);
      this.logger.log(`Client ${client.id} joined org:${data.orgId}`);
    }
  }

  @SubscribeMessage("leave:org")
  handleLeaveOrg(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { orgId: string },
  ) {
    if (data.orgId) {
      client.leave(`org:${data.orgId}`);
      this.logger.log(`Client ${client.id} left org:${data.orgId}`);
    }
  }

  // ---- Emit helpers (called from services) ----

  emitToOrg<T>(orgId: string, event: string, payload: SocketPayload<T>) {
    this.server.to(`org:${orgId}`).emit(event, payload);
  }

  emitTaskCreated<T>(orgId: string, payload: SocketPayload<T>) {
    this.emitToOrg(orgId, SOCKET_EVENTS.TASK_CREATED, payload);
  }

  emitTaskUpdated<T>(orgId: string, payload: SocketPayload<T>) {
    this.emitToOrg(orgId, SOCKET_EVENTS.TASK_UPDATED, payload);
  }

  emitTaskDeleted<T>(orgId: string, payload: SocketPayload<T>) {
    this.emitToOrg(orgId, SOCKET_EVENTS.TASK_DELETED, payload);
  }

  emitTaskMoved<T>(orgId: string, payload: SocketPayload<T>) {
    this.emitToOrg(orgId, SOCKET_EVENTS.TASK_MOVED, payload);
  }

  emitTaskCommented<T>(orgId: string, payload: SocketPayload<T>) {
    this.emitToOrg(orgId, SOCKET_EVENTS.TASK_COMMENTED, payload);
  }

  emitProcessActivated<T>(orgId: string, payload: SocketPayload<T>) {
    this.emitToOrg(orgId, SOCKET_EVENTS.PROCESS_ACTIVATED, payload);
  }

  emitProcessUpdated<T>(orgId: string, payload: SocketPayload<T>) {
    this.emitToOrg(orgId, SOCKET_EVENTS.PROCESS_UPDATED, payload);
  }

  emitProcessCompleted<T>(orgId: string, payload: SocketPayload<T>) {
    this.emitToOrg(orgId, SOCKET_EVENTS.PROCESS_COMPLETED, payload);
  }

  emitMemberJoined<T>(orgId: string, payload: SocketPayload<T>) {
    this.emitToOrg(orgId, SOCKET_EVENTS.MEMBER_JOINED, payload);
  }

  emitMemberUpdated<T>(orgId: string, payload: SocketPayload<T>) {
    this.emitToOrg(orgId, SOCKET_EVENTS.MEMBER_UPDATED, payload);
  }

  emitNotification<T>(orgId: string, payload: SocketPayload<T>) {
    this.emitToOrg(orgId, SOCKET_EVENTS.NOTIFICATION_NEW, payload);
  }
}
