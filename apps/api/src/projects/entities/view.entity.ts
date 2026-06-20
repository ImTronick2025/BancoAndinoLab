import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { ViewNode, ViewType } from '@cap/model';
import { ProjectEntity } from './project.entity';

@Entity('views')
export class ViewEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @ManyToOne(() => ProjectEntity, (p) => p.views, { onDelete: 'CASCADE' })
  project: ProjectEntity;

  @Column()
  type: ViewType;

  @Column()
  name: string;

  /** For drill-down views, the model object this view expands. */
  @Column({ type: 'uuid', nullable: true })
  scopeObjectId?: string;

  /** Per-view placement & style of referenced model objects. */
  @Column({ type: 'jsonb', default: () => "'[]'" })
  nodes: ViewNode[];
}
