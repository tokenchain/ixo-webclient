import * as React from 'react';
import { deviceWidth } from '../../lib/commonData';
import styled from 'styled-components';
import { AgentRoles } from '../../types/models';
import { getCountryName } from '../../utils/formatters';
import { ModalWrapper } from '../common/ModalWrapper';
import { ProjectNewAgent } from './ProjectNewAgent';
import { UserInfo } from '../../types/models';
import QRComponent from '../common/QRComponent'; 
import { Helmet } from 'react-helmet';
import ReactMd from 'react-md-file';

const placeholder = require('../../assets/images/ixo-placeholder-large.jpg');

const OverviewContainer = styled.section`

	margin-top: -86px;
	background: ${props => props.theme.bg.lightGrey};
	color: white;
	padding-bottom: 40px;
`;

const ProjectImage = styled.img`
	width: 100%;
	box-shadow: 0px 10px 35px 0px rgba(0,0,0,0.25);
	margin-bottom: 22px;
`;

const BarContainer = styled.div`

	div {
		height: 2px;
		background-color: #033C50;
	}

	div div {
		height: 4px;
		position: relative;
		top: -1px;
		z-index: 1;
	}
`;

const SidebarTop = styled.div`
	font-weight: 200;
    display: flex;
    flex-direction: column;
	justify-content: center;
	
	p {
		margin-bottom: 0;
		line-height: 24px;
	}

	i {
		margin-right: 8px;
	}

	i:before {
		color: ${props => props.theme.fontDarkGrey};
	}
`;

const Sidebar = styled.div`
	background: white;
	padding: 24px 15px 15px;
	box-shadow: 0px 5px 25px 0px rgba(0,0,0,0.2);
	margin: 90px 0 35px;
	color: ${props => props.theme.fontDarkGrey};

	hr {
		height: 1px;
		border-radius: 2px;
		background-color: #c9c9c9;
	}
`;

const Claims = styled.h4`
	font-size: 18px;
	margin: 15px 0 0;
	color: #282828;

	strong {
		color: #A11C43;
		font-weight: 600;
		font-size: 39px;
		display: block;
	}
`;

const Text = styled.div`
	color: ${props => props.theme.fontDarkGrey};
	font-size: 16px;
	line-height: 30px;
`;

const Social = styled.div`

	margin: 10px 0 20px;
    display: flex;
	justify-content: space-evenly;
	
	@media (min-width:${deviceWidth.tablet}px){
		margin-top: 10px;
		display: block;
	}

	i {
		font-size: 17px;
		margin-right: 28px;

		transition: transform 0.3s ease;
	}

	i:before {
		color: ${props => props.theme.fontDarkGrey};
	}

	i:hover:before {
		cursor: pointer;
		color: ${props => props.theme.darkGrey};
	}

	a:hover {
		text-decoration: none;
	}
`;

const Hidden = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: opacity 0.3s ease;
	opacity: 0;

	i {
		color: #282828;
		top: auto;
		margin: 0 8px;
		font-size: 20px;
	}

	.icon-facebook:hover:before {
		color: #3B5998;
	}
	.icon-twitter:hover:before {
		color: #1DA1F2;
	}
`;

const Visible = styled.div`
	i {
		font-size: 21px;
		position: relative;
		top: 3px;
		margin-right: 10px;
	}
	transition: opacity 0.3s ease;
`;

const LocalButton = styled.a`
	border: 1px solid #A11C43;
    &&& {color: ${props => props.theme.fontGrey};}
    font-size: 16px;
    text-transform: uppercase;
    padding: 5px 20px;
    background: none;
    margin:20px 0 30px;
	width: 100%;
	font-family: ${props => props.theme.fontRobotoCondensed};
	font-weight: 500;
	display:inline-block;
	text-align: center;
	position: relative;

	transition: all 0.3s ease;
	cursor: pointer;

	i:before {
		color: #A11C43;
	}

	:hover {
		${Visible} {
			opacity: 0;
		}

		${Hidden} {
			opacity: 1;
		}
	}
`;

const FounderContainer = styled.section`
	padding: 50px 0;
	background: white;
`;

const IconText = styled.p`

`;

const Founder = styled.div`

	h3 {
		font-family: ${props => props.theme.fontRobotoCondensed};
	}

	h3 {
		font-size: 30px;
	}
	
	img {
		margin-top: 20px;
	}

	${IconText} {
		margin-top: 10px;
		color: #333C4E;
		font-size: 14px;
		font-family: ${props => props.theme.fontRoboto};

		span {
			display: block;
			margin:0 15px 10px 0;
		}

		@media (min-width:400px) {
			span {
				display: inline;
			}
		}

		i {
			margin-right: 5px;
			color: #4c4c4c;
		}

		i:before {
			color: #4c4c4c;
		}

		&{
			color: #333C4E;
		}
	}
`;

export interface ParentProps {
	userInfo: UserInfo;
	project: any;
	id: string;
	isModalOpen: boolean;
	modalData: any;
	checkUserDid: () => boolean;
	createAgent: (agentData: any) => void;
	toggleModal: (data?: any, modalStatus?: boolean) => void;
	hasCapability: (Role: [AgentRoles]) => boolean;
	imageLink: string;
}

export const ProjectOverview: React.SFC<ParentProps> = (props) => {
	
	const submitAgent = (role: string, agentData: any) => {

		let agentCreateJson: any = {...agentData, role: role};
		props.createAgent(agentCreateJson);
		props.toggleModal({});
	};

	const renderModal = (data: any) => {
		let userName = '';
		if (props.userInfo) {
			userName = props.userInfo.name.valueOf();
		}
		return (
			<ProjectNewAgent 
				submitAgent={submitAgent}
				role={data.selectedRole}
				name={userName}
			/>
		);
	};

	const renderLogo = () => {
		if (props.project.founder.logoLink !== '') {
			return <img src={props.project.founder.logoLink} alt=""/>;
		} else {
			return <span />;
		}
	};

	const titleMap = {
		[AgentRoles.investors]: 'Become an Investor',
		[AgentRoles.evaluators]: 'Become an Evaluator',
		[AgentRoles.serviceProviders]: 'Become a Service Agent',
	};

	const renderSubtitle = (role: string) => {
		return titleMap[role];
	};

	const onProjectImageNotFound = (evt) => {
		evt.target.src = placeholder;
	};

	const shareToTwitter = () => {
		var url = location.href;
		var text = 'It’s up to all of us to start making an impact for a positive future for humanity. Check out this venture that aims to achieve the global SDGs. If you think it’s a worthy cause, then like or share this post to show your support.';
		window.open('http://twitter.com/share?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(text), '', 'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
	};
	
	// @ts-ignore
	window.fbAsyncInit = function() {
		// @ts-ignore
		window.FB.init({
		appId            : '245800599615583',
		autoLogAppEvents : true,
		xfbml            : true,
		version          : 'v3.1'
		});
	};
	
	(function(d: any, s: any, id: any) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {return; }
		js = d.createElement(s); js.id = id;
		js.src = 'https://connect.facebook.net/en_US/sdk.js';
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));

	const shareToFacebook = () => {
		// @ts-ignore
		FB.ui({
			method: 'share',
			href: location.href, 
			picture: props.imageLink,
			name: props.project.title,
			description: props.project.shortDescription
		},    (response) => {
			console.log('res is: ', response);
		});
	};

	return (
		<div>
			<Helmet
				title={props.project.title}
				meta={[
					{ 'name': 'description', 'content': props.project.shortDescription },
					{ property: 'og:type', content: 'article' },
					{ property: 'og:title', content: 'ixo provides a trusted global information network that is owned by everyone. Enabling anyone to become the creators of their own impact projects and a stake-holder in the projects they believe in.' },
					{ property: 'og:image', content: props.imageLink },
					{ property: 'og:url', content: location.href }
				]}
			/>
			<ModalWrapper
				isModalOpen={props.isModalOpen}
				handleToggleModal={() => props.toggleModal({})}
				header={{
					title: props.project.title,
					subtitle: renderSubtitle(props.modalData.selectedRole),
					icon: 'icon-modal'
				}}
			>
				{renderModal(props.modalData)}
			</ModalWrapper>
			<OverviewContainer className="container-fluid">
				<div className="container">
					<div className="row">
						<div className="col-md-8">
							<ProjectImage src={props.imageLink} onError={onProjectImageNotFound}/>
							<Text>
								<ReactMd markdown={props.project.longDescription} />
							</Text>
							<Social>
								{props.project.socialMedia.instagramLink && <a href={props.project.socialMedia.instagramLink} target="_blank"><i className="icon-instagram" /></a>}
								{props.project.socialMedia.twitterLink && <a href={props.project.socialMedia.twitterLink} target="_blank"><i className="icon-twitter"/></a>}
								{props.project.socialMedia.facebookLink && <a href={props.project.socialMedia.facebookLink} target="_blank"><i className="icon-facebook"/></a>}
								{props.project.socialMedia.webLink && <a href={props.project.socialMedia.webLink} target="_blank"><i className="icon-world"/></a>}
							</Social>
						</div>
						<div className="col-md-4">
							<Sidebar>
								<SidebarTop>
									<p><strong>Created:</strong> {props.project.createdOn.split('T')[0]}</p>
									<p><strong>By:</strong> {props.project.ownerName}</p>
									{props.project.projectLocation && 
										<p><i className="icon-location" />{getCountryName(props.project.projectLocation)}</p>
									}
								</SidebarTop>
								<BarContainer />
								<hr />
								<Claims><strong>{props.project.claimStats.currentSuccessful}</strong> successful {props.project.impactAction}</Claims>
								<LocalButton>
									<Visible>
										<i className="icon-share" />SHARE THIS PROJECT
									</Visible>
									<Hidden>
										<i onClick={shareToTwitter} className="icon-twitter" />
										<i onClick={shareToFacebook} className="icon-facebook" />
									</Hidden>
								</LocalButton>
							</Sidebar>
							<QRComponent url={location.href} />
						</div>
					</div>
				</div>
			</OverviewContainer>
			<FounderContainer className="container-fluid">
				<div className="container">
					<Founder className="row">
						<div className="col-md-8">
							<h3>{props.project.founder.name}</h3>
							<Text>{props.project.founder.shortDescription}</Text>
							<IconText>
								{props.project.founder.countryOfOrigin && <span><i className="icon-location"/>{getCountryName(props.project.founder.countryOfOrigin)}</span>}
								{props.project.founder.websiteURL && <span><i className="icon-url"/><a href={props.project.founder.websiteURL} target="_blank">{props.project.founder.websiteURL}</a></span>}
							</IconText>
						</div>
						<div className="col-md-4">
							{renderLogo()}
						</div>
					</Founder>
				</div>
			</FounderContainer>
		</div>

	);
};