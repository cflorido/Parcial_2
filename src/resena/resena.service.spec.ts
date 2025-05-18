import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ResenaService } from './resena.service';
import { ResenaEntity } from './resena.entity';
import { ActividadEntity } from '../actividad/actividad.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ResenaService', () => {
  let service: ResenaService;
  let resenaRepo: Repository<ResenaEntity>;
  let actividadRepo: Repository<ActividadEntity>;
  let estudianteRepo: Repository<EstudianteEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ResenaService],
    }).compile();

    service = module.get<ResenaService>(ResenaService);
    resenaRepo = module.get(getRepositoryToken(ResenaEntity));
    actividadRepo = module.get(getRepositoryToken(ActividadEntity));
    estudianteRepo = module.get(getRepositoryToken(EstudianteEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('deberia crear una reseña si todo es valido', async () => {
    const estudiante = await estudianteRepo.save({
      cedula: 1234567890,
      nombre: 'Shakira',
      correo: 'shakira@gmail.com',
      programa: 'Música',
      semestre: 4,
      actividades: [],
      resenas: [],
    });

    const actividad = await actividadRepo.save({
      titulo: 'Taller de guitarra',
      fecha: '2025-06-10',
      cupoMaximo: 10,
      estado: 2,
      estudiantes: [estudiante],
      resenas: [],
    });

    const data = {
      comentario: 'Excelente actividad',
      calificacion: 5,
      fecha: '2025-06-11',
    };

    const resena = await service.agregarResena(estudiante.id, actividad.id, data);
    expect(resena).toMatchObject({
      comentario: data.comentario,
      calificacion: data.calificacion,
      fecha: data.fecha,
    });
    expect(resena.estudiante.id).toBe(estudiante.id);
    expect(resena.actividad.id).toBe(actividad.id);
  });

  it('deberia lanzar error si no encuentra la actividad', async () => {
    const estudiante = await estudianteRepo.save({
      cedula: 1098765432,
      nombre: 'Karol G',
      correo: 'karolg@gmail.com',
      programa: 'Diseño',
      semestre: 3,
      actividades: [],
      resenas: [],
    });

    await expect(
      service.agregarResena(estudiante.id, 999, {
        comentario: 'No encontré la clase',
        calificacion: 3,
        fecha: '2025-06-12',
      })
    ).rejects.toThrowError(new NotFoundException('No se ha encontrado la actividad'));
  });

  it('deberia lanzar error si la actividad no esta finalizada', async () => {
    const estudiante = await estudianteRepo.save({
      cedula: 1122334455,
      nombre: 'Juanes',
      correo: 'juanes@gmail.com',
      programa: 'Ingeniería',
      semestre: 5,
      actividades: [],
      resenas: [],
    });

    const actividad = await actividadRepo.save({
      titulo: 'Clase abierta',
      fecha: '2025-06-13',
      cupoMaximo: 10,
      estado: 0,
      estudiantes: [estudiante],
      resenas: [],
    });

    await expect(
      service.agregarResena(estudiante.id, actividad.id, {
        comentario: 'No me gustó',
        calificacion: 2,
        fecha: '2025-06-13',
      })
    ).rejects.toThrowError(new BadRequestException('La actividad no ha finalizado'));
  });

  it('deberia lanzar error si el estudiante no estaba inscrito', async () => {
    const estudiante = await estudianteRepo.save({
      cedula: 5566778899,
      nombre: 'Maluma',
      correo: 'maluma@gmail.com',
      programa: 'Arquitectura',
      semestre: 2,
      actividades: [],
      resenas: [],
    });

    const actividad = await actividadRepo.save({
      titulo: 'Clausura',
      fecha: '2025-06-14',
      cupoMaximo: 10,
      estado: 2,
      estudiantes: [],
      resenas: [],
    });

    await expect(
      service.agregarResena(estudiante.id, actividad.id, {
        comentario: 'Estuvo bien',
        calificacion: 4,
        fecha: '2025-06-14',
      })
    ).rejects.toThrowError(new BadRequestException('El estudiante no estaba inscrito'));
  });

  it('deberia lanzar error si el estudiante no existe', async () => {
    const actividad = await actividadRepo.save({
      titulo: 'Taller finalizado',
      fecha: '2025-06-15',
      cupoMaximo: 10,
      estado: 2,
      estudiantes: [],
      resenas: [],
    });

    await expect(
      service.agregarResena(999, actividad.id, {
        comentario: 'Buen contenido',
        calificacion: 4,
        fecha: '2025-06-15',
      })
    ).rejects.toThrowError(new NotFoundException('El estudiante no estaba inscrito'));
  });
});
