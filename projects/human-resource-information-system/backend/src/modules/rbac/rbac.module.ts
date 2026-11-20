import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../../entities/role.entity.js';
import { RolePermission } from '../../entities/role_permission.entity.js';
import { EntityScope } from '../../entities/entity_scope.entity.js';
import { DataMaskRule } from '../../entities/data_mask_rule.entity.js';
import { UserRole } from '../../entities/user_role.entity.js';
import { RbacController } from './rbac.controller.js';
import { RbacService } from './rbac.service.js';
import { ScopingGuard } from '../../common/guards/scoping.guard.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, RolePermission, EntityScope, DataMaskRule, UserRole]),
  ],
  controllers: [RbacController],
  providers: [RbacService, ScopingGuard],
  exports: [RbacService, ScopingGuard],
})
export class RbacModule {}
