import { ethers } from 'ethers'

import { lensHubABI, lensHubContract } from './lens-hub.contract'

export const createLensContract = (library: any) => {
  return new ethers.Contract(lensHubContract, lensHubABI, library)
}

export enum PublicationType {
  POST = 'Post',
  MIRROR = 'Mirror',
  COMMENT = 'Comment',
}
