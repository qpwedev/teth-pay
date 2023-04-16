import * as ethers from 'ethers';
import axios from 'axios';
import IAccounts from './IAccounts';
import ITransaction from './ITransaction'

class WalletMonitor {
    walletAddress: string;
    apiKey: string;
    accounts: IAccounts[];
    network: string;
    transactions: any
    etherscanKey: string

    constructor(walletAddress: string, apiKey: string, wallets: any, network: string, etherscanKey: string) {
        this.accounts = wallets;
        this.walletAddress = walletAddress;
        this.apiKey = apiKey;
        this.network = network
        this.etherscanKey = etherscanKey

        this.fetchAllTransactions(walletAddress).then((transactions) => {
            this.transactions = transactions;
        });
    }

    async fetchAllTransactions(walletAddress: string): Promise<ITransaction[]> {
        const baseUrl = this.network === 'mainnet' ? 'https://api.etherscan.io' : `https://api-${this.network}.etherscan.io`;
        const apiUrl = `${baseUrl}/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${this.etherscanKey}`;
      
        try {
            const response = await axios.get(apiUrl);
            if (response.data.status === '1') {
                return response.data.result;
            } else {
                console.error('Error fetching transactions:', response.data.message);
                return [];
            }
        } catch (error: any) {
            console.error('Error fetching transactions:', error.message);
            return [];
        }
    }

    removeBorrower(address: string) {
        this.accounts = this.accounts.filter(account => account.address.toLowerCase() !== address); 
    }

    isBorrower(tx: ITransaction) {
        const value = ethers.utils.parseEther(ethers.utils.formatEther(ethers.BigNumber.from(tx.value)));

        return this.accounts.some(
            (account) => account.address.toLowerCase() === tx.from && account.amount <= parseFloat(ethers.utils.formatEther(value))
        );
    }

    async handleUpdate() {
        const transactions = await this.fetchAllTransactions(this.walletAddress);
    
        if (this.transactions?.length < transactions.length) {
            this.transactions = transactions;

            return transactions[transactions.length - 1];
        }
        
        return null;
    }    
}

export default WalletMonitor;
