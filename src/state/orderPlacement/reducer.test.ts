import { Store, createStore } from 'redux'

import { priceInput, sellAmountInput, setDefaultsFromURLSearch } from './actions'
import reducer, { OrderPlacementState } from './reducer'

describe('orderPlacement reducer', () => {
  let store: Store<OrderPlacementState>

  beforeEach(() => {
    store = createStore(reducer, {
      price: '1',
      sellAmount: '',
      chainId: 1,
      showPriceInverted: false,
    })
  })

  describe('setDefaultsFromURL', () => {
    test('get auctionId', () => {
      store.dispatch(
        setDefaultsFromURLSearch({
          queryString: '?chainId=1&auctionId=2',
        }),
      )

      expect(store.getState()).toEqual({
        price: '-',
        chainId: 1,
        sellAmount: '',
        showPriceInverted: false,
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
        chainId: 1,
        sellAmount: '2',
        showPriceInverted: false,
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
        chainId: 1,
        sellAmount: '',
        showPriceInverted: false,
      })
    })
  })
})
