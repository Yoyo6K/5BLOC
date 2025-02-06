import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { BlockchainContext } from '../context/BlockchainContext';
import PropertyCard from '../components/PropertyCard';

const Properties = () => {
  const { contract } = useContext(BlockchainContext);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    if (contract) {
      const fetchProperties = async () => {
        const tokens = await contract.getProperties();
        setProperties(tokens);
      };
      fetchProperties();
    }
  }, [contract]);

  return (
    <div>
      <h2>All Properties</h2>
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

export default Properties;
