export interface IPlayer {
  id: number;
  firstName: string;
  lastname: string;
  shortName: string;
  sex: 'M' | 'F';
  country: {
    picture: string;
    code: string;
  };
  picture: string;
  data: {
    rank: number;
    points: number;
    weight: number;
    height: number;
    age: number;
    last: number[];
  };
}

export interface IPlayerObject {
  players: IPlayer[];
}
