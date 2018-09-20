// require('dotenv').config();
import * as React from 'react';
import { ImageLoader, imageQuality } from '../common/ImageLoader';
import { PublicSiteStoreState } from '../../redux/public_site_reducer';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { countryLatLng } from '../../lib/commonData';
import { Button, ButtonTypes } from '../common/Buttons';
import { warningToast, successToast, errorToast } from '../helpers/Toast';
import { ErrorTypes } from '../../types/models';
import { Redirect } from 'react-router-dom';

const Text = styled.input`
	margin: 20px 0;
	display: block;
	width: 100%;
`;

const TextArea = styled.textarea`
	margin: 20px 0;
	display: block;
	width: 100%;
	height: 150px;
`;

const SmallTextArea = TextArea.extend`
	height: 50px;
`;
const BigTextArea = TextArea.extend`
	height: 150px;
`;

const Container = styled.div`
	background: linear-gradient(0deg, #F1F0F0 0%, #D6D6D6 100%);
	
	button {
		margin: 0 10px 10px 10px;
	}
`;

const LogoThumb = styled.img`
	width: 30px;
	height: 30px;
`;

export interface StateProps {
	ixo: any;
	keysafe?: any;
}

export interface State {
	hasKeySafe: boolean;
	hasDid: boolean;
	isDidLedgered: boolean;
	toastShown: boolean;
	didDoc: any;

	croppedImg: any;
	imageKey: string;
	claimSchema: string;
	claimSchemaKey: string;
	claimForm: string;
	claimFormKey: string;
	projectJson: string;
	project: Object;
	shouldRedirect: boolean;
	fetchedImage: string;
	fetchedFile: string;
}	

let defaultProject = {
	title: '',
	ownerName: '',
	ownerEmail: '',
	shortDescription: '',
	longDescription: '',
	impactAction: '',
	projectLocation: '',
	requiredClaims: 0,
	autoApprove: ['SA'],
	sdgs: [],
	templates: {
		claim: {
			schema: '',
			form: ''
		}
	},
	evaluatorPayPerClaim: '0',
	socialMedia: {
		facebookLink: '',
		instagramLink: '',
		twitterLink: '',
		webLink: ''
	},
	serviceEndpoint: process.env.REACT_APP_DEFAULT_PDS,
	imageLink: '',
	founder: {
		name: '',
		email: '',
		countryOfOrigin: '',
		shortDescription: '',
		websiteURL: '',
		logoLink: ''
	}
};

export class ProjectCreate extends React.Component<StateProps, State> {

	state = {
		shouldRedirect: false,
		hasKeySafe: false,
		hasDid: false,
		isDidLedgered: false,
		toastShown: false,
		didDoc: null,

		croppedImg: null,
		imageKey: null,
		claimSchema: '',
		claimSchemaKey: null,
		claimForm: '',
		claimFormKey: null,
		projectJson: JSON.stringify(defaultProject),
		project: defaultProject,
		fetchedImage: null,
		fetchedFile: '',
	};

	busyLedgering = false;

	checkState() {
		// If the user has a keysafe and but the hasKeySafe not set then set state
		if (this.props.keysafe && !this.state.hasKeySafe) {
			this.props.keysafe.getDidDoc((error, response) => {
				if (error) {
					if (this.state.toastShown === false) {
						errorToast('Please log into IXO Keysafe');
						this.setState({ toastShown: true});
					}
				} else {	
					let newDidDoc = {
							did: response.didDoc.did,
							pubKey: response.didDoc.pubKey,
							credentials: []
					};
					this.setState({hasKeySafe: true, hasDid: true, didDoc: newDidDoc });
				}
			});
		}
		// So has a client side didDoc, so lets check if it is ledgered
		if (this.props.ixo && this.state.didDoc && !this.state.isDidLedgered) {
			let ledgerDid = () => this.ledgerDid();
			this.props.ixo.user.getDidDoc(this.state.didDoc.did).then((didResponse: any) => {
				if (didResponse.did) {
					this.setState({isDidLedgered: true, didDoc: didResponse});
				} else {
					// Did not ledgered
					ledgerDid();
				}
			})
			.catch((err) => {
					// Did not ledgered
					ledgerDid();
					
			});
		}
	}

	setBusyLedgeringToFalse() {
		this.busyLedgering = false;
	}

	ledgerDid = () => {
		if (this.state.didDoc && !this.busyLedgering) {
			let payload = {didDoc: this.state.didDoc};
			this.busyLedgering = true;
			this.props.keysafe.requestSigning(JSON.stringify(payload), (error, signature) => {
				if (!error) {
					this.props.ixo.user.registerUserDid(payload, signature).then((response: any) => {
						if (response.code === 0) {
							successToast('Did document was ledgered successfully');
						} else {
							errorToast('Unable to ledger did at this time');
						}
						// Delay the update here to allow Explorer to sync
						setTimeout(() => this.busyLedgering = false, 3000);
					});
				} else {
					this.busyLedgering = false;
				}
			});
		} else {
			if (this.state.toastShown === false) {
				warningToast('Please log into the IXO Keysafe');
				this.setState({ toastShown: true});
			}
		}
	}

	componentDidMount() {
		setTimeout(() => this.checkState(), 2000);
		// this.checkState();
	}

	/****************************************************************************************************/

	handleCreateProject = () => {
		console.log(this.state.project);
		if (this.props.keysafe === null) {
		errorToast('Please install IXO Credential Manager first.');
		} else {
			if (this.state.croppedImg) {
				let promises = [];
				promises.push(
					this.props.ixo.project.createPublic(this.state.croppedImg, this.state.project.serviceEndpoint).then((res: any) => {
						successToast('Uploaded image successfully');
						let newProject = this.state.project;
						newProject.imageLink = res.result;
						this.setState({project: newProject, projectJson: JSON.stringify(newProject)});
						return res.result;
					})
				);
				Promise.all(promises).then((results) => {
					let projectObj: string = this.state.projectJson;
					this.props.keysafe.requestSigning(projectObj, (error: any, signature: any) => {
						
						this.props.ixo.project.createProject(JSON.parse(projectObj), signature, this.state.project.serviceEndpoint).then((res: any) => {
							if (res.error) {
								errorToast(res.error.message, ErrorTypes.message);
							} else {
								successToast('Venture submitted successfully');
								this.setState({ shouldRedirect: true});
							}
						});
					});
				});
			}
		}
	}

	handlePdsUrlChange = (event: any) => {
		let newProject = this.state.project;
		newProject.serviceEndpoint = event.target.value;
		this.setState({project: newProject, projectJson: JSON.stringify(newProject)});
	}

	handleProjectChange = (event: any) => {
		this.setState({project: JSON.parse(event.target.value), projectJson: event.target.value});
	}

	handleImage = (base64Image) => {
		this.setState({croppedImg: base64Image });
	}
	
	uploadImage = (event) => {
		console.log(this.state.croppedImg);
		this.props.ixo.project.createPublic(this.state.croppedImg, this.state.project.serviceEndpoint).then((res: any) => {
			console.log('Uploaded: ', res);
			let newProject = this.state.project;
			newProject.imageLink = res.result;
			this.setState({project: newProject, projectJson: JSON.stringify(newProject)});
		});
	}

	fetchImage = (event) => {
		this.props.ixo.project.fetchPublic(this.state.project.imageLink, this.state.project.serviceEndpoint).then((res: any) => {
			console.log('Fetched: ', res);
			let imageSrc = 'data:' + res.contentType + ';base64,' + res.data;
			this.setState({fetchedImage: imageSrc});
		});
	}

	handleFileSelected = (type, base64File) => {
		if (type === 'schema') {
			this.setState({claimSchema: base64File });
		}
		if (type === 'form') {
			this.setState({claimForm: base64File });
		}
	}
	
	uploadFile = (type) => {
		let fileToUpload: string;
		if (type === 'schema') {
			fileToUpload = this.state.claimSchema;
		}
		if (type === 'form') {
			fileToUpload = this.state.claimForm;
		}

		this.props.ixo.project.createPublic(fileToUpload, this.state.project.serviceEndpoint).then((res: any) => {
			console.log('Uploaded: ', res);
			let newProject = this.state.project;
			if (type === 'schema') {
				newProject.templates.claim.schema = res.result;
			}
			if (type === 'form') {
				newProject.templates.claim.form = res.result;
			}
			this.setState({project: newProject, projectJson: JSON.stringify(newProject)});
		});
	}

	handlePropertyChanged = (prop: string, event: any) => {
		let newProject = this.state.project;
		newProject[prop] = event.target.value;
		this.setState({project: newProject, projectJson: JSON.stringify(newProject)});
	}

	handleFounderPropertyChanged = (prop: string, event: any) => {
		let newProject = this.state.project;
		newProject.founder[prop] = event.target.value;
		this.setState({project: newProject, projectJson: JSON.stringify(newProject)});
	}

	handleRequiredClaimsChanged = (event: any) => {
		let newProject = this.state.project;
		newProject.requiredClaims = parseInt(event.target.value.trim(), 10);
		this.setState({project: newProject, projectJson: JSON.stringify(newProject)});
	}

	handleOwnerNameChanged = (event: any) => {
		let newProject = this.state.project;
		newProject.ownerName = event.target.value;
		newProject.founder.name = event.target.value;
		this.setState({project: newProject, projectJson: JSON.stringify(newProject)});
	}

	handleOwnerEmailChanged = (event: any) => {
		let newProject = this.state.project;
		newProject.ownerEmail = event.target.value.trim();
		newProject.founder.email = event.target.value.trim();
		this.setState({project: newProject, projectJson: JSON.stringify(newProject)});
	}

	handleSDGChanged = (event: any) => {
		let newProject = this.state.project;
		let sdgs = event.target.value;
		// remove all whitespaces
		// @ts-ignore
		sdgs = sdgs.replace(/ /g, '');
		let sdgList = sdgs.split(',');

		newProject.sdgs = sdgList;
		this.setState({project: newProject, projectJson: JSON.stringify(newProject)});
	}

	render() {
		if (this.state.shouldRedirect === true) {
			return <Redirect to="/" />;
		}
		return (
			<div>
				
				<Container className="container-fluid">
					<div className="row">
						<div className="col-md-12">
							<br />
							<Text placeholder="Project datastore url example: http://104.155.142.57:5000/ or http://beta.elysian.ixo.world:5000/" value={this.state.project.serviceEndpoint} onChange={this.handlePdsUrlChange} />
							<ImageLoader quality={imageQuality.medium} placeholder="Choose project image file" imageWidth={960} aspect={16 / 9} imageCallback={this.handleImage}/>
							<Text placeholder="Title" value={this.state.project.title} onChange={(ev) => this.handlePropertyChanged('title', ev)}/>
							<Text placeholder="Owner Name" value={this.state.project.ownerName} onChange={this.handleOwnerNameChanged} />
							<Text placeholder="Owner Email" value={this.state.project.ownerEmail} onChange={this.handleOwnerEmailChanged} />
							<SmallTextArea placeholder="Short Description" value={this.state.project.shortDescription} onChange={(ev) => this.handlePropertyChanged('shortDescription', ev)}/>
							<BigTextArea placeholder="Long Description" value={this.state.project.longDescription} onChange={(ev) => this.handlePropertyChanged('longDescription', ev)}/>
							<select value={this.state.project.projectLocation} onChange={(ev) => this.handlePropertyChanged('projectLocation', ev)}>
							{countryLatLng.map( (v) => {
								return (
									<option key={v.alpha2} value={v.alpha2}>{v.country}</option>
								);
							})}
							</select>
							<Text placeholder="SDG list (comma separated)" value={this.state.project.sdgs} onChange={this.handleSDGChanged}/>
							<Text placeholder="Founder Name" value={this.state.project.founder.name} onChange={(ev) => this.handleFounderPropertyChanged('name', ev)}/>
							<Text placeholder="Founder email" value={this.state.project.founder.email} onChange={(ev) => this.handleFounderPropertyChanged('email', ev)}/>
							<Text placeholder="Founder ShortDescription" value={this.state.project.founder.shortDescription} onChange={(ev) => this.handleFounderPropertyChanged('shortDescription', ev)}/>
							<select value={this.state.project.founder.countryOfOrigin} onChange={(ev) => this.handleFounderPropertyChanged('founder', ev)}>
							{countryLatLng.map( (v) => {
								return (
									<option key={v.alpha2} value={v.alpha2}>{v.country}</option>
								);
							})}
							</select>
							<Text placeholder="Founder websiteURL" value={this.state.project.founder.websiteURL} onChange={(ev) => this.handleFounderPropertyChanged('websiteURL', ev)}/>
							<Text placeholder="Founder logoLink" value={this.state.project.founder.logoLink} onChange={(ev) => this.handleFounderPropertyChanged('logoLink', ev)}/>
							<LogoThumb src={this.state.project.founder.logoLink} alt="Not Set" />
							<br />
							<Button type={ButtonTypes.gradient} onClick={this.handleCreateProject}>SUBMIT VENTURE</Button>
						</div>
					</div>
				</Container>
			</div>
		); 
	}
}

function mapStateToProps(state: PublicSiteStoreState): StateProps {
	return {
		ixo: state.ixoStore.ixo,
		keysafe: state.keysafeStore.keysafe
	};
}

export const ProjectCreateConnected = (connect(
	mapStateToProps
)(ProjectCreate));