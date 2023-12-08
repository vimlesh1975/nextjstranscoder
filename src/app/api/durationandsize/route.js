import excuteQuery from '../db';
import { getObjectUrl } from '../uploadToS3';

import ffmpeg from 'fluent-ffmpeg';

import { formatTime } from '../common';
var cron = require('node-cron');
const originallocation = process.env.originallocation1;

var videoFiles = [];

async function getMetadata(MediaID, MediaExt) {
  const file = MediaID + MediaExt;
  const videoPath = await getObjectUrl(originallocation + file);

  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        resolve(metadata);
      }
    });
  });
}

const query_getMetadata = async () => {
  if (videoFiles.length === 0) {
    console.log('first');
    const mediaForProxy = await excuteQuery({
      query:
        "SELECT * FROM  media where (Duration is  NULL or Duration='') and UploadStatus=1 and (MediaType='Video' or MediaType='image') ORDER BY MediaUploadedTime DESC",
    });
    mediaForProxy.forEach((element) => {
      videoFiles.push(element.FILENAMEASUPLOADED);
    });

    // udpadte database to proxyready='-1' so that other qury shouldnot find that
    // await excuteQuery({
    //   query:
    //     "update media set proxyready='-1' where ( (FilenameProxy1 is  NULL or FilenameProxy1='') or proxyready=0)   and  UploadStatus=1 and MediaType='Video'",
    // });

    for (const { MediaID, MediaExt } of mediaForProxy) {
      const file = MediaID + MediaExt;
      try {
        const metaData = await getMetadata(MediaID, MediaExt);
        const duration = isNaN(metaData.format.duration)
          ? '0:00:00'
          : formatTime(metaData.format.duration);
        const size = metaData.format.size;
        console.log(duration, size);

        // udpadte database to proxyready='1' and fill the name of proxy file

        await excuteQuery({
          query: `update media Set Duration='${duration}', FileSize='${size}' where MediaID='${MediaID}'`,
        });
      } catch (error) {
        console.error(
          error.message || `An error occurred during transcoding of ${file}`
        );
      }
    }
    videoFiles = [];
  }
};

const dd = cron.schedule('* * * * *', () => {
  console.log('nodecorn called');
  query_getMetadata();
});

export async function GET(req, res) {
  query_getMetadata();
  const response = new Response(JSON.stringify('Proxy Transcoding Started'));
  return response;
}
