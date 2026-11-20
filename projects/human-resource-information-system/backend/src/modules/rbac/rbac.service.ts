import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../entities/role.entity.js';
import { RolePermission } from '../../entities/role_permission.entity.js';
import { EntityScope } from '../../entities/entity_scope.entity.js';
import { DataMaskRule } from '../../entities/data_mask_rule.entity.js';
import { UserRole } from '../../entities/user_role.entity.js';

export interface ResolvedPermissions {
  actions: string[];
  fieldMasks: Record<string, string>;
  scopes: Array<{ scopeType: string; entityId: string }>;
}

@Injectable()
export class RbacService {
  constructor(
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    @InjectRepository(RolePermission) private readonly permRepo: Repository<RolePermission>,
    @InjectRepository(EntityScope) private readonly scopeRepo: Repository<EntityScope>,
    @InjectRepository(DataMaskRule) private readonly maskRepo: Repository<DataMaskRule>,
    @InjectRepository(UserRole) private readonly userRoleRepo: Repository<UserRole>,
  ) {}

  async createRole(code: string, name: string, isSystem = false): Promise<Role> {
    const role = this.roleRepo.create({ code, name, isSystem });
    return this.roleRepo.save(role);
  }

  async deleteRole(id: string): Promise<void> {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (role) await this.roleRepo.remove(role);
  }

  async updateRole(id: string, updates: Partial<Role>): Promise<Role> {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) throw new Error(`Role ${id} not found`);
    Object.assign(role, updates);
    return this.roleRepo.save(role);
  }

  async listRoles(): Promise<Role[]> {
    return this.roleRepo.find();
  }

  async assignRoleToUser(userId: string, roleId: string, assignedBy: string): Promise<void> {
    const userRole = this.userRoleRepo.create({
      userId,
      roleId,
      grantedAt: new Date(),
      assignedBy,
    });
    await this.userRoleRepo.save(userRole);
  }

  async resolvePermissions(userId: string): Promise<ResolvedPermissions> {
    const userRoles = await this.userRoleRepo.find({ where: { userId } });
    const roleIds = userRoles.map((ur) => ur.roleId);
    const permissions = await this.permRepo
      .createQueryBuilder('p')
      .where('p.role_id IN (:...roleIds)', { roleIds })
      .getMany();
    const scopes = await this.scopeRepo.find({ where: { userId } });
    const masks = await this.maskRepo.find();

    const actions: string[] = [];
    const fieldMasks: Record<string, string> = {};

    for (const perm of permissions) {
      actions.push(`${perm.resourceCode}:${perm.action}`);
      if (perm.fieldMask) {
        for (const [field, mask] of Object.entries(perm.fieldMask)) {
          fieldMasks[field] = mask;
        }
      }
    }

    const maskRules = masks.filter(
      (m) => m.roles.some((r) => roleIds.includes(r)),
    );
    for (const m of maskRules) {
      fieldMasks[m.fieldName] = m.maskType;
    }

    return {
      actions,
      fieldMasks,
      scopes: scopes.map((s) => ({ scopeType: s.scopeType, entityId: s.entityId })),
    };
  }
}
