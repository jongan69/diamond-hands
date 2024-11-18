// route.ts
export async function POST(
    request: Request
) {
    const body = await request.json();
    const mintAddress = body.mint;
    const url = `https://holderscan.com/api/tokens/tokens/meta?ca=${mintAddress}`;
    try {
        const response = await fetch(url, { cache: 'no-store' })
            .then(res => res.json())

        const currentHolders = response.data?.currentHolders;
        const supply = response.data?.supply;
        const marketCap = response.data?.marketCap;
        const marketCapOverHolders = response?.data?.marketCapOverHolders;
        const holdersOver10USD = response?.data?.holdersOver10USD;
        // console.log(currentHolders)
        if (currentHolders) {
            return Response.json({ currentHolders, supply, marketCap, marketCapOverHolders, holdersOver10USD });
        } else {
            // console.log(response)
            return Response.json({ error: 'failed to load data' })
        }
    } catch (error: any) {
        console.error(`Error fetching price data: ${error}`);
        return Response.json({ error: 'failed to load data' })
    }
}