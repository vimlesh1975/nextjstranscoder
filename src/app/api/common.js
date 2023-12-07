import fs from 'fs';

export const deleteAFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting file:', err);
    } else {
      // console.log(filePath + ' deleted successfully');
    }
  });
};
