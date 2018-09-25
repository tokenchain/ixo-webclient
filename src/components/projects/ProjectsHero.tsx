import * as React from 'react';
import styled from 'styled-components';
import { deviceWidth } from '../../lib/commonData';

const DaysContainer = styled.div`
	justify-content: flex-start;
	display: flex;

	p {
		top: 20px;
	}

	@media (min-width: ${deviceWidth.mobile}px) {
		padding-top: 20px;
		padding-left: 250px;
		div {
			display: inline-block;
			justify-content: flex-start;
			display: grid;
			p {
				top: 0px;
				left: 5px;
			}
		}
		
	}
`;

const HeroInner = styled.div`
	padding: 110px 0 50px;
	color: ${props => props.theme.fontDarkGrey};
	position: relative;

	h2 {
		font-weight: 300;
		line-height: 40px;
		font-size: 32px;
		strong {
			text-align: left;
			font-weight: 600;
		}
	}

	h3 {
		font-weight: 300;
		display: block;
		font-size: 22px;
		color: #A11C43;
		font-family: ${props => props.theme.fontRobotoCondensed};
	}

	p {
		font-size: 16px;
		font-family: ${props => props.theme.fontRobotoCondensed};
		display: inline-block;
		right: auto;
		margin-bottom:0;
	}

	@media (min-width: ${deviceWidth.mobile}px) {
		h2 {	
			font-size: 40px;
			strong {
				display: block;
				text-align: right;
			}
		}

		h3 {
			font-size: 44px;
			display: inline-block;
		}

		p {
			position: relative;
			top: -20px;
			right: 10px;
		}
	}
`;

const HeroContainer = styled.div`
	margin:0 10px;
	width: 100vw;
	position: relative;

	${HeroInner}:before {
		position: absolute;
		content:" ";
		top:0;
		left:0;
		width:100%;
		height:100%;
		z-index:0;
		transition: background 0.3s ease;

		background-color: rgba(3,60,80,0);
	}

	@media (min-width: ${deviceWidth.mobile}px) {
		margin: 0;
	}
`;

export interface State {
	daysTo2030: number;
}

export interface Props {
	ixo?: any;
}

export class ProjectsHero extends React.Component<Props, State> {
	state = {
		daysTo2030: this.datediff(Date.now(), Date.parse('2030-01-01T00:00:00')),
	};
	
	datediff(first: number, second: number) {
		// Take the difference between the dates and divide by milliseconds per day.
		// Round to nearest whole number to deal with DST.
		return Math.round((second - first) / (1000 * 60 * 60 * 24));
	}

	render() {
		return (
			<HeroContainer>
				<HeroInner className="container">
					<div className="row">
						<div className="col-xl-6 col-lg-8">
							<h2>Technology ventures for the <strong>future of humanity.</strong></h2>
							<DaysContainer>
								<div>
									<h3>{this.state.daysTo2030.toLocaleString()}</h3>
									<p>DAYS TO ACHIEVE THE <strong>2030 GLOBAL GOALS</strong></p>
								</div>
							</DaysContainer>
						</div>
					</div>
				</HeroInner>
			</HeroContainer>
		);
	}
}