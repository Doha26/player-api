import { IPlayerObject } from 'src/utils/interface';
import { getPlayersArrayFromS3 } from 'src/utils/s3';

export const S3Provider = [
  {
    provide: 'PLAYERS_DATA',
    useFactory: async (): Promise<IPlayerObject> => {
      return await getPlayersArrayFromS3();
    },
  },
];
