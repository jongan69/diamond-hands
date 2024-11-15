// route.ts
export async function POST(
    request: Request
) {
    const body = await request.json();
    const mintAddress = body.mint;
    const url = `https://price.jup.ag/v6/price?ids=${mintAddress}`;

    try {
        const response = await fetch(url, { cache: 'no-store' })
            .then(res => res.json())
        const price = response.data[mintAddress].price;
        return Response.json({ price, uiFormmatted: `$${price.toFixed(3)}`});
    } catch (error: any) {
        console.error(`Error fetching price data: ${error}`);
        return Response.json({ error: 'failed to load data' })
    }
}