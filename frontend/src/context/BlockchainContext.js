import React, { createContext, useState, useEffect } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';


export const BlockchainContext = createContext();

export const BlockchainProvider = ({ children }) => {
const [account, setAccount] = useState(null);
const [provider, setProvider] = useState(null);
const [contract, setContract] = useState(null);

const connectWallet = async () => {
    if (window.ethereum) {
        const web3Provider = new Web3Provider(window.ethereum, "any");
        const accounts = await web3Provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
        setProvider(web3Provider);
    } else {
        alert("Installez Metamask");
    }
};


useEffect(() => {
    if (provider) {
    const loadContract = async () => {
        const contractAddress = "0xYourSmartContractAddress";
        const contractABI = [ /* ABI du smart contract */ ];
        const signer = provider.getSigner();
        const instance = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(instance);
    };
    loadContract();
    }
}, [provider]);

return (
    <BlockchainContext.Provider value={{ account, connectWallet, contract }}>
    {children}
    </BlockchainContext.Provider>
);
};