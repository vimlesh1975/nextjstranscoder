import { spawn } from 'child_process';
import excuteQuery from '../db';

var cron = require('node-cron');
const path = 'C:/casparcg/_media/';
var inputFilePaths = [];

function transcodeFile(file) {
  return new Promise((resolve, reject) => {
    const ffmpegCommand = spawn('C:/casparcg/mydata/ffmpeg/ffmpeg.exe', [
      '-i',
      path + file,
      '-c:v',
      'libx264',
      '-c:a',
      'aac',
      '-strict',
      'experimental',
      '-y',
      path + 'proxy1/' + file.split('.')[0] + '_proxy1.mp4',
    ]);

    ffmpegCommand.on('close', (code) => {
      if (code === 0) {
        console.log(`completed ${file} `);
        console.log(`----------------------------`);
        resolve();
      } else {
        console.error(`Transcoding ${file} failed with exit code ${code}`);
        reject(new Error(`Transcoding ${file} failed with exit code ${code}`));
      }
    });
  });
}

async function runTranscoding() {
  for (const file of inputFilePaths) {
    try {
      console.log(`Starting ${file}`);
      await transcodeFile(file);
    } catch (error) {
      console.error(
        error.message || `An error occurred during transcoding of ${file}`
      );
    }
  }
  inputFilePaths = [];
}

const queryandtranscode = async () => {
  if (inputFilePaths.length === 0) {
    const aa = await excuteQuery({
      query:
        "SELECT * FROM  media where  (FilenameProxy1 is  NULL or FilenameProxy1='') and proxyready=0  and MOD(SUBSTR(EventID,21,2),2)  =1 and  UploadStatus=1 and MediaType='Video'",
    });
    aa.forEach((element) => {
      inputFilePaths.push(element.FILENAMEASUPLOADED);
    });
    runTranscoding();
  }
};

const dd = cron.schedule('* * * * *', () => queryandtranscode());

export async function GET(req, res) {
  queryandtranscode();
  const response = new Response(JSON.stringify('Transcoding'));
  return response;
}
