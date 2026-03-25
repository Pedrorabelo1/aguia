export const MEMBER_ROLES = ["OWNER", "ADMIN", "MANAGER", "MEMBER", "VIEWER"] as const;
export type MemberRole = (typeof MEMBER_ROLES)[number];

export const TASK_STATUSES = ["TODO", "IN_PROGRESS", "IN_REVIEW", "BLOCKED", "DONE", "CANCELLED"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const PRIORITIES = ["URGENT", "HIGH", "MEDIUM", "LOW"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const STEP_TYPES = ["TASK", "APPROVAL", "NOTIFICATION", "CONDITION", "SUBPROCESS", "WAIT"] as const;
export type StepType = (typeof STEP_TYPES)[number];

export const INSTANCE_STATUSES = ["ACTIVE", "PAUSED", "COMPLETED", "CANCELLED"] as const;
export type InstanceStatus = (typeof INSTANCE_STATUSES)[number];

export const PLAN_TYPES = ["STARTER", "BUSINESS", "ENTERPRISE"] as const;
export type PlanType = (typeof PLAN_TYPES)[number];

// Permission matrix
export const PERMISSIONS = {
  "org:settings": ["OWNER", "ADMIN"],
  "org:members": ["OWNER", "ADMIN"],
  "process:create": ["OWNER", "ADMIN", "MANAGER"],
  "process:edit": ["OWNER", "ADMIN", "MANAGER"],
  "process:activate": ["OWNER", "ADMIN", "MANAGER"],
  "task:create": ["OWNER", "ADMIN", "MANAGER", "MEMBER"],
  "task:edit": ["OWNER", "ADMIN", "MANAGER", "MEMBER"],
  "comment:create": ["OWNER", "ADMIN", "MANAGER", "MEMBER"],
  "view:all": ["OWNER", "ADMIN", "MANAGER", "MEMBER", "VIEWER"],
  "view:radar": ["OWNER", "ADMIN", "MANAGER"],
} as const;

export type PermissionAction = keyof typeof PERMISSIONS;

export function hasPermission(role: MemberRole, action: PermissionAction): boolean {
  return (PERMISSIONS[action] as readonly string[]).includes(role);
}

// Socket events
export const SOCKET_EVENTS = {
  TASK_CREATED: "task:created",
  TASK_UPDATED: "task:updated",
  TASK_DELETED: "task:deleted",
  TASK_MOVED: "task:moved",
  TASK_COMMENTED: "task:commented",
  PROCESS_ACTIVATED: "process:activated",
  PROCESS_UPDATED: "process:updated",
  PROCESS_COMPLETED: "process:completed",
  MEMBER_JOINED: "member:joined",
  MEMBER_UPDATED: "member:updated",
  NOTIFICATION_NEW: "notification:new",
} as const;

// Default theme
export const DEFAULT_THEME = {
  primaryColor: "#3B82F6",
  secondaryColor: "#1E40AF",
  accentColor: "#F59E0B",
  bgColor: "#FFFFFF",
  sidebarColor: "#1E293B",
  fontFamily: "Inter",
} as const;

// Google Fonts available
export const AVAILABLE_FONTS = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Montserrat",
  "Poppins",
  "Lato",
  "Nunito",
  "Raleway",
  "Source Sans Pro",
  "PT Sans",
] as const;
