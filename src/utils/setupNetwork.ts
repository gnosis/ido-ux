export const setupNetwork = async (chainId: number) => {
  const provider = (window as Window).ethereum
  if (provider && provider.request) {
    try {
      if (chainId === 100) {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${chainId.toString(16)}`,
              chainName: 'xDai',
              nativeCurrency: {
                name: 'xDai',
                symbol: 'xDai',
                decimals: 18,
              },
              rpcUrls: ['https://rpc.xdaichain.com/'],
              blockExplorerUrls: ['https://blockscout.com/xdai/mainnet'],
            },
          ],
        })
      }
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  } else {
    console.error(
      `Can't setup the network with chainId: ${chainId} on metamask because window.ethereum is undefined`,
    )
    return false
  }
}
