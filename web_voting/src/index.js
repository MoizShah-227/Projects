import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';
import '@rainbow-me/rainbowkit/styles.css';

const chains = [sepolia];

const { connectors } = getDefaultWallets({
  appName: 'VoteChain dApp',
  projectId: 'fe9aeaa240ab7677b3f8c101e16c1407',
  chains,
});

const config = createConfig({
  connectors,
  chains: [sepolia],
  transports: {
   [sepolia.id]: http(), // 👈 This enables `usePublicClient()` properly
  },
  ssr: false,
  autoConnect: true,
});

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={chains}>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
