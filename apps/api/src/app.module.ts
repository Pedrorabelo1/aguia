import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { AuthMiddleware } from "./auth/auth.middleware";
import { OrgModule } from "./org/org.module";
import { MemberModule } from "./member/member.module";
import { ProcessModule } from "./process/process.module";
import { TaskModule } from "./task/task.module";
import { CommentModule } from "./comment/comment.module";
import { NotificationModule } from "./notification/notification.module";
import { LabelModule } from "./label/label.module";
import { DepartmentModule } from "./department/department.module";
import { SocketModule } from "./socket/socket.module";

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    OrgModule,
    MemberModule,
    ProcessModule,
    TaskModule,
    CommentModule,
    NotificationModule,
    LabelModule,
    DepartmentModule,
    SocketModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply auth middleware to all org-scoped routes
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        "orgs/:orgId/members*",
        "orgs/:orgId/processes*",
        "orgs/:orgId/tasks*",
        "orgs/:orgId/comments*",
        "orgs/:orgId/notifications*",
        "orgs/:orgId/labels*",
        "orgs/:orgId/departments*",
      );
  }
}
