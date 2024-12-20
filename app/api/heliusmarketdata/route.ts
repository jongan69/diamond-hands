import { NextRequest, NextResponse } from 'next/server';

interface Params {
    limit: number;
    mint: string;
    cursor?: string;
    options?: {
        showZeroBalance: boolean;
    }
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const mintAddress = body.mint;
    const api_key = process.env.HELIUS_API_KEY ?? "";
    const url = `https://mainnet.helius-rpc.com/?api-key=${api_key}`;

    let allOwners = new Set();
    let emptyWallets = new Set();
    let cursor: string | null = null;

    try {
        while (true) {
            let params: Params = {
                limit: 1000,
                mint: mintAddress,
                ...(cursor && { cursor }),
                options: {
                    showZeroBalance: true
                },
            };

            const body = {
                jsonrpc: "2.0",
                id: "lockin.chat",
                method: "getTokenAccounts",
                params: params
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!data.result || !data.result.token_accounts || data.result.token_accounts.length === 0) {
                console.log("No more results");
                break;
            }

            data.result.token_accounts.forEach((account: { owner: string; amount: string; }) => {

                if (Number(account.amount) === 0) {
                    emptyWallets.add(account.owner);
                }
                if (Number(account.amount) > 0) {
                    allOwners.add(account.owner);
                }
            });

            cursor = data.result.cursor;

            if (!cursor) {
                break;
            }
        }

        const totalHolders = allOwners.size;
        const totalEmptyWallets = emptyWallets.size;

        if (totalHolders) {
            return NextResponse.json({ totalHolders, RetardedAssJeetFaggots: totalEmptyWallets });
        } else {
            return NextResponse.json({ error: 'failed to load data' });
        }
    } catch (error: any) {
        console.error(`Error fetching token accounts: ${error}`);
        return NextResponse.json({ error: 'failed to load data' });
    }
}
