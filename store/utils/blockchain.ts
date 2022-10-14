import { ChainId } from '@usedapp/core'
import { BigNumber } from 'ethers'

// eslint-disable-next-line sonarjs/cognitive-complexity
export const checkAndChangeChainId = async () => {
  const isMainnet = false
  // @ts-ignore
  const chain = Number.parseInt(window.ethereum.chainId, 16)
  console.log(chain, ChainId.Mumbai, `0x${ChainId.Mumbai.toString(16)}`)
  if (!isMainnet) {
    if (chain !== ChainId.Mumbai) {
      try {
        // @ts-ignore
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${ChainId.Mumbai.toString(16)}` }],
        })
      } catch (error: any) {
        if (error.code === 4902) {
          console.log('sss')

          // @ts-ignore
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${ChainId.Mumbai.toString(16)}`,
                chainName: 'Polygon Mumbai',
                rpcUrls: ['https://matic-mumbai.chainstacklabs.com'] /* ... */,
              },
            ],
          })
        }
        // throw new Error('Didnt change network')
      }
    }
  } else if (chain !== ChainId.BSC) {
    try {
      // @ts-ignore
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BigNumber.from(ChainId.BSC).toHexString() }],
      })
    } catch (error: any) {
      if (error.code === 4902) {
        // @ts-ignore
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: BigNumber.from(ChainId.BSC).toHexString(),
              chainName: 'BSC Mainnet',
              rpcUrls: ['https://bsc-dataseed.binance.org'] /* ... */,
            },
          ],
        })
      }
      throw new Error('Didnt change network')
    }
  }
}
