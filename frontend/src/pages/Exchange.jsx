import React, { useState, useEffect, useContext } from 'react';
import { BlockchainContext } from '../context/BlockchainContext';

const Exchange = () => {
  const { contract, account } = useContext(BlockchainContext);
  const [myTokens, setMyTokens] = useState([]);       // Tokens appartenant à l'utilisateur
  const [availableTokens, setAvailableTokens] = useState([]); // Tokens disponibles (non possédés par account)
  const [selectedMyToken, setSelectedMyToken] = useState(null);
  const [selectedAvailableToken, setSelectedAvailableToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTokens = async () => {
      if (contract && account) {
        try {
          const props = await contract.getAllProperties();
          const myTokensTemp = [];
          const availableTokensTemp = [];
          for (let i = 0; i < props.length; i++) {
            const tokenId = i + 1;
            try {
              const currentOwner = await contract.ownerOf(tokenId);
              if (currentOwner.toLowerCase() === account.toLowerCase()) {
                myTokensTemp.push(tokenId);
              } else {
                availableTokensTemp.push(tokenId);
              }
            } catch (e) {
              // token non existant ou brûlé
              continue;
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

  const handleExchange = async () => {
    if (!selectedMyToken || !selectedAvailableToken) {
      alert("Veuillez sélectionner un token parmi vos tokens et un token disponible.");
      return;
    }
    try {
      const tx = await contract.exchangeTokens(selectedMyToken, selectedAvailableToken);
      await tx.wait();
      alert("Échange réussi !");
      setSelectedMyToken(null);
      setSelectedAvailableToken(null);
    } catch (error) {
      console.error("Erreur lors de l'échange :", error);
      alert("Erreur lors de l'échange. Consultez la console pour plus de détails.");
    }
  };

  if (loading) return <p>Chargement des tokens pour l'échange...</p>;

  return (
    <div>
      <h2>Échanger des tokens</h2>
      <div>
        <h3>Mes Tokens</h3>
        {myTokens.length ? (
          myTokens.map((tokenId) => (
            <button
              key={tokenId}
              onClick={() => setSelectedMyToken(tokenId)}
              style={{
                backgroundColor: selectedMyToken === tokenId ? 'lightgreen' : ''
              }}
            >
              Token #{tokenId}
            </button>
          ))
        ) : (
          <p>Vous ne possédez aucun token.</p>
        )}
      </div>
      <div>
        <h3>Tokens Disponibles</h3>
        {availableTokens.length ? (
          availableTokens.map((tokenId) => (
            <button
              key={tokenId}
              onClick={() => setSelectedAvailableToken(tokenId)}
              style={{
                backgroundColor: selectedAvailableToken === tokenId ? 'lightblue' : ''
              }}
            >
              Token #{tokenId}
            </button>
          ))
        ) : (
          <p>Aucun token disponible pour l'échange.</p>
        )}
      </div>
      <button onClick={handleExchange}>Procéder à l'échange</button>
    </div>
  );
};

export default Exchange;