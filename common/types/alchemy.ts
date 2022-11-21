import { Medium, OwnedNft, RootObject } from "./alchemy";

declare module namespace {
  export interface Contract {
    address: string;
  }

  export interface TokenMetadata {
    tokenType: string;
  }

  export interface Id {
    tokenId: string;
    tokenMetadata: TokenMetadata;
  }

  export interface TokenUri {
    raw: string;
    gateway: string;
  }

  export interface Medium {
    raw: string;
    gateway: string;
    thumbnail: string;
    format: string;
    bytes?: number;
  }

  export interface Attribute {
    display_type: string;
    value: any;
    trait_type: string;
  }

  export interface Points {
    Hats: number;
    Shirt: number;
    Face: number;
    Body: number;
  }

  export interface Collection {
    name: string;
    family: string;
  }

  export interface Metadata {
    image: string;
    external_url: string;
    background_color: string;
    revealed: boolean;
    name: string;
    description: string;
    minted: boolean;
    attributes: Attribute[];
    owner: string;
    tokenId?: number;
    animation_url: string;
    date?: number;
    edition?: number;
    properties: any;
    dna: string;
    compiler: string;
    google_image: string;
    ipfs_image: string;
    points: Points;
    destination_url: string;
    external_link: string;
    seller_fee_basis_points?: number;
    symbol: string;
    collection: Collection;
    twitter: string;
    website: string;
    authors: string;
    metadata: any[];
    background_image: string;
    is_normalized?: boolean;
    segment_length?: number;
    image_url: string;
    name_length?: number;
    version?: number;
    url: string;
    provenanceSequence?: number;
    image_hash: string;
    nftFileHash: string;
  }

  export interface OpenSea {
    floorPrice: number;
    collectionName: string;
    safelistRequestStatus: string;
    imageUrl: string;
    description: string;
    lastIngestedAt: Date;
    externalUrl: string;
    twitterUsername: string;
    discordUrl: string;
  }

  export interface ContractMetadata {
    name: string;
    symbol: string;
    totalSupply: string;
    tokenType: string;
    openSea: OpenSea;
  }

  export interface OwnedNft {
    contract: Contract;
    id: Id;
    balance: string;
    title: string;
    description: string;
    tokenUri: TokenUri;
    media: Medium[];
    metadata: Metadata;
    timeLastUpdated: Date;
    contractMetadata: ContractMetadata;
    error: string;
  }

  export interface RootObject {
    ownedNfts: OwnedNft[];
    pageKey: string;
    totalCount: number;
    blockHash: string;
  }
}

export interface IAlchemyResponse {
  contract: namespace.Contract;
  tokenMetadata: namespace.TokenMetadata;
  id: namespace.Id;
  tokenUri: namespace.TokenUri;
  medium: namespace.Medium;
  attribute: namespace.Attribute;
  points: namespace.Points;
  collection: namespace.Collection;
  metadata: namespace.Metadata;
  openSea: namespace.OpenSea;
  contractMetadata: namespace.ContractMetadata;
  ownedNft: namespace.OwnedNft;
  rootObject: namespace.RootObject;
}

// {
//    "contract": {
//    "address": "0x0038a8e6209d53dd93a3e3634ebfe6a8a0f68e33"
//    },
//    "id": {
//    "tokenId": "0x0000000000000000000000000000000000000000000000000000000000000244",
//    "tokenMetadata": {
//    "tokenType": "ERC721"
//    }
//    },
//    "balance": "1",
//    "title": "Art Gobbler 580 – Yakfwempy Foopa",
//    "description": "Yakfwempy Foopa gobbles art and squirts Goo.",
//    "tokenUri": {
//    "raw": "https://nfts.artgobblers.com/api/gobblers/580",
//    "gateway": "https://nfts.artgobblers.com/api/gobblers/580"
//    },
//    "media": [
//    {
//    "raw": "https://storage.googleapis.com/gobblers.artgobblers.com/gifs/580.gif",
//    "gateway": "https://storage.googleapis.com/gobblers.artgobblers.com/gifs/580.gif"
//    }
//    ],
//    "metadata": {
//    "image": "https://storage.googleapis.com/gobblers.artgobblers.com/gifs/580.gif",
//    "external_url": "https://artgobblers.com/gobbler/580",
//    "background_color": "BACDDC",
//    "revealed": true,
//    "name": "Art Gobbler 580 – Yakfwempy Foopa",
//    "description": "Yakfwempy Foopa gobbles art and squirts Goo.",
//    "minted": true,
//    "attributes": [
//    {
//    "display_type": "number",
//    "value": 6,
//    "trait_type": "Multiplier"
//    },
//    {
//    "display_type": "number",
//    "value": 580,
//    "trait_type": "Random Id"
//    },
//    {
//    "value": "Overlook",
//    "trait_type": "Background"
//    },
//    {
//    "value": "Torso",
//    "trait_type": "Torso"
//    },
//    {
//    "value": "Melt",
//    "trait_type": "Head"
//    },
//    {
//    "value": "Base Left Arm",
//    "trait_type": "Left arm"
//    },
//    {
//    "value": "Sailor",
//    "trait_type": "Right hand"
//    },
//    {
//    "value": "Base Left Leg",
//    "trait_type": "Left foot"
//    },
//    {
//    "value": "Base Right Leg",
//    "trait_type": "Right foot"
//    },
//    {
//    "value": "Slate",
//    "trait_type": "Palette"
//    }
//    ]
//    },
//    "timeLastUpdated": "2022-11-03T00:49:04.472Z",
//    "contractMetadata": {
//    "name": "Art Gobblers",
//    "symbol": "Art Gobblers",
//    "totalSupply": "1578",
//    "tokenType": "ERC721",
//    "openSea": {
//    "floorPrice": 0,
//    "collectionName": "11101o909q24",
//    "safelistRequestStatus": "not_requested",
//    "imageUrl": "https://i.seadn.io/gcs/files/30fb3f3e1f3d394a9603671017895660.png?w=500&auto=format",
//    "description": "",
//    "lastIngestedAt": "2022-11-15T05:06:59.000Z"
//    }
//    }
//    },
