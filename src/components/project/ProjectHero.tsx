import * as React from 'react';
import styled from 'styled-components';
import { SDGArray, deviceWidth } from '../../lib/commonData';
import { getCountryName, getIxoWorldRoute } from '../../utils/formatters';
import { AgentRoles } from '../../types/models';

const SingleSDG = styled.a`
	&&& {
		color: ${props => props.theme.fontBlue};
	}
	font-family: ${props => props.theme.fontRobotoCondensed};
	font-weight: 300;
	font-size: 14px;
	margin:0 10px 10px 0;
	display:inline-flex;
	align-items: center;
	text-decoration: none;
	cursor: pointer;

	i {
		font-size: 22px;
		margin-right: 8px;
	}

	i:before {
		width: 50px;
		display: inline-block;
	}

	@media (min-width: ${deviceWidth.tablet}px){
		i:before {
			width: auto;
		}		
	}

	&&&:hover, :hover i:before {
		color: ${props => props.theme.fontLightBlue};
	}
`;

const HeroInner = styled.div`
	
	padding-top: 80px;
	padding-bottom: 130px;
	position:relative;
	height:100%;

	@media (min-width: ${deviceWidth.desktop + 1}px){
		padding-top: 150px;
	}	
`;

const HeroContainer = styled.div`
	background-size: cover;
	margin:0;
	position: relative;	

	.detailed {
		padding-bottom: 50px;
	}
`;

const ColLeft = styled.div`

`;

const ColRight = styled.div`
	color: white;
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
		color: white;
	}
`;

const Title = styled.h1`
	color: white;
	font-size: 36px;
	line-height: 1;
	margin-bottom:10px;
	font-family: ${props => props.theme.fontRobotoCondensed};

	@media (min-width: 600px) {
		font-size: 45px;
	}
`;

const SubTextContainer = styled.div`
	margin-bottom: 20px;

	@media (min-width: ${deviceWidth.desktop}px) {
		margin-bottom: 0;
	}
`;

export interface Props {
	project: any;
	match: any;
	isDetail: boolean;
	isClaim?: boolean;
	hasCapability: (role: [AgentRoles]) => boolean;
}

export const ProjectHero: React.SFC<Props> = ({project, match, isDetail, hasCapability, isClaim}) => {

	return (
		<HeroContainer className="container-fluid">
				<HeroInner className={`container ${isDetail && `detailed`}`}>
					<div className="row">
						<ColLeft className="col-lg-8 col-sm-12">
							<Title>{project.title}</Title>
							<SubTextContainer>
								{project.sdgs.map((SDG, index) => {
									const goal = Math.floor(SDG);
									return (
										<SingleSDG href={getIxoWorldRoute('/about')} key={index}>
											<i className={`icon-sdg-${SDGArray[goal - 1].ico}`}/>
											{goal}. {SDGArray[goal - 1].title}
									</SingleSDG>
									);
								})}
							</SubTextContainer>						</ColLeft>
						<ColRight className="col-lg-4 col-sm-12">
							<p><strong>Created:</strong> {project.createdOn.split('T')[0]}</p>
							<p><strong>By:</strong> {project.ownerName}</p>
							<p>
								<i className="icon-location" />
								{getCountryName(project.projectLocation)}
							</p>
						</ColRight>
					</div>
				</HeroInner>
		</HeroContainer>
	);
};