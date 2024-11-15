from solana.rpc.async_api import AsyncClient
from solana.rpc.types import TokenAccountOpts
from solana.publickey import PublicKey
from solana.transaction import Transaction
from solana.system_program import TransferParams, transfer
from spl.token.constants import TOKEN_PROGRAM_ID
from spl.token.async_client import AsyncToken
from spl.token.instructions import transfer_checked
from metaplex.solana.utils import get_nft_holders
import asyncio

# Initialize Solana Client
async def get_solana_client():
    return AsyncClient("https://api.mainnet-beta.solana.com")

# Function to get holders of an NFT collection
async def get_nft_holders(client: AsyncClient, collection_address: str):
    holders = await get_nft_holders(client, collection_address)
    return holders

# Function to airdrop tokens to all NFT holders
async def airdrop_tokens(client: AsyncClient, token_mint_address: str, sender_pubkey: PublicKey, holders: list, amount: float):
    token_mint = PublicKey(token_mint_address)
    transactions = []

    for holder in holders:
        holder_pubkey = PublicKey(holder)
        transaction = Transaction()

        # Create token transfer instruction
        transfer_instruction = transfer_checked(
            source=sender_pubkey,
            dest=holder_pubkey,
            mint=token_mint,
            owner=sender_pubkey,
            amount=int(amount * 10**9),  # Assume token has 9 decimals
            decimals=9
        )
        transaction.add(transfer_instruction)
        transactions.append(transaction)

    # Send all transactions
    for tx in transactions:
        await client.send_transaction(tx, sender_pubkey)

# Main function
async def main():
    # Setup variables
    collection_address = "89rrGCbNrxpBHjss3fc8nJLbvbnDWyBTeonefrNUC2mK"
    token_mint_address = "2kBzHjLgm9rwrbZikLk1dkx1Bt56Spc4cjdYH8Hh89Em"
    sender_privkey = "5gbyiKPv9cob13gjhxGu8bvUswcPLK6G8sgTDjgbeAautey9FbdGWx5tm12ct69FCZxiWHcazDTdV85vAJg3zpZz"  # Use your wallet private key here

    client = await get_solana_client()
    
    # Get the list of NFT holders
    holders = await get_nft_holders(client, collection_address)
    
    # Airdrop a specific token to each holder
    await airdrop_tokens(client, token_mint_address, PublicKey(sender_privkey), holders, amount=69)  # Airdrop 1 token to each

    # Close the client connection
    await client.close()

# Run the main function
if __name__ == "__main__":
    asyncio.run(main())
