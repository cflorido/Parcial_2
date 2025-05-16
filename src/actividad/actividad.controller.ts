import { Controller, Post, Param, ParseIntPipe } from '@nestjs/common';
import { EstudianteService } from '../estudiante/estudiante.service';

//BONOOOOOO AAAAAAAAAAAAA

@Controller('actividades')
export class ActividadController {
    constructor(private readonly estudianteService: EstudianteService) {}

    @Post(':actividadId/inscribir/:estudianteId')
    async inscribirseActividad(
        @Param('actividadId', ParseIntPipe) actividadId: number,
        @Param('estudianteId', ParseIntPipe) estudianteId: number
    ): Promise<string> {
        return this.estudianteService.inscribirseActividad(estudianteId, actividadId);
    }
}