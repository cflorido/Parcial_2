import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResenaEntity } from './resena.entity';
import { ActividadEntity } from '../actividad/actividad.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity';

@Injectable()
export class ResenaService {
    constructor(
        @InjectRepository(ResenaEntity)
        private resenaRepository: Repository<ResenaEntity>,
        @InjectRepository(ActividadEntity)
        private actividadRepository: Repository<ActividadEntity>,
        @InjectRepository(EstudianteEntity)
        private estudianteRepository: Repository<EstudianteEntity>,
    ) {}

    async agregarResena(estudianteId: number, actividadId: number, data: Partial<ResenaEntity>): Promise<ResenaEntity> {
        //Sacar la actividad 
        const actividad = await this.actividadRepository.findOne({ where: { id: actividadId }, relations: ['estudiantes', 'resenas'] });
    
        if (!actividad){
            throw new NotFoundException('No se ha encontrado la actividad');
        }
 
        if (actividad.estado !== 2) {
            throw new BadRequestException('La actividad ya finalizo');
        }

        const inscrito = actividad.estudiantes.some(estudiante => estudiante.id === estudianteId);
        if (!inscrito) {
            throw new BadRequestException('El estudiante no estaba inscrito');
        }
        
        const estudiante = await this.estudianteRepository.findOne({ where: { id: estudianteId } });
        if (!estudiante) throw new NotFoundException('No se ha encontrado al estudiante');


        const resena = this.resenaRepository.create({...data, estudiante,actividad});
        return this.resenaRepository.save(resena);
    }
}