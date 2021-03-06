import React, { Component } from 'react'
import {
  StyledHeaderItem,
  Token,
  ValueContainer,
  Title,
  Price,
  AdditionalInfo,
} from './SummaryCard.styles'
import { thousandSeparator } from '../../../../utils/formatters'

export default class HeaderItem extends Component<any> {
  render(): JSX.Element {
    return (
      <StyledHeaderItem>
        {this.props.tokenType ? (
          <Token>
            <span>{this.props.tokenType}</span>
          </Token>
        ) : null}

        <ValueContainer>
          <Title>{this.props.title}</Title>
          <Price>
            {this.props.tokenType ? thousandSeparator(this.props.value) : '0%'}
          </Price>
          <AdditionalInfo>{this.props.additionalInfo}</AdditionalInfo>
        </ValueContainer>
      </StyledHeaderItem>
    )
  }
}
