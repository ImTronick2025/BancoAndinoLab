import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ProjectEntity } from './entities/project.entity';
import { ModelObjectEntity } from './entities/model-object.entity';
import { RelationshipEntity } from './entities/relationship.entity';
import { ViewEntity } from './entities/view.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectEntity,
      ModelObjectEntity,
      RelationshipEntity,
      ViewEntity,
    ]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
