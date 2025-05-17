import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResenaEntity } from './resena.entity';
import { ActividadEntity } from '../actividad/actividad.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity';
import { ResenaService } from './resena.service';
import { ResenaController } from './resena.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResenaEntity, ActividadEntity, EstudianteEntity])
  ],
  controllers: [ResenaController], 
  providers: [ResenaService],
  exports: [ResenaService]
})
export class ResenaModule {}