import { ethers, utils } from 'ethers'

// eslint-disable-next-line unicorn/prefer-module
const omitDeep = require('omit-deep')

// @ts-ignore

export const signedTypeData = async (domain: any, types: any, value: any, signer: any) => {
  return signer._signTypedData(
    omitDeep(domain, '__typename'),
    omitDeep(types, '__typename'),
    omitDeep(value, '__typename')
  )
}

export const splitSignature = (signature: string) => {
  return utils.splitSignature(signature)
}
