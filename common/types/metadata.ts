export enum PublicationMetadataVersions {
  one = "1.0.0",
  // please use metadata v2 when doing anything! v1 is supported but discontinued.
  two = "2.0.0",
}

enum PublicationMetadataDisplayType {
  number = "number",
  string = "string",
  date = "date",
}

interface PublicationMetadataAttribute {
  displayType?: PublicationMetadataDisplayType | undefined | null;
  traitType?: string | undefined | null;
  value: string;
}

enum PublicationContentWarning {
  NSFW = "NSFW",
  SENSITIVE = "SENSITIVE",
  SPOILER = "SPOILER",
}

export enum PublicationMainFocus {
  VIDEO = "VIDEO",
  IMAGE = "IMAGE",
  ARTICLE = "ARTICLE",
  TEXT_ONLY = "TEXT_ONLY",
  AUDIO = "AUDIO",
  LINK = "LINK",
  EMBED = "EMBED",
}

export interface ILensMetadata {
  /**
   * The metadata version.
   */
  version: PublicationMetadataVersions;

  /**
   * The metadata lens_id can be anything but if your uploading to ipfs
   * you will want it to be random.. using uuid could be an option!
   */
  metadata_id: string;

  /**
   * A human-readable description of the item.
   */
  description?: string | undefined | null;

  /**
   * The content of a publication. If this is blank `media` must be defined or its out of spec.
   */
  content?: string | undefined | null;

  /**
   * IOS 639-1 language code aka en or it and ISO 3166-1 alpha-2 region code aka US or IT aka en-US or it-IT
   * Full spec > https://tools.ietf.org/search/bcp47
   */
  locale: string;

  /**
   * Main content focus that for this publication
   */
  mainContentFocus: PublicationMainFocus;

  /**
   * Name of the item.
   */
  name: string;

  /**
    * These are the attributes for the item, which will show up on the OpenSea and others NFT trading websites on the 
   item.
    */
  attributes: PublicationMetadataAttribute[];
}
