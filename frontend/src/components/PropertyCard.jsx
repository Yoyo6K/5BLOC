import React from 'react';

const PropertyCard = ({ property }) => {
  return (
    <div className="property-card">
      <img 
        src={`https://ipfs.io/ipfs/${property.imageHash}`} 
        alt={property.name} 
        className="property-image" 
      />
      <h3>{property.name}</h3>
      <p><strong>Type :</strong> {property.propertyType}</p>
      <p><strong>Localisation :</strong> {property.location}</p>
      <p><strong>Valeur :</strong> {property.value} ETH</p>
      <p><strong>Surface :</strong> {property.surface} m²</p>
      <p><strong>Date de création :</strong> {property.createdAt}</p>
      <p><strong>Dernier transfert :</strong> {property.lastTransferAt}</p>
      {property.forSale ? (
        <p><strong>Prix de vente :</strong> {property.salePrice} ETH</p>
      ) : (
        <p><strong>Non en vente</strong></p>
      )}
      <p>
        <strong>Historique des propriétaires :</strong> {property.previousOwners.length > 0 
          ? property.previousOwners.join(', ') 
          : 'Aucun propriétaire précédent'}
      </p>
      <p><strong>Hash du document :</strong> {property.documentHash}</p>
    </div>
  );
};

export default PropertyCard;