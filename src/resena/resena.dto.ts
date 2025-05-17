import { IsString, IsInt, Min, Max } from 'class-validator';

export class ResenaDto {
    @IsString()
    comentario: string;

    //Aqui se agregaron unas validaciones adicionales que no sobran
    @IsInt()
    @Min(0, { message: 'La calificacion minima debe ser 0' })
    @Max(5, { message: 'La calificación maxima deberia ser 5' })
    calificacion: number;

    @IsString()
    fecha: string;
}

