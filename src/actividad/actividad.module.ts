import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActividadEntity } from './actividad.entity';
import { ActividadService } from './actividad.service';
import { ActividadController } from './actividad.controller';
import { EstudianteEntity } from '../estudiante/estudiante.entity';
import { ResenaEntity } from '../resena/resena.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ActividadEntity, EstudianteEntity, ResenaEntity])
  ],
  controllers: [ActividadController],
  providers: [ActividadService],
  exports: [ActividadService]
})
export class ActividadModule {}