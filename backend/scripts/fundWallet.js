// backend/scripts/fundWallet.js
const hre = require("hardhat");

async function main() {
  const [sender] = await hre.ethers.getSigners();
  // Récupérez l'adresse du destinataire à partir d'une variable d'environnement ou configurez-la directement
  const recipient = process.env.OWNER_ADDRESS || "0xAdresseDeTest"; 
  // Adaptez la conversion en KC si nécessaire, ici on utilise ethers.parseEther("100") comme exemple
  const amount = ethers.parseEther("100");

  console.log(`Envoi de ${amount.toString()} KC (ou l'équivalent en ETH) à ${recipient}...`);
  const tx = await sender.sendTransaction({
    to: recipient,
    value: amount,
  });
  await tx.wait();
  console.log("Transaction réussie !");
}

main().catch((error) => {
  console.error("Erreur lors du financement :", error);
  process.exitCode = 1;
});