import React, { useState, useEffect, useContext } from 'react';
import { BlockchainContext } from '../context/BlockchainContext';

const Properties = () => {
  const { contract } = useContext(BlockchainContext);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      if (contract) {
        const data = await contract.getProperties();
        setProperties(data);
      }
    };
    fetchProperties();
  }, [contract]);

  return (
    <div>
      <h2>Biens disponibles</h2>
      <ul>
        {properties.map((property, index) => (
          <li key={index}>{property.name} - {property.value} ETH</li>
        ))}
      </ul>
    </div>
  );
};

export default Properties;
