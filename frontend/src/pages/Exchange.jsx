import React, { useState } from 'react';
import { useContext } from 'react';
import { BlockchainContext } from '../context/BlockchainContext';

const Exchange = () => {
  const { contract, account } = useContext(BlockchainContext);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [exchangeType, setExchangeType] = useState('gare');

  const handleExchange = async () => {
    if (!contract) return;
    try {
      const method = exchangeType === 'gare' ? 'exchangeForGare' : 'exchangeForHotel';
      await contract[method](...selectedProperties);
      alert(`Exchange successful for ${exchangeType}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Exchange Properties</h2>
      <button onClick={handleExchange}>Exchange for {exchangeType}</button>
    </div>
  );
};

export default Exchange;