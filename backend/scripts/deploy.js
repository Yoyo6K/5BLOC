// backend/scripts/deploy.js
const fs = require('fs');
const hre = require("hardhat");
const config = require("../init"); // Assurez-vous que le chemin est correct

async function main() {
  // Récupère le(s) signataire(s)
  const [deployer] = await hre.ethers.getSigners();
  console.log("Déploiement avec le compte :", deployer.address);
  
  // Récupère le solde du déployeur via le provider
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Solde du déployeur :", balance.toString(), "wei");
  
  // Récupère la factory du contrat et déploie le contrat en passant l'initialOwner du fichier init.js
  const PropertyNFT = await hre.ethers.getContractFactory("PropertyNFT");
  console.log("Déploiement en cours du contrat PropertyNFT...");
  
  const propertyNFT = await PropertyNFT.deploy(config.initialOwner);
  // Pour ethers v6, utilisez waitForDeployment() pour attendre que le contrat soit déployé
  await propertyNFT.waitForDeployment();
  
  console.log("Contrat déployé avec succès !");
  console.log("Adresse du contrat :", propertyNFT.target);
  console.log("Hash de la transaction :", propertyNFT.deploymentTransaction().hash);
  
  // Récupère les informations du réseau
  const network = await hre.ethers.provider.getNetwork();
  console.log("Réseau connecté :", network.name, "Chain ID :", network.chainId.toString());
  
  // Enregistre les informations de déploiement dans un fichier JSON
  const deployedInfo = {
    address: propertyNFT.target,
    deployer: deployer.address,
    transactionHash: propertyNFT.deploymentTransaction().hash,
    network: network.name,
    chainId: network.chainId.toString()
  };
  
  fs.writeFileSync('deployedContract.json', JSON.stringify(deployedInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Erreur lors du déploiement :", error);
    process.exit(1);
  });