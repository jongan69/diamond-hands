// route.ts
export async function POST(
    request: Request
) {
    const body = await request.json();
    const mintAddress = body.mint;
    const url = `https://price.jup.ag/v6/price?ids=${mintAddress}&showExtraInfo=true`;

    try {
        const response = await fetch(url, { cache: 'no-store' })
            .then(res => res.json())
        // console.log(response)
        const price = response.data[mintAddress].price;
        if (price) {
            return Response.json({ price, uiFormmatted: `$${price.toFixed(3)}`});
        } else {
            return Response.json({ error: 'failed to load data' })
        }
    } catch (error: any) {
        console.error(`Error fetching price data: ${error}`);
        return Response.json({ error: 'failed to load data' })
    }
}