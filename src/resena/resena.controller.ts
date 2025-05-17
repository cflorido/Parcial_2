import { Controller, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ResenaService } from './resena.service';
import { ResenaDto } from './resena.dto';
import { ResenaEntity } from './resena.entity';

@Controller('resenas')
export class ResenaController {
    constructor(private readonly resenaService: ResenaService) {}
    //-----------------------------------
    @Post(':actividadId/estudiante/:estudianteId')
    async agregarResena(
        @Param('actividadId', ParseIntPipe) actividadId: number,
        @Param('estudianteId', ParseIntPipe) estudianteId: number,
        @Body() data: ResenaDto
    ): Promise<ResenaEntity> {
        return this.resenaService.agregarResena(estudianteId, actividadId, data);
    }
}