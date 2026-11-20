import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { RbacService } from './rbac.service.js';

type AuthedRequest = Request & {
  user?: { id: string; email?: string; roles?: string[] };
};

@Controller('rbac')
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  @Get('roles')
  listRoles() {
    return this.rbacService.listRoles();
  }

  @Post('roles')
  createRole(@Body() body: { code: string; name: string; isSystem?: boolean }) {
    return this.rbacService.createRole(body.code, body.name, body.isSystem);
  }

  @Put('roles/:id')
  updateRole(
    @Param('id') id: string,
    @Body() body: { name?: string; isSystem?: boolean },
  ) {
    return this.rbacService.updateRole(id, body);
  }

  @Delete('roles/:id')
  deleteRole(@Param('id') id: string) {
    return this.rbacService.deleteRole(id);
  }

  @Post('users/:id/roles')
  assignRole(
    @Param('id') userId: string,
    @Body() body: { roleId: string },
    @Req() req: AuthedRequest,
  ) {
    const assignedBy = (req.user as { id: string }).id;
    return this.rbacService.assignRoleToUser(userId, body.roleId, assignedBy);
  }

  @Get('resolve')
  resolve(@Req() req: AuthedRequest) {
    const user = req.user as { id: string };
    return this.rbacService.resolvePermissions(user.id);
  }
}
