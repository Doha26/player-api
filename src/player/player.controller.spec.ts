/* eslint-disable @typescript-eslint/no-empty-function */
import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';

describe('PlayerController', () => {
  let playerControler: PlayerController;
  let spyService: PlayerService;

  beforeAll(async () => {
    const ApiServiceProvider = {
      provide: PlayerService,
      useFactory: () => ({
        findOne: jest.fn(() => {}),
        findAll: jest.fn(() => []),
        getStats: jest.fn(() => {}),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [PlayerService, ApiServiceProvider],
    }).compile();
    playerControler = module.get<PlayerController>(PlayerController);
    spyService = module.get<PlayerService>(PlayerService);
  });

  it('should be defined', () => {
    expect(playerControler).toBeDefined();
  });

  it('calling findAll() method', () => {
    playerControler.findAll();
    expect(spyService.findAll).toHaveBeenCalled();
  });

  it('calling findOne() method', () => {
    playerControler.findOne(17);
    expect(spyService.findOne).toHaveBeenCalled();
  });
});
