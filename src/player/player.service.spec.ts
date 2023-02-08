import { Test, TestingModule } from '@nestjs/testing';
import { PlayerService } from './player.service';
import { PlayerServiceMock } from '../__mocks__/mockPlayerService';

describe('PlayerService', () => {
  let playerService: PlayerService;

  beforeAll(async () => {
    const ApiServiceProvider = {
      provide: PlayerService,
      useClass: PlayerServiceMock,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerService],
    }).compile();

    playerService = module.get<PlayerService>(PlayerService);
  });

  it('should be defined', () => {
    expect(playerService).toBeDefined();
  });
});
