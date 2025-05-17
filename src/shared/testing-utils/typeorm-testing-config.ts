import { TypeOrmModule } from '@nestjs/typeorm';
import { ActividadEntity } from '../../actividad/actividad.entity';
import { EstudianteEntity } from '../../estudiante/estudiante.entity';
import { ResenaEntity } from '../../resena/resena.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [ActividadEntity, EstudianteEntity, ResenaEntity],
       synchronize: true,
    autoLoadEntities: true,
  }),
  TypeOrmModule.forFeature([ActividadEntity, EstudianteEntity, ResenaEntity]),
];
