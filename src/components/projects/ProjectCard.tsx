import * as React from 'react';
import { SDGArray, deviceWidth } from '../../lib/commonData';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { excerptText } from '../../utils/formatters';

const placeholder = require('../../assets/images/ixo-placeholder-large.jpg');

const Title = styled.h3`
    font-weight: 400;
    font-size: 21px;
    box-sizing: border-box;
    margin: 12px 0;
	color: ${props => props.theme.fontDarkGrey};
    line-height: 1.2;
`;

const Description = styled.div`
	height: 100%;
    width: 100%;
    background: rgba(0,0,0,0.5);
    margin: 0;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    padding: 40px 20px 10px;
	text-align: left;
	transition: opacity 0.5s ease;

	@media (min-width: ${deviceWidth.desktop}px){
		opacity: 0;
	}
`;

const Excerpt = styled.p`
	color: #8B8B8B;
	font-size: 15px;
	font-weight: 100;
`;

const SDGs = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-content: flex-start;
	justify-content: flex-end;
`;

const CardTop = styled.div`
	border-radius:2px 2px 0 0;
	padding: 10px;
	height: 240px;
	box-shadow: 0 8px 16px -2px rgba(0,0,0,0.03);
	background-size: auto 100%;
	background-repeat: no-repeat;
	background-position: center top;

	transition: background-size 0.3s ease;

	position:relative;

	@media (min-width: ${deviceWidth.mobile}px){
		height: 225px;
	}

	:before {
		content: "";
		position: absolute;
		width: 100%;
		height: 33%;
		top: 0;
		left: 0;
		background: linear-gradient(180deg, rgba(0,0,0,0.63) 0%, rgba(0,0,0,0) 100%);
	}

	i {
		position: relative;
		z-index: 1;
	}
	i:before {
		color: white;
		font-size: 20px;
		margin: 10px 5px;
		display: inline-flex;
	}
`;

const Founder = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;

	img {
		filter: grayscale(100%);
		height: 40px;
	}

	p {
		color: #282828;
		font-size: 12px;
		margin-bottom: 0;
		font-weight: 500;
		text-transform: uppercase;
	}
`;

const CardBottom = styled.div`
	border-radius: 0 0 2px 2px;
	padding: 20px 14px 15px;
	background: white;
`;

const CardContainer = styled.div`
	margin-bottom: 34px;
`;

const ProjectLink = styled(Link) `
	display: block;
	box-shadow: 0px 10px 25px 0px rgba(0,0,0,0);
	background: white;
	height:100%;

	transition: box-shadow 0.3s ease;

	:hover {
		box-shadow: 0px 10px 25px 0px rgba(0,0,0,0.15);
		text-decoration:none;
	}

	:hover ${CardTop} {
		background-size: auto 105%;
	}

	:hover ${Description} {
		opacity: 1;
	}

	:hover ${Description} p {
		top: 0;
	}
`;

export interface Props {
	project: any;
	did: string;
	ixo?: any;
}

export interface States {
}

export class ProjectCard extends React.Component<Props, States> {

	state = {
	};
	
	fetchImage = () => {
		if (this.props.project.imageLink && this.props.project.imageLink !== '') {
			this.setState({ imageLink: this.props.project.serviceEndpoint + 'public/' + this.props.project.imageLink});
		}
	}

	getImageLink = () => {
		return this.props.project.serviceEndpoint + 'public/' + this.props.project.imageLink;
	}

	componentDidMount() {
		this.fetchImage();
	}

	render() {
		return (
			<CardContainer className="col-10 offset-1 col-xl-4 col-md-6 col-sm-10 offset-sm-1 offset-md-0">
				<ProjectLink to={{pathname: `/projects/${this.props.did}/overview`, state: { projectPublic: this.props.project, imageLink: this.getImageLink() } }}>
					<CardTop style={{backgroundImage: `url(${this.getImageLink()}),url(${placeholder})`}}>
						<SDGs>
						{this.props.project.sdgs.map((SDG, SDGi) => {
							if (SDG !== 18) {
							return (
								<i key={SDGi} className={`icon-sdg-${SDGArray[Math.floor(SDG) - 1].ico}`} />
								);
							} else {
								return null;
							}
						})}
						</SDGs>
						<Description />
					</CardTop>
					<CardBottom>
						<Title>{excerptText(this.props.project.title, 10)}</Title>
						<Excerpt>{excerptText(this.props.project.shortDescription, 20)}</Excerpt>
						<Founder>
							<p>{this.props.project.founder.name}</p>
							{this.props.project.founder.logoLink && <img src={this.props.project.founder.logoLink} />}
						</Founder>
					</CardBottom>
				</ProjectLink>
			</CardContainer>
		);
	}
}