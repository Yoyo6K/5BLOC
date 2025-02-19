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
      value: ethers.parseEther("1"),
      surface: 100,
      documentHash: "docHash1",
      imageHash: "imgHash1",
      tokenURI: "/img/maison1.jpg",
      forSale: true,
      salePrice: ethers.parseEther("0.5")
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
      tokenURI: "/img/maison2.jpg",
      forSale: false,
      salePrice: ethers.parseEther("15")
    },
    {
      to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      name: "Maison 3",
      propertyType: "maison",
      location: "Centre-ville",
      value: ethers.parseEther("20"),
      surface: 500,
      documentHash: "docHash3",
      imageHash: "imgHash3",
      tokenURI: "/img/maison3.jpg",
      forSale: true,
      salePrice: ethers.parseEther("10")
    },
    {
      to: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      name: "Maison 4",
      propertyType: "maison",
      location: "Banlieue B",
      value: ethers.parseEther("8"),
      surface: 150,
      documentHash: "docHash4",
      imageHash: "imgHash4",
      tokenURI: "/img/maison4.jpg",
      forSale: false,
      salePrice: ethers.parseEther("7")
    },
    {
      to: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      name: "Hôtel 1",
      propertyType: "hotel",
      location: "Quartier C",
      value: ethers.parseEther("30"),
      surface: 600,
      documentHash: "docHash5",
      imageHash: "imgHash5",
      tokenURI: "/img/hotel1.jpg",
      forSale: true,
      salePrice: ethers.parseEther("25")
    },
    {
      to: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
      name: "Maison 5",
      propertyType: "maison",
      location: "Rue D",
      value: ethers.parseEther("5"),
      surface: 80,
      documentHash: "docHash6",
      imageHash: "imgHash6",
      tokenURI: "/img/maison5.jpg",
      forSale: true,
      salePrice: ethers.parseEther("3")
    },
    {
      to: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
      name: "Hôtel 2",
      propertyType: "hotel",
      location: "Zone E",
      value: ethers.parseEther("40"),
      surface: 700,
      documentHash: "docHash7",
      imageHash: "imgHash7",
      tokenURI: "/img/hotel2.jpg",
      forSale: false,
      salePrice: ethers.parseEther("35")
    },
    {
      to: "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
      name: "Maison 6",
      propertyType: "maison",
      location: "Quartier F",
      value: ethers.parseEther("10"),
      surface: 180,
      documentHash: "docHash8",
      imageHash: "imgHash8",
      tokenURI: "/img/maison6.jpg",
      forSale: true,
      salePrice: ethers.parseEther("9")
    },
    {
      to: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955",
      name: "Hôtel 3",
      propertyType: "hotel",
      location: "Rue G",
      value: ethers.parseEther("50"),
      surface: 800,
      documentHash: "docHash9",
      imageHash: "imgHash9",
      tokenURI: "/img/hotel3.jpg",
      forSale: false,
      salePrice: ethers.parseEther("45")
    },
    {
      to: "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
      name: "Maison 7",
      propertyType: "maison",
      location: "Banlieue H",
      value: ethers.parseEther("15"),
      surface: 200,
      documentHash: "docHash10",
      imageHash: "imgHash10",
      tokenURI: "/img/maison7.jpg",
      forSale: true,
      salePrice: ethers.parseEther("12")
    },
    {
      to: "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",
      name: "Hôtel 4",
      propertyType: "hotel",
      location: "Quartier I",
      value: ethers.parseEther("60"),
      surface: 900,
      documentHash: "docHash11",
      imageHash: "imgHash11",
      tokenURI: "/img/hotel4.jpg",
      forSale: true,
      salePrice: ethers.parseEther("50")
    },
    {
      to: "0xBcd4042DE499D14e55001CcbB24a551F3b954096",
      name: "Maison 8",
      propertyType: "maison",
      location: "Zone J",
      value: ethers.parseEther("7"),
      surface: 90,
      documentHash: "docHash12",
      imageHash: "imgHash12",
      tokenURI: "/img/maison8.jpg",
      forSale: false,
      salePrice: ethers.parseEther("6")
    },
    {
      to: "0x71bE63f3384f5fb98995898A86B02Fb2426c5788",
      name: "Hôtel 5",
      propertyType: "hotel",
      location: "Rue K",
      value: ethers.parseEther("70"),
      surface: 1000,
      documentHash: "docHash13",
      imageHash: "imgHash13",
      tokenURI: "/img/hotel5.jpg",
      forSale: true,
      salePrice: ethers.parseEther("65")
    },
    {
      to: "0xFABB0ac9d68B0B445fB7357272Ff202C5651694a",
      name: "Maison 9",
      propertyType: "maison",
      location: "Banlieue L",
      value: ethers.parseEther("9"),
      surface: 110,
      documentHash: "docHash14",
      imageHash: "imgHash14",
      tokenURI: "/img/maison9.jpg",
      forSale: true,
      salePrice: ethers.parseEther("8")
    },
    {
      to: "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec",
      name: "Hôtel 6",
      propertyType: "hotel",
      location: "Quartier M",
      value: ethers.parseEther("80"),
      surface: 1100,
      documentHash: "docHash15",
      imageHash: "imgHash15",
      tokenURI: "/img/hotel6.jpg",
      forSale: false,
      salePrice: ethers.parseEther("75")
    }
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