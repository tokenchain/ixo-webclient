import { Ixo } from 'ixo-module'
import { IxoActions, ResetIxoAction, InitIxoAction } from './types'

export const initIxo = (BLOCK_SYNC_URL: string): InitIxoAction => ({
  type: IxoActions.InitIxo,
  payload: {
    ixo: new Ixo(BLOCK_SYNC_URL),
  },
})

export const resetIxo = (): ResetIxoAction => ({
  type: IxoActions.ResetIxo,
})
