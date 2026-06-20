import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectEntity } from './project.entity';

@Entity('relationships')
export class RelationshipEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @ManyToOne(() => ProjectEntity, (p) => p.relationships, {
    onDelete: 'CASCADE',
  })
  project: ProjectEntity;

  @Column({ type: 'uuid' })
  sourceId: string;

  @Column({ type: 'uuid' })
  targetId: string;

  @Column({ nullable: true })
  label?: string;

  @Column({ nullable: true })
  technology?: string;

  @Column({ nullable: true })
  protocol?: string;
}
