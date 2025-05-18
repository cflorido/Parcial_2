import { Controller, Post, Body, Param, ParseIntPipe, Patch, Get, Query } from '@nestjs/common';
import { ActividadService } from './actividad.service';
import { EstudianteService } from '../estudiante/estudiante.service';
import { ActividadDto } from './actividad.dto';
import { ActividadEntity } from './actividad.entity';


@Controller('actividades')
export class ActividadController {

    //-----------------------------------
    constructor(
        private readonly actividadService: ActividadService,
        private readonly estudianteService: EstudianteService
    ) {}

    //-----------------------------------
    @Post()
    async crearActividad(@Body() data: ActividadDto): Promise<ActividadEntity> {
        return this.actividadService.crearActividad(data);
    }

    //-----------------------------------
    @Patch(':id/estado')
    async cambiarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { estado: number }
    ): Promise<ActividadEntity> {
    const { estado } = body;
    return this.actividadService.cambiarEstado(id, estado);
    }

    //-----------------------------------
    @Get()
    async findAllActividadesByDate(@Query('fecha') fecha: string): Promise<ActividadEntity[]> {
        return this.actividadService.findAllActividadesByDate(fecha);
    }



}