import * as React from 'react';
import { Fragment } from 'react';

import styled from 'styled-components';
import { ProjectCard } from './ProjectCard';
import { ProjectsHero } from './ProjectsHero';
import { ProjectsFilter } from './ProjectsFilter';
import { Spinner } from '../common/Spinner';
import { connect } from 'react-redux';

import { PublicSiteStoreState } from '../../redux/public_site_reducer';
import * as Toast from '../helpers/Toast';
import { contentType, UserInfo } from '../../types/models';
import { ProjectsDashboard } from './ProjectsDashboard';
import { floorAndRemoveDuplicateSDGs } from '../../utils/formatters';
import * as tracking from '../../utils/socialTracker';

const Container = styled.div`

	display: flex;
	flex-direction: column;
	flex: 1 1 auto;
	
	.example-enter {
		opacity: 0.01;
	}
	
	.example-enter.example-enter-active {
		opacity: 1;
		transition: opacity 1000ms ease-in;
	}
	
	.example-leave {
		opacity: 1;
	}
	
	.example-leave.example-leave-active {
		opacity: 0.01;
		transition: opacity 800ms ease-in;
	}
`;

const ProjectsContainer = styled.div`
	overflow-y: scroll;
	flex: 1 1 auto;

	& > .row {
		margin-top: 30px;
		justify-content: center;
	}

	> .container {
		padding: 76px 0 50px;
	}
`;

const ErrorContainer = styled.div`
	display: flex;
	flex: 1;
	justify-content: center;
	color: #282828;
	align-items: center;
	height:100%:
`;

export interface ParentProps {
	ixo?: any;
	location?: any;
	contentType: contentType;
	userInfo?: UserInfo;
}

export interface State {
	projectList: any[];
	loaded: boolean;
	claims: any;
	claimsTotalRequired: number;
	agents: any;
	filteredProjects: any[];
	showOnlyFilterProjects: boolean;
}

export interface StateProps {
	ixo?: any;
}

export interface Props extends ParentProps, StateProps {}

export class Projects extends React.Component<Props, State> {
	state = {
		projectList: null,
		loaded: false,
		claims: null,
		claimsTotalRequired: 0,
		agents: null,
		filteredProjects: [],
		showOnlyFilterProjects: false
	};

	loadingProjects = false;

	componentDidMount() {
		this.refreshAllProjects();
	}

	handleFilter = ( showOnlyFilterProjects?: boolean, filterIndexes?: number[] ) => {
		
		let filteredProjects = [];
		if (showOnlyFilterProjects === true) {
			let projects = [...this.state.projectList];
			projects = floorAndRemoveDuplicateSDGs(projects); 
	
			for (let j = 0; j < projects.length; j++) {
				for (let filterI of filterIndexes) {
					if (projects[j].data.sdgs.includes(filterI)) {
						filteredProjects.push(projects[j]);
						break;
					}
				}
			}
		}
		this.setState({showOnlyFilterProjects: showOnlyFilterProjects, filteredProjects: filteredProjects });
	}

	getMyProjects(userInfo: UserInfo, projList: any) {
		if (userInfo != null) {
			let did = userInfo.didDoc.did;
			let myProjects = projList.filter((proj) => {
				return (proj.data.createdBy === did || proj.data.agents.some((agent) => agent.did === did));
			});
			return myProjects;
		} else {
			return [];
		}
	}

	refreshAllProjects() {
		if (this.props.ixo && !this.loadingProjects) {
			this.loadingProjects = true;
			this.props.ixo.project
				.listProjects()
				.then((response: any) => {
					let projectList = response;
					projectList.sort((a, b) => {return new Date(b.data.createdOn).getTime() - new Date(a.data.createdOn).getTime(); } );

					let claimsArr = new Array();
					let reqClaims: number = 0;
					let agents = {
						serviceProviders: 0,
						evaluators: 0
					};

					// check and hide if any projects should be hidden
					if (process.env.REACT_APP_HIDDEN_PROJECTS.length > 0) {
						projectList = this.handleHideProjects(projectList);
					}

					// check and reorder if any projects should be pinned to top
					if (process.env.REACT_APP_PINNED_PROJECTS.length > 0) {
						projectList = this.handlePinProjects(projectList);
					}

					// check and reorder if any projects is featured to be the first
					if (process.env.REACT_APP_FEATURED_PROJECT.length > 0) {
						projectList = this.handleFeaturedProject(projectList);
					}
					
					for (let project of projectList) {

						agents.serviceProviders += project.data.agentStats.serviceProviders;
						agents.evaluators += project.data.agentStats.evaluators;

						// count and sum required claims
						reqClaims += project.data.requiredClaims;
						for (let claim of project.data.claims) {
							claimsArr.push(claim);
						}
					}

					this.setState({ 
						projectList: projectList,
						claims: claimsArr,
						claimsTotalRequired: reqClaims,
						agents: Object.assign({}, agents),
						// filteredProjects: this.getMyProjects(this.props.userInfo, projectList)
					});
					this.loadingProjects = false;
				})
				.catch((result: Error) => {
					Toast.errorToast('Unable to connect to IXO Explorer');
					this.loadingProjects = false;
				});
		}
	}

	componentWillUpdate() {
		if (this.state.projectList === null) {
			this.refreshAllProjects();
		}
	}

	componentWillReceiveProps(nextProps: any) {
		if (this.props.contentType) {
			if (nextProps.location && nextProps.location.key !== this.props.location.key) {
				// the route was clicked but not changed, so lets refresh the projects
				this.refreshAllProjects();
			}
		}
		if (this.state.projectList !== null && this.props.userInfo !== nextProps.userInfo) {
			this.setState({filteredProjects: this.getMyProjects(nextProps.userInfo, this.state.projectList)});
		}
	}

	handlePinProjects = (projects: any[]) => {
		if (process.env.REACT_APP_PINNED_PROJECTS.length === 0) {
			return projects;
		} else {
			const projectsToPin = process.env.REACT_APP_PINNED_PROJECTS.split(',');
			const pinnedProjects = [];
			const unpinnedProjects = [];
			for (let project of projects) {
				// @ts-ignore)
				if (projectsToPin.includes(project.projectDid)) {
					pinnedProjects.push(project);
				} else {
					unpinnedProjects.push(project);
				}
			}
			return pinnedProjects.concat(unpinnedProjects);
		}
	}

	handleFeaturedProject = (projects: any[]) => {
		if (process.env.REACT_APP_FEATURED_PROJECT.length === 0) {
			return projects;
		} else {
			const projectToFeature = process.env.REACT_APP_FEATURED_PROJECT;
			let featuredProject = null;
			const otherProjects = [];
			for (let project of projects) {
				if (projectToFeature === project.projectDid) {
					featuredProject = project;
				} else {
					otherProjects.push(project);
				}
			}
			otherProjects.unshift(featuredProject);
			return otherProjects;
		}
	}

	handleHideProjects = (projects: any[]) => {
		if (process.env.REACT_APP_HIDDEN_PROJECTS.length === 0) {
			return projects;
		} else {
			const hiddenProjects = process.env.REACT_APP_HIDDEN_PROJECTS.split(',');
			return projects.filter((project => {
				// @ts-ignore
				return (!hiddenProjects.includes(project.projectDid));
			}));
		}
	}

	renderProjects = () => {
		if (this.state.projectList.length > 0) {	
			let projects = (this.state.showOnlyFilterProjects ? this.state.filteredProjects : this.state.projectList);	
			return (
				<ProjectsContainer className="container-fluid">
					<div className="container">
						<div className="row row-eq-height">
							{projects.map((project, index) => {
								return (
									<ProjectCard
										ixo={this.props.ixo}
										project={project.data}
										did={project.projectDid}
										key={index}
									/>
								);
							})}
						</div>
					</div>
				</ProjectsContainer>
			);
		} else {
			return (
				<ErrorContainer>
					<p>No projects were found</p>
				</ErrorContainer>
			);
		}
	}

	handleRenderProjectList() {
		if (this.state.projectList === null) {
			return <Spinner info="Loading Ventures" />;
		} else {
			if (this.props.contentType === contentType.dashboard) {
				return (
					<ProjectsDashboard 
						projects={this.state.projectList}
						claims={this.state.claims} 
						claimsTotalRequired={this.state.claimsTotalRequired}
						agents={this.state.agents}
					/>
				);
			} else {
				return this.renderProjects();
			}
		}
	}

	renderHero() {
		if (this.props.contentType === contentType.dashboard) {
			return null;
		} else {
			return (
				<Fragment>
					<ProjectsHero ixo={this.props.ixo} />
					<ProjectsFilter handleFilter={(filter, idxs) => this.handleFilter(filter, idxs)}/>
				</Fragment>
			);
		}
	}

	render() {
		tracking.fireTracker('/sdgfutures.ixo.world');
		return (        
			<Container>
				{this.renderHero()}
				
				{this.handleRenderProjectList()}
			</Container>
		);
		}
		
}

function mapStateToProps(state: PublicSiteStoreState) {
	return {
		ixo: state.ixoStore.ixo,
		userInfo: state.loginStore.userInfo,
	};
}

export const ProjectsContainerConnected = connect<{}, {}, ParentProps>(mapStateToProps)(Projects as any);
