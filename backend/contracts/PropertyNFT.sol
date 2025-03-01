// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PropertyNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;
    uint256 public tokenCount; // Nombre total de tokens mintés

    // Mapping pour suivre le dernier timestamp de transaction pour chaque adresse (cooldown)
    mapping(address => uint256) public lastTransaction;

    // Structure représentant les informations d'un bien, avec gestion de la vente
    struct Property {
        string name;
        string propertyType;  // "maison", "gare", "hotel"
        string location;
        uint256 value;        // valeur en wei
        uint256 surface;      // en m²
        string documentHash;
        string image;         // URL de l'image
        address[] previousOwners;
        uint256 createdAt;
        uint256 lastTransferAt;
        bool forSale;         // Indique si le bien est à vendre
        uint256 salePrice;    // Prix de vente (en wei)
    }


    // Association d'un tokenId à ses données
    mapping(uint256 => Property) public properties;

    // Durées de cooldown et lock
    uint256 constant COOLDOWN = 1 minutes;
    uint256 constant INITIAL_LOCK = 1 minutes;

    constructor(address initialOwner)
        ERC721("PropertyNFT", "PROP")
        Ownable(initialOwner)
    {}

    // Fonction utilitaire pour comparer des chaînes de caractères
    function compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return keccak256(bytes(a)) == keccak256(bytes(b));
    }

    /// @notice Mint un nouveau bien immobilier avec ses métadonnées, y compris la gestion de la vente.
    function mintProperty(
        address to,
        string memory _name,
        string memory _propertyType,
        string memory _location,
        uint256 _value,
        uint256 _surface,
        string memory _documentHash,
        string memory _image,        // URL de l'image
        string memory tokenURI,
        bool _forSale,
        uint256 _salePrice
    ) public onlyOwner returns (uint256) {
        require(balanceOf(to) < 6, "Recipient already holds max properties");
        require(
            compareStrings(_propertyType, "maison") ||
            compareStrings(_propertyType, "gare") ||
            compareStrings(_propertyType, "hotel"),
            "Invalid property type"
        );

        _tokenIds++;
        tokenCount = _tokenIds;  // Mise à jour du compteur
        uint256 newTokenId = _tokenIds;
        _mint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        address[] memory prevOwners; // tableau vide
        properties[newTokenId] = Property({
            name: _name,
            propertyType: _propertyType,
            location: _location,
            value: _value,
            surface: _surface,
            documentHash: _documentHash,
            image: _image,  // Assigner l'URL de l'image
            previousOwners: prevOwners,
            createdAt: block.timestamp,
            lastTransferAt: block.timestamp,
            forSale: _forSale,
            salePrice: _salePrice
        });

        lastTransaction[to] = block.timestamp;
        return newTokenId;
    }


    function exchangeTokens(uint256 tokenIdA, uint256 tokenIdB) external {
        // Récupérer les propriétaires actuels
        address ownerA = ownerOf(tokenIdA);
        address ownerB = ownerOf(tokenIdB);
        
        // Vérifier que l'appelant possède au moins l'un des tokens
        require(msg.sender == ownerA || msg.sender == ownerB, "Caller must own one of the tokens");
        // Vérifier que les deux tokens ne sont pas déjà détenus par le même utilisateur
        require(ownerA != ownerB, "Both tokens are already owned by the same account");
        
        // Optionnel : Vérifier que les tokens sont du même type (exemple : même catégorie)
        require(compareStrings(properties[tokenIdA].propertyType, properties[tokenIdB].propertyType), "Tokens must be of the same type to exchange");
        
        // Effectuer l'échange en transférant tokenIdA de ownerA à ownerB et tokenIdB de ownerB à ownerA.
        _transfer(ownerA, ownerB, tokenIdA);
        _transfer(ownerB, ownerA, tokenIdB);
        
        // Mettre à jour l'historique et les timestamps pour tokenIdA
        properties[tokenIdA].previousOwners.push(ownerA);
        properties[tokenIdA].lastTransferAt = block.timestamp;
        // Mettre à jour l'historique et les timestamps pour tokenIdB
        properties[tokenIdB].previousOwners.push(ownerB);
        properties[tokenIdB].lastTransferAt = block.timestamp;
    }

    function buyProperty(uint256 tokenId) external payable {
        // Récupérer la propriété depuis le mapping
        Property storage prop = properties[tokenId];

        // Vérifier que le bien est en vente
        require(prop.forSale, "Property is not for sale");
        // Vérifier que le montant envoyé est suffisant
        require(msg.value >= prop.salePrice, "Insufficient funds sent");

        // Récupérer le propriétaire actuel
        address seller = ownerOf(tokenId);

        // Transférer le NFT de seller à msg.sender (l'acheteur)
        _transfer(seller, msg.sender, tokenId);

        // Mettre à jour l'historique des propriétaires
        prop.previousOwners.push(seller);
        // Mettre à jour le timestamp du dernier transfert
        prop.lastTransferAt = block.timestamp;

        // Désactiver la mise en vente du bien (ou vous pouvez prévoir une logique différente)
        prop.forSale = false;
        prop.salePrice = 0;

        // Optionnel : Rembourser le surplus si msg.value > salePrice
        if (msg.value > prop.salePrice) {
        payable(msg.sender).transfer(msg.value - prop.salePrice);
        }

        // Optionnel : Transférer les fonds au vendeur
        payable(seller).transfer(prop.salePrice);
    }


    // Surcharge de _update pour intégrer la logique avant/après transfert
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        
        if (from != address(0) && to != address(0) && from != to) {
            require(block.timestamp >= lastTransaction[from] + COOLDOWN, "Sender in cooldown period");
            lastTransaction[from] = block.timestamp;
            
            if (balanceOf(to) == 0) {
                require(block.timestamp >= lastTransaction[to] + INITIAL_LOCK, "Recipient initial lock active");
            } else {
                require(block.timestamp >= lastTransaction[to] + COOLDOWN, "Recipient in cooldown period");
            }
            lastTransaction[to] = block.timestamp;
            
            require(balanceOf(to) + 1 <= 4, "Recipient would exceed max properties");
        }
        
        address previousOwner = super._update(to, tokenId, auth);
        
        if (from != address(0) && to != address(0) && from != to) {
            properties[tokenId].previousOwners.push(from);
            properties[tokenId].lastTransferAt = block.timestamp;
        }
        
        return previousOwner;
    }

    // Getter pour récupérer l'intégralité du tableau previousOwners
    function getPreviousOwners(uint256 tokenId) public view returns (address[] memory) {
        return properties[tokenId].previousOwners;
    }
    
    // Optionnel : fonction pour récupérer toutes les propriétés (pour un nombre limité de tokens)
    function getAllProperties() public view returns (Property[] memory) {
        Property[] memory allProperties = new Property[](tokenCount);
        for (uint256 i = 1; i <= tokenCount; i++) {
            allProperties[i - 1] = properties[i];
        }
        return allProperties;
    }
}