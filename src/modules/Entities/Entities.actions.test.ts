import moment from 'moment'
import * as SUT from './Entities.actions'
import { EntitiesActions, EntityType } from './types'
import mockStore from '../../common/redux/mockStore'

let store

beforeEach(() => {
  store = mockStore({
    entities: {
      entities: [
        {
          did: 'someDid1',
          userDid: 'someUserDid1',
          title: 'someTitle1',
          shortDescription: 'someShortDescription1',
          dateCreated: moment('2020-04-09T13:14:13.000Z'),
          ownerName: 'someOwnerName1',
          status: 'someStatus1',
          country: 'someCountry1',
          impactAction: 'someImpactAction1',
          serviceProvidersCount: 13,
          evaluatorsCount: 1,
          requiredClaimsCount: 100,
          successfulClaimsCount: 10,
          pendingClaimsCount: 20,
          rejectedClaimsCount: 30,
          sdgs: [1, 2, 3],
          longDescription: 'someLongDescription',
          agentDids: ['someAgentDid1'],
          imageUrl: 'sommeImageUrl',
          categories: [
            {
              name: 'someCategory1',
              tags: [
                'someCategory1_tag1',
                'someCategory1_tag2',
                'someCategory1_tag3',
              ],
            },
            {
              name: 'someCategory1',
              tags: [
                'someCategory1_tag1',
                'someCategory1_tag2',
                'someCategory1_tag3',
              ],
            },
          ],
          data: null,
        },
      ],
      filter: {
        dateFrom: moment('2020-04-09T13:14:13.000Z'),
        dateTo: moment('2020-04-08T13:14:13.000Z'),
        categories: [
          {
            name: 'foo1',
            tags: ['bar1_1', 'bar1_2', 'bar1_3'],
          },
        ],
        userEntities: true,
      },
    },
  })
})

describe('Entities Actions', () => {
  // TODO - getEntities ()
  describe('changeEntityType', () => {
    it('should create an action to set the entityType', () => {
      // when ... we call the changeEntityType action creator
      const action = SUT.changeEntitiesType(EntityType.Cell)

      // then we should expect it to create action with the correct type and payload
      expect(action.type).toEqual(EntitiesActions.ChangeEntitiesType)
      expect(action.payload).toEqual({ entityType: EntityType.Cell })
    })
  })

  describe('filterToggleUserEntities', () => {
    it('should create an action to set the userEntities filter', () => {
      // when ... we call the filterToggleUserEntities action creator
      const action = SUT.filterToggleUserEntities(true)

      // then we should expect it to create action with the correct type and payload
      expect(action.type).toEqual(EntitiesActions.FilterToggleUserEntities)
      expect(action.payload).toEqual({ userEntities: true })
    })
  })

  describe('filterToggleFeaturedEntities', () => {
    it('should create an action to set the featuredEntities filter', () => {
      // when ... we call the filterToggleFeaturedEntities action creator
      const action = SUT.filterToggleFeaturedEntities(true)

      // then we should expect it to create action with the correct type and payload
      expect(action.type).toEqual(EntitiesActions.FilterToggleFeaturedEntities)
      expect(action.payload).toEqual({ featuredEntities: true })
    })
  })

  describe('filterTogglePopularEntities', () => {
    it('should create an action to set the popularEntities filter', () => {
      // when ... we call the filterTogglePopularEntities action creator
      const action = SUT.filterTogglePopularEntities(true)

      // then we should expect it to create action with the correct type and payload
      expect(action.type).toEqual(EntitiesActions.FilterTogglePopularEntities)
      expect(action.payload).toEqual({ popularEntities: true })
    })
  })

  describe('filterDates', () => {
    it('should create an action to set the dates filter', () => {
      // when ... we call the filterDates action creator
      const action = SUT.filterDates(
        moment('2020-04-03T13:14:13.000Z'),
        moment('2020-04-09T13:14:13.000Z'),
      )

      // then we should expect it to create action with the correct type and payload
      expect(action.type).toEqual(EntitiesActions.FilterDates)
      expect(action.payload).toEqual({
        dateFrom: moment('2020-04-03T13:14:13.000Z'),
        dateTo: moment('2020-04-09T13:14:13.000Z'),
      })
    })
  })

  describe('resetDatesFilter', () => {
    it('should create an action to reset the dates filter', () => {
      // when ... we call the resetDatesFilter action creator
      const action = SUT.resetDatesFilter()

      // then we should expect it to create action with the correct type
      expect(action.type).toEqual(EntitiesActions.ResetDatesFilter)
    })
  })

  describe('filterCategoryTag', () => {
    it('should create an action to remove the specific category tag when it exists', () => {
      // when ... we call the filterCategoryTag action creator
      store.dispatch(SUT.filterCategoryTag('foo1', 'bar1_3'))
      const action = store.getActions()[0]

      // then we should expect it to create action with the correct type and payload
      expect(action.type).toEqual(EntitiesActions.FilterCategoryTag)
      expect(action.payload).toEqual({
        category: 'foo1',
        tags: ['bar1_1', 'bar1_2'],
      })
    })

    it('should create an action to add the specific category tag when it does not exists', () => {
      // when ... we call the filterCategoryTag action creator
      store.dispatch(SUT.filterCategoryTag('foo1', 'bar1_4'))
      const action = store.getActions()[0]

      // then we should expect it to create action with the correct type and payload
      expect(action.type).toEqual(EntitiesActions.FilterCategoryTag)
      expect(action.payload).toEqual({
        category: 'foo1',
        tags: ['bar1_1', 'bar1_2', 'bar1_3', 'bar1_4'],
      })
    })
  })

  describe('filterCategories', () => {
    it('should create an action to set the entity type and filter', () => {
      // when ... we call the filterCategoryTag action creator
      store.dispatch(
        SUT.filterCategories([
          { name: 'Cell Type', tags: ['Index', 'Relayer', 'Portal'] },
          { name: 'Stage', tags: ['Forming'] },
        ]),
      )
      const action = store.getActions()[0]

      // then we should expect it to create action with the correct type and payload
      expect(action.type).toEqual(EntitiesActions.FilterCategories)
      expect(action.payload).toEqual({
        categories: [
          { name: 'Cell Type', tags: ['Index', 'Relayer', 'Portal'] },
          { name: 'Stage', tags: ['Forming'] },
        ],
      })
    })
  })

  describe('resetCategoryFilter', () => {
    it('should create an action to reset the specific category filter', () => {
      // when ... we call the resetCategoryFilter action creator
      const action = SUT.resetCategoryFilter('foo')

      // then we should expect it to create action with the correct type
      expect(action.type).toEqual(EntitiesActions.ResetCategoryFilter)
      expect(action.payload).toEqual({ category: 'foo' })
    })
  })

  describe('resetFilters', () => {
    it('should create an action to reset the filter', () => {
      // when ... we call the resetFilters action creator
      const action = SUT.resetFilters()

      // then we should expect it to create action with the correct type
      expect(action.type).toEqual(EntitiesActions.ResetFilters)
    })
  })
})
