import * as React from 'react';
import styled from 'styled-components';
// import { Link } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Inner = styled.div`
	position:relative;
	z-index:2;

	font-family: ${props => props.theme.fontRobotoCondensed};
`;

const UserMenu = styled.div`
	position: fixed;
	top: -260px;
	width: 260px;
	right:0;
	z-index: 1;
	font-family: ${props => props.theme.fontRoboto};

	transition: top 0.5s ease;
`;

const UserBox = styled.div`
	width: 160px;
	height: 74px;
	padding: 0 10px 20px 10px;
	position:relative;
	z-index: 2;
	display: flex;
	flex-direction: column;
	align-items: center;

	transition: all 0.5s ease;

	> p {
		margin-bottom: 0;
		text-align: center;
	}

	i {
		font-size: 18px;
		margin: 1px 0 0 10px;	
	}
`;

const NoPadLeft = styled.div`
	padding-right:0;
	position:relative;
	z-index:2;

	${UserMenu}.visible {
		top:74px;
	}

	h3 {
		font-size:14px;
		margin-bottom:0;
		display: flex;
		justify-content: space-between;
		z-index:2;
		position:relative;
		letter-spacing:0.3px
		font-weight: 600;
		font-family: ${props => props.theme.fontRoboto};
	}
`;

const StatusBox = styled.div`
	text-align:center;
	width: 110px;
`;
const StatusText = styled.p`
	color: #282828;
	text-transform: uppercase;
	font-size: 11px;
	margin: 5px auto 10px;
	font-weight: normal;
`;

const JoinLink = styled(Link)`
	color: #282828;
	text-decoration: none;

	:hover {
		text-decoration: none;
		color: #282828;
	}
`;	

interface HeaderRightProps {
	userInfo: any;
	renderStatusIndicator: () => JSX.Element;
	simple?: boolean;
}

interface State {
	showMenu: boolean;
}
export class HeaderRight extends React.Component<HeaderRightProps, State> {

	state = {
		showMenu: false
	};
	
	render() {
		if (this.props.simple === true) {
			return <NoPadLeft className="col-md-2" />;
		} else {
			return (
				<NoPadLeft className="col-md-2">
					<Inner className="d-flex justify-content-end">
						{(this.props.userInfo === null) ?
							<JoinLink to="/register">
								<UserBox>
									<StatusBox>
										{this.props.renderStatusIndicator()}
										<StatusText>IXO EXPLORER STATUS</StatusText>
									</StatusBox>
									<h3><span>Join the Beta</span></h3>
								</UserBox>
							</JoinLink>
							:
							<UserBox>
								<StatusBox>
									{this.props.renderStatusIndicator()}
									<StatusText>IXO EXPLORER STATUS</StatusText>
								</StatusBox>
								<h3><span>{this.props.userInfo.name}</span></h3>
							</UserBox>
						}
					</Inner>
				</NoPadLeft>
			);
		}
	}
}