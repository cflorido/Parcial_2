import { IsString, IsInt, IsEmail, Min, Max } from 'class-validator';

export class EstudianteDto {
    @IsInt()
    cedula: number;

    @IsString()
    nombre: string;

    @IsString()
    correo: string;

    @IsString()
    programa: string;

    @IsInt()
    semestre: number;
}