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
import { ModalWrapper } from '../common/ModalWrapper';
import Select from 'react-select';

const chromeIcon = require('../../assets/images/register/chrome.png');
const mozillaIcon = require('../../assets/images/register/firefox.png');
const keysafeImg = require('../../assets/images/keysafe.svg');

const BrowserIcon = styled.img`
	position: absolute;
    left: 10px;
    top: 2px;
    width: 36px
`;

const KeysafeImg = styled.img`
	width: inherit;
`;

const ModalContainer = styled.div`
	width: 320px;
	margin:0 auto;
	max-width: 100%;
	padding-bottom: 20px;

	p {
		font-weight: 300;
		font-size: 15px;
	}

	a {
		margin:30px 0;
	}
`;

const Label = styled.label`
	color: #333C4E;
	font-weight: 400;
`;

const Text = styled.input`
	margin: 0 0 20px;
	padding: 15px;
	display: block;
	width: 100%;
	border-radius: 3px;
	border: 1px solid ${props => props.theme.lightGrey};
	color: #b00042;

	::placeholder {
		color: ${props => props.theme.lightGrey};
		font-weight: 300;
	}
	
`;

const TextArea = Text.extend`
	vertical-align: top;
	height: 150px;
`;

const SmallTextArea = TextArea.extend`
	height: 50px;
`;

const Container = styled.div`

	color: ${props => props.theme.fontDarkGrey};
	button {
		margin: 0 10px 10px 10px;
	}
`;

const Intro = styled.div`
	margin-top: 50px;

	p {
		width: 600px;
		max-width: 100%;
	}
`;

const SDGForm = styled.div`
	margin-top: 50px;
`;

const FormSection = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;

	.hidden {
		display: none;
	}

	.selector {
		margin-bottom: 20px;
	}
`;

const InnerSection = styled.div`
	background: white;
	padding: 40px 50px;
	width: 640px;
	max-width: 100%;
	box-shadow: 0 8px 16px -2px rgba(0,0,0,0.03);
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
	isModalOpen: boolean;
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

	UNSDGs: string;
	lngDescr: string;
	goals: string;

	github: string;
	twitter: string;
	facebook: string;
	instagram: string;

	websiteLink: string;
	mediaLink: string;

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
		isModalOpen: false,
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

		UNSDGs: '',
		lngDescr: '',
		goals: '',
		github: '',
		twitter: '',
		facebook: '',
		instagram: '',
		websiteLink: '',
		mediaLink: '',
	};

	busyLedgering = false;

	toggleModal = () => {
		this.setState({isModalOpen: !this.state.isModalOpen});
	}

	checkState() {
		// If the user has a keysafe and but the hasKeySafe not set then set state
		if (this.props.keysafe) {
			if (!this.state.hasKeySafe) {
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
				});
			}
		} else {
			this.toggleModal();
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

	renderModal = () => {
		return (
			<ModalContainer> 
				<p>ixo Keysafe is your browser connection to the blockchain. It is a secure identity vault that allows you to <b>submit and manage your ventures</b>.</p>
				<KeysafeImg src={keysafeImg} />
				<Button type={ButtonTypes.dark} href="https://chrome.google.com/webstore/detail/ixo-keysafe/nnlfaleaeoefglohpacnfgoeldfakkjk" target="_blank"><BrowserIcon src={chromeIcon} alt="Chrome"/> DOWNLOAD FOR CHROME</Button>
				<Button type={ButtonTypes.dark} href="https://addons.mozilla.org/en-US/firefox/addon/ixo-keysafe/" target="_blank"><BrowserIcon src={mozillaIcon} alt="Firefox"/> DOWNLOAD FOR FIREFOX</Button>
			</ModalContainer>
		);
	}

	renderModalHeading = () => {
		return {
			title: 'Install the ixo Keysafe',
			subtitle: 'Your secure identity vault.',
			width: '325'
		};
	}
	/****************************************************************************************************/

	handleCreateProject = () => {
		console.log(this.state.project);
		let newProject = this.state.project;
		newProject.longDescription = this.createMarkup();

		if (this.props.keysafe === null) {
		errorToast('Please install IXO Credential Manager first.');
		} else {
			if (this.state.croppedImg) {
				let promises = [];
				promises.push(
					this.props.ixo.project.createPublic(this.state.croppedImg, this.state.project.serviceEndpoint).then((res: any) => {
						successToast('Uploaded image successfully');
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
		// This check is for select boxes (using a plugin that sends value directly), if not a select box it gets the event.target.value
		if (prop === 'projectLocation' || prop === 'countryOfOrigin') {
			newProject[prop] = event.value;
		} else {
			newProject[prop] = event.target.value;
		}
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
		this.setState({project: newProject, projectJson: JSON.stringify(newProject)});
	}

	handleOwnerEmailChanged = (event: any) => {
		let newProject = this.state.project;
		newProject.ownerEmail = event.target.value.trim();
		this.setState({project: newProject, projectJson: JSON.stringify(newProject)});
	}

	handleSDGChanged = (event: any) => {
		let newProject = this.state.project;
		let sdgs = event.target.value;
		sdgs = sdgs.replace(/ /g, '');
		let sdgList = sdgs.split(',');

		newProject.sdgs = sdgList;
		this.setState({project: newProject, projectJson: JSON.stringify(newProject)});
	}

	projectMediaLink = () => {
		let mLink = this.state.mediaLink.trim();
		if (mLink.length > 0) {
			let link = '\n### Project Media\n'
				+ '<a href="' + mLink + '" target="_blank">' + mLink + '</a>\n';
			return link;
		} else {
			return '';
		}
	}

	socialMediaLinks = () => {
		let github = this.state.github.trim();
		let facebook = this.state.facebook.trim();
		let instagram = this.state.instagram.trim();
		let twitter = this.state.twitter.trim();
		let websiteLink = this.state.websiteLink.trim();
		if (github.length > 0 || facebook.length > 0 || instagram.length > 0 || twitter.length > 0 || websiteLink.length > 0) {
			let link = '\n### Social Media\n';
			if (instagram.length > 0 ) {
				link = link + '<a href="' + instagram + '" target="_blank"><img src="/socialmedia/instagram.svg" /></a>&nbsp;&nbsp;&nbsp;';
			}
			if (twitter.length > 0 ) {
				link = link + '<a href="' + twitter + '" target="_blank"><img src="/socialmedia/twitter.svg" /></a>&nbsp;&nbsp;&nbsp;';
			}
			if (facebook.length > 0 ) {
				link = link + '<a href="' + facebook + '" target="_blank"><img src="/socialmedia/facebook.svg" /></a>&nbsp;&nbsp;&nbsp;';
			}
			if (websiteLink.length > 0 ) {
				link = link + '<a href="' + websiteLink + '" target="_blank"><img src="/socialmedia/url.svg" /></a>&nbsp;&nbsp;&nbsp;';
			}
			if (github.length > 0 ) {
				link = link + '<a href="' + github + '" target="_blank"><img src="/socialmedia/github.svg" /></a>';
			}
			return link + '\n';
		} else {
			return '';
		}
	}

	createMarkup = () => {
		// double up line feeds to ensure that it linefeeds in markup
		let long = this.fixTextForMarkup(this.state.lngDescr);
		let UNSDGs = this.fixTextForMarkup(this.state.UNSDGs);
		let goals = this.fixTextForMarkup(this.state.goals);

		let descr = long 
			+ '\n### How does your project solve for the UN SDGs?\n'
			+ UNSDGs
			+ '\n### Goal for 2030 and beyond\n'
			+ goals
			+ this.projectMediaLink()
			+ this.socialMediaLinks();

		return descr;
	}

	fixTextForMarkup = (txt) => {
		// ensure double line feeds and remove trailing linefeed
		let newTxt = txt.replace(/\n/g, '\n\n');
		newTxt = newTxt.trim();
		return txt;
	}

	render() {

		// Custom styling for select boxes
		const colourStyles = {
			control: styles => ({ ...styles, backgroundColor: 'white', height: '50px', borderRadius: '3px', borderColor: '#B6B6B6' }),
			placeholder: styles => ({ ...styles, color: '#B6B6B6' }),
			singleValue: styles => ({ ...styles, color: '#b00042', fontWeight: '400' })
		};

		// List of countries for select boxes
		const countries = countryLatLng.map( (v) => {
			return (
				{ label: v.country, value: v.alpha2}
			);
		});

		if (this.state.shouldRedirect === true) {
			return <Redirect to="/" />;
		}
		return (
			<React.Fragment>
				<ModalWrapper
					isModalOpen={this.state.isModalOpen}
					handleToggleModal={(val) => this.toggleModal()}
					header={this.renderModalHeading()}
				>
					{this.renderModal()}
				</ModalWrapper>
				<Container className="container">
					<Intro className="row">
						<div className="col-md-12">
							<h1>Launch a Venture</h1>
							<p>Launch your venture for all to see the positive impact you’re making on the world. Remember that your venture should have the intention of achieving one of the 18 Sustainable Development Goals.</p>
						</div>
					</Intro>
				</Container>
				<SDGForm>
					<FormSection>
						<InnerSection>
							<Text className="hidden" placeholder="Project datastore url example: http://104.155.142.57:5000/ or http://beta.elysian.ixo.world:5000/" value={this.state.project.serviceEndpoint} onChange={this.handlePdsUrlChange} />
							
							<Label>Your Name</Label>
							<Text placeholder="John Smith" value={this.state.project.ownerName} onChange={this.handleOwnerNameChanged} />

							<Label>Your Email</Label>
							<Text placeholder="john@gmail.com" value={this.state.project.ownerEmail} onChange={this.handleOwnerEmailChanged} />
							
							<Label>What is the name of your venture?</Label>
							<Text placeholder="E.g Togo water project" value={this.state.project.title} onChange={(ev) => this.handlePropertyChanged('title', ev)}/>
							
							<Label>Describe your venture in a short sentence</Label>
							<SmallTextArea placeholder="Project headline" value={this.state.project.shortDescription} onChange={(ev) => this.handlePropertyChanged('shortDescription', ev)}/>
							
							<Label>In which country is your venture located?</Label>
							<Select
								options={countries}
								onChange={(ev) => this.handlePropertyChanged('projectLocation', ev)}
								className="selector"
								placeholder="Eg. South Africa"
								styles={colourStyles}
							/>
							{/* <select value={this.state.project.projectLocation} onChange={(ev) => this.handlePropertyChanged('projectLocation', ev)}>
							{countryLatLng.map( (v) => {
								return (
									<option key={v.alpha2} value={v.alpha2}>{v.country}</option>
									);
								})}
							</select> */}

							<Label>A picture is worth a thousand words. Send us a high quality picture that best describes your projector</Label>
							<ImageLoader quality={imageQuality.medium} placeholder="Choose project image file" imageWidth={960} aspect={16 / 9} imageCallback={this.handleImage}/>
							<TextArea placeholder="Long Description" value={this.state.lngDescr} onChange={(ev) => this.setState({lngDescr: ev.target.value})}/>
							<TextArea placeholder="How does your project solve the UN SDGs?" value={this.state.UNSDGs} onChange={(ev) => this.setState({UNSDGs: ev.target.value})}/>
							<TextArea placeholder="Goal for 2030 and beyond" value={this.state.goals} onChange={(ev) => this.setState({goals: ev.target.value})}/>
							<Text className="hidden" placeholder="Impact Action" value={this.state.project.impactAction} onChange={(ev) => this.handlePropertyChanged('impactAction', ev)}/>
							<Text placeholder="SDG list (comma separated)" value={this.state.project.sdgs} onChange={this.handleSDGChanged}/>
							<Text placeholder="Github" value={this.state.github} onChange={(ev) => this.setState({github: ev.target.value})}/>
							<Text placeholder="Facebook" value={this.state.facebook} onChange={(ev) => this.setState({facebook: ev.target.value})}/>
							<Text placeholder="Twitter" value={this.state.twitter} onChange={(ev) => this.setState({twitter: ev.target.value})}/>
							<Text placeholder="Instagram" value={this.state.instagram} onChange={(ev) => this.setState({instagram: ev.target.value})}/>
							<Text placeholder="MediaLink" value={this.state.mediaLink} onChange={(ev) => this.setState({mediaLink: ev.target.value})}/>
							<Text placeholder="WebsiteLink" value={this.state.websiteLink} onChange={(ev) => this.setState({websiteLink: ev.target.value})}/>
							<Text placeholder="Founder Name" value={this.state.project.founder.name} onChange={(ev) => this.handleFounderPropertyChanged('name', ev)}/>
							<Text placeholder="Founder email" value={this.state.project.founder.email} onChange={(ev) => this.handleFounderPropertyChanged('email', ev)}/>
							<Text placeholder="Founder ShortDescription" value={this.state.project.founder.shortDescription} onChange={(ev) => this.handleFounderPropertyChanged('shortDescription', ev)}/>
							{/* <select value={this.state.project.founder.countryOfOrigin} onChange={(ev) => this.handleFounderPropertyChanged('countryOfOrigin', ev)}>

							</select> */}
							<Text placeholder="Founder websiteURL" value={this.state.project.founder.websiteURL} onChange={(ev) => this.handleFounderPropertyChanged('websiteURL', ev)}/>
							<Text placeholder="Founder logoLink" value={this.state.project.founder.logoLink} onChange={(ev) => this.handleFounderPropertyChanged('logoLink', ev)}/>
							<LogoThumb src={this.state.project.founder.logoLink} alt="Not Set" />
							<br />
							<Button type={ButtonTypes.gradient} onClick={this.handleCreateProject}>SUBMIT VENTURE</Button>
						</InnerSection>
					</FormSection>
				</SDGForm>
			</React.Fragment>
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