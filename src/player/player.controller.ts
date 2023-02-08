import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PlayerService } from './player.service';

@Controller('api/v1/players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @ApiTags('players')
  @Get('/')
  @ApiOperation({ description: 'Get All players' })
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.playerService.findAll();
  }
  @ApiTags('players')
  @Get('stats')
  @ApiOperation({ description: 'Get players stats' })
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  getStats() {
    return this.playerService.getStats();
  }
  @ApiTags('players')
  @Get(':id')
  @ApiOperation({ description: 'Get a single player with Id' })
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: number) {
    return this.playerService.findOne(+id);
  }
}
