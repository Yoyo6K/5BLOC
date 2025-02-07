// backend/scripts/populateContract.js
const { ethers } = require("hardhat");
const fs = require('fs');
require('dotenv').config();

async function main() {
  // Récupérer l'adresse du contrat depuis deployedContract.json
  const deployedInfo = JSON.parse(fs.readFileSync('deployedContract.json', 'utf8'));
  const contractAddress = deployedInfo.address;

  // Récupérer l'instance du contrat déployé
  const PropertyNFT = await ethers.getContractAt("PropertyNFT", contractAddress);

  // Récupérer l'adresse du propriétaire depuis .env
  const ownerAddress = process.env.OWNER_ADDRESS;
  
  // Impersonner le compte propriétaire pour pouvoir appeler mintProperty (qui est onlyOwner)
  await ethers.provider.send("hardhat_impersonateAccount", [ownerAddress]);
  const ownerSigner = await ethers.getSigner(ownerAddress);

  console.log("Initialisation des propriétés sur le contrat à l'adresse :", contractAddress);

  const properties = [
    {
      to: ownerAddress,
      name: "Maison 1",
      propertyType: "maison",
      location: "Quartier A",
      value: ethers.parseEther("1"), // 1 KC, si 1 KC = 10^18 unités. Sinon, utilisez ethers.parseUnits("1", decimals)
      surface: 100,
      documentHash: "docHash1",
      imageHash: "imgHash1",
      tokenURI: "ipfs://tokenURI1",
      forSale: true,
      salePrice: ethers.parseEther("0.5") // 0.5 KC
    },
    {
      to: ownerAddress,
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
    // Connecter le contrat avec le signer owner pour que onlyOwner soit respecté
    const tx = await PropertyNFT.connect(ownerSigner).mintProperty(
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