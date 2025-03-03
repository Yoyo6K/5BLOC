import React, { useState, useEffect, useContext } from 'react';
import { BlockchainContext } from '../context/BlockchainContext';
import { ethers } from 'ethers';
import PropertyCard from '../components/PropertyCard';
import '../assets/css/Properties.css';

const Exchange = () => {
  const { contract, account } = useContext(BlockchainContext);
  const [myTokens, setMyTokens] = useState([]);             // Liste d'objets de tokens appartenant à l'utilisateur
  const [availableTokens, setAvailableTokens] = useState([]); // Liste d'objets de tokens appartenant aux autres
  const [selectedMyTokens, setSelectedMyTokens] = useState([]);
  const [selectedAvailableTokens, setSelectedAvailableTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTokens = async () => {
      if (contract && account) {
        try {
          const props = await contract.getAllProperties();
          console.log("Toutes les propriétés :", props);
          const myTokensTemp = [];
          const availableTokensTemp = [];

          for (let i = 0; i < props.length; i++) {
            const tokenId = i + 1;
            let currentOwner;
            try {
              currentOwner = await contract.ownerOf(tokenId);
            } catch (error) {
              console.log(`Token ${tokenId} n'existe pas ou a été brûlé`);
              continue;
            }

            // Construire un objet détaillé
            const createdAt = props[i].createdAt.toNumber ? props[i].createdAt.toNumber() : Number(props[i].createdAt);
            const lastTransferAt = props[i].lastTransferAt.toNumber ? props[i].lastTransferAt.toNumber() : Number(props[i].lastTransferAt);

            const propertyObj = {
              tokenId,
              name: props[i].name,
              propertyType: props[i].propertyType,
              location: props[i].location,
              value: ethers.formatEther(props[i].value),
              surface: props[i].surface.toString(),
              documentHash: props[i].documentHash,
              imageHash: props[i].imageHash,
              createdAt: new Date(createdAt * 1000).toLocaleString(),
              lastTransferAt: new Date(lastTransferAt * 1000).toLocaleString(),
              forSale: props[i].forSale,
              salePrice: ethers.formatEther(props[i].salePrice),
              previousOwners: props[i].previousOwners || []
            };

            if (currentOwner.toLowerCase() === account.toLowerCase()) {
              myTokensTemp.push(propertyObj);
            } else {
              availableTokensTemp.push(propertyObj);
            }
          }

          setMyTokens(myTokensTemp);
          setAvailableTokens(availableTokensTemp);
        } catch (error) {
          console.error("Erreur lors du chargement des tokens :", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadTokens();
  }, [contract, account]);

  const toggleMyToken = (propertyObj) => {
    if (selectedMyTokens.find(p => p.tokenId === propertyObj.tokenId)) {
      setSelectedMyTokens(selectedMyTokens.filter(p => p.tokenId !== propertyObj.tokenId));
    } else {
      setSelectedMyTokens([...selectedMyTokens, propertyObj]);
    }
  };

  const toggleAvailableToken = (propertyObj) => {
    if (selectedAvailableTokens.find(p => p.tokenId === propertyObj.tokenId)) {
      setSelectedAvailableTokens(selectedAvailableTokens.filter(p => p.tokenId !== propertyObj.tokenId));
    } else {
      setSelectedAvailableTokens([...selectedAvailableTokens, propertyObj]);
    }
  };

  const handleExchange = async () => {
    if (selectedMyTokens.length === 0 || selectedAvailableTokens.length === 0) {
      alert("Veuillez sélectionner au moins un token de chaque côté.");
      return;
    }
    try {
      // Exemple : Pour cet exemple, nous échangeons token par token en paires.
      // Vous pouvez adapter la logique pour gérer un échange multiple en une seule transaction.
      for (let i = 0; i < Math.min(selectedMyTokens.length, selectedAvailableTokens.length); i++) {
        const tokenA = selectedMyTokens[i];
        const tokenB = selectedAvailableTokens[i];
        const tx = await contract.exchangeTokens(tokenA.tokenId, tokenB.tokenId);
        await tx.wait();
      }
      alert("Échange(s) réussi(s) !");
      // Réinitialiser la sélection
      setSelectedMyTokens([]);
      setSelectedAvailableTokens([]);
    } catch (error) {
      console.error("Erreur lors de l'échange multiple :", error);
      alert("Erreur lors de l'échange. Consultez la console pour plus de détails.");
    }
  };

  if (loading) {
    return <p>Chargement des tokens pour l'échange...</p>;
  }

  return (
    <div>
      <h2>Échanger des tokens</h2>
      <div style={{ display: 'flex', gap: '30px' }}>
        <div>
          <h3>Mes Tokens</h3>
          <div className="property-list">
            {myTokens.length ? (
              myTokens.map((propertyObj) => {
                const isSelected = selectedMyTokens.find(p => p.tokenId === propertyObj.tokenId);
                return (
                  <PropertyCard
                    key={propertyObj.tokenId}
                    property={propertyObj}
                    isOwnerView={true}
                    selectable={true}
                    isSelected={!!isSelected}
                    onSelect={() => toggleMyToken(propertyObj)}
                  />
                );
              })
            ) : (
              <p>Vous ne possédez aucun token.</p>
            )}
          </div>
        </div>

        <div>
          <h3>Tokens Disponibles</h3>
          <div className="property-list">
            {availableTokens.length ? (
              availableTokens.map((propertyObj) => {
                const isSelected = selectedAvailableTokens.find(p => p.tokenId === propertyObj.tokenId);
                return (
                  <PropertyCard
                    key={propertyObj.tokenId}
                    property={propertyObj}
                    isOwnerView={false}
                    selectable={true}
                    isSelected={!!isSelected}
                    onSelect={() => toggleAvailableToken(propertyObj)}
                  />
                );
              })
            ) : (
              <p>Aucun token disponible pour l'échange.</p>
            )}
          </div>
        </div>
      </div>

      <button onClick={handleExchange} style={{ marginTop: '20px' }}>
        Procéder à l'échange
      </button>

      {selectedMyTokens.length > 0 && selectedAvailableTokens.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4>Résumé de votre sélection :</h4>
          <p>
            <strong>Mes tokens sélectionnés :</strong>{" "}
            {selectedMyTokens.map(p => `#${p.tokenId} (${p.propertyType}, value=${p.value})`).join(", ")}
          </p>
          <p>
            <strong>Tokens disponibles sélectionnés :</strong>{" "}
            {selectedAvailableTokens.map(p => `#${p.tokenId} (${p.propertyType}, value=${p.value})`).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
};

export default Exchange;