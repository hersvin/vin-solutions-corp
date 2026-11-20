import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Project, ProjectStatus } from '../../entities/project.entity.js';
import { ProjectMember } from '../../entities/project_member.entity.js';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(ProjectMember)
    private readonly memberRepo: Repository<ProjectMember>,
  ) {}

  async createProject(body: {
    companyId: string;
    name: string;
    code?: string;
    ownerUserId: string;
    description?: string;
    startDate?: string;
    dueDate?: string;
    budgetRef?: string;
    workspaceId?: string;
    visibility?: string;
  }): Promise<Project> {
    const project = this.projectRepo.create({
      companyId: body.companyId,
      name: body.name,
      code: body.code ?? null,
      ownerUserId: body.ownerUserId,
      description: body.description ?? null,
      startDate: body.startDate ?? null,
      dueDate: body.dueDate ?? null,
      budgetRef: body.budgetRef ?? null,
      workspaceId: body.workspaceId ?? null,
    });
    return this.projectRepo.save(project);
  }

  async listProjects(companyId?: string): Promise<Project[]> {
    return this.projectRepo.find({
      where: { ...(companyId ? { companyId } : {}), deletedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }

  async addMember(
    projectId: string,
    userId: string,
    role?: string,
  ): Promise<ProjectMember> {
    await this.findOrThrow(projectId);
    const member = this.memberRepo.create({
      projectId,
      userId,
      role: role ?? null,
      grantedAt: new Date(),
    });
    return this.memberRepo.save(member);
  }

  async updateStatus(projectId: string, status: ProjectStatus): Promise<Project> {
    const project = await this.findOrThrow(projectId);
    project.status = status;
    return this.projectRepo.save(project);
  }

  async findOrThrow(id: string): Promise<Project> {
    const project = await this.projectRepo.findOne({ where: { id, deletedAt: IsNull() } });
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return project;
  }
}
