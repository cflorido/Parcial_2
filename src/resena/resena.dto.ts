import { IsString, IsInt, Min, Max } from 'class-validator';

export class ResenaDto {
    @IsString()
    comentario: string;

    @IsInt()
    calificacion: number;

    @IsString()
    fecha: string;
}

