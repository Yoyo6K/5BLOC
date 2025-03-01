const fs = require('fs');
const hre = require("hardhat");
require('dotenv').config();

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Déploiement avec le compte :", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Solde du déployeur :", balance.toString(), "wei");

  const initialOwner = process.env.OWNER_ADDRESS;
  const PropertyNFT = await hre.ethers.getContractFactory("PropertyNFT");
  console.log("Déploiement en cours du contrat PropertyNFT...");

  const propertyNFT = await PropertyNFT.deploy(initialOwner);
  await propertyNFT.waitForDeployment();

  // Utiliser propertyNFT.target si défini, sinon propertyNFT.address
  const deployedAddress = propertyNFT.target || propertyNFT.address;
  if (!deployedAddress) {
    throw new Error("Deployment failed: contract address is undefined or null.");
  }

  console.log("Contrat déployé avec succès !");
  console.log("Adresse du contrat :", deployedAddress);
  console.log("Hash de la transaction :", propertyNFT.deploymentTransaction().hash);

  const network = await hre.ethers.provider.getNetwork();
  console.log("Réseau connecté :", network.name, "Chain ID :", network.chainId.toString());

  const deployedInfo = {
    address: deployedAddress,
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