import React, { useContext } from 'react';
import { BlockchainContext } from '../context/BlockchainContext';

const WalletConnect = () => {
  const { connectWallet, account } = useContext(BlockchainContext);

  return (
    <div>
      {account ? (
        <p>Connecté : {account}</p>
      ) : (
        <button onClick={connectWallet}>Connexion Wallet</button>
      )}
    </div>
  );
};

export default WalletConnect;