import { ChainId } from '../../utils'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
  [ChainId.RINKEBY]: '0x42Ad527de7d4e9d9d011aC45B31D8551f8Fe9821',
  [ChainId.XDAI]: '0xb5b692a88bdfc81ca69dcb1d924f59f0413a602a',
  [ChainId.MATIC]: '0x3BA9517da78710b8FCF566e303C2530e5AA604f2',
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
