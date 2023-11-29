import { spawn } from 'child_process';
import excuteQuery from './db';
import { uploadToS3 } from './uploadToS3';
import fs from 'fs';

var cron = require('node-cron');
const path = process.env.path1;
const proxypath = process.env.proxypath1;
const ffmpegpath = process.env.ffmpegpath1;

var videoFiles = [];

const deleteAFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting file:', err);
    } else {
      console.log(filePath + ' deleted successfully');
    }
  });
};

const destinationProxyfile = (file) => {
  return proxypath + file.split('.')[0] + '_proxy1.mp4';
};

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
      destinationProxyfile(file),
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

const query_MakeProxy_UploadtoS3_Delete = async () => {
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
        await uploadToS3(
          file.split('.')[0] + '_proxy1.mp4',
          destinationProxyfile(file)
        );
        deleteAFile(destinationProxyfile(file));
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
