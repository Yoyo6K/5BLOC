import React, { useEffect, useState, useContext } from 'react';
import { BlockchainContext } from '../context/BlockchainContext';
import { ethers } from 'ethers';
import PropertyCard from '../components/PropertyCard';
import '../assets/css/Properties.css';

const MyProperties = () => {
  const { contract, account } = useContext(BlockchainContext);
  const [myProperties, setMyProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMyProperties = async () => {
      if (contract && account) {
        try {
          const props = await contract.getAllProperties();
          console.log("Toutes les propriétés :", props);
          const filtered = [];
          for (let i = 0; i < props.length; i++) {
            const tokenId = i + 1;
            let currentOwner;
            try {
              currentOwner = await contract.ownerOf(tokenId);
            } catch (e) {
              console.log(`Token ${tokenId} est brûlé ou inexistant.`);
              continue;
            }
            if (currentOwner.toLowerCase() === account.toLowerCase()) {
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
                image: props[i].image,
                createdAt: new Date(createdAt * 1000).toLocaleString(),
                lastTransferAt: new Date(lastTransferAt * 1000).toLocaleString(),
                forSale: props[i].forSale,
                salePrice: ethers.formatEther(props[i].salePrice),
                previousOwners: props[i].previousOwners || []
              });
            }
          }
          setMyProperties(filtered);
        } catch (error) {
          console.error("Erreur lors du chargement de mes propriétés :", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadMyProperties();
  }, [contract, account]);

  if (loading) {
    return <p>Chargement de mes propriétés...</p>;
  }

  if (!myProperties.length) {
    return <p>Aucune propriété trouvée.</p>;
  }

  return (
    <div>
      <h2>Mes Propriétés</h2>
      <div className="property-list">
        {myProperties.map((property) => (
          <PropertyCard key={property.tokenId} property={property} isOwnerView={true} />
        ))}
      </div>
    </div>
  );
};

export default MyProperties;