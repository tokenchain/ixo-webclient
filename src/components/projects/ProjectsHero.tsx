import * as React from 'react';
import styled from 'styled-components';
import { deviceWidth } from '../../lib/commonData';

const DaysContainer = styled.div`
	justify-content: flex-end;
	display: flex;

	div {
		display: inline-block;
	}
`;

const HeroInner = styled.div`
	padding: 110px 0 0;
	color: white;

	h2 {
		font-weight: 300;
		strong {
			display: block;
		}
	}

	h3 {
		font-weight: 300;
		font-size: 70px;
		border-bottom: 1px solid ${props => props.theme.fontLightBlue};
		color: ${props => props.theme.fontLightBlue};
	}

	p {
		font-size: 19px;
		font-family: ${props => props.theme.fontRobotoCondensed};
	}
`;

const HeroContainer = styled.div`
	background: linear-gradient(0deg, #F1F0F0 0%, #D6D6D6 100%);
	margin:0 0 0px;
	width: 100vw;
	position:relative;
	height: 200px;

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

	@media (min-width: ${deviceWidth.tablet}px) {
		height: 425px;
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
		daysTo2030: this.datediff(Date.now(), Date.parse('2030-01-01 00:00:00')),
	};
	
	datediff(first: number, second: number) {
		// Take the difference between the dates and divide by milliseconds per day.
		// Round to nearest whole number to deal with DST.
		return Math.round((second - first) / (1000 * 60 * 60 * 24));
	}

	render() {
		const dateString = String(this.state.daysTo2030);
		return (
			<HeroContainer>
				<HeroInner className="container">
					<div className="row">
						<div className="col-md-6">
							<h2>Technology ventures for the <strong>future of humanity.</strong></h2>
						</div>
						<DaysContainer className="col-md-6">
							<div>
								<h3>{[dateString.slice(0, 1) , ' ', dateString.slice(1)].join('')}</h3>
								<p>COUNTDOWN TO <strong>2030</strong></p>
							</div>
						</DaysContainer>
					</div>
				</HeroInner>
			</HeroContainer>
		);
	}
}