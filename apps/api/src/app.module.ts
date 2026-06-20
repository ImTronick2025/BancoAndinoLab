import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthController } from './health.controller';
import { ProjectsModule } from './projects/projects.module';
import { ProjectEntity } from './projects/entities/project.entity';
import { ModelObjectEntity } from './projects/entities/model-object.entity';
import { RelationshipEntity } from './projects/entities/relationship.entity';
import { ViewEntity } from './projects/entities/view.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DATABASE_HOST', 'localhost'),
        port: parseInt(config.get('DATABASE_PORT', '5432'), 10),
        username: config.get('DATABASE_USER', 'cap'),
        password: config.get('DATABASE_PASSWORD', 'cap'),
        database: config.get('DATABASE_NAME', 'cap'),
        entities: [
          ProjectEntity,
          ModelObjectEntity,
          RelationshipEntity,
          ViewEntity,
        ],
        synchronize: config.get('DATABASE_SYNCHRONIZE', 'true') === 'true',
      }),
    }),
    ProjectsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
