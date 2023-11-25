import { spawn } from 'child_process';
var cron = require('node-cron');

export async function GET(req, res) {
  const path = 'C:/casparcg/_media/';
  const inputFilePaths = ['go1080p25.mp4', 'CG1080i50.mp4'];
  const msg = [];

  cron.schedule('* * * * *', () => {
    console.log('running a task every minute');
  });

  for (const file of inputFilePaths) {
    try {
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

      const aa = await new Promise((resolve, reject) => {
        ffmpegCommand.on('close', (code) => {
          if (code === 0) {
            msg.push(file);
            resolve(file + ' Transcoded');
          } else {
            const errorMessage = 'Transcoding failed with exit code ' + code;
            reject(new Error(errorMessage));
          }
        });
      });

      // Log the result for each file
      console.log(aa);
    } catch (error) {
      // Log the error for each file
      console.error(error.message || 'An error occurred during transcoding');
    }
  }

  // Send a single response after all files are processed
  const response = new Response(JSON.stringify(msg + ' files processed'));
  return response;
}
