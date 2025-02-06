import React from 'react';
import { useContext } from 'react';
import { BlockchainContext } from '../context/BlockchainContext';

const PropertyCard = ({ property }) => {
  const { contract } = useContext(BlockchainContext);

  return (
    <div className="property-card">
      <h3>{property.name}</h3>
      <p>Type: {property.propertyType}</p>
      <p>Location: {property.location}</p>
      <p>Value: {property.value} wei</p>
    </div>
  );
};

export default PropertyCard;