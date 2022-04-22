import { ContractKitProvider, Alfajores, NetworkNames } from '@celo-tools/use-contractkit';
import '@celo-tools/use-contractkit/lib/styles.css';
import React from 'react';
import { Home } from '../src/Components/Home';



function WrappedApp() {
  return (
    <ContractKitProvider
      dapp={{
        name: "My awesome dApp",
        description: "My awesome description",
        url: "https://example.com",
      }}
      networks={[Alfajores]}
      network={{
        name: NetworkNames.Alfajores,
        rpcUrl: 'https://alfajores-forno.celo-testnet.org',
        graphQl: 'https://alfajores-blockscout.celo-testnet.org/graphiql',
        explorer: 'https://alfajores-blockscout.celo-testnet.org',
        chainId: 44787,
      }}
    >
      <Home />
    </ContractKitProvider>
  );
}
export default WrappedApp;