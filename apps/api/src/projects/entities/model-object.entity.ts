import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type {
  CloudProvider,
  ModelObjectKind,
  Zone,
} from '@cap/model';
import { ProjectEntity } from './project.entity';

@Entity('model_objects')
export class ModelObjectEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @ManyToOne(() => ProjectEntity, (p) => p.objects, { onDelete: 'CASCADE' })
  project: ProjectEntity;

  @Column()
  kind: ModelObjectKind;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  provider?: CloudProvider;

  @Column({ nullable: true })
  resourceType?: string;

  @Column({ nullable: true })
  zone?: Zone;

  /** Self-reference enabling C4 drill-down (system -> container -> component). */
  @Column({ type: 'uuid', nullable: true })
  parentId?: string;

  @Column({ type: 'simple-array', nullable: true })
  tags?: string[];

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, string>;
}
