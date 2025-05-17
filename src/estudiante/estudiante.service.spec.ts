/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { EstudianteService } from './estudiante.service';
import { EstudianteEntity } from './estudiante.entity';
import { ActividadEntity } from '../actividad/actividad.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('EstudianteService', () => {

  let service: EstudianteService;
  let estudianteRepository: Repository<EstudianteEntity>;
  let actividadRepository: Repository<ActividadEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EstudianteService],
    }).compile();

    service = module.get<EstudianteService>(EstudianteService);
    estudianteRepository = module.get(getRepositoryToken(EstudianteEntity));
    actividadRepository = module.get(getRepositoryToken(ActividadEntity));
  });

  it('crearEstudiante deberia crear un estudiante valido', async () => {
    const data = {
      cedula: 1029482492,
      nombre: "Carol Sofia Florido Castro",
      correo: "cflorido@gmail.com",
      programa: "sistemas",
      semestre: 5,
    };

    const estudiante = await service.crearEstudiante(data);
    expect(estudiante).toMatchObject(data);
  });

  it('crearEstudiante deberia lanzar errror si el email no es valido', async () => {
    const data = {
      cedula:8473859385,
      nombre: 'Juan',
      correo: 'invalid-email',
      programa: "Sistemas",
      semestre: 5,
    };
    await expect(service.crearEstudiante(data)).rejects.toThrow(BadRequestException);
  });


  it('findEstudianteById deberia retornar un estudiante', async () => {
    const estudiante = await estudianteRepository.save({
      cedula: 5646567543,
      nombre: 'Alejandra Castro',
      correo: 'aleja@gmail.com',
      programa: 'Derecho',
      semestre: 4,
      actividades: [],
      resenas: [],
    });

    const result = await service.findEstudianteById(estudiante.id);
    expect(result).toMatchObject({ id: estudiante.id });
  });

  it('findEstudianteById deberia notificar si no encuentra al estudiante', async () => {
    await expect(service.findEstudianteById(999)).rejects.toThrow(NotFoundException);
  });

  it('inscribirseActividad deberia inscribir a un estudiante a una actividad', async () => {
    const estudiante = await estudianteRepository.save({
      cedula: 53245658,
      nombre: 'Anita',
      correo: 'anita@mail.com',
      programa: 'Fisica',
      semestre: 6,
      actividades: [],
      resenas: [],
    });

    const actividad = await actividadRepository.save({
      titulo: 'Actividad para tener mas creatividad',
      fecha: '2025-06-01',
      cupoMaximo: 10,
      estado: 0,
      estudiantes: [],
      resenas: [],
    });

    const result = await service.inscribirseActividad(estudiante.id, actividad.id);
    expect(result).toBe('Se ha incrito al estudiante a la actividad');
  });

  it('inscribirseActividad deberia notificar si no se encontro el estudiante para inscribirlo en la actividad', async () => {
    const actividad = await actividadRepository.save({
      titulo: 'Charla de arte',
      fecha: '2025-05-05',
      cupoMaximo: 10,
      estado: 0,
      estudiantes: [],
      resenas: [],
    });
    await expect(service.inscribirseActividad(0, actividad.id)).rejects.toThrow(NotFoundException);
  });

  it('inscribirseActividad deberia notificar si no se encontro la actividad', async () => {
    const estudiante = await estudianteRepository.save({
      cedula: 8765678765,
      nombre: 'Carlos',
      correo: 'Carlos@gmail.com',
      programa: 'comunicacion',
      semestre: 2,
      actividades: [],
      resenas: [],
    });
    await expect(service.inscribirseActividad(estudiante.id, 0)).rejects.toThrow(NotFoundException);
  });

  it('inscribirseActividad deberia notificar si no hay cupos', async () => {
    const estudiante = await estudianteRepository.save({
      cedula: 3453245646,
      nombre: 'xxx',
      correo: 'xxx@mail.com',
      programa: 'Economía',
      semestre: 6,
      actividades: [],
      resenas: [],
    });

    const actividad = await actividadRepository.save({
      titulo: 'Curso de hacer cosas',
      fecha: '2025-05-05',
      cupoMaximo: 1,
      estado: 0,
      estudiantes: [estudiante],
      resenas: [],
    });

    await expect(service.inscribirseActividad(estudiante.id, actividad.id)).rejects.toThrow('sin cupos');
  });

  it('inscribirseActividad deberia notificar si la actividad no esta abierta', async () => {
    const estudiante = await estudianteRepository.save({
      cedula: 4544356435,
      nombre: 'Pedro',
      correo: 'pedro@gmail.com',
      programa: 'Contaduría',
      semestre: 8,
      actividades: [],
      resenas: [],
    });

    const actividad = await actividadRepository.save({
      titulo: 'Clase cerrada ups',
      fecha: '2025-06-01',
      cupoMaximo: 10,
      estado: 1,
      estudiantes: [],
      resenas: [],
    });

    await expect(service.inscribirseActividad(estudiante.id, actividad.id)).rejects.toThrow('actividad no disponible');
  });

  it('inscribirseActividad deberia notificar si el estudiante ya esta inscrito', async () => {
    const estudiante = await estudianteRepository.save({
      cedula: 5356768896,
      nombre: 'sofia',
      correo: 'sofia@gmail.com',
      programa: 'Arquitectura',
      semestre: 7,
      actividades: [],
      resenas: [],
    });

    const actividad = await actividadRepository.save({
      titulo: 'Simposio',
      fecha: '2025-05-05',
      cupoMaximo: 10,
      estado: 0,
      estudiantes: [estudiante],
      resenas: [],
    });

    await expect(service.inscribirseActividad(estudiante.id, actividad.id)).rejects.toThrow('El estudiante no se puede incribir');
  });
});
