import excuteQuery from '../db';
import { getObjectUrl } from '../uploadToS3';

import ffmpeg from 'fluent-ffmpeg';

import { formatTime } from '../common';
var cron = require('node-cron');
const originallocation = process.env.originallocation1;
const mediauploadedtimeinterval = parseInt(process.env.mediauploadedtimeinterval1);
const whereClause=" where (Duration is  NULL or Duration='') and  (MediaType='Video' or MediaType='image')  and (MediaUploadedTime > (NOW() - INTERVAL " + mediauploadedtimeinterval + " DAY))  ORDER BY MediaUploadedTime DESC";



ffmpeg.setFfmpegPath(process.env.ffprobepath1);

var videoFiles = [];

async function getMetadata(MediaID, MediaExt) {
  const file = MediaID + MediaExt;
  const videoPath = await getObjectUrl(originallocation + file);

  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath,async (err, metadata) => {
      if (err) {
        await excuteQuery({
          query: `update media Set Duration='-2', FileSize='-2' where MediaID='${MediaID}'`,
        });
        reject(err);
      } else {
        resolve(metadata);
      }
    });
  });
}


const query_getMetadata = async () => {
  if (videoFiles.length === 0) {
    const mediaForProxy = await excuteQuery({
      query:
        "SELECT * FROM  media " + whereClause
    });
    mediaForProxy.forEach((element) => {
      videoFiles.push(element.FILENAMEASUPLOADED);
    });

    await excuteQuery({
      query:
      "update media Set Duration='-1', FileSize='-1' " + whereClause
    });

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

var started = false;
var dd ;
const log1 = () => {
  console.log('log from duration files')
}




export async function POST(req, res) {
  const jsonData = await req.json();
  if (jsonData.start === true && started === false) {
    query_getMetadata();
     dd = cron.schedule('* * * * *', () => {
      query_getMetadata()
    });
  //  dd = cron.schedule('*/5 * * * * *', () => log1());
  //   log1();
  started = true;
  }
  if (jsonData.start === false && started === true) {
  started = false;
  dd.stop();

  }
  const response = new Response(JSON.stringify({ started: started }));
  return response;
}

export async function GET(req, res) {
  const response = new Response(JSON.stringify({ started: started }));
  return response;
}