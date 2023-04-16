import * as encoding from "@walletconnect/encoding";
import { BigNumber, utils, providers } from "ethers";
import axios, { AxiosInstance } from "axios";
import { UniversalProvider } from "@walletconnect/universal-provider";
import { config } from "dotenv";
config();

interface IFormattedRpcResponse {
  method: string;
  address: string;
  valid: boolean;
  result: string;
}

export interface GasPrice {
  time: number;
  price: number;
}

export interface GasPrices {
  timestamp: number;
  slow: GasPrice;
  average: GasPrice;
  fast: GasPrice;
}

const ethereumApi: AxiosInstance = axios.create({
  baseURL: "https://ethereum-api.xyz",
  timeout: 30000, // 30 secs
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const apiGetGasPrices = async (): Promise<GasPrices> => {
  const response = await ethereumApi.get(`/gas-prices`);
  const { result } = response.data;
  return result;
};

export async function getGasPrice(chainId: string): Promise<string> {
  if (chainId === "eip155:1") return toWad("20", 9).toHexString();
  const gasPrices = await apiGetGasPrices();
  return toWad(`${gasPrices.slow.price}`, 9).toHexString();
}

export async function formatTestTransaction(
  account: string,
  provider: providers.JsonRpcProvider
) {
  let tx;
  try {
    const [namespace, reference, address] = account.split(":");

    console.log("namespace");
    const _nonce = await provider.getTransactionCount(address);
    console.log("_nonce", _nonce);
    const nonce = encoding.sanitizeHex(encoding.numberToHex(_nonce));

    const _gasPrice = await getGasPrice(reference);
    console.log("_gasPrice", _gasPrice);
    const gasPrice = encoding.sanitizeHex(_gasPrice);

    const _gasLimit = 21000;
    const gasLimit = encoding.sanitizeHex(encoding.numberToHex(_gasLimit));

    const _value = 0;
    const value = encoding.sanitizeHex(encoding.numberToHex(_value));

    tx = {
      from: address,
      to: address,
      data: "0x",
      nonce,
      gasPrice,
      gasLimit,
      value,
    };
  } catch (error) {
    console.log("error", error);
  }

  return tx;
}

export const toWad = (amount: string, decimals = 18): BigNumber => {
  return utils.parseUnits(sanitizeDecimals(amount, decimals), decimals);
};

export const sanitizeDecimals = (value: string, decimals = 18): string => {
  const [integer, fractional] = value.split(".");
  const _fractional = fractional
    ? fractional.substring(0, decimals).replace(/0+$/gi, "")
    : undefined;
  return _fractional ? [integer, _fractional].join(".") : integer;
};

export const testSendTransaction: (
  web3Provider: any
) => Promise<IFormattedRpcResponse> = async (web3Provider) => {
  if (!web3Provider) {
    throw new Error("web3Provider not connected");
  }

  console.log("web3Provider", web3Provider);

  const { chainId } = await web3Provider.getNetwork();
  console.log("chainId", chainId);
  const [address] = await web3Provider.listAccounts();
  console.log("address", address);
  const balance = await web3Provider.getBalance(address);
  console.log("balance", balance);

  const tx = await formatTestTransaction(
    "eip155:" + chainId + ":" + address,
    web3Provider
  );

  if (balance.lt(BigNumber.from(tx.gasPrice).mul(tx.gasLimit))) {
    return {
      method: "eth_sendTransaction",
      address,
      valid: false,
      result: "Insufficient funds for intrinsic transaction cost",
    };
  }

  const txHash = await web3Provider.send("eth_sendTransaction", [tx]);

  return {
    method: "eth_sendTransaction",
    address,
    valid: true,
    result: txHash,
  };
};
