import moment, { Moment } from 'moment'
import { Dispatch } from 'redux'
import {
  GetEntitiesAction,
  ChangeEntitiesTypeAction,
  FilterToggleUserEntitiesAction,
  FilterToggleFeaturedEntitiesAction,
  FilterTogglePopularEntitiesAction,
  FilterEntitiesDatesAction,
  ResetEntitiesDatesFilterAction,
  FilterEntitiesCategoryTagsAction,
  ResetEntitiesCategoryFilterAction,
  ResetEntitiesFiltersAction,
  EntitiesActions,
  EntityType,
  FilterCategoriesAction,
  Category,
} from './types'
import { RootState } from 'src/common/redux/types'
import blocksyncApi from '../../common/api/blocksync-api/blocksync-api'
import { toTitleCase } from '../../common/utils/formatters'

export const getEntities = () => (dispatch: Dispatch): GetEntitiesAction => {
  return dispatch({
    type: EntitiesActions.GetEntities,
    payload: blocksyncApi.project.listProjects().then(response => {
      return response.map(entity => ({
        did: entity.projectDid,
        entityType: entity.data.entityType
          ? toTitleCase(entity.data.entityType)
          : EntityType.Project,
        userDid: entity.data.createdBy,
        status: entity.status,
        title: entity.data.title,
        shortDescription: entity.data.shortDescription,
        longDescription: entity.data.longDescription,
        dateCreated: moment(entity.data.createdOn),
        ownerName: entity.data.ownerName,
        country: entity.data.projectLocation,
        impactAction: entity.data.impactAction,
        imageUrl: `${entity.data.serviceEndpoint}public/${entity.data.imageLink}`,
        logoUrl: entity.data.logoLink,
        serviceProvidersCount: entity.data.agentStats.serviceProviders,
        evaluatorsCount: entity.data.agentStats.evaluators,
        requiredClaimsCount: entity.data.requiredClaims,
        pendingClaimsCount: [entity.data.claims].filter(
          claim => claim.status === '0',
        ).length, // due to pendingClaims not existing in the claimStats we have to look in the claims itself!
        successfulClaimsCount: entity.data.claimStats.currentSuccessful,
        rejectedClaimsCount: entity.data.claimStats.currentRejected,
        agentDids: entity.data.agents.map(agent => agent.did),
        sdgs: entity.data.sdgs,
        categories: entity.data.ddoTags
          ? entity.data.ddoTags.map(ddoTag => ({
              name: ddoTag.category,
              tags: ddoTag.tags,
            }))
          : [],
        founderLogoUrl: entity.data.founder ? entity.data.founder.logoLink : '',
        data: entity.data, // TEMP until project module not getting data from projects
      }))
    }),
  })
}

export const changeEntitiesType = (
  entityType: EntityType,
): ChangeEntitiesTypeAction => ({
  type: EntitiesActions.ChangeEntitiesType,
  payload: {
    entityType,
  },
})

export const filterToggleUserEntities = (
  userEntities: boolean,
): FilterToggleUserEntitiesAction => ({
  type: EntitiesActions.FilterToggleUserEntities,
  payload: {
    userEntities,
  },
})

export const filterToggleFeaturedEntities = (
  featuredEntities: boolean,
): FilterToggleFeaturedEntitiesAction => ({
  type: EntitiesActions.FilterToggleFeaturedEntities,
  payload: {
    featuredEntities,
  },
})

export const filterTogglePopularEntities = (
  popularEntities: boolean,
): FilterTogglePopularEntitiesAction => ({
  type: EntitiesActions.FilterTogglePopularEntities,
  payload: {
    popularEntities,
  },
})

export const filterDates = (
  dateFrom: Moment,
  dateTo: Moment,
): FilterEntitiesDatesAction => ({
  type: EntitiesActions.FilterDates,
  payload: {
    dateFrom,
    dateTo,
  },
})

export const resetDatesFilter = (): ResetEntitiesDatesFilterAction => ({
  type: EntitiesActions.ResetDatesFilter,
})

export const filterCategoryTag = (category: string, tag: string) => (
  dispatch: Dispatch,
  getState: () => RootState,
): FilterEntitiesCategoryTagsAction => {
  const state = getState()

  const currentCategoryTags = state.entities.filter.categories.find(
    filterCategory => filterCategory.name === category,
  ).tags

  const newCategoryTags = currentCategoryTags.includes(tag)
    ? [...currentCategoryTags.filter(val => val !== tag)]
    : [...currentCategoryTags, tag]

  return dispatch({
    type: EntitiesActions.FilterCategoryTag,
    payload: {
      category,
      tags: newCategoryTags,
    },
  })
}

export const filterCategories = (
  categories: Category[],
): FilterCategoriesAction => ({
  type: EntitiesActions.FilterCategories,
  payload: { categories },
})

export const resetCategoryFilter = (
  category: string,
): ResetEntitiesCategoryFilterAction => ({
  type: EntitiesActions.ResetCategoryFilter,
  payload: { category },
})

export const resetFilters = (): ResetEntitiesFiltersAction => ({
  type: EntitiesActions.ResetFilters,
})
