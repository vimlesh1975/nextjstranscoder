import { spawn } from 'child_process';
var cron = require('node-cron');
const path = 'C:/casparcg/_media/';
const inputFilePaths = ['go1080p25.mp4', 'CG1080i50.mp4'];

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
      path + file.split('.')[0] + '_transcoded.mp4',
    ]);

    ffmpegCommand.on('close', (code) => {
      if (code === 0) {
        console.log(`Transcoding ${file} completed successfully`);
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
      console.log(`Starting transcoding of ${file}`);
      await transcodeFile(file);
      console.log(`Transcoding of ${file} finished`);
    } catch (error) {
      console.error(
        error.message || `An error occurred during transcoding of ${file}`
      );
    }
  }
}
export async function GET(req, res) {
  // Schedule the transcoding function to run every minute
  cron.schedule('* * * * *', () => {
    console.log('Running transcoding...');
    runTranscoding();
  });
  // Send a single response after all files are processed
  const response = new Response(JSON.stringify(' files processed'));
  return response;
}
