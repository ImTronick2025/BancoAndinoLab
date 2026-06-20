import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { ArchitectureModel } from '@cap/model';
import { ProjectEntity } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projects: Repository<ProjectEntity>,
  ) {}

  findAll(): Promise<ProjectEntity[]> {
    return this.projects.find();
  }

  async findOne(id: string): Promise<ProjectEntity> {
    const project = await this.projects.findOne({
      where: { id },
      relations: { objects: true, relationships: true, views: true },
    });
    if (!project) {
      throw new NotFoundException(`Project ${id} not found`);
    }
    return project;
  }

  create(dto: CreateProjectDto): Promise<ProjectEntity> {
    const project = this.projects.create({
      name: dto.name,
      description: dto.description,
      provider: dto.provider ?? 'azure',
    });
    return this.projects.save(project);
  }

  async remove(id: string): Promise<void> {
    const result = await this.projects.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Project ${id} not found`);
    }
  }

  /** Export the full architecture model as a diagram-as-code document. */
  async exportModel(id: string): Promise<ArchitectureModel> {
    const project = await this.findOne(id);
    return {
      project: {
        id: project.id,
        organizationId: project.organizationId ?? '',
        name: project.name,
        description: project.description,
        provider: project.provider,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
      },
      objects: project.objects.map((o) => ({
        id: o.id,
        projectId: project.id,
        kind: o.kind,
        name: o.name,
        description: o.description,
        provider: o.provider,
        resourceType: o.resourceType,
        zone: o.zone,
        parentId: o.parentId,
        tags: o.tags,
        metadata: o.metadata,
      })),
      relationships: project.relationships.map((r) => ({
        id: r.id,
        projectId: project.id,
        sourceId: r.sourceId,
        targetId: r.targetId,
        label: r.label,
        technology: r.technology,
        protocol: r.protocol,
      })),
      views: project.views.map((v) => ({
        id: v.id,
        projectId: project.id,
        type: v.type,
        name: v.name,
        scopeObjectId: v.scopeObjectId,
        nodes: v.nodes,
      })),
    };
  }
}
