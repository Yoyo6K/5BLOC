import React, { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import PropertyNFTABI from '../PropertyNFTABI.json';
import deployedContract from '../deployedContract.json';

export const BlockchainContext = createContext();

export const BlockchainProvider = ({ children }) => {
  const [account, setAccount] = useState(localStorage.getItem('account') || null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  // Fonction pour connecter le wallet via MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Utilisation de BrowserProvider pour ethers v6
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await web3Provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
        localStorage.setItem('account', accounts[0]);
        setProvider(web3Provider);
      } catch (error) {
        console.error("Erreur lors de la connexion au wallet :", error);
      }
    } else {
      alert("Veuillez installer MetaMask");
    }
  };

  useEffect(() => {
    const initializeProvider = async () => {
      if (account && window.ethereum) {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(web3Provider);
      }
    };
    initializeProvider();
  }, [account]);

  useEffect(() => {
    console.log("contract 1");
    if (account && provider) {
      console.log("contract 2");
      const loadContract = async () => {
        const contractAddress = deployedContract.address; // Assurez-vous que ce fichier se trouve dans frontend/src
        // Utilisez le provider pour créer l'instance du contrat pour supporter les appels en lecture
        const instance = new ethers.Contract(contractAddress, PropertyNFTABI, provider);
        setContract(instance);
      };
      loadContract();
    }
  }, [account, provider]);

  return (
    <BlockchainContext.Provider value={{ account, connectWallet, contract }}>
      {children}
    </BlockchainContext.Provider>
  );
};