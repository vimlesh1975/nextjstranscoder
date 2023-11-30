import { spawn } from 'child_process';
import excuteQuery from './db';
import { uploadToS3, getObjectUrl } from './uploadToS3';
import fs from 'fs';

var cron = require('node-cron');
const proxypath = process.env.proxypath1;
const ffmpegpath = process.env.ffmpegpath1;

const proxy1location = process.env.proxy1location1;
const originallocation = process.env.originallocation1;

var videoFiles = [];

const deleteAFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting file:', err);
    } else {
      // console.log(filePath + ' deleted successfully');
    }
  });
};

const destinationProxyfile = (file) => {
  return proxypath + file.split('.')[0] + '_proxy1.mp4';
};

async function makeProxy(file, MediaID) {
  const outputLogStream = fs.createWriteStream(proxypath + MediaID + '.log');
  const file1 = await getObjectUrl(originallocation + file);
  return new Promise((resolve, reject) => {
    const ffmpegCommand = spawn(ffmpegpath, [
      '-i',
      file1,
      '-c:v',
      'libx264',
      '-c:a',
      'aac',
      '-ar',
      '48k',
      '-s',
      '480x300',
      '-r',
      '25',
      '-b:v',
      '750k',
      '-minrate',
      '750k',
      '-maxrate',
      '750k',
      '-strict',
      'experimental',
      '-y',
      destinationProxyfile(file),
    ]);

    // ffmpegCommand.stdout.on('data', (data) => {
    //   console.log(`stdout: ${data}`);
    // });

    ffmpegCommand.stderr.on('data', (data) => {
      outputLogStream.write(data.toString());
    });

    ffmpegCommand.on('close', (code) => {
      outputLogStream.end();
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
        "SELECT * FROM  media where  ((FilenameProxy1 is  NULL or FilenameProxy1='') or proxyready=0)  and  UploadStatus=1 and MediaType='Video' ORDER BY MediaUploadedTime DESC",
    });
    mediaForProxy.forEach((element) => {
      videoFiles.push(element.FILENAMEASUPLOADED);
    });

    // udpadte database to proxyready='-1' so that other qury shouldnot find that
    // await excuteQuery({
    //   query:
    //     "update media set proxyready='-1' where ( (FilenameProxy1 is  NULL or FilenameProxy1='') or proxyready=0)   and  UploadStatus=1 and MediaType='Video'",
    // });

    for (const { FILENAMEASUPLOADED: file, MediaID } of mediaForProxy) {
      try {
        console.log(
          `Starting ${file} at ${
            new Date().getMinutes() + ':' + new Date().getSeconds()
          }`
        );
        await makeProxy(file, MediaID);
        await uploadToS3(
          proxy1location + file.split('.')[0] + '_proxy1.mp4',
          destinationProxyfile(file)
        );
        deleteAFile(destinationProxyfile(file));

        // udpadte database to proxyready='1' and fill the name of proxy file
        // await excuteQuery({
        //   query: `update media Set FilenameProxy1='${MediaID}_proxy1', proxyready=1 where MediaID='${MediaID}'`,
        // });
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
