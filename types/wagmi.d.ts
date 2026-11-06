declare module "wagmi" {
  export const http: any;
  export const createConfig: any;
  export const WagmiProvider: any;
  export const useAccount: any;
  export const useConnect: any;
  export const useDisconnect: any;
  export const useChainId: any;
  export const useSwitchChain: any;
  export const useBalance: any;
  export const useReadContract: any;
  export const useWriteContract: any;
  export const useWaitForTransactionReceipt: any;
  export interface Register {
    [key: string]: any;
  }
}

declare module "@wagmi/core" {
  export const injected: any;
  export const http: any;
  export const createConfig: any;
}

