import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteEntity } from './estudiante.entity';
import { ActividadEntity } from '../actividad/actividad.entity';
import { ResenaEntity } from '../resena/resena.entity';
import { EstudianteService } from './estudiante.service';
import { EstudianteController } from './estudiante.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([EstudianteEntity, ActividadEntity, ResenaEntity])
  ],
  controllers: [EstudianteController], 
  providers: [EstudianteService],
  exports: [EstudianteService]
})
export class EstudianteModule {}