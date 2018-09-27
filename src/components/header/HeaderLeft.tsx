import * as React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { Fragment } from 'react';
import { deviceWidth } from '../../lib/commonData';
import MediaQuery from 'react-responsive';
import * as ReactGA from 'react-ga';

// const ixoLogo = require('../../assets/images/ixo-logo.svg');
const sdgLogo = require('../../assets/images/header-logo.svg');

const HeaderLink = styled(NavLink)`
	color: inherit;
	font-family: ${props => props.theme.fontRobotoCondensed};
	font-size: 13px;
	font-weight: 400;
	letter-spacing: 1px;
	text-transform: uppercase;
	bottom: 1px;
	border-width: 0 0 1px;
	border-style: solid;
	border-color: #D6D6D6;
	padding:5px 10px;
	margin: 5px 5px;
	display: block;

	@media (min-width: ${deviceWidth.desktop}px) {
		display: inline;
		padding: 7px 10px;
		margin: 5px 5px;
		font-size:15px;
	}

	@media (min-width: 1200px) {
		margin: 5px 20px;
	}

	&.active {
		bottom: 1px;
		border-width: 0 0 1px;
		border-style: solid;
		border-color: #A11C43;
	}

	:hover {
 		text-decoration:none;
 		&&{color: #A11C43;}}
	}
`;

const HeaderBorderLink = HeaderLink.extend`
	border-radius: 3px;
	font-weight: 300;
	color: white;
	background: #A11C43;
	border-bottom: 1px solid #A11C43;

	&.active {
		background: #A11C43;
		color: #FCBBCE;
		font-weight: 300;
	}

	:hover {
		text-decoration:none;
		&&{color: white;}
	}

	&.active:hover {
		&&{color: #FCBBCE;}
	}

`;

const Main = styled.div`
	padding:15px 20px;
	justify-content: space-between;
	height: 74px;

	a {
		text-decoration: none;
	}

	.openMenu {
		right: 0;
		opacity: 1;
		pointer-events: auto;
	}
`;

const IXOLogo = styled.img`
	margin-top: -6px;
`;

const Menu = styled.div`

	transition: all 0.8s ease;
    position: absolute;
	top: 74px;
	opacity: 0;
    right: -20%;
    background: white;
    width: 100%;
	padding: 15px;
	pointer-events: none;
	max-width: 600px;

	${HeaderLink} {
		display: block;
	}

	@media( min-width: ${deviceWidth.desktop}px) {
		max-width: none;
		position: relative;
		top: auto;
		opacity: 1;
		right: auto
		background: none;
		pointer-events: auto;

		${HeaderLink} {
			display: inline;
		}
	}
`;

const Burger = styled.div`

	position: relative;

	@media( min-width: ${deviceWidth.desktop}px) {
		display: none;
	}

	.bar1, .bar2, .bar3 {
		width: 35px;
		height: 5px;
		background-color: #333;
		margin: 6px 0;
		transition: 0.4s;
	}

	.change .bar1 {
		-webkit-transform: rotate(-45deg) translate(-8px, 8px);
		transform: rotate(-45deg) translate(-8px, 8px);
		transform-origin: center;
	}

	.change .bar2 {opacity: 0;}

	.change .bar3 {
		-webkit-transform: rotate(45deg) translate(-8px, -8px);
		transform: rotate(45deg) translate(-8px, -8px);
		transform-origin: center;
	}
`;
export interface ParentProps {
	refreshProjects: Function;
	simple: boolean;
}

export class HeaderLeft extends React.Component<ParentProps> {

	state = {
		menuOpen: false
	};

	handleBurgerClick = () => {
		this.setState({ menuOpen : !this.state.menuOpen});
	}

	trackEventClick = (clickEvent: string) => {
		ReactGA.event({
			category: 'Button click',
			action: clickEvent,
		});
	}

	render() {
		return (
			<Fragment>
				<Main className="col-md-12 col-lg-10 d-flex align-items-center">
					<div>
						<a href="/"><IXOLogo alt="SDG Futures Logo" src={sdgLogo}/></a>
					</div>
					<div>
						<Burger onClick={this.handleBurgerClick} >
							<div className={this.state.menuOpen === true ? 'change' : ''}>
								<div className="bar1"/>
								<div className="bar2"/>
								<div className="bar3"/>
							</div>
						</Burger>
						<Menu className={this.state.menuOpen === true ? 'openMenu' : ''}>
							{/* <HeaderBorderLink exact={true} to={{ pathname: `/projects/did:ixo:fGcCu1UjtSB9XXVAcHtou/overview`, state: {featured: true} }}>Apply</HeaderBorderLink> */}
							{/* {process.env.REACT_APP_FEATURED_PROJECT && <HeaderBorderLink exact={true} to={`/projects/${process.env.REACT_APP_FEATURED_PROJECT}/overview`}>Apply</HeaderBorderLink>} */}
							<HeaderBorderLink exact={true} onClick={() => this.props.refreshProjects} to="/">Ventures</HeaderBorderLink>
							<HeaderLink exact={true} to="/about">About</HeaderLink>
							<HeaderLink exact={true} onClick={() => { this.trackEventClick('Clicked Imapacts Navigation'); }}  to="/global-statistics">Impacts</HeaderLink>
							<MediaQuery minWidth={`${deviceWidth.desktop}px`}>
								<HeaderBorderLink onClick={() => { this.trackEventClick('Launch New Venture Header Button'); }} exact={true} to="/create-project">Launch a Venture</HeaderBorderLink>
							</MediaQuery>
						</Menu>
					</div>
				</Main> 
			</Fragment>
		);
	}
}