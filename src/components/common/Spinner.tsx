import * as React from 'react';
import styled from 'styled-components';

const sdgLogo = require('../../assets/images/SDGLogo.svg');

const Container = styled.div`
    display:flex;
    justify-content:center;
	align-items:center;
	flex-direction: column;
	background-color: ${props => props.theme.bg.lightGrey};
	flex:1 1 auto;
	p {
		color: #282828
	}
`;

const LoaderContainer = styled.div`
	height: 80px;
	display: flex;
	align-items: center;
`;

const SpinningImage = styled.div`
	animation-name: spinner;
	animation-duration: 2.5s;
	animation-iteration-count: infinite;
	animation-timing-function: linear;
	transform-origin: 50% 50%;
	display: inline-block;

	@keyframes spinner {
	0% {
			transform: rotate(0deg);
	}
	100% {
			transform: rotate(360deg);
	}
`;

// const LoaderInner = styled.div`

// 	border-radius: 50%;
// 	padding: 5px;
// 	background: ${props => props.theme.ixoBlue};

// 	i {
// 		font-size: 30px;
// 		display:block;
// 		width: 29px;
// 		height: 29px;
// 		padding: 0;
// 		background: ${props => props.theme.bg.blue};
// 		border-radius: 50%;
// 	}
// 	.icon-ixo-x:before {
// 		color: ${props => props.theme.ixoBlue};
// 	}
// `;
export interface Props {
	info: string;
}

export const Spinner: React.SFC<Props> = ({info}) => {
	return (
		<Container>
			<LoaderContainer>
				<SpinningImage>
					<img src={sdgLogo} width="50px" height="50px"/>
				</SpinningImage>
			</LoaderContainer>
			<p>{info}</p>
		</Container>
	);
};