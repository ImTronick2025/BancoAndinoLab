import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { CloudProvider } from '@cap/model';
import { ModelObjectEntity } from './model-object.entity';
import { RelationshipEntity } from './relationship.entity';
import { ViewEntity } from './view.entity';

@Entity('projects')
export class ProjectEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // TODO(Fase 4): link to a real Organization entity once auth lands.
  @Column({ type: 'uuid', nullable: true })
  organizationId: string | null;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: 'azure' })
  provider: CloudProvider;

  @OneToMany(() => ModelObjectEntity, (o) => o.project, { cascade: true })
  objects: ModelObjectEntity[];

  @OneToMany(() => RelationshipEntity, (r) => r.project, { cascade: true })
  relationships: RelationshipEntity[];

  @OneToMany(() => ViewEntity, (v) => v.project, { cascade: true })
  views: ViewEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
