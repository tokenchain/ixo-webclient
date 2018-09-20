import * as React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { deviceWidth } from '../../lib/commonData';
import { Fragment } from 'react';

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
	margin: 5px 15px;

	@media (min-width: 415px) {
		padding: 7px 10px;
		margin: 5px 20px;
		font-size:15px;
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

	border:1px solid #A11C43;
	border-radius: 3px;
	font-weight: 300;
	color: white;
	background: #A11C43;

	&.active {
		background: #A11C43;
		color: white;
		font-weight: 300;
	}

	:hover {
		text-decoration:none;
		&&{color: white;}}
	}


`;

const Main = styled.div`
	padding:15px 20px;
	justify-content: flex-end;

	@media (min-width:${deviceWidth.tablet}px){
		justify-content: space-between;
	}

	a {
		text-decoration: none;
	}
`;

const IXOLogo = styled.img`
	margin-top: -6px;
`;

export const HeaderLeft: React.SFC<any> = ({refreshProjects}) => {

	return (
		<Fragment>
			<Main className="col-md-10 d-flex align-items-center">
				<div>
					<a href="/"><IXOLogo alt="SDG Futures Logo" src={sdgLogo}/></a>
				</div>
				<div>
					<HeaderLink exact={true} onClick={refreshProjects} to="/">Ventures</HeaderLink>
					<HeaderLink exact={true} to="/about">About SDG Futures</HeaderLink>
					<HeaderLink exact={true} to="/global-statistics">Impacts</HeaderLink>
					<HeaderBorderLink exact={true} to="/create-project">Launch a Venture</HeaderBorderLink>
				</div>
			</Main>
		</Fragment>
	);
};