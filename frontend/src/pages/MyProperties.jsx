import React, { useEffect, useState, useContext } from 'react';
import { BlockchainContext } from '../context/BlockchainContext';
import { ethers } from 'ethers';
import PropertyCard from '../components/PropertyCard';

const MyProperties = () => {
  const { contract, account } = useContext(BlockchainContext);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      if (contract && account) {
        try {
          // Récupérer toutes les propriétés via la fonction getAllProperties()
          const props = await contract.getAllProperties();
          console.log("Propriétés récupérées :", props);
          const myProperties = [];
          // On suppose que props est un tableau où l'index 0 correspond au tokenId 1, etc.
          for (let i = 0; i < props.length; i++) {
            const tokenId = i + 1;
            // Récupérer le propriétaire actuel du token
            const currentOwner = await contract.ownerOf(tokenId);
            if (currentOwner.toLowerCase() === account.toLowerCase()) {
              const prop = props[i];
              const createdAt = prop.createdAt.toNumber ? prop.createdAt.toNumber() : Number(prop.createdAt);
              const lastTransferAt = prop.lastTransferAt.toNumber ? prop.lastTransferAt.toNumber() : Number(prop.lastTransferAt);
              myProperties.push({
                tokenId,
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
              });
            }
          }
          setProperties(myProperties);
        } catch (error) {
          console.error("Erreur lors du chargement des propriétés :", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProperties();
  }, [contract, account]);

  if (loading) {
    return <p>Chargement de mes propriétés...</p>;
  }

  if (!properties.length) {
    return <p>Aucune propriété trouvée.</p>;
  }

  return (
    <div>
      <h2>Mes Propriétés</h2>
      <div className="property-list">
        {properties.map((property) => (
          <PropertyCard key={property.tokenId} property={property} />
        ))}
      </div>
    </div>
  );
};

export default MyProperties;