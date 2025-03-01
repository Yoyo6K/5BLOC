import React, { useEffect, useState, useContext } from 'react';
import { BlockchainContext } from '../context/BlockchainContext';
import { ethers } from 'ethers';
import PropertyCard from '../components/PropertyCard';
import '../assets/css/Properties.css';

const Properties = () => {
  const { contract, account } = useContext(BlockchainContext);
  const [availableProperties, setAvailableProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProperties = async () => {
      if (contract && account) {
        try {
          // Récupérer toutes les propriétés du contrat
          const props = await contract.getAllProperties();
          console.log("Propriétés récupérées :", props);
          const filtered = [];
          // On suppose que tokenId = index + 1
          for (let i = 0; i < props.length; i++) {
            const tokenId = i + 1;
            let currentOwner;
            try {
              currentOwner = await contract.ownerOf(tokenId);
            } catch (e) {
              // Si ownerOf échoue, le token est probablement brûlé ; on passe.
              console.log(`Token ${tokenId} est brûlé ou inexistant.`);
              continue;
            }
            // On inclut la propriété si elle est en vente et que le propriétaire n'est pas l'utilisateur connecté
            if (props[i].forSale && currentOwner.toLowerCase() !== account.toLowerCase()) {
              const createdAt = props[i].createdAt.toNumber ? props[i].createdAt.toNumber() : Number(props[i].createdAt);
              const lastTransferAt = props[i].lastTransferAt.toNumber ? props[i].lastTransferAt.toNumber() : Number(props[i].lastTransferAt);
              filtered.push({
                tokenId,
                name: props[i].name,
                propertyType: props[i].propertyType,
                location: props[i].location,
                value: ethers.formatEther(props[i].value),
                surface: props[i].surface.toString(),
                documentHash: props[i].documentHash,
                image: props[i].image, // Assurez-vous d'utiliser le champ correct (ici "image")
                createdAt: new Date(createdAt * 1000).toLocaleString(),
                lastTransferAt: new Date(lastTransferAt * 1000).toLocaleString(),
                forSale: props[i].forSale,
                salePrice: ethers.formatEther(props[i].salePrice),
                previousOwners: props[i].previousOwners || []
              });
            }
          }
          setAvailableProperties(filtered);
        } catch (error) {
          console.error("Erreur lors du chargement des propriétés disponibles :", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadProperties();
  }, [contract, account]);

  if (loading) {
    return <p>Chargement des propriétés...</p>;
  }

  if (!availableProperties.length) {
    return <p>Aucune propriété trouvée.</p>;
  }

  return (
    <div>
      <h2>Propriétés disponibles</h2>
      <div className="property-list">
        {availableProperties.map((property) => (
          <PropertyCard key={property.tokenId} property={property} isOwnerView={false} />
        ))}
      </div>
    </div>
  );
};

export default Properties;