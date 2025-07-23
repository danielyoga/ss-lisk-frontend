import { type Config } from "wagmi";
import { defaultConfig } from "@xellar/kit";
import { liskSepolia } from "wagmi/chains";

const walletConnectProjectId = "04251f8180896efb96c57a0984864657" as string;
const xellarAppId = process.env.NEXT_PUBLIC_XELLAR_APP_ID as string;

export const config = defaultConfig({
  appName: "App",
  walletConnectProjectId,
  xellarAppId,
  xellarEnv: "sandbox",
  ssr: true,
  chains: [liskSepolia],
}) as Config;