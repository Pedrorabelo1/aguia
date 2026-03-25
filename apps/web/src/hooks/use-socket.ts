"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { SOCKET_EVENTS } from "@aguia/shared";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

export function useSocket(orgId: string) {
  const socketRef = useRef<Socket | null>(null);
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    let socket: Socket;

    const connect = async () => {
      const token = await getToken();

      socket = io(SOCKET_URL, {
        auth: { token },
        query: { orgId },
        transports: ["websocket"],
      });

      socket.on("connect", () => {
        console.log("Socket connected");
        socket.emit("join:org", orgId);
      });

      socket.on(SOCKET_EVENTS.TASK_CREATED, () => {
        queryClient.invalidateQueries({ queryKey: ["tasks", orgId] });
      });

      socket.on(SOCKET_EVENTS.TASK_UPDATED, () => {
        queryClient.invalidateQueries({ queryKey: ["tasks", orgId] });
      });

      socket.on(SOCKET_EVENTS.TASK_DELETED, () => {
        queryClient.invalidateQueries({ queryKey: ["tasks", orgId] });
      });

      socket.on(SOCKET_EVENTS.TASK_MOVED, () => {
        queryClient.invalidateQueries({ queryKey: ["tasks", orgId] });
      });

      socket.on(SOCKET_EVENTS.TASK_COMMENTED, () => {
        queryClient.invalidateQueries({ queryKey: ["tasks", orgId] });
      });

      socket.on(SOCKET_EVENTS.PROCESS_ACTIVATED, () => {
        queryClient.invalidateQueries({ queryKey: ["processes", orgId] });
      });

      socket.on(SOCKET_EVENTS.PROCESS_COMPLETED, () => {
        queryClient.invalidateQueries({ queryKey: ["processes", orgId] });
      });

      socket.on(SOCKET_EVENTS.NOTIFICATION_NEW, () => {
        queryClient.invalidateQueries({ queryKey: ["notifications", orgId] });
      });

      socketRef.current = socket;
    };

    connect();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [orgId, getToken, queryClient]);

  return socketRef;
}
