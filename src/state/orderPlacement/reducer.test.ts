import { Store, createStore } from 'redux'

import { priceInput, sellAmountInput, setDefaultsFromURLSearch } from './actions'
import reducer, { SwapState } from './reducer'

describe('orderplacement reducer', () => {
  let store: Store<SwapState>

  beforeEach(() => {
    store = createStore(reducer, {
      price: '1',
      auctionId: 1,
      sellAmount: '',
    })
  })

  describe('setDefaultsFromURL', () => {
    test('get auctionId', () => {
      store.dispatch(
        setDefaultsFromURLSearch({
          chainId: 1,
          queryString: '?auctionId=2',
        }),
      )

      expect(store.getState()).toEqual({
        price: '1',
        auctionId: 2,
        sellAmount: '',
      })
    })
  })

  describe('sellAmountInput', () => {
    test('change on new input', () => {
      store.dispatch(
        sellAmountInput({
          sellAmount: '2',
        }),
      )

      expect(store.getState()).toEqual({
        price: '1',
        auctionId: 1,
        sellAmount: '2',
      })
    })
  })

  describe('priceInput', () => {
    test('change on new input', () => {
      store.dispatch(
        priceInput({
          price: '2',
        }),
      )

      expect(store.getState()).toEqual({
        price: '2',
        auctionId: 1,
        sellAmount: '',
      })
    })
  })
})
