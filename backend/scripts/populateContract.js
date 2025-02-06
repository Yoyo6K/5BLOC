// backend/scripts/populateContract.js
const { ethers } = require("hardhat");
const fs = require('fs');

async function main() {
  // Récupérer l'adresse du contrat depuis deployedContract.json
  const deployedInfo = JSON.parse(fs.readFileSync('deployedContract.json', 'utf8'));
  const contractAddress = deployedInfo.address;

  // Récupérer l'instance du contrat déployé
  const PropertyNFT = await ethers.getContractAt("PropertyNFT", contractAddress);
  const [owner] = await ethers.getSigners();

  console.log("Initialisation des propriétés sur le contrat à l'adresse :", contractAddress);

  const properties = [
    {
      to: owner.address,
      name: "Maison 1",
      propertyType: "maison",
      location: "Quartier A",
      value: ethers.parseEther("1"),
      surface: 100,
      documentHash: "docHash1",
      imageHash: "imgHash1",
      tokenURI: "ipfs://tokenURI1",
      forSale: true,
      salePrice: ethers.parseEther("0.5")
    },
    {
      to: owner.address,
      name: "Maison 2",
      propertyType: "maison",
      location: "Rue 2",
      value: ethers.parseEther("12"),
      surface: 120,
      documentHash: "docHash2",
      imageHash: "imgHash2",
      tokenURI: "ipfs://tokenURI2",
      forSale: false,
      salePrice: ethers.parseEther("15")
    },
    // Ajoutez d'autres propriétés si nécessaire
  ];

  for (const prop of properties) {
    console.log(`Ajout de ${prop.name}...`);
    const tx = await PropertyNFT.mintProperty(
      prop.to,
      prop.name,
      prop.propertyType,
      prop.location,
      prop.value,
      prop.surface,
      prop.documentHash,
      prop.imageHash,
      prop.tokenURI,
      prop.forSale,
      prop.salePrice
    );
    await tx.wait();
    console.log(`${prop.name} ajouté avec succès !`);
  }
  console.log("Toutes les propriétés ont été ajoutées !");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Erreur lors de l'initialisation :", error);
    process.exit(1);
  });