import * as React from 'react';
import styled from 'styled-components';
import { WidgetWrapper, gridSizes } from '../common/WidgetWrapper';
import { LayoutWrapper } from '../common/LayoutWrapper';
import BarChartProjects, { BarColors } from '../widgets/BarChartProjects';
import { WorldMap, LatLng } from '../widgets/WorldMap';
import { isoCountriesLatLng } from '../../lib/commonData';
import { SDGArray } from '../../lib/commonData';
import { SDGsCount } from '../../utils/formatters';

const Container = styled.div`
	background: linear-gradient(0deg, #F1F0F0 0%, #D6D6D6 100%);
	color: white;
	flex: 1 1 auto;
	display: flex;
`;

const ProjectCount = styled.h1`
	color: #A11C43;
`;

const SDGsContainer = styled.div`
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	max-width: 100%;
	margin-top: 10px;
	margin-bottom: 10px;
`;

const SDG = styled.div`
	width: 60px;
	box-shadow: 0 3px 11px 0 rgba(0,0,0,0.31);
	margin: 0 7.5px 15px;
	position: relative;
	cursor: pointer;

	img {
		width: 100%;
		height: 60px;
		transition: opacity 0.3s ease;
	} 
`;

const SDGMetric = styled.div`
	display: flex;
	align-items: center;
	width: 60px;
	height: 30px;
	font-weight: 400;
	color: #282828;
	justify-content: center;
	text-decoration: bold;
	background-color: white;
	box-shadow: 0 3px 11px 0 rgba(0,0,0,0.31);
`;

export interface ParentProps {
	projects: any[];
	claims: any[];
	claimsTotalRequired: number;
	agents: any;
}

export const ProjectsDashboard: React.SFC<ParentProps> = ({projects, claims, claimsTotalRequired, agents}) => {

	const getProjectsLatLng = () => {
		let markers = [];
		for (var i = 0; i < projects.length; ++i) {
			let proj = projects[i].data;
			let latLng = isoCountriesLatLng[proj.projectLocation];
			if (latLng) {
				markers.push(new LatLng(latLng.lat, latLng.lng));
			}
		}
		return markers;
	};

	const formatProjectCount = (count: number) => {
		var n = count;
		return n.toLocaleString();
	};

	const projCnt = SDGsCount(projects);

	return (
		<Container>
		<LayoutWrapper>
			<div className="row">
				<div className="col-md-12">
					<SDGsContainer>
						{SDGArray.map((sdg, idx) => {
							return (
								<SDG key={idx} style={{background: sdg.color}}>
									<img src={`./sdgs/${idx + 1}.png`}/>
									<SDGMetric>{projCnt[idx]}</SDGMetric>
								</SDG>
							);
						})}
						<SDG key={18} style={{background: 'white'}}>
							<img src={`./sdgs/18.png`}/>
							<SDGMetric>{projects.length}</SDGMetric>
						</SDG> 
					</SDGsContainer>	
				</div>
			</div>
			<div className="row">
				<div className="col-md-12">
					<WidgetWrapper title="Ventures" path={``}>
						<ProjectCount>
							{formatProjectCount(projects.length)}
						</ProjectCount>
						<BarChartProjects 
							barData={[
								{data: projects, color: BarColors.yellow, label: 'Ventures Submitted'},
							]}
						/>
					</WidgetWrapper>
				</div>
			</div>
			<div className="row">
				<div className="col-md-12">
					<WidgetWrapper title="Venture location activity" path={``} gridHeight={gridSizes.standard}>
						<WorldMap markers={getProjectsLatLng()}/>
					</WidgetWrapper>
				</div>
			</div>
		</LayoutWrapper>
		</Container>
	);
};