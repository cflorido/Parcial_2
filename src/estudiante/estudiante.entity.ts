import { ActividadEntity } from '../actividad/actividad.entity';
import { ResenaEntity } from '../resena/resena.entity';
import { Entity, PrimaryGeneratedColumn, Column, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class EstudianteEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    cedula: number;

    @Column()
    nombre: string;

    @Column()
    correo: string; 

    @Column()
    programa: string; 

    @Column()
    semestre: number;

    @ManyToMany(() => ActividadEntity, actividad => actividad.estudiantes)
    @JoinTable()
    actividades: ActividadEntity[]; 

    @OneToMany(() => ResenaEntity, resena => resena.estudiante)
    resenas: ResenaEntity[];
   
}