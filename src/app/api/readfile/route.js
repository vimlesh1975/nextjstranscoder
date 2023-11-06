// pages/api/readfile.js

import fs from 'fs';
import { spawn } from 'child_process';
export function GET(req, res) {
  // try {
  //   const data = fs.readFileSync('E:/__00vimlesh/aa.txt', 'utf-8');
  //   // res.json(data);
  //   return new Response(JSON.stringify(data));
  // } catch (error) {
  //   return new Response(JSON.stringify('Failed to read the file.'));
  // }
  const inputFilePath = 'C:/casparcg/_media/go1080p25.mp4';
  const outputFilePath = 'C:/casparcg/_media/output.mp4';

  try {
    const ffmpegCommand = spawn('C:/casparcg/mydata/ffmpeg/ffmpeg.exe', [
      '-i',
      inputFilePath,
      '-c:v',
      'libx264',
      '-c:a',
      'aac',
      '-strict',
      'experimental',
      '-y',
      outputFilePath,
    ]);

    ffmpegCommand.on('close', (code) => {
      if (code === 0) {
        const response = new Response(
          JSON.stringify('Transcoding completed successfully')
        );
        return response;
      } else {
        const response = new Response(JSON.stringify('Transcoding failed'));
        return response;
      }
    });
  } catch (error) {
    return new Response(JSON.stringify('Failed to read the file.'));
  }
}
