import * as encoding from "@walletconnect/encoding";
import { UniversalProvider } from "@walletconnect/universal-provider";
import { activeSessions } from "../db";
import { providers, BigNumber } from "ethers";
import { toWad, formatTestTransaction } from "./utilities";
import { config } from "dotenv";
import { editOrSend } from "../utils/utils";
import { backKeyboard } from "../markups";
config();

const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;
const RELAY_URL = process.env.NEXT_PUBLIC_RELAY_URL;

export async function sendTokens(
  web3Provider: providers.Web3Provider,
  recipientAddress: string,
  amount: string,
  currency: string
) {
  if (!web3Provider) {
    throw new Error("web3Provider not connected");
  }

  console.log("start");
  const { chainId } = await web3Provider.getNetwork();
  console.log("chainId", chainId);
  const [senderAddress] = await web3Provider.listAccounts();
  console.log("senderAddress", senderAddress);

  const tx = await formatTestTransaction(
    `eip155:${chainId}:${senderAddress}`,
    web3Provider
  );
  console.log("tx", tx);

  const _value = toWad(amount).toHexString();
  const value = encoding.sanitizeHex(_value);

  const transaction = {
    ...tx,
    to: recipientAddress,
    value,
  };

  const txHash = await web3Provider.send("eth_sendTransaction", [transaction]);

  return {
    method: "eth_sendTransaction",
    address: senderAddress,
    valid: true,
    result: txHash,
  };
}

async function getConnectionUri(ctx: any) {
  const provider = await UniversalProvider.init({
    projectId: PROJECT_ID,
    relayUrl: RELAY_URL,
  });

  const chainId = 1;
  // @ts-ignore
  let resolveUri;
  const uriPromise = new Promise((resolve) => {
    resolveUri = resolve;
  });

  provider.on("display_uri", async (uri: string) => {
    // @ts-ignore
    resolveUri(uri);
  });

  provider
    .connect({
      namespaces: {
        eip155: {
          methods: ["eth_sendTransaction"],
          chains: [`eip155:${chainId}`],
          events: ["chainChanged", "accountsChanged"],
          rpcMap: {},
        },
      }
    })
    .then(async (session) => {
      // mockup
      const web3Provider = new providers.Web3Provider(provider);
      activeSessions.set("123", web3Provider);

      editOrSend(ctx, 'Wallet connected', undefined, './img/main.jpg')
    }).catch((error) => {
      console.log("PROVIDER ERROR", error);
    }
    );

  const uri = await uriPromise;

  return uri;
}

export { getConnectionUri };
