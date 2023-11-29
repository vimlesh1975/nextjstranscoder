import { spawn } from 'child_process';
import excuteQuery from './db';
import { uploadToS3 } from './uploadToS3';

var cron = require('node-cron');
const path = process.env.path1;
const proxypath = process.env.proxypath1;
const ffmpegpath = process.env.ffmpegpath1;

var videoFiles = [];

function makeProxy(file) {
  return new Promise((resolve, reject) => {
    const ffmpegCommand = spawn(ffmpegpath, [
      '-i',
      path + file,
      '-c:v',
      'libx264',
      '-c:a',
      'aac',
      '-strict',
      'experimental',
      '-y',
      proxypath + file.split('.')[0] + '_proxy1.mp4',
    ]);

    ffmpegCommand.on('close', (code) => {
      if (code === 0) {
        console.log(
          `completed ${file} at ${
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

const queryAndMakeProxy = async () => {
  if (videoFiles.length === 0) {
    const mediaForProxy = await excuteQuery({
      query:
        "SELECT * FROM  media where  (FilenameProxy1 is  NULL or FilenameProxy1='') and proxyready=0  and MOD(SUBSTR(EventID,21,2),2)  =1 and  UploadStatus=1 and MediaType='Video'",
    });
    mediaForProxy.forEach((element) => {
      videoFiles.push(element.FILENAMEASUPLOADED);
    });
    for (const file of videoFiles) {
      try {
        console.log(
          `Starting ${file} at ${
            new Date().getMinutes() + ':' + new Date().getSeconds()
          }`
        );
        await makeProxy(file);
      } catch (error) {
        console.error(
          error.message || `An error occurred during transcoding of ${file}`
        );
      }
    }
    videoFiles = [];
  }
};

const dd = cron.schedule('* * * * *', () => queryAndMakeProxy());

export async function GET(req, res) {
  await uploadToS3('key1', 'C:/casparcg/_media/CG1080i50.mp4');
  queryAndMakeProxy();
  const response = new Response(JSON.stringify('Proxy Transcoding Started'));
  return response;
}
