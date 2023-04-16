import { UniversalProvider } from "@walletconnect/universal-provider";
import { config } from "dotenv";
config();

const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;
const DEFAULT_LOGGER = "debug";
const RELAY_URL = process.env.NEXT_PUBLIC_RELAY_URL;

async function getConnectionUri() {
  const provider = await UniversalProvider.init({
    projectId: PROJECT_ID,
    logger: DEFAULT_LOGGER,
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
      },
    })
    .then((session) => {
      console.log("provider", provider);
    });

  const uri = await uriPromise;

  return { uri };
}
