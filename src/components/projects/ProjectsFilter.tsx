import * as React from 'react';
import { SDGArray } from '../../lib/commonData';
import styled from 'styled-components';

const SDGsContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	width: 810px;
	max-width: 100%;
	margin-top: 50px;
`;

const Dialog = styled.div`
	position: absolute;
	bottom: calc(100% - 5px);
	background: white;
	border-radius: 5px;
	width: 265px;
	padding: 12px;
	box-shadow: 0 2px 9px 0 rgba(0,0,0,0.5);
	opacity: 0;
	transform: scale(0.8);
	z-index: 11;
	pointer-events: none;
	transition: all 0.3s ease;

	p {
		font-size: 14px;
		margin-bottom: 0;
	}

	a {
		font-weight: bold;
		color: #00D2FF;
		font-size: 14px;
	}
`;

const Arrow = styled.div`
	position: absolute;
	top:100%;
	left: 10px;
	width: 0; 
	height: 0; 
	border-left: 8px solid transparent;
	border-right: 8px solid transparent;
	border-top: 10px solid white; 
`;

const Check = styled.div`
	position: absolute;
	top:0;
	left:0;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	background: rgba(0,0,0,0.3);
	opacity: 0;

	transition: all 0.3s ease;

	i {
		font-size: 24px;
		transform: scale(0.6);
		transition: 0.3s ease;

		:before {
			color: white;
		}
	}
`;

const SDG = styled.div`
	width: 75px;
	height: 75px;
	box-shadow: 0 3px 11px 0 rgba(0,0,0,0.31);
	margin: 0 15px 15px 0;
	position: relative;
	cursor: pointer;

	img {
		width: 100%;
		height: 100%;
		transition: opacity 0.3s ease;
	} 

	:hover {
		${Dialog} {
			opacity: 1;
			transform: scale(1);
			pointer-events: auto;
		}

		img {
			opacity: 0.5;
		}
	}

	.checked ${Check} {
		opacity: 1;

		i {
			transform: scale(1);
		}
	}

	.checked img {
		opacity: 0.5;
	}
`;

export interface ParentProps {
	handleFilter: (filter: boolean, indexes?: number[] ) => void;
}

export interface State {
	selected: number[];
}

export class ProjectsFilter extends React.Component<ParentProps, State> {

	state = {
		selected: []
	};

	handleSetClicked = (idx: number) => {
		
		let currSelected: number[] = [...this.state.selected];

		// @ts-ignore
		if (currSelected.includes(idx)) {
			currSelected = currSelected.filter((val) => idx !== val );
		} else {
			currSelected.push(idx);
		}
		this.setState({
			selected: currSelected
		});

		if (currSelected.length > 0 ) {
			this.props.handleFilter(true, currSelected);
		} else {
			this.props.handleFilter(false);
		}
	}

	handleIsSelected = (idx: number) => {
		
		// @ts-ignore
		if (this.state.selected.includes(idx)) {
			return true;
		} else {
			return false;
		}
	}
	render() {
		return (
			<div className="container">
					<SDGsContainer>
						{SDGArray.map((sdg, idx) => {
							return (
								<SDG onClick={() => this.handleSetClicked(idx + 1)} key={idx} style={{background: sdg.color}}>
									<div className={this.handleIsSelected(idx + 1) ? 'checked' : ''}>
										<img src={`./sdgs/${idx + 1}.png`}/>
										<Dialog>
											<p>{sdg.shortText}</p>
											<a href={sdg.url} target="_blank">Find out more</a>
											<Arrow />
										</Dialog>
										<Check>
											<i className="icon-approved" />
										</Check>
									</div>
								</SDG>
							);
						})}
						<SDG onClick={() => this.handleSetClicked(18)} style={{background: 'white'}}>
							<div className={this.handleIsSelected(18) ? 'checked' : ''}>
								<img src={`./sdgs/18.png`}/>
								<Dialog>
									<p>Future of humanity description</p>
									<a href="test" target="_blank">Find out more</a>
									<Arrow />
								</Dialog>
								<Check>
									<i className="icon-approved" />
								</Check>
							</div>
						</SDG>
					</SDGsContainer>
			</div>
		);
	}
}