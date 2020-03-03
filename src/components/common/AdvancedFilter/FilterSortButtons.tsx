import * as React from 'react'
import DatePicker from './DatePicker'
import filterSchemaIXO from '../../../lib/json/filterSchemaIXO.json'
import {
  PositionController,
  Button,
  ButtonWrapper,
  FilterModal,
  ModalItems,
  FilterSelectButton,
  ResetButton,
  ApplyButton,
} from './Style'

class FilterSortButtons extends React.Component<
  {},
  { showDatePicker: boolean; checkTitle: string; selectedButtons: string[] }
> {
  constructor(props) {
    super(props)
    this.state = {
      showDatePicker: false,
      checkTitle: ' ',
      selectedButtons: [],
    }
  }

  toggleShowDatePicker = (e): void => {
    e.preventDefault()
    this.setState({
      showDatePicker: !this.state.showDatePicker,
      checkTitle: ' ',
    })
  }

  setId = (e, title): void => {
    console.log(title)
    this.setState({
      checkTitle: title,
      showDatePicker: false,
    })
    if (this.state.checkTitle === title && !e.target.reset) {
      this.setState({
        checkTitle: ' ',
      })
    }
  }

  handleClose = (e, title): void => {
    const filterModal = e.target
      .closest('.button-wrapper')
      .querySelector('.filter-modal')
    if (filterModal.contains(e.target)) {
      return
    }
    this.setId(e, title)
  }

  handleMultipleSelect = (button): void => {
    const tmp = this.state.selectedButtons
    if (this.state.selectedButtons.includes(button)) {
      this.setState({
        selectedButtons: this.state.selectedButtons.filter(el => el !== button),
      })
    } else {
      tmp.push(button)
      this.setState({
        selectedButtons: tmp,
      })
    }
  }

  resetFilters = (): void => {
    this.setState({
      selectedButtons: [],
    })
  }

  render(): JSX.Element {
    return (
      <PositionController>
        <Button onClick={this.toggleShowDatePicker}>
          <i className="icon-calendar-sort" style={{ padding: 6 }}></i>
          Dates
        </Button>

        {filterSchemaIXO.categories.map(filterCategory => {
          return (
            <ButtonWrapper
              key={filterCategory['title']}
              className={`button-wrapper ${
                filterCategory['title'] === this.state.checkTitle
                  ? 'active'
                  : ''
              }`}
              onClick={(e): void =>
                this.handleClose(e, filterCategory['title'])
              }
            >
              <Button
                onClick={(e): void => this.setId(e, filterCategory['title'])}
              >
                {filterCategory.title}
              </Button>
              <FilterModal
                className="filter-modal"
                style={{
                  display:
                    filterCategory['title'] === this.state.checkTitle
                      ? 'block'
                      : 'none',
                }}
              >
                <ModalItems>
                  {filterCategory.tags.map(button => {
                    return (
                      <FilterSelectButton
                        key={button.title}
                        onClick={(): void =>
                          this.handleMultipleSelect(button.title)
                        }
                        className={
                          this.state.selectedButtons.includes(button.title)
                            ? 'buttonPressed'
                            : ''
                        }
                      >
                        <h3>{button.title}</h3>
                        <img
                          alt={button.title}
                          src={require('./IXOicons/' + button.icon)}
                        />
                      </FilterSelectButton>
                    )
                  })}
                </ModalItems>
                <ResetButton>Reset</ResetButton>
                <ApplyButton>Apply</ApplyButton>
              </FilterModal>
            </ButtonWrapper>
          )
        })}
        <Button className="reset" onClick={this.resetFilters}>
          <i className="icon-reset" style={{ padding: 6 }}></i>
          Reset
        </Button>
        {this.state.showDatePicker ? <DatePicker /> : null}
      </PositionController>
    )
  }
}
export default FilterSortButtons
