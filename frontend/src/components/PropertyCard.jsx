import React, { useState, useContext } from 'react';
import "../assets/css/PropertyCard.css";
import { BlockchainContext } from "../context/BlockchainContext";
import { ethers } from "ethers";

const PropertyCard = ({
  property,
  isOwnerView = false,
  selectable = false,
  isSelected = false,
  onSelect = () => {}
}) => {
  const [showModal, setShowModal] = useState(false);
  const { contract } = useContext(BlockchainContext);

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleBuy = async () => {
    console.log("Données de la propriété :", property);
    if (!contract || !property) {
      alert("Le contrat ou la propriété n'est pas chargé.");
      return;
    }
  
    try {
      const salePriceWei = ethers.parseEther(property.salePrice);
      const tx = await contract.buyProperty(property.tokenId, { value: salePriceWei });
      await tx.wait();
      alert("Achat réussi !");
    } catch (error) {
      console.error("Erreur lors de l'achat :", error);
      alert("Erreur lors de l'achat. Consultez la console pour plus de détails.");
    }
  };

  return (
    <>
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
        <button className="learn-more-button" onClick={handleModalOpen}>En savoir plus</button>
        
        {/* Bouton d'achat affiché uniquement si on n'est pas dans la vue propriétaire */}
        {(!isOwnerView && property.forSale) ? (
          <div>
            <p><strong>Prix de vente :</strong> {property.salePrice} ETH</p>
            <button className="buy-button" onClick={handleBuy}>Acheter</button>
          </div>
        ) : (!isOwnerView ? (
          <p><strong>Non en vente</strong></p>
        ) : null)}

        {/* Bouton de sélection affiché uniquement si selectable est true */}
        {selectable && (
          <button className="select-button" onClick={onSelect}>
            {isSelected ? "Désélectionner" : "Sélectionner"}
          </button>
        )}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={handleModalClose}>&times;</span>
            <p><strong>Surface :</strong> {property.surface} m²</p>
            <p><strong>Date de création :</strong> {property.createdAt}</p>
            <p><strong>Dernier transfert :</strong> {property.lastTransferAt}</p>
            <p>
              <strong>Historique des propriétaires :</strong> {property.previousOwners.length > 0 
                ? property.previousOwners.join(', ') 
                : 'Aucun propriétaire précédent'}
            </p>
            <p><strong>Hash du document :</strong> {property.documentHash}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyCard;