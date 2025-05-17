import { Controller, Post, Body, Param, ParseIntPipe, Get } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { EstudianteDto } from './estudiante.dto';
import { EstudianteEntity } from './estudiante.entity';

@Controller('estudiantes')
export class EstudianteController {
    constructor(private readonly estudianteService: EstudianteService) {}

    //-----------------------------------
    @Post()
    async crearEstudiante(@Body() data: EstudianteDto): Promise<EstudianteEntity> {
        return this.estudianteService.crearEstudiante(data);
    }

    //-----------------------------------
    @Get(':id')
    async findEstudianteById(@Param('id', ParseIntPipe) id: number): Promise<EstudianteEntity> {
        return this.estudianteService.findEstudianteById(id);
    }

    //-----------------------------------
    @Post(':estudianteId/inscribir/:actividadId')
    async inscribirseActividad(
        @Param('estudianteId', ParseIntPipe) estudianteId: number,
        @Param('actividadId', ParseIntPipe) actividadId: number
    ): Promise<string> {
        return this.estudianteService.inscribirseActividad(estudianteId, actividadId);
    }
}