import React, { useEffect, useState, useContext } from 'react';
import { BlockchainContext } from '../context/BlockchainContext';
import { ethers } from 'ethers';
import PropertyCard from '../components/PropertyCard';
import '../assets/css/Properties.css';

const Properties = () => {
  const { contract } = useContext(BlockchainContext);
  const [properties, setProperties] = useState([]);  // Tableau de propriétés
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProperties = async () => {
      if (contract) {
        try {
          const props = await contract.getAllProperties();
          console.log("Propriétés récupérées :", props);
          const formattedProperties = props.map((prop, index) => {
            const createdAt = prop.createdAt.toNumber ? prop.createdAt.toNumber() : Number(prop.createdAt);
            const lastTransferAt = prop.lastTransferAt.toNumber ? prop.lastTransferAt.toNumber() : Number(prop.lastTransferAt);
            
            return {
              tokenId: index, 
              name: prop.name,
              propertyType: prop.propertyType,
              location: prop.location,
              value: ethers.formatEther(prop.value),
              surface: prop.surface.toString(),
              documentHash: prop.documentHash,
              imageHash: prop.imageHash,
              createdAt: new Date(createdAt * 1000).toLocaleString(),
              lastTransferAt: new Date(lastTransferAt * 1000).toLocaleString(),
              forSale: prop.forSale,
              salePrice: ethers.formatEther(prop.salePrice),
              previousOwners: prop.previousOwners || []
            };
          });
          setProperties(formattedProperties);
        } catch (error) {
          console.error("Erreur lors du chargement des propriétés :", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadProperties();
  }, [contract]);

  if (loading) {
    return <p>Chargement des propriétés...</p>;
  }

  if (!properties.length) {
    return <p>Aucune propriété trouvée.</p>;
  }

  return (
    <div>
      <h2>Propriétés disponibles</h2>
      <div className="property-list">
        {properties.map((property, index) => (
          <PropertyCard key={index} property={property} />
        ))}
      </div>
    </div>
  );
};

export default Properties;