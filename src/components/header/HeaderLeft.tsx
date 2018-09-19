import * as React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { deviceWidth } from '../../lib/commonData';
import { Fragment } from 'react';

// const ixoLogo = require('../../assets/images/ixo-logo.svg');
const sdgLogo = require('../../assets/images/FuturesLogo.svg');

const HeaderLink = styled(NavLink)`
	color: white;
	font-family: ${props => props.theme.fontRobotoCondensed};
	font-size: 13px;
	font-weight: 400;
	letter-spacing: 1px;
	text-transform: uppercase;
	border: 1px solid #000000;
	border-radius:3px;
	
	@media (min-width: 415px) {
		padding:5px 10px 5px;
		margin:0 10px;
		font-size:13px;
	}

	transition:border 0.3s ease;

	:hover {
 		text-decoration:none;
 		&&{color: ${props => props.theme.fontBlue};}}
 	}
`;

const HeaderBorderLink = HeaderLink.extend`

	border:1px solid #49bfe0;
	font-weight: 300;

	&.active {
		background: ${props => props.theme.bg.gradientButton};
		color:white;
		font-weight: 300;
	}

`;

const Main = styled.div`
	padding:15px 20px;
	justify-content: flex-end;
	
	a:first-child {
		margin-right: auto;
	}

	@media (min-width:${deviceWidth.tablet}px){
		justify-content: flex-start;

		a:first-child {
			margin-right: inherit;
		}
	}

	a {
		text-decoration: none;
	}
`;

const IXOLogo = styled.img`
	margin-top: -6px;
	margin-right:100px;
`;

export const HeaderLeft: React.SFC<any> = ({refreshProjects}) => {

	return (
		<Fragment>
			<Main className="col-md-3 d-flex align-items-center">
				<a href="/"><IXOLogo alt="SDG Futures Logo" src={sdgLogo}/></a>
			</Main>
			<Main className="col-md-7 d-flex align-items-center">
				<HeaderLink exact={true} onClick={refreshProjects} to="/">Ventures</HeaderLink>
				<HeaderBorderLink exact={true} to="/create-project">Launch a Venture</HeaderBorderLink>
				<HeaderLink exact={true} to="/about">About SDG Futures</HeaderLink>
				<HeaderLink exact={true} to="/global-statistics">Impacts</HeaderLink>
			</Main>
		</Fragment>
	);
};