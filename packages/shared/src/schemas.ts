import { z } from "zod";

// ═══ Organization Schemas ═══

export const createOrgSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

export const updateOrgThemeSchema = z.object({
  logoUrl: z.string().url().nullable().optional(),
  faviconUrl: z.string().url().nullable().optional(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  bgColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  sidebarColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  fontFamily: z.string().min(1).max(50).optional(),
});

// ═══ Member Schemas ═══

export const inviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN", "MANAGER", "MEMBER", "VIEWER"]),
});

export const updateMemberSchema = z.object({
  role: z.enum(["OWNER", "ADMIN", "MANAGER", "MEMBER", "VIEWER"]).optional(),
  displayName: z.string().min(1).max(100).optional(),
  isActive: z.boolean().optional(),
});

// ═══ Department Schemas ═══

export const createDepartmentSchema = z.object({
  name: z.string().min(1).max(100),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  icon: z.string().max(50).optional(),
});

export const updateDepartmentSchema = createDepartmentSchema.partial();

// ═══ Process Schemas ═══

export const createProcessSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  icon: z.string().max(50).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  departmentId: z.string().optional(),
});

export const updateProcessSchema = createProcessSchema.partial().extend({
  flowNodes: z.any().optional(),
  flowEdges: z.any().optional(),
  isPublished: z.boolean().optional(),
});

export const createProcessStepSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  type: z.enum(["TASK", "APPROVAL", "NOTIFICATION", "CONDITION", "SUBPROCESS", "WAIT"]),
  order: z.number().int().min(0),
  defaultAssigneeRole: z.string().optional(),
  estimatedMinutes: z.number().int().positive().optional(),
  daysFromStart: z.number().int().min(0).optional(),
  isRequired: z.boolean().optional(),
  conditions: z.any().optional(),
  flowNodeId: z.string().optional(),
});

// ═══ Task Schemas ═══

export const createTaskSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().max(5000).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "BLOCKED", "DONE", "CANCELLED"]).optional(),
  priority: z.enum(["URGENT", "HIGH", "MEDIUM", "LOW"]).optional(),
  dueDate: z.string().datetime().optional(),
  assigneeId: z.string().optional(),
  parentId: z.string().optional(),
  labelIds: z.array(z.string()).optional(),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  order: z.number().int().min(0).optional(),
});

// ═══ Comment Schemas ═══

export const createCommentSchema = z.object({
  content: z.string().min(1).max(10000),
  taskId: z.string(),
  parentId: z.string().optional(),
});

// ═══ Label Schemas ═══

export const createLabelSchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

// ═══ Type Exports ═══

export type CreateOrgInput = z.infer<typeof createOrgSchema>;
export type UpdateOrgThemeInput = z.infer<typeof updateOrgThemeSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;
export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;
export type CreateProcessInput = z.infer<typeof createProcessSchema>;
export type UpdateProcessInput = z.infer<typeof updateProcessSchema>;
export type CreateProcessStepInput = z.infer<typeof createProcessStepSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type CreateLabelInput = z.infer<typeof createLabelSchema>;
