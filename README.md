# Projet Web3 – Monopoly

## Contexte

Le maire de Lyonne souhaite décentraliser la gestion des biens immobiliers de la ville via leur tokenisation. L'objectif est d'offrir aux citoyens une plateforme décentralisée leur permettant d'acquérir et d'échanger ces biens immobiliers, tout en évitant une centralisation excessive.

## Objectifs du Projet

- **Tokenisation des biens immobiliers :** Conversion des propriétés en actifs numériques via des NFT (ERC-721).
- **Consultation et achat de biens :** Permettre aux citoyens de visualiser les biens disponibles et d'acquérir ceux qui les intéressent.
- **Échange de biens :** Faciliter les échanges entre citoyens selon des règles précises (ex. 3 maisons pour 1 gare, 4 maisons pour 1 hôtel).
- **Gestion des documents de propriété :** Stocker les documents sur IPFS et enregistrer le hash dans le smart contract.
- **Respect des règles de gouvernance :**  
  - Limite de possession : maximum 4 actifs par adresse.  
  - Types de biens : maisons, gares, hôtels.  
  - Contraintes d’échange : échange uniquement entre biens de même valeur.  
  - Contraintes temporelles : cooldown de 5 minutes entre deux transactions et lock de 10 minutes après un achat initial.

## Déploiement en Local

L'option 2 consiste à exécuter tous les tests dans un environnement local (Hardhat Network). Aucune configuration pour un réseau public n'est nécessaire dans cette option.

# Documentation Technique et Choix Techniques

## Smart Contract
Le contrat **PropertyNFT** est basé sur les standards **ERC-721** d'OpenZeppelin et intègre des règles métier spécifiques pour la tokenisation immobilière :
- Limite de **4 biens** par utilisateur.
- Mécanismes d'**échanges définis**.
- **Contraintes temporelles** pour certaines opérations.

## Tests Unitaires
Les tests sont écrits avec **Hardhat**, **Chai** et utilisent les helpers de **Hardhat Network** (ex. `time.increase` pour manipuler le temps).  
Ils garantissent que toutes les fonctionnalités du smart contract fonctionnent comme prévu dans un **environnement local**.

## Architecture du Projet
Le projet est structuré de manière à séparer clairement :
- Le **backend** (smart contracts et tests).
- Le **frontend** (interface utilisateur).

Cette séparation facilite la **maintenance** et l'**évolution future** du projet.

## Format des Biens (Metadata)

Chaque bien est représenté par une structure comportant les informations suivantes :

```json
{
  "name": "Nom du bien",
  "type": "maison|gare|hotel",
  "location": "Quartier/Adresse",
  "value": "Valeur en ETH/SOL",
  "surface": "Surface en m²",
  "documentHash": "Hash IPFS du document de propriété",
  "imageHash": "Hash IPFS de l'image du bien",
  "previousOwners": ["liste des adresses des propriétaires précédents"],
  "createdAt": "timestamp de création",
  "lastTransferAt": "timestamp du dernier transfert"
}
```
# Spécifications Techniques
## Smart Contract (Backend)

- **Langage** : Solidity (version 0.8.19)
- **Standard** : ERC-721 avec l'extension ERC721URIStorage
- **Sécurité et Best Practices** :
  - Utilisation des contrats OpenZeppelin
  - Implémentation des règles métier spécifiques (limite de 4 biens, échanges selon règles prédéfinies, contraintes temporelles, etc.)

## Tests Unitaires

- **Option 2 choisie** : Environnement local basé sur Hardhat
- **Suite de tests unitaires** couvrant l'intégralité des fonctionnalités du smart contract

## Stockage

- **Documents de propriété** : Stockés sur IPFS (le hash est enregistré dans le smart contract)
- **Historique des propriétaires** : Conservé dans les métadonnées du NFT

# Installation et Configuration

## Prérequis :

- Node.js (version 14 ou supérieure)
- npm (ou yarn)

## Installation des dépendances :

```bash
npm install
```

## Compilation des Smart Contracts :

```bash
npx hardhat compile
```

## Exécution des tests unitaires :

```bash
npx hardhat test
```

### Les tests couvrent :

- Le minting des biens et la vérification des métadonnées.
- Le rejet de mint en cas de type invalide ou de dépassement de la limite de 4 biens.
- Les échanges (3 maisons → 1 gare et 4 maisons → 1 hôtel) avec vérification des conditions d'échange.
- Les contraintes temporelles (cooldown et lock initial) lors des transferts.
- La mise à jour de l'historique des propriétaires (`previousOwners`) et du timestamp (`lastTransferAt`).

## Frontend (en Développement)