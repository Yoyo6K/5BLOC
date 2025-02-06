const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("PropertyNFT", function () {
  let propertyNFT, owner, addr1, addr2;
  const tokenURI = "ipfs://exampleURI";

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const PropertyNFT = await ethers.getContractFactory("PropertyNFT");
    propertyNFT = await PropertyNFT.deploy(owner.address);
  });  

  describe("Minting", function () {
    it("Should mint a property with valid parameters and set metadata correctly", async function () {
      await expect(
        propertyNFT.mintProperty(
          addr1.address,
          "Maison 1",
          "maison",
          "Quartier Latin, Lyonne",
          ethers.parseEther("1"),
          120,
          "docHash123",
          "imgHash123",
          tokenURI,
          true,
          ethers.parseEther("0.5")
        )
      ).to.emit(propertyNFT, "Transfer");
      
      expect(await propertyNFT.ownerOf(1)).to.equal(addr1.address);
      const prop = await propertyNFT.properties(1);
      expect(prop.name).to.equal("Maison 1");
      expect(prop.propertyType).to.equal("maison");
      expect(prop.location).to.equal("Quartier Latin, Lyonne");
      expect(prop.forSale).to.equal(true);
      expect(prop.salePrice).to.equal(ethers.parseEther("0.5"));
    });

    it("Should revert minting if property type is invalid", async function () {
      await expect(
        propertyNFT.mintProperty(
          addr1.address,
          "Appartement 1",
          "appartement", // type non valide
          "Quartier, Lyonne",
          ethers.parseEther("1"),
          100,
          "docHash",
          "imgHash",
          tokenURI,
          false,
          ethers.parseEther("0")
        )
      ).to.be.revertedWith("Invalid property type");
    });

    it("Should revert if recipient already holds 4 properties", async function () {
      // Mint 4 biens pour addr1
      for (let i = 0; i < 4; i++) {
        await propertyNFT.mintProperty(
          addr1.address,
          `Maison ${i + 1}`,
          "maison",
          "Quartier, Lyonne",
          ethers.parseEther("1"),
          100,
          "docHash",
          "imgHash",
          tokenURI,
          true,
          ethers.parseEther("0.5")
        );        
      }
      // La 5ème tentative doit échouer
      await expect(
        propertyNFT.mintProperty(
          addr1.address,
          "Maison 5",
          "maison",
          "Quartier, Lyonne",
          ethers.parseEther("1"),
          100,
          "docHash",
          "imgHash",
          tokenURI,
          true,
          ethers.parseEther("0.5")
        )
      ).to.be.revertedWith("Recipient already holds max properties");
    });
  });

  describe("Exchanges", function () {
    describe("Exchange for Gare", function () {
      it("Should exchange 3 maisons for one gare", async function () {
        // Mint 3 tokens de type "maison" pour owner
        for (let i = 0; i < 3; i++) {
          await propertyNFT.mintProperty(
            owner.address,
            `Maison ${i + 1}`,
            "maison",
            "Quartier, Lyonne",
            ethers.parseEther("1"),
            100,
            "docHash",
            "imgHash",
            tokenURI,
            true,
            ethers.parseEther("0.5")
          );
        }
        // Exécuter l'échange
        await expect(propertyNFT.exchangeForGare(1, 2, 3, tokenURI))
          .to.emit(propertyNFT, "Transfer");

        // Le nouveau token (tokenId 4) doit être de type "gare"
        const prop = await propertyNFT.properties(4);
        expect(prop.propertyType).to.equal("gare");
        expect(await propertyNFT.ownerOf(4)).to.equal(owner.address);
      });

      it("Should revert exchange for gare if tokens are not all 'maison'", async function () {
        // Mint 2 maisons et 1 token de type "hotel"
        await propertyNFT.mintProperty(owner.address, "Maison 1", "maison", "Location", ethers.parseEther("1"), 100, "docHash", "imgHash", tokenURI, true, ethers.parseEther("0.5"));
        await propertyNFT.mintProperty(owner.address, "Maison 2", "maison", "Location", ethers.parseEther("1"), 100, "docHash", "imgHash", tokenURI, true, ethers.parseEther("0.5"));
        await propertyNFT.mintProperty(owner.address, "Hotel 1", "hotel", "Location", ethers.parseEther("1"), 100, "docHash", "imgHash", tokenURI, false, ethers.parseEther("0"));
        await expect(propertyNFT.exchangeForGare(1, 2, 3, tokenURI))
          .to.be.revertedWith("All tokens must be maison");
      });

      it("Should revert exchange for gare if tokens do not have the same value", async function () {
        // Mint 3 maisons avec des valeurs différentes
        await propertyNFT.mintProperty(owner.address, "Maison 1", "maison", "Location", ethers.parseEther("1"), 100, "docHash", "imgHash", tokenURI, true, ethers.parseEther("0.5"));
        await propertyNFT.mintProperty(owner.address, "Maison 2", "maison", "Location", ethers.parseEther("1"), 100, "docHash", "imgHash", tokenURI, true, ethers.parseEther("0.5"));
        await propertyNFT.mintProperty(owner.address, "Maison 3", "maison", "Location", ethers.parseEther("2"), 100, "docHash", "imgHash", tokenURI, true, ethers.parseEther("1"));
        await expect(propertyNFT.exchangeForGare(1, 2, 3, tokenURI))
          .to.be.revertedWith("All tokens must have the same value");
      });
    });

    describe("Exchange for Hotel", function () {
      it("Should exchange 4 maisons for one hotel", async function () {
        // Mint 4 tokens de type "maison" pour owner
        for (let i = 0; i < 4; i++) {
          await propertyNFT.mintProperty(
            owner.address,
            `Maison ${i + 1}`,
            "maison",
            "Quartier, Lyonne",
            ethers.parseEther("1"),
            100,
            "docHash",
            "imgHash",
            tokenURI,
            true,
            ethers.parseEther("0.5")
          );
        }
        // Exécuter l'échange
        await expect(propertyNFT.exchangeForHotel(1, 2, 3, 4, tokenURI))
          .to.emit(propertyNFT, "Transfer");

        // Le nouveau token (tokenId 5) doit être de type "hotel"
        const prop = await propertyNFT.properties(5);
        expect(prop.propertyType).to.equal("hotel");
        expect(await propertyNFT.ownerOf(5)).to.equal(owner.address);
      });

      it("Should revert exchange for hotel if tokens are not all 'maison'", async function () {
        // Mint 3 maisons et 1 token de type "gare"
        await propertyNFT.mintProperty(owner.address, "Maison 1", "maison", "Location", ethers.parseEther("1"), 100, "docHash", "imgHash", tokenURI, true, ethers.parseEther("0.5"));
        await propertyNFT.mintProperty(owner.address, "Maison 2", "maison", "Location", ethers.parseEther("1"), 100, "docHash", "imgHash", tokenURI, true, ethers.parseEther("0.5"));
        await propertyNFT.mintProperty(owner.address, "Maison 3", "maison", "Location", ethers.parseEther("1"), 100, "docHash", "imgHash", tokenURI, true, ethers.parseEther("0.5"));
        await propertyNFT.mintProperty(owner.address, "Gare", "gare", "Location", ethers.parseEther("1"), 100, "docHash", "imgHash", tokenURI, false, ethers.parseEther("0"));
        await expect(propertyNFT.exchangeForHotel(1, 2, 3, 4, tokenURI))
          .to.be.revertedWith("All tokens must be maison");
      });
    });
  });

  describe("Cooldown and Transfer Constraints", function () {
    it("Should enforce a 5-minute cooldown on transfers", async function () {
      // Mint un bien pour owner
      await propertyNFT.mintProperty(
        owner.address,
        "Maison Cool",
        "maison",
        "Location",
        ethers.parseEther("1"),
        100,
        "docHash",
        "imgHash",
        tokenURI,
        true,
        ethers.parseEther("0.5")
      );

      // Le transfert immédiat doit échouer à cause du cooldown
      await expect(
        propertyNFT["safeTransferFrom(address,address,uint256)"](owner.address, addr1.address, 1)
      ).to.be.revertedWith("Sender in cooldown period");

      // Augmenter le temps de 5 minutes
      await time.increase(5 * 60);
      
      // Le transfert doit maintenant réussir
      await propertyNFT["safeTransferFrom(address,address,uint256)"](owner.address, addr1.address, 1);
      expect(await propertyNFT.ownerOf(1)).to.equal(addr1.address);
    });
  });

  describe("Historical Data Update", function () {
    it("Should update previousOwners and lastTransferAt on transfer", async function () {
      // Mint un bien pour owner
      await propertyNFT.mintProperty(
        owner.address,
        "Maison History",
        "maison",
        "Location",
        ethers.parseEther("1"),
        100,
        "docHash",
        "imgHash",
        tokenURI,
        true,
        ethers.parseEther("0.5")
      );
      const propBefore = await propertyNFT.properties(1);
      // Augmenter le temps de 5 minutes
      await time.increase(5 * 60);
      // Transférer le bien de owner à addr1
      await propertyNFT["safeTransferFrom(address,address,uint256)"](owner.address, addr1.address, 1);
      const propAfter = await propertyNFT.properties(1);
      // Récupérer le tableau previousOwners via le getter
      const previousOwners = await propertyNFT.getPreviousOwners(1);
      expect(previousOwners).to.include(owner.address);
      // Vérifier que lastTransferAt a été mis à jour (supérieur à createdAt)
      expect(propAfter.lastTransferAt).to.be.gt(propBefore.createdAt);
    });
  });
});