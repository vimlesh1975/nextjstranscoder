import excuteQuery from '../db';
import { getObjectUrl } from '../uploadToS3';
const thumbnail1location = process.env.thumbnail1location1;
const proxy1location = process.env.proxy1location1;
const orderbyforgallery = process.env.orderbyforgallery;


export async function GET(req, res) {
  const response1 = await excuteQuery({
    query:
      "SELECT * FROM  media where MediaType='Video' or MediaType='Image' "+ orderbyforgallery,
  });
  if (Array.isArray(response1)) {
    const urls = await Promise.all(response1.map(element => getObjectUrl(thumbnail1location + element.MediaID + '_th1.jpg')));
    const videoUrls = await Promise.all(response1.map(element => getObjectUrl(proxy1location + element.MediaID + '_proxy1.mp4')));
    const response = new Response(JSON.stringify({ media: response1, urls, videoUrls }));
    return response;
  }
  else {
    const response=new Response(JSON.stringify({}));;
    return response;
  }
}
