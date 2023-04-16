import { UniversalProvider } from "@walletconnect/universal-provider";
import { config } from "dotenv";
config();

const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;
const RELAY_URL = process.env.NEXT_PUBLIC_RELAY_URL;

async function getConnectionUri() {
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

  try {
    provider
      .connect({
        namespaces: {
          eip155: {
            methods: ["eth_sendTransaction"],
            chains: [`eip155:${chainId}`],
            events: ["chainChanged", "accountsChanged"],
            rpcMap: {},
          },
        },
      })
      .then((session) => {
        console.log("provider", provider);
      });
  }
  catch (e) {
    console.log("error", e);
  }


  const uri = await uriPromise;

  return uri;
}

export {
  getConnectionUri
}