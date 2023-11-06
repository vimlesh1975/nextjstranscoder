import excuteQuery from './db';

export async function POST(req, res) {
  const body = await req.json();
  const aa = await excuteQuery({ query: body.query });
  return new Response(JSON.stringify(aa));
}
