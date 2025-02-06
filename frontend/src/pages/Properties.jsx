import React, { useEffect, useState, useContext } from 'react';
import { BlockchainContext } from '../context/BlockchainContext';
import { ethers } from 'ethers';
import PropertyCard from '../components/PropertyCard';

const Properties = () => {
  const { contract } = useContext(BlockchainContext);
  const [properties, setProperties] = useState([]);  // On garde un tableau de propriétés
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProperties = async () => {
      if (contract) {
        try {
          const tokenCount = await contract.getTokenCount();  // Appel de la nouvelle fonction du contrat
          const allProperties = [];  // Tableau pour stocker toutes les propriétés

          for (let i = 1; i <= tokenCount; i++) {
            const prop = await contract.properties(i);  // Récupère chaque propriété par son ID

            // Vérifie si prop.createdAt et prop.lastTransferAt sont des BigNumber ou non
            const createdAt = prop.createdAt.toNumber ? prop.createdAt.toNumber() : Number(prop.createdAt);
            const lastTransferAt = prop.lastTransferAt.toNumber ? prop.lastTransferAt.toNumber() : Number(prop.lastTransferAt);

            allProperties.push({
              name: prop.name,
              propertyType: prop.propertyType,
              location: prop.location,
              value: ethers.formatEther(prop.value),  // Assure-toi de convertir correctement la valeur
              surface: prop.surface.toString(),
              documentHash: prop.documentHash,
              imageHash: prop.imageHash,
              createdAt: new Date(createdAt * 1000).toLocaleString(),  // Converti le timestamp
              lastTransferAt: new Date(lastTransferAt * 1000).toLocaleString(),  // Converti le timestamp
              previousOwners: prop.previousOwners || [],  // Assure-toi que ce soit un tableau
            });
          }

          setProperties(allProperties);  // Mets à jour l'état avec toutes les propriétés
        } catch (error) {
          console.error("Erreur lors du chargement des propriétés :", error);
        }
        setLoading(false);
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
          <PropertyCard key={index} property={property} />  // Utilisation de la carte pour chaque propriété
        ))}
      </div>
    </div>
  );
};

export default Properties;
