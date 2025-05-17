/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ActividadService } from './actividad.service';
import { ActividadEntity } from './actividad.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { EstudianteEntity } from '../estudiante/estudiante.entity';


describe('ActividadService', () => {

  let service: ActividadService;
  let repository: Repository<ActividadEntity>;
  let actividadesList: ActividadEntity[];
  let estudianteRepository: Repository<EstudianteEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ActividadService],
      
    }).compile();

    service = module.get<ActividadService>(ActividadService);
    repository = module.get<Repository<ActividadEntity>>(getRepositoryToken(ActividadEntity));
    estudianteRepository = module.get<Repository<EstudianteEntity>>(getRepositoryToken(EstudianteEntity));
    await seedDatabase();

  });

  const seedDatabase = async () => {
    repository.clear();
    actividadesList = [];

    for (let i = 0; i < 5; i++) {
      const actividad = await repository.save({
        titulo: faker.lorem.words(5),
        fecha: '2025-05-05',
        cupoMaximo: 10,
        estado: 0,
        estudiantes: [],
        resenas: [],
      });
      actividadesList.push(actividad);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('crearActividad deberia lanzar error si el titulo es muy corto', async () => {
    await expect(service.crearActividad({ titulo: 'hola', fecha: '2025-05-05', cupoMaximo: 10 }))
      .rejects.toHaveProperty('message', 'El titulo debe tener por lo menos 15 letras');
  });

  it('crearActividad deberia lanzar error si el titulo tiene simbolos', async () => {
    await expect(service.crearActividad({ titulo: 'hola este es un titulo con simbolos!!!', fecha: '2025-05-05', cupoMaximo: 10 }))
      .rejects.toHaveProperty('message', 'El titulo no puede contener simbolos');
  });

  it('crearActividad deberia guardar una actividad valida', async () => {
    const dto = {
      titulo: 'Titulo completamente valido sin simbolos',
      fecha: '2025-05-05',
      cupoMaximo: 20,
    };

    const result = await service.crearActividad(dto);
    expect(result).not.toBeNull();
    const stored = await repository.findOne({ where: { id: result.id } });
    expect(stored).not.toBeNull();
    if (stored) {
      expect(stored.titulo).toBe(dto.titulo);
      expect(stored.estado).toBe(0);
    }
  });

  it('cambiarEstado deberia alertar si no se encuentra la actividad', async () => {
    await expect(service.cambiarEstado(0, 1)).rejects.toHaveProperty('message', 'No se encontro la ectividad');
  });

  it('cambiarEstado deberia alertar si el estado es invalido', async () => {
    const actividad = actividadesList[0];
    await expect(service.cambiarEstado(actividad.id, 5)).rejects.toHaveProperty('message', 'Se tiene un estado invalido');
  });

  it('cambiarEstado deberia alertar si no se puede cerrar la actividad por que el 80% del cupo debe estar está lleno', async () => {
    const actividad = await repository.save({
      titulo: 'Actividad de prueba que no se puede cerrar',
      fecha: '2025-05-05',
      cupoMaximo: 10,
      estado: 0,
      estudiantes: Array(7),
      resenas: [],
    });

    await expect(service.cambiarEstado(actividad.id, 1)).rejects.toHaveProperty('message', 'Hay un error: el 80% del cupo debe estar está lleno');
  });

it('cambiarEstado deberia cerrar la actividad si se cumple con que el 80% del cupo debe estar está lleno', async () => {
  const estudiantes: EstudianteEntity[] = [];


    for (let i = 0; i < 8; i++) {
    const estudiante = await estudianteRepository.save({
        cedula: parseInt(faker.string.numeric(10)),
        nombre: faker.person.fullName(),
        correo: faker.internet.email(),
        programa: faker.word.words(2),
        semestre: faker.number.int({ min: 1, max: 10 }),
        telefono: faker.phone.number(),
        actividades: [], 
        resenas: []      
    });
    estudiantes.push(estudiante);
    }


  const actividad = await repository.save({
    titulo: 'Actividad cerrable yeii',
    fecha: '2025-05-05',
    cupoMaximo: 10,
    estado: 0,
    estudiantes,
    resenas: [],
  });

  const updated = await service.cambiarEstado(actividad.id, 1);
  expect(updated.estado).toBe(1);
});


  it('cambiarEstado  no deberia finalizar la actividad si aun hay cupos', async () => {
    const actividad = await repository.save({
      titulo: 'Actividad finalizable pero no llena',
      fecha: '2025-05-05',
      cupoMaximo: 10,
      estado: 0,
      estudiantes: Array(9),
      resenas: [],
    });

    await expect(service.cambiarEstado(actividad.id, 2)).rejects.toHaveProperty('message', 'Error: no debe haber cupo disponible');
  });

    it('cambiarEstado deberia dejar finalizar una actividad si no hay cupos', async () => {
    const estudiantes: EstudianteEntity[] = [];


    for (let i = 0; i < 8; i++) {
    const estudiante = await estudianteRepository.save({
        cedula: parseInt(faker.string.numeric(10)),
        nombre: faker.person.fullName(),
        correo: faker.internet.email(),
        programa: faker.word.words(2),
        semestre: faker.number.int({ min: 1, max: 10 }),
        telefono: faker.phone.number(),
        actividades: [], 
        resenas: []      
    });
    estudiantes.push(estudiante);
    }


    const actividad = await repository.save({
        titulo: 'Actividad finalizable llena',
        fecha: '2025-05-05',
        cupoMaximo: 8,
        estado: 0,
        estudiantes,
        resenas: [],
    });

    const updated = await service.cambiarEstado(actividad.id, 2);
    expect(updated.estado).toBe(2);
    });


  it('findAllActividadesByDate deberia retornar todas las actividades correctas dada una fecha', async () => {
    const result = await service.findAllActividadesByDate('2025-05-05');
    expect(result).not.toBeNull();
    expect(result.length).toBeGreaterThan(0);
    result.forEach(act => expect(act.fecha).toBe('2025-05-05'));
  });
});