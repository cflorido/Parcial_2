import { IsString, IsInt, MinLength, Matches, Min } from 'class-validator';

export class ActividadDto {
    @IsString()
    titulo: string;

    @IsString()
    fecha: string;
    
    //Aqui se agregaron unas validaciones adicionales que no sobran
    @IsInt()
    @Min(1, { message: 'El cupo maximo deberia ser mayor a 0' })
    cupoMaximo: number;
}