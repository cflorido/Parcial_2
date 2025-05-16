import { ActividadEntity } from 'src/actividad/actividad.entity';
import { EstudianteEntity } from 'src/estudiante/estudiante.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class ResenaEntity {
    @PrimaryGeneratedColumn('increment')
    id: number; 

    @Column()
    comentario: string;

    @Column()
    calificacion: number; 

    @Column()
    fecha: string; 
    
    @ManyToOne(() => EstudianteEntity, estudiante => estudiante.resenas)
    estudiante: EstudianteEntity;

    @ManyToOne(() => ActividadEntity, actividad => actividad.resenas)
    actividad: ActividadEntity;

}