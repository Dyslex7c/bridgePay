import { 
    createConfig, 
    http, 
    cookieStorage,
    createStorage
  } from 'wagmi'
  import { sepolia, baseSepolia, arbitrumSepolia, optimismSepolia, avalancheFuji } from 'wagmi/chains'
  
  export function getConfig() {
    return createConfig({
      chains: [sepolia, arbitrumSepolia, optimismSepolia, avalancheFuji, baseSepolia],
      ssr: true,
      storage: createStorage({
        storage: cookieStorage,
      }),
      transports: {
        [sepolia.id]: http(),
        [arbitrumSepolia.id]: http(),
        [optimismSepolia.id]: http(),
        [avalancheFuji.id]: http(),
        [baseSepolia.id]: http(),
      },
    })
  }