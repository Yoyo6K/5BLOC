import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { BlockchainContext } from '../context/BlockchainContext';
import PropertyCard from '../components/PropertyCard';

const MyProperties = () => {
  const { contract, account } = useContext(BlockchainContext);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    if (contract && account) {
      const fetchProperties = async () => {
        const tokens = await contract.getPropertiesOwnedBy(account);
        setProperties(tokens);
      };
      fetchProperties();
    }
  }, [contract, account]);

  return (
    <div>
      <h2>My Properties</h2>
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

export default MyProperties;