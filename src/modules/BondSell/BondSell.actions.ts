import {
  ClearAction,
  GetQuoteAction,
  ConfirmSellAction,
  BondSellActions,
  InitiateQuoteAction,
} from './types'
import Axios from 'axios'
import { Currency } from '../../types/models'
import * as Toast from '../../common/utils/Toast'
import { Dispatch } from 'redux'
import { RootState } from 'src/common/redux/types'
import * as transactionUtils from '../../common/utils/transaction.utils'
import keysafe from '../../common/keysafe/keysafe'
import { BondSellTx } from '../BondSell/types'

export const initiateQuote = (): InitiateQuoteAction => ({
  type: BondSellActions.InitiateQuote,
})

export const getQuote = (sending: Currency, minPrice: Currency) => (
  dispatch: Dispatch,
  getState: () => RootState,
): GetQuoteAction => {
  const {
    activeBond: { bondDid },
  } = getState()
  return dispatch({
    type: BondSellActions.GetQuote,
    payload: Axios.get(
      `${process.env.REACT_APP_GAIA_URL}/bonds/${bondDid}/sell_return/${sending.amount}`,
      {
        transformResponse: [
          (response: string): any => {
            return JSON.parse(response).result
          },
        ],
      },
    ).then(response => {
      return {
        sending,
        minPrice,
        receiving: response.data.returns[0],
        txFees: response.data.tx_fees,
        totalFee: response.data.total_fees[0],
      }
    }),
  })
}

export const confirmSell = () => (
  dispatch: Dispatch,
  getState: () => RootState,
): ConfirmSellAction => {
  const {
    activeBond: { bondDid },
    bondSell: { sending },
    account: {
      userInfo: {
        didDoc: { did, pubKey },
      },
    },
  } = getState()

  const tx: BondSellTx = {
    pub_key: pubKey,
    seller_did: did,
    bond_did: bondDid,
    amount: sending,
  }

  keysafe.requestSigning(JSON.stringify(tx), (error, signature) => {
    if (error) {
      return null
    }

    return dispatch({
      type: BondSellActions.ConfirmSell,
      payload: Axios.post(
        `${process.env.REACT_APP_GAIA_URL}/txs`,
        JSON.stringify(
          transactionUtils.generateTx('cosmos-sdk/MsgSell', tx, signature),
        ),
      )
        .then(response => {
          if (!response.data.logs[0].success) {
            Toast.errorToast('Sale failed. Please try again.')
          } else {
            Toast.successToast(
              'Transaction submitted. Check its status in the orders tab.',
            )
          }
        })
        .catch(error => {
          Toast.errorToast(`Error: ${error.message}`)
        }),
    })
  })

  return null
}

export const clear = (): ClearAction => ({
  type: BondSellActions.Clear,
})
