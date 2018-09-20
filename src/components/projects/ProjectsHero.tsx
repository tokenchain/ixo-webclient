import * as React from 'react';
import styled from 'styled-components';

const DaysContainer = styled.div`
	justify-content: flex-end;
	display: flex;

	div {
		display: inline-block;
	}
`;

const HeroInner = styled.div`
	padding: 110px 0 0;
	color: ${props => props.theme.fontDarkGrey};
	position: relative;

	h2 {
		font-weight: 300;
		font-size: 40px;
		line-height: 40px;

		strong {
			display: block;
			text-align: right;
			font-weight: 600;
		}
	}

	h3 {
		font-weight: 300;
		font-size: 44px;
		display: inline-block;
		color: #A11C43;
		font-family: ${props => props.theme.fontRobotoCondensed};
	}

	p {
		font-size: 16px;
		font-family: ${props => props.theme.fontRobotoCondensed};
		display: inline-block;
		position: relative;
		top: -20px;
		right: 10px;
	}
`;

const HeroContainer = styled.div`
	margin:0 0 0px;
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
		return (
			<HeroContainer>
				<HeroInner className="container">
					<div className="row">
						<div className="col-xl-6 col-lg-8">
							<h2>Technology ventures for the <strong>future of humanity.</strong></h2>
							<DaysContainer>
								<div>
									<p>COUNTDOWN TO <strong>2030</strong></p>
									<h3>{this.state.daysTo2030.toLocaleString()}</h3>
								</div>
							</DaysContainer>
						</div>
					</div>
				</HeroInner>
			</HeroContainer>
		);
	}
}