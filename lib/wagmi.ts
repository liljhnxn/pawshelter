import { http, createConfig } from "wagmi";
import { injected } from "@wagmi/core";
import { botchainMainnet } from "./contract";

export const config = createConfig({
  chains: [botchainMainnet],
  connectors: [
    injected({
      target: "metaMask",
    }),
    injected(),
  ],
  transports: {
    [botchainMainnet.id]: http("https://rpc.botchain.ai"),
  },
  ssr: true,
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
