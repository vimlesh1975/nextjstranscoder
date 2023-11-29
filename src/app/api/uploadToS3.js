import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
const s3Client = new S3Client({
  region: process.env.region1,
  credentials: {
    accessKeyId: process.env.accessKeyId1,
    secretAccessKey: process.env.secretAccessKey1,
  },
});

const bucket1 = process.env.bucket1;

import fs from 'fs';

const getObjectUrl = async (key) => {
  const command = new GetObjectCommand({
    Bucket: bucket1,
    Key: key,
  });
  const url = await getSignedUrl(s3Client, command);
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
  const url = await getObjectUrl(fileName);
  return url;
};

// console.log(await uploadToS3('CG1080i50.mp4'));
