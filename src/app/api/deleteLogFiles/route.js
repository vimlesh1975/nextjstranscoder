const fs = require('fs');
const path = require('path');
var cron = require('node-cron');

// const logpath = 'path/to/your/directory'; // Replace this with the path to the directory containing the files
const logpath = process.env.logpath1;
// Calculate the timestamp for 8 hours ago
// const eightHoursAgo = Date.now() - 8 * 60 * 60 * 1000;

// Read the files in the directory
const deleteFiles = (minutes) => {
  const minutesAgo = Date.now() - minutes * 60 * 1000;

  fs.readdir(logpath, (err, files) => {
    if (err) {
      console.error(`Error reading directory: ${err.message}`);
      return;
    }

    // Iterate over the files
    files
    .filter((file) => path.extname(file) === '.log')
    .forEach((file) => {
      const filePath = path.join(logpath, file);

      // Get file stats (including the last modification time)
      fs.stat(filePath, (statErr, stats) => {
        if (statErr) {
          console.error(
            `Error getting file stats for ${filePath}: ${statErr.message}`
          );
          return;
        }

        // Compare the last modification time with the timestamp for 8 hours ago
        if (stats.mtime.getTime() < minutesAgo) {
          // If the file is older than 8 hours, delete it
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error(
                `Error deleting file ${filePath}: ${unlinkErr.message}`
              );
            } else {
              console.log(`File deleted: ${filePath}`);
            }
          });
        }
      });
    });
  });
};


var started = false;
var dd ;
const log1 = () => {
  console.log('log from delete files')
}

export async function POST(req, res) {
  const jsonData = await req.json();
  if (jsonData.start === true && started === false) {
     dd = cron.schedule('* * * * *', () => deleteFiles(60));
  //  dd = cron.schedule('*/5 * * * * *', () => log1());
  //   log1();
  started = true;
  }
  if (jsonData.start === false && started === true) {
  started = false;
  dd.stop();

  }
  if(jsonData.start==='now' ){
    deleteFiles(0.001);
  }
  const response = new Response(JSON.stringify({ started: started }));
  return response;
}
export async function GET(req, res) {
  const response = new Response(JSON.stringify({ started: started }));
  return response;
}