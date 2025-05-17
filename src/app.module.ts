import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteEntity } from './estudiante/estudiante.entity';
import { ActividadEntity } from './actividad/actividad.entity';
import { ResenaEntity } from './resena/resena.entity';
import { EstudianteModule } from './estudiante/estudiante.module';
import { ActividadModule } from './actividad/actividad.module';
import { ResenaModule } from './resena/resena.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'parcial_2',
      entities: [EstudianteEntity, ActividadEntity, ResenaEntity],
      dropSchema: true,
      synchronize: true
    }),
    EstudianteModule,
    ActividadModule,
    ResenaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}