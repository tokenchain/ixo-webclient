import React, { Dispatch } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { filterCategories, changeEntitiesType } from './Entities.actions'
import { EntityType, Category } from './types'
import * as entitiesUtils from './Entities.utils'
import * as queryString from 'query-string'
import { ErrorContainer } from './Entities.container.styles'

interface Props {
  location: any
  handleChangeEntitiesType: (entityType: EntityType) => void
  handleFilterCategories: (categories: Category[]) => void
}

const EntitiesSelect: React.FunctionComponent<Props> = ({
  location: { search },
  handleChangeEntitiesType,
  handleFilterCategories,
}) => {
  const params = queryString.parse(search)
  const entityTypes = Object.values(EntityType)

  if (entityTypes.find(e => e === params.type)) {
    const entityType = params.type as EntityType

    handleChangeEntitiesType(entityType)
    // "type" must be set and valid in order for any filters to be able to be applied
    if (params.categories) {
      const categoriesFromParams = JSON.parse(params.categories as string)
      const remainingCategories = entitiesUtils
        .getInitialSelectedCategories(entityType)
        .filter(c => !categoriesFromParams.map(c => c.name).includes(c.name))
      const categories = [...categoriesFromParams, ...remainingCategories]

      handleFilterCategories(categories)
    }
    // Other filters can be handled here in the future
  } else {
    return (
      <ErrorContainer>
        Error: expected &quot;type&quot; parameter of one of the following&nbsp;
        {entityTypes.map(e => (
          <strong key={e}>&nbsp;{e},</strong>
        ))}
      </ErrorContainer>
    )
  }

  return <Redirect to="/" />
}

const mapDispatchToProps = (dispatch: Dispatch<any>): any => ({
  handleChangeEntitiesType: (entityType: EntityType): void =>
    dispatch(changeEntitiesType(entityType)),
  handleFilterCategories: (categories: Category[]): void =>
    dispatch(filterCategories(categories)),
})

export const EntitiesSelectConnected = connect(
  null,
  mapDispatchToProps,
)(EntitiesSelect)
