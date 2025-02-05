// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PropertyNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;

    // Mapping pour suivre le dernier timestamp de transaction pour chaque adresse (cooldown)
    mapping(address => uint256) public lastTransaction;

    // Structure représentant les informations d'un bien
    struct Property {
        string name;
        string propertyType; // "maison", "gare", "hotel"
        string location;
        uint256 value; // en wei ou en unité adaptée (à préciser)
        uint256 surface; // en m²
        string documentHash;
        string imageHash;
        address[] previousOwners;
        uint256 createdAt;
        uint256 lastTransferAt;
    }

    // Association d'un tokenId à ses données
    mapping(uint256 => Property) public properties;

    // Durées de cooldown et lock
    uint256 constant COOLDOWN = 5 minutes;
    uint256 constant INITIAL_LOCK = 10 minutes;

    constructor(address initialOwner)
        ERC721("PropertyNFT", "PROP")
        Ownable(initialOwner)
    {
        // Le propriétaire initial est défini via Ownable(initialOwner)
    }

    // Fonction utilitaire pour comparer des chaînes de caractères
    function compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return keccak256(bytes(a)) == keccak256(bytes(b));
    }

    /// @notice Mint (crée) un nouveau bien immobilier avec ses métadonnées
    /// @dev Seul le propriétaire (admin) peut appeler cette fonction
    function mintProperty(
        address to,
        string memory _name,
        string memory _propertyType,
        string memory _location,
        uint256 _value,
        uint256 _surface,
        string memory _documentHash,
        string memory _imageHash,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        // Vérifie que le destinataire ne dépasse pas 4 biens
        require(balanceOf(to) < 4, "Recipient already holds max properties");
        // Vérifie que le type de bien est valide
        require(
            compareStrings(_propertyType, "maison") ||
            compareStrings(_propertyType, "gare") ||
            compareStrings(_propertyType, "hotel"),
            "Invalid property type"
        );

        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        _mint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        // Initialise les informations du bien
        address[] memory prevOwners; // tableau vide
        properties[newTokenId] = Property({
            name: _name,
            propertyType: _propertyType,
            location: _location,
            value: _value,
            surface: _surface,
            documentHash: _documentHash,
            imageHash: _imageHash,
            previousOwners: prevOwners,
            createdAt: block.timestamp,
            lastTransferAt: block.timestamp
        });

        // IMPORTANT : Met à jour lastTransaction pour le destinataire lors du mint
        lastTransaction[to] = block.timestamp;

        return newTokenId;
    }

    /// @notice Permet d'échanger 3 "maisons" contre une "gare"
    function exchangeForGare(uint256 tokenId1, uint256 tokenId2, uint256 tokenId3, string memory tokenURI) public returns (uint256) {
        // Le demandeur doit être propriétaire des 3 tokens
        require(ownerOf(tokenId1) == msg.sender &&
                ownerOf(tokenId2) == msg.sender &&
                ownerOf(tokenId3) == msg.sender,
                "Caller must own all tokens");

        // Vérifie que tous les tokens sont de type "maison"
        require(
            compareStrings(properties[tokenId1].propertyType, "maison") &&
            compareStrings(properties[tokenId2].propertyType, "maison") &&
            compareStrings(properties[tokenId3].propertyType, "maison"),
            "All tokens must be maison"
        );

        // Vérifie que les valeurs des tokens sont identiques
        require(
            properties[tokenId1].value == properties[tokenId2].value &&
            properties[tokenId1].value == properties[tokenId3].value,
            "All tokens must have the same value"
        );

        // Brûle (supprime) les 3 tokens
        _burn(tokenId1);
        _burn(tokenId2);
        _burn(tokenId3);

        // Mint un nouveau token de type "gare"
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        // Initialise les infos du nouveau bien
        address[] memory emptyOwners;
        properties[newTokenId] = Property({
            name: "Gare",
            propertyType: "gare",
            location: properties[tokenId1].location,
            value: properties[tokenId1].value,
            surface: 0,
            documentHash: "",
            imageHash: "",
            previousOwners: emptyOwners,
            createdAt: block.timestamp,
            lastTransferAt: block.timestamp
        });

        return newTokenId;
    }

    /// @notice Permet d'échanger 4 "maisons" contre un "hotel"
    function exchangeForHotel(uint256 tokenId1, uint256 tokenId2, uint256 tokenId3, uint256 tokenId4, string memory tokenURI) public returns (uint256) {
        // Le demandeur doit être propriétaire des 4 tokens
        require(ownerOf(tokenId1) == msg.sender &&
                ownerOf(tokenId2) == msg.sender &&
                ownerOf(tokenId3) == msg.sender &&
                ownerOf(tokenId4) == msg.sender,
                "Caller must own all tokens");

        // Vérifie que tous les tokens sont de type "maison"
        require(
            compareStrings(properties[tokenId1].propertyType, "maison") &&
            compareStrings(properties[tokenId2].propertyType, "maison") &&
            compareStrings(properties[tokenId3].propertyType, "maison") &&
            compareStrings(properties[tokenId4].propertyType, "maison"),
            "All tokens must be maison"
        );

        // Vérifie que les valeurs des tokens sont identiques
        require(
            properties[tokenId1].value == properties[tokenId2].value &&
            properties[tokenId1].value == properties[tokenId3].value &&
            properties[tokenId1].value == properties[tokenId4].value,
            "All tokens must have the same value"
        );

        // Brûle (supprime) les 4 tokens
        _burn(tokenId1);
        _burn(tokenId2);
        _burn(tokenId3);
        _burn(tokenId4);

        // Mint un nouveau token de type "hotel"
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        // Initialise les infos du nouveau bien
        address[] memory emptyOwners;
        properties[newTokenId] = Property({
            name: "Hotel",
            propertyType: "hotel",
            location: properties[tokenId1].location,
            value: properties[tokenId1].value,
            surface: 0,
            documentHash: "",
            imageHash: "",
            previousOwners: emptyOwners,
            createdAt: block.timestamp,
            lastTransferAt: block.timestamp
        });

        return newTokenId;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Surcharge de _update pour intégrer la logique avant/après transfert
    ////////////////////////////////////////////////////////////////////////////////

    /**
     * @dev Surcharge de _update pour insérer la logique de cooldown, limite de possession,
     * et mise à jour de l'historique des propriétaires.
     *
     * Cette fonction est appelée pour chaque opération de transfert (mint, burn, transfert).
     */
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        
        // Si c'est un transfert classique (ni mint ni burn)
        if (from != address(0) && to != address(0) && from != to) {
            // Vérifie le cooldown pour l'expéditeur
            require(block.timestamp >= lastTransaction[from] + COOLDOWN, "Sender in cooldown period");
            lastTransaction[from] = block.timestamp;
            
            // Pour le destinataire, appliquer le lock initial si c'est son premier bien
            if (balanceOf(to) == 0) {
                require(block.timestamp >= lastTransaction[to] + INITIAL_LOCK, "Recipient initial lock active");
            } else {
                require(block.timestamp >= lastTransaction[to] + COOLDOWN, "Recipient in cooldown period");
            }
            lastTransaction[to] = block.timestamp;
            
            require(balanceOf(to) + 1 <= 4, "Recipient would exceed max properties");
        }
        
        // Appel de la fonction parent qui effectue la mise à jour réelle (transfert, mint ou burn)
        address previousOwner = super._update(to, tokenId, auth);
        
        // Logique après transfert pour un transfert classique
        if (from != address(0) && to != address(0) && from != to) {
            properties[tokenId].previousOwners.push(from);
            properties[tokenId].lastTransferAt = block.timestamp;
        }
        
        return previousOwner;
    }

    // Ajout d'un getter pour récupérer l'intégralité du tableau previousOwners
    function getPreviousOwners(uint256 tokenId) public view returns (address[] memory) {
        return properties[tokenId].previousOwners;
    }
}