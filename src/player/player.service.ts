import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { getPlayersArrayFromS3 } from '../utils/s3';
import { IPlayer } from '../utils/interface';

@Injectable()
export class PlayerService {
  players: IPlayer[] = [];

  constructor() {
    getPlayersArrayFromS3()
      .then((playersObject) => {
        this.players = playersObject.players;
      })
      .catch((err) => {
        throw new HttpException(
          `Unable to retrieve players:${err.message}`,
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  /**
   * Find all players availlable
   * @returns IPlayer[]
   */

  findAll = () => {
    return this.players.sort(
      (a: IPlayer, b: IPlayer) => a.data.rank - b.data.rank,
    );
  };

  /**
   * Get a player with a single Id
   * @param id string player id
   * @returns IPlayer
   */
  findOne = (id: number) => {
    const player = this.players.find((player: IPlayer) => player.id === id);
    if (!player) {
      throw new NotFoundException(`Could not find player with Id:${id}`);
    }

    return player;
  };

  /**
   * Get differents stats
   * @returns Object
   */

  getStat = () => {
    return {
      countryWithHighestWin: this.getWinnercountry().country.code,
      averagePlayerIMC: this.getAveragePlayerIMC().toFixed(2),
      playersMedianHeight: this.getPlayersMedianHeight(),
    };
  };

  getWinnercountry() {
    const data = [...this.players];
    return data
      .sort(
        (a: IPlayer, b: IPlayer) =>
          data.filter((v: IPlayer) => v.country.code === a.country.code)
            .length -
          data.filter((v: IPlayer) => v.country.code === b.country.code).length,
      )
      .pop();
  }

  getAveragePlayerIMC = () => {
    let totalIMC = 0;
    // For each player, get the IMC
    this.players.forEach((player: IPlayer) => {
      // convert the player weight from g to kg
      const pWeight = player.data.weight / 1000;
      // convert the player heigh from m to CM
      const pHeiht = player.data.height / 100;

      // store all the players IMCs
      const playerImc = pWeight / Math.pow(pHeiht, 2);
      totalIMC += playerImc;
    });

    // Get the Medium IMC of all players according to the number of players
    return totalIMC / this.players.length;
  };

  getPlayersMedianHeight = () => {
    const arrayValues = [...this.players];
    arrayValues.sort(function (x: IPlayer, y: IPlayer) {
      return x.data.height - y.data.height;
    });
    const midpoint = Math.floor(arrayValues.length / 2);
    return arrayValues.length % 2 === 1
      ? arrayValues[midpoint].data.height
      : (arrayValues[midpoint - 1].data.height +
          arrayValues[midpoint].data.height) /
          2;
  };
}
