import { AWSError, S3 } from 'aws-sdk';
import { GetObjectOutput } from 'aws-sdk/clients/s3';
import { Readable } from 'stream';
import { IPlayer, IPlayerObject } from './interface';

const s3Bucket = process.env.S3_BUCKET_NAME || '';
const s3BucketFilename = process.env.S3_BUCKET_FILE_NAME || '';
const awsRegion = process.env.AWS_REGION || '';

const s3 = new S3({
  region: awsRegion,
});

/**
 * Get an s3 object as stream
 * @param bucket string bucket name
 * @param objectKey string object key
 * @returns Readable s3 object stream
 */
export const getS3ObjectStream = (
  bucket: string,
  objectKey: string,
): Readable => {
  const params = {
    Bucket: bucket,
    Key: objectKey,
  };

  return s3.getObject(params).createReadStream();
};

/**
 * Get an s3 object as a promise
 * @param bucket string bucket name
 * @param objectKey string object key
 * @returns Promise<GetObjectOutput|AWSError> s3 object promise
 */
// tslint:disable-next-line: max-line-length
export const getS3ObjectPromise = (
  bucket: string,
  objectKey: string,
): Promise<GetObjectOutput | AWSError> => {
  const params = {
    Bucket: bucket,
    Key: objectKey,
  };

  return s3.getObject(params).promise();
};

export const getPlayersArrayFromS3 = async (): Promise<IPlayerObject> => {
  const playersArray = await new Promise<IPlayerObject>(
    async (resolve, reject) => {
      const rawSettings = (await getS3ObjectPromise(
        s3Bucket,
        s3BucketFilename,
      )) as S3.GetObjectOutput;
      if (rawSettings?.Body) {
        try {
          resolve(JSON.parse(rawSettings.Body.toString()));
        } catch (error) {
          reject(
            `Error while getting players JSON file  from s3 bucket - JSON bad formatted`,
          );
        }
      } else {
        reject(`Error while getting JSON player file from s3 bucket`);
      }
    },
  );
  return playersArray;
};
