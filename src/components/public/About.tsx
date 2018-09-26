import * as React from 'react';
import styled from 'styled-components';
import { deviceWidth } from '../../lib/commonData';
// import { ButtonTypes, Button } from '../common/Buttons';
import * as tracking from '../../utils/socialTracker';
import MediaQuery from 'react-responsive';

// const bannerBg = require('../../assets/images/404/404-bg.jpg');
// const walrusImg = require('../../assets/images/404/walrus-image.png');

const AboutContainer = styled.div`
	background: inherit;
	display: flex;
	flex: 1;
	flex-direction: column;
	justify-content: center;
`;
// const BannerLeft = styled.div`
// 	width: 100%;
// 	img {
// 		margin-top: 10%;
// 		margin-left: -3%;
// 		width: 90%;
// 	}
// 	@media (max-width: 1240px) {
// 		img {
// 			display: none
// 		}
// 	}
// 	@media (max-width: ${deviceWidth.tablet}px){
// 		img {
// 			display: none;
// 		}
// 	}
// `;
const AboutInner = styled.div`
	display: flex;
	align-items: center;
	color: #282828;
	
	@media (min-width: ${deviceWidth.mobile}px) {
		margin-top: -74px;
	}

	h2 {
		font-size: 45px;
		font-family: ${props => props.theme.fontRobotoCondensed};
		width: 100%;
		margin-bottom: 25px;
	}

	h5 {
		font-size: 23px;
		font-weight: 300;
	}
	p {
		position: relative;
		box-sizing: border-box;
		font-weight: 300;
		max-width: 540px;
		margin-bottom: 25px;
	}

	button {
		background: none;
		color: white;
		border: 1px solid #49BFE0;
		padding: 10px 25px;
		text-transform: uppercase;
		font-size: 15px;
		font-family: ${props => props.theme.fontRobotoCondensed};
		margin-top: 20px;
		cursor: pointer;
	}
`;

// const ButtonContainer = styled.div`
// 	display: inline-flex;
// 	margin-top: 20px;
// `;

export interface ParentProps { }

export const About: React.SFC<ParentProps> = (props) => {
	return (
		<AboutContainer className="container">
			<div className="row">
				{tracking.fireTracker('/about-sdg-futures')}
				<AboutInner className="col-lg-8 col-md-12">
					<div>
						<h2>About SDG Futures</h2>
						<p>SDG Futures is an initiative of Future of Humanity, a decentralized and distributed communities 
							and technology stack for the United Nations SDG’s.
						</p>
						<p> SDG Futures is partnering with the best in 
							technology, philanthropy, and ethical business to form open-sourced decentralized communities to 
							accomplish the United Nation's Sustainable Development Goals globally.
						</p>
							<MediaQuery minWidth={`${deviceWidth.desktop}px`}>
								{/* <ButtonContainer><Button type={ButtonTypes.dark} href="/create-project">Launch a Venture</Button></ButtonContainer> */}
							</MediaQuery>
					</div>
				</AboutInner>
			</div>
		</AboutContainer>
	);
};