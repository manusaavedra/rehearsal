export async function GET(req) {
    const searchParams = req.nextUrl.searchParams
    const url = searchParams.get('url')

    const response = await fetch(url);
    const html = await response.text();
    return Response.json({ text: html })
}