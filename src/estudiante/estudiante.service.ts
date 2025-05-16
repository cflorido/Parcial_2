import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstudianteEntity } from './estudiante.entity';
import { ActividadEntity } from '../actividad/actividad.entity';

@Injectable()
export class EstudianteService {
    constructor(
        @InjectRepository(EstudianteEntity)
        private estudianteRepository: Repository<EstudianteEntity>,
        @InjectRepository(ActividadEntity)
        private actividadRepository: Repository<ActividadEntity>,
    ) {}



    async crearEstudiante(data: Partial<EstudianteEntity>): Promise<EstudianteEntity> {
        
        //Para manejar correoooo....

        const emailFormato = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.correo || !emailFormato.test(data.correo)) {
            throw new BadRequestException('se tiene un correo invalido');
        }

        //y semestre debe estar entre 1 y 10
        if (typeof data.semestre !== 'number' || data.semestre < 1 || data.semestre > 10) {
            throw new BadRequestException('el semeste debe estar entre 1 y 10 ');
        }


        const estudiante = this.estudianteRepository.create(data);
        return this.estudianteRepository.save(estudiante);
    }

    async findEstudianteById(id: number): Promise<EstudianteEntity> {
        const estudiante = await this.estudianteRepository.findOne({ where: { id }, relations: ['actividades', 'resenas'] });
        if (!estudiante) {
            throw new NotFoundException('No se ha encontrado al estudiante ');
        }
        return estudiante;
    }

    async inscribirseActividad(estudianteID: number, actividadID: number): Promise<string> {

        //----------------------------------
        const estudiante = await this.estudianteRepository.findOne({ where: { id: estudianteID }, relations: ['actividades'] });
        if (!estudiante) throw new NotFoundException('no se encontro el estudiante ');

        const actividad = await this.actividadRepository.findOne({ where: { id: actividadID }, relations: ['estudiantes'] });
        if (!actividad) throw new NotFoundException('no se encontro la actividad');

        //----------------------------------
        if (actividad.estudiantes.length >= actividad.cupoMaximo) {
            throw new BadRequestException('sin cupos');
        }
        if (actividad.estado !== 0) {
            throw new BadRequestException('actividad no disponible');
        }
        if (actividad.estudiantes.some(estudiante  => estudiante.id === estudianteID)) {
            throw new BadRequestException('El estudiante no se puede incribir');
        }

        

        actividad.estudiantes.push(estudiante);
        await this.actividadRepository.save(actividad);
        return 'Se ha incrito al estudiante a la actividad';
    }
}