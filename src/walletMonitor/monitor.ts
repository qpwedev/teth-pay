import WalletMonitor from "./walletMonitor";
import {config} from 'dotenv'

config();

const walletAddress = '0x286801EBc5Bc627a3bccb16b88Ab372c35f94563';
const apiKey = process.env.API_KEY!;

const monitor = new WalletMonitor(walletAddress, apiKey, [
    {
        address: "0xfA1173eaFE53Fd657d5B754Ccb6920f778D60e5E", 
        amount: 0.001
    },
    {
        address: "0xE84C0e1e122415D065B51E672f6A1CDfdFFe7957",
        amount: 0.002
    }
]);

monitor.monitor().catch((error) => {
    console.error('Error:', error.message);
    process.exit(1);
});
