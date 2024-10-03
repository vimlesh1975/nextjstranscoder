import {
  PutObjectCommand,
  GetObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import fs from 'fs';

import readCredentials from './readCredentials'

const configfromenvfile={
  credentials: {
    accessKeyId: process.env.accessKeyId1,
    secretAccessKey: process.env.secretAccessKey1,
  },
}
const configfromereadingFile=await readCredentials();


const bucket1 = process.env.bucket1;

// const s3Client = new S3Client({
//   region: process.env.region1,
//   credentials: {
//     accessKeyId: process.env.accessKeyId1,
//     secretAccessKey: process.env.secretAccessKey1,
//   },
// });

const  s3Client = new S3Client({
  region: process.env.region1,
  endpoint: process.env.endpoint1,
  forcePathStyle: process.env.forcePathStyle1,
  credentials:(process.env.credentialsfromenv === '1')?configfromenvfile.credentials:configfromereadingFile.credentials
});

export const getObjectUrl = async (key) => {
  const command = new GetObjectCommand({
    Bucket: bucket1,
    Key: key,
  });
  const url = await getSignedUrl(s3Client, command, { expiresIn: 1000 });
  return url;
};

export const uploadToS3 = async (fileName, fileUrl) => {
  const videoStream = fs.createReadStream(fileUrl);
  const command = new PutObjectCommand({
    Bucket: bucket1,
    Key: fileName,
    Body: videoStream,
  });
  await s3Client.send(command);
};
