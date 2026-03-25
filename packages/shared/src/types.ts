// Shared types used across frontend and backend

export interface OrgTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgColor: string;
  sidebarColor: string;
  fontFamily: string;
  logoUrl: string | null;
  faviconUrl: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  hasMore: boolean;
  cursor?: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

export interface SocketPayload<T = unknown> {
  orgId: string;
  data: T;
  memberId: string;
  timestamp: string;
}
