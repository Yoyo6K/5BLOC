# Projet Web3 – Développement d'une DApp basée sur la Blockchain

## Contexte

Les innovations technologiques liées à la blockchain permettent de décentraliser la gestion et la validation de nombreuses interactions économiques et sociales. Ce projet invite les étudiants à imaginer une application pratique tirant parti des principes du Web3.  
Notre mission consiste à concevoir une DApp innovante répondant à un cas d’usage que nous avons défini, tout en intégrant des contraintes métiers précises pour guider la conception technique.

## Cas d'Usage

Nous avons choisi de développer une application de **gestion décentralisée d'actifs numériques**. Plus précisément, notre DApp permet de :

- **Tokeniser des ressources** sous forme de tokens (par exemple, "maison", "gare", "hôtel") avec différents niveaux.
- **Faciliter les échanges** de tokens entre utilisateurs, en appliquant des règles de conversion précises (par exemple, conversion entre types de tokens).
- **Limiter la possession** des ressources à un maximum de 4 tokens par utilisateur.
- **Imposer des contraintes temporelles** (cooldown et lock) pour sécuriser les transactions.
- **Stocker les métadonnées** (documents, images, etc.) sur IPFS.

## Objectifs du Projet

- **Tokenisation des ressources :**  
  Représenter chaque actif numérique par un token conforme au standard ERC-721, incluant des métadonnées (nom, type, valeur, document, image, historique des propriétaires, etc.).

- **Échanges de tokens :**  
  Implémenter un mécanisme d’échange de tokens entre utilisateurs.  
  Définir des règles précises pour valider les transactions, par exemple une règle de conversion entre types (exemple : 2 maisons = 1 gare, 3 maisons = 1 hôtel).

- **Limites de possession :**  
  Chaque utilisateur ne peut posséder qu’un maximum de 4 tokens.

- **Contraintes temporelles :**  
  Appliquer un cooldown (5 minutes) entre deux transactions successives et un lock (10 minutes) après une acquisition.

- **Utilisation d’IPFS :**  
  Stocker les documents et images liés aux tokens sur IPFS et enregistrer leurs hash dans les smart contracts.

- **Tests unitaires :**  
  Assurer une couverture de tests significative à l’aide de Hardhat pour valider l’ensemble des fonctionnalités du smart contract.

## Format des Métadonnées

Chaque token est accompagné d’un fichier JSON (stocké sur IPFS) contenant au moins les informations suivantes :

```json
{
  "name": "Nom de la ressource",
  "type": "Type de ressource (ex. maison, gare, hôtel)",
  "value": "Valeur associée à la ressource",
  "hash": "Hash IPFS du document lié",
  "previousOwners": ["Liste des adresses des anciens propriétaires"],
  "createdAt": "Timestamp de création",
  "lastTransferAt": "Timestamp du dernier transfert"
  // ... autres attributs éventuels
}
```

## Architecture du Projet

Le projet est structuré en deux parties principales :

- **Backend :**
  - Smart Contracts (développés en Solidity, standard ERC-721)
  - Scripts de déploiement et de tests unitaires (avec Hardhat)
  - Gestion des contraintes métiers (limite de possession, échanges avec règles de conversion, contraintes temporelles)

- **Frontend :**
  - Application React permettant la connexion au wallet (MetaMask), la consultation, l'achat et l'échange de tokens
  - Interface utilisateur responsive et intuitive
  - Utilisation d’un contexte blockchain pour interagir avec le smart contract

## Spécifications Techniques

### Smart Contract (Backend)

- **Langage :** Solidity (version 0.8.28)
- **Standard :** ERC-721 avec extension ERC721URIStorage
- **Fonctionnalités clés :**
  - Mint de tokens avec métadonnées et mise en vente
  - Fonction d'achat (`buyProperty`)
  - Fonction d'échange (`exchangeTokens`) avec règles de conversion entre types (ex. 2 maisons = 1 gare, 3 maisons = 1 hôtel)
  - Vérification de la limite de possession (max. 4 tokens par utilisateur)
  - Application des contraintes temporelles (cooldown et lock)
  - Stockage des hash IPFS pour documents et images
  - Fonctions de consultation (getPreviousOwners, getAllProperties)

### Tests Unitaires

- **Outils :** Hardhat, Chai et helpers de Hardhat Network (ex. `time.increase`)
- **Couverture :**
  - Mint des tokens et vérification des métadonnées
  - Validation des règles de possession (max. 4 tokens)
  - Tests des échanges de tokens avec règles de conversion
  - Tests des contraintes temporelles (cooldown et lock)
  - Tests de la fonction d'achat (vérification des fonds, transfert de propriété, etc.)

### Stockage

- **IPFS :**
  Les documents et images relatifs aux tokens sont stockés sur IPFS. Les hash IPFS sont enregistrés dans le smart contract et utilisés par le front-end via une passerelle (ex. `https://ipfs.io/ipfs/`).

## Installation et Configuration

### Prérequis

- Node.js (version 14 ou supérieure)
- npm (ou yarn)
- MetaMask installé dans le navigateur

### Installation des Dépendances

Dans le dossier racine du projet (ou dans les dossiers `backend` et `frontend` séparément) :
```bash
npm install
```

### Compilation des Smart Contracts

Dans le dossier `backend` :
```bash
npx hardhat compile
```

### Exécution des Tests Unitaires

Dans le dossier `backend` :
```bash
npx hardhat test
```

### Déploiement en Local

1. Lancez Hardhat Node pour simuler un réseau local :
   ```bash
   npx hardhat node
   ```
2. Déployez le contrat :
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```
   N'oubliez pas de mettre à jour l'ABI et le deployedContract.json côté front-end après le déploiement.

### Frontend

Dans le dossier `frontend` :
```bash
npm start
```
L’application se lance par défaut sur [http://localhost:3000](http://localhost:3000).  
Utilisez MetaMask pour connecter votre wallet et interagir avec la DApp.

## Utilisation de la DApp

- **Connexion Wallet :**  
  Connectez votre wallet via MetaMask pour accéder aux fonctionnalités de la DApp.

- **Consultation des Tokens :**  
  - La page **Propriétés disponibles** affiche les tokens en vente.
  - La page **Mes Propriétés** affiche les tokens que vous possédez.

- **Achat de Tokens :**  
  Dans la page **Propriétés disponibles**, cliquez sur "Acheter" pour acquérir un token mis en vente.

- **Échange de Tokens :**  
  La page **Échange** vous permet de :
  - Sélectionner plusieurs tokens dans **Mes Tokens** (ceux que vous possédez).
  - Sélectionner plusieurs tokens dans **Tokens Disponibles** (ceux appartenant aux autres).
  - Procéder à l'échange par paire (selon la logique définie dans le contrat, avec application des règles de conversion).

## Rapport Technique

Le rapport technique détaille :

- **Choix de Conception :**
  - Utilisation d'Ethereum (Hardhat) et React pour le développement.
  - Adoption du standard ERC-721 et utilisation d’OpenZeppelin pour la sécurité.

- **Contraintes Métiers :**
  - Limite de 4 tokens par utilisateur.
  - Règles de conversion pour l'échange de tokens (par exemple, 2 maisons = 1 gare, 3 maisons = 1 hôtel).
  - Contraintes temporelles (cooldown et lock).
  - Stockage des métadonnées sur IPFS.

- **Architecture :**
  - Séparation claire entre le backend (smart contracts, tests, scripts de déploiement) et le frontend (interface utilisateur).

- **Tests Unitaires :**
  - Une suite de tests complète a été réalisée pour valider les fonctionnalités du smart contract.

- **Difficultés et Solutions :**
  - Description des défis rencontrés (gestion des échanges multiples, contraintes temporelles, etc.) et des solutions mises en œuvre.

## Livrables

Le projet comprend :

- **Document de Présentation du Cas d'Usage** (ce README ou un document séparé détaillant le concept et le parcours utilisateur).
- **Code Source de la DApp** (incluant smart contracts, front-end et scripts de déploiement).
- **Tests Unitaires** réalisés avec Hardhat.
- **Rapport Technique** expliquant les choix de conception, le respect des contraintes métiers et les difficultés rencontrées.

## Critères d'Évaluation

- **Pertinence et Originalité du Cas d'Usage :**  
  La DApp répond à un besoin identifié dans la gestion décentralisée d'actifs numériques.

- **Qualité de la DApp :**  
  Respect des contraintes techniques et fonctionnelles (tokenisation, échanges, limites de possession, contraintes temporelles, utilisation d’IPFS).

- **Couverture des Tests Unitaires :**  
  Tests complets validant l'ensemble des fonctionnalités du smart contract.

- **Documentation :**  
  Documentation claire et complète (README, rapport technique) détaillant les choix de conception, les instructions d'installation et d'utilisation.

---