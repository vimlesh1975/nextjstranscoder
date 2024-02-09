import excuteQuery from '../db';

export async function POST(req, res) {
  const jsonData = await req.json();
 const dd= await excuteQuery({query:jsonData.query})
  const response = new Response(JSON.stringify({ dd}));
  return response;
}
