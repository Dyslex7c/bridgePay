"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { type State, WagmiProvider } from "wagmi";
import "@rainbow-me/rainbowkit/styles.css";

import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { getConfig } from "./config";
import { useTheme } from "@/components/theme-provider";

function RainbowKitWrapper({ children }: { children: ReactNode }) {
    const { isDark } = useTheme();
  
    return (
      <div key={isDark ? "dark" : "light"}>
        <RainbowKitProvider
          modalSize="compact"
          theme={
            isDark
              ? darkTheme({
                  accentColor: "transparent",
                  accentColorForeground: "white",
                  borderRadius: "small",
                  fontStack: "system",
                  overlayBlur: "small",
                })
              : lightTheme({
                  accentColor: "transparent",
                  accentColorForeground: "black",
                  borderRadius: "small",
                  fontStack: "system",
                  overlayBlur: "small",
                })
          }
          initialChain={11155111}
        >
          {children}
        </RainbowKitProvider>
      </div>
    );
  }  

type Props = {
    children: ReactNode;
    initialState: State | undefined;
};

export function Providers({ children, initialState }: Props) {
    const [config] = useState(() => getConfig());
    const [queryClient] = useState(() => new QueryClient());

    return (
        <WagmiProvider config={config} initialState={initialState}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitWrapper>
                    {children}
                </RainbowKitWrapper>
            </QueryClientProvider>
        </WagmiProvider>
    );
}