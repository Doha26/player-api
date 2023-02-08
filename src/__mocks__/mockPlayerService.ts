import { PlayerService } from '../player/player.service';

export class PlayerServiceMock {
  findOne(id: number) {
    return [];
  }
  findAll(id: string) {
    return [];
  }
}
