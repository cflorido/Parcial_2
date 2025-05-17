import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActividadEntity } from './actividad.entity';

@Injectable()
export class ActividadService {
    constructor(
        @InjectRepository(ActividadEntity)
        private actividadRepository: Repository<ActividadEntity>,
    ) {}

    async crearActividad(data: Partial<ActividadEntity>): Promise<ActividadEntity> {


        if (!data.titulo || data.titulo.length < 15) {
            throw new BadRequestException('El titulo debe tener por lo menos 15 letras');
        }

        // Aqui no debe tener un titulo con simbolos AAAA
        const simbolosRegex = /[^a-zA-Z0-9\s]/;
        if (simbolosRegex.test(data.titulo)) {
            throw new BadRequestException('El titulo no puede contener simbolos');
        }

        //Decision de diseño: En este caso se decidio que el estado de la actividad se inicializa en 0
        const actividad = this.actividadRepository.create({...data, estado: 0 });
        return this.actividadRepository.save(actividad);

    }


    async cambiarEstado(actividadID: number, estado: number): Promise<ActividadEntity> {

        const actividad = await this.actividadRepository.findOne({ where: { id: actividadID }, relations: ['estudiantes', 'resenas'] });
        
        if (!actividad) {
            throw new NotFoundException('No se encontro la ectividad');
        }


        if (![0, 1, 2].includes(estado)) {
            throw new BadRequestException('Se tiene un estado invalido');
        }
        //0(abierta), 1(Cerrada), 2(Finalizada)

        if (estado === 1) {
            if (actividad.estudiantes.length < Math.ceil(actividad.cupoMaximo * 0.8)) {
                throw new BadRequestException('Hay un error: el 80% del cupo debe estar está lleno');
            }
        }

        //Para que se de como finaliwzada en este caso me dice que la cantidad de estudiantes debe ser igial al cupo maximo 
        if (estado === 2) {
            if (actividad.estudiantes.length < actividad.cupoMaximo) {
                throw new BadRequestException('Error: no debe haber cupo disponible');
            }
        }

        actividad.estado = estado;
        return this.actividadRepository.save(actividad);
    }

    async findAllActividadesByDate(fecha: string): Promise<ActividadEntity[]> {
        return this.actividadRepository.find({ where: { fecha } });
    }
}