import * as SUT from './Projects.reducer'
import {
  GetProjectsSuccessAction,
  ProjectsActions,
  ProjectsState,
} from './types'

const initialState = SUT.initialState

describe('Projects Reducer', () => {
  it('should return the same state if an action is called on it which is not handled by the reducer', () => {
    // given .. we have an action the reducer does not handle
    const action: any = 'foo'

    // when ... we run the reducer with this action
    const result = SUT.reducer(initialState, action)

    // then ... the state that was passed into the function should be returned
    expect(result).toEqual(initialState)
  })

  describe('GetProjectsSuccess Action', () => {
    it('should return a new copy of state, with quote data set', () => {
      // given .. we have an action of type BondSwapActions.GetQuoteSuccess and some data
      const action: GetProjectsSuccessAction = {
        type: ProjectsActions.GetProjectsSuccess,
        payload: {
          projects: [{ title: 'test' }],
        },
      }

      const newState: ProjectsState = {
        ...initialState,
        projects: [{ title: 'test' }],
      }

      // when ... we run the reducer with this action
      const result = SUT.reducer(initialState, action)

      // then the state should be set as expected
      expect(result).toEqual(newState)
    })
  })
})
