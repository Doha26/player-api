import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { S3Provider } from './s3.provider';

@Module({
  controllers: [PlayerController],
  providers: [...S3Provider, PlayerService],
  exports: [...S3Provider],
})
export class PlayerModule {}
