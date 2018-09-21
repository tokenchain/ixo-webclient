import * as React from 'react';
import styled from 'styled-components';
import MediaQuery from 'react-responsive';
import { deviceWidth } from '../../lib/commonData';
// import { getIxoWorldRoute } from '../../utils/formatters';
import { getIxoWorldRoute } from '../../utils/formatters';
import { Fragment } from 'react';

const ixoLogo = require('../../assets/images/ixo-logo.svg');
const sdgLogo = require('../../assets/images/footer-logo.svg');

const IXOLogo = styled.img`
	margin-top: -6px;
	margin-right:5px;
	margin-left:5px;
	height: 16px;
`;

const ExternalFooterLink = styled.a`
	font-family: ${props => props.theme.fontRobotoRegular};
	color: white;
	margin: 0;
	font-size: 13px;
	border: 1px solid #000000;
	border-radius:3px;
	margin:0 10px;

	:hover {
		text-decoration:none;
		color: ${props => props.theme.fontBlue};
	}

	transition: border 0.3s ease;

	@media (min-width: ${deviceWidth.tablet}px) {
		padding: 20px 20px 10px;
		margin:0 10px;
		font-size:13px;
	}

	transition:border 0.3s ease;
`;

const SDGLogo = styled.img`
	margin-right: 20px;
	width: 200px;
	margin-top: 0px;
`;

// const FooterTextBlue = styled.span`
// 	color: #5CD0FA;

// 	:hover {
// 		text-decoration: underline;
// 	}
// `;

const FooterText = styled.div`
	padding: 5px 0px 20px 15px;
	color: white;
	font-family: Roboto;
	font-size: 14px;
	line-height: 19px;
`;

const Main = styled.div`
	display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

export const FooterLeft: React.SFC<any> = ({simple}) => {

	return (
		<Fragment>
			<Main className="col-md-8">
				<div className="row">
					<MediaQuery minWidth={`${deviceWidth.tablet}px`}>
						<SDGLogo alt="SDG Futures Logo" src={sdgLogo}/>
					</MediaQuery>
					<ExternalFooterLink href="/">Ventures</ExternalFooterLink>
					<ExternalFooterLink href="/about">About</ExternalFooterLink>
					<ExternalFooterLink href="/global-statistics">Impacts</ExternalFooterLink>
					{/* <FooterLink exact={true} to="/">Oracles</FooterLink> */}
					{/* <FooterLink exact={true} to="/">Plans / Pricing</FooterLink> */}
				</div>
				<div className="row">
					<FooterText className="row">
						In partnership with <a href="https://ixo.world"><IXOLogo alt="ixo Logo" src={ixoLogo}/></a> for the Future of Humanity
					</FooterText>
				</div>
			</Main>
		</Fragment>
	);
};