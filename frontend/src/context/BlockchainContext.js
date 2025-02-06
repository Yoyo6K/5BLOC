import { ethers } from 'ethers';
import React, { createContext, useState, useEffect } from 'react';

export const BlockchainContext = createContext();

export const BlockchainProvider = ({ children }) => {
  const [account, setAccount] = useState(localStorage.getItem('account') || null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [contractInfo, setContractInfo] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await web3Provider.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      localStorage.setItem('account', accounts[0]);
      setProvider(web3Provider);
    } else {
      alert("Installez Metamask");
    }
  };

  useEffect(() => {
    if (account && provider) {
      const loadContract = async () => {
        const contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

        const contractABI = [
          "function getProperties() public view returns (tuple(string name, uint value)[] memory)"
        ];

        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        setContract(contract);

        const network = await provider.getNetwork();
        const deployer = await contract.deployTransaction.from; 
        const transactionHash = contract.deployTransaction.hash;
        console.log(contract);

        setContractInfo({
          address: contractAddress,
          deployer,
          transactionHash,
          network: network.name,
          chainId: network.chainId,
        });
      };

      loadContract();
    }
  }, [account, provider]);

  return (
    <BlockchainContext.Provider value={{ account, connectWallet, contract, contractInfo }}>
      {children}
    </BlockchainContext.Provider>
  );
};
