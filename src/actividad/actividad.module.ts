import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActividadEntity } from './actividad.entity';
import { ActividadService } from './actividad.service';
import { ActividadController } from './actividad.controller';
import { EstudianteEntity } from '../estudiante/estudiante.entity';
import { ResenaEntity } from '../resena/resena.entity';
import { EstudianteModule } from '../estudiante/estudiante.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([ActividadEntity, EstudianteEntity, ResenaEntity]),
    EstudianteModule 
  ],
  controllers: [ActividadController],
  providers: [ActividadService],
  exports: [ActividadService]
})
export class ActividadModule {}