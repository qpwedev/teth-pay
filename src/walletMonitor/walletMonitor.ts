import * as ethers from 'ethers';
import IAccounts from './IAccounts';

class WalletMonitor {
    walletAddress: string;
    apiKey: string;
    accounts: IAccounts[];
    provider: ethers.providers.AlchemyProvider;

    constructor(walletAddress: string, apiKey: string, wallets: any) {
        this.accounts = wallets;
        this.walletAddress = walletAddress;
        this.apiKey = apiKey;
        this.provider = new ethers.providers.AlchemyProvider("goerli", apiKey);
    }

    async getTransactionDetails(txHash: string) {
        try {
            const tx = await this.provider.getTransaction(txHash);
            const value = ethers.utils.parseEther(ethers.utils.formatEther(tx.value));

            if (tx && tx.from && tx.to && tx.value) {
                const isBorrower = this.accounts.some(
                    (account) => account.address === tx.from && account.amount <= parseFloat(ethers.utils.formatEther(value))
                );

                if (isBorrower) {
                    this.accounts = this.accounts.filter(account => account.address !== tx.from);

                    console.log(`Borrower returned money: ${tx.from}`);
                    console.log(`Current borrowers: ${this.accounts.length}`);
                } else {
                    console.log("Not a borrower");
                }
            } else {
                console.log("Non-payment action");
            }
        } catch (error: any) {
            console.error(`Error fetching transaction details for ${txHash}:`, error.message);
        }
    }

    async handle() {
        const currentBlockNumber = await this.provider.getBlockNumber();
    
        this.provider.on("block", async (blockNumber: number) => {
            if (!this.accounts || this.accounts.length === 0) {
                console.log("Grats! No borrowers.");
                process.exit(0);
            }
    
            try {
                const block = await this.provider.getBlockWithTransactions(blockNumber);
                const incomingTxs = block.transactions.filter(
                    (tx: ethers.providers.TransactionResponse) => tx.to === this.walletAddress
                );
    
                for (const tx of incomingTxs) {
                    console.log("New transaction detected:", tx);
                    await this.getTransactionDetails(tx.hash);
                }
            } catch (error: any) {
                console.error(`Error fetching transactions for block ${blockNumber}:`, error.message);
            }
        });
    }
    

    async monitor() {
        if (!this.accounts || this.accounts.length === 0) {
            console.log("Grats! No borrowers.");
            process.exit(0);
        }

        console.log(`Monitoring transactions for address: ${this.walletAddress}`);
        await this.handle();
    }
}

export default WalletMonitor;
