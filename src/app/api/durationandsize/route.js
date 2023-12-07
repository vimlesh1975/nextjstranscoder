import { spawn } from 'child_process';
import excuteQuery from '../db';
import { uploadToS3, getObjectUrl } from '../uploadToS3';
import fs from 'fs';
import { deleteAFile } from '../common';

var cron = require('node-cron');
const logpath = process.env.logpath1;
const ffprobepath = process.env.ffprobepath1;

const proxy1location = process.env.proxy1location1;
const originallocation = process.env.originallocation1;

var videoFiles = [];

async function makeProxy(MediaID, MediaExt) {
  const file = MediaID + MediaExt;
  console.log(
    `Starting duration and size of ${file} at ${
      new Date().getMinutes() + ':' + new Date().getSeconds()
    }`
  );
  const outputLogStream = fs.createWriteStream(
    logpath + MediaID + '_duartionandsize.log'
  );
  const file1 = await getObjectUrl(originallocation + file);
  return new Promise((resolve, reject) => {
    const ffmpegCommand = spawn(ffprobepath, [
      '-sexagesimal',
      file1,
      '-v',
      'error',
      '-show_entries',
      'format=size',
      '-of',
      'default=noprint_wrappers=1:nokey=1',
    ]);

    ffmpegCommand.stdout.on('data', (data) => {
      console.log(Buffer.from(data).toString('utf-8'));
      resolve(data);
    });
    ffmpegCommand.stderr.on('data', (data) => {
      outputLogStream.write(data.toString());
    });

    ffmpegCommand.on('close', (code) => {
      outputLogStream.end();
      if (code === 0) {
        console.log(
          `completed duration and size of ${file} at ${
            new Date().getMinutes() + ':' + new Date().getSeconds()
          }`
        );
        console.log(`----------------------------`);
        resolve();
      } else {
        console.error(`Transcoding ${file} failed with exit code ${code}`);
        reject(new Error(`Transcoding ${file} failed with exit code ${code}`));
      }
    });
  });
}

const query_MakeProxy_UploadtoS3_Delete = async () => {
  if (videoFiles.length === 0) {
    const mediaForProxy = await excuteQuery({
      query:
        "SELECT * FROM  media where (Duration is  NULL or Duration='') and UploadStatus=1 and MediaType='Video' ORDER BY MediaUploadedTime DESC limit 1",
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
        const time = await makeProxy(MediaID, MediaExt);
        // await uploadToS3(
        //   proxy1location + MediaID + '_proxy1.mp4',
        //   logpath + MediaID + '_proxy1.mp4'
        // );
        // deleteAFile(logpath + MediaID + '_proxy1.mp4');

        // udpadte database to proxyready='1' and fill the name of proxy file
        // await excuteQuery({
        //   query: `update media Set FilenameProxy1='${MediaID}_proxy1', proxyready=1 where MediaID='${MediaID}'`,
        // });
        console.log(time);
      } catch (error) {
        console.error(
          error.message || `An error occurred during transcoding of ${file}`
        );
      }
    }
    videoFiles = [];
  }
};

const dd = cron.schedule('* * * * *', () =>
  query_MakeProxy_UploadtoS3_Delete()
);

export async function GET(req, res) {
  query_MakeProxy_UploadtoS3_Delete();
  const response = new Response(JSON.stringify('Proxy Transcoding Started'));
  return response;
}
