// require('dotenv').config();
import * as React from 'react';
import { ImageLoader, imageQuality, styleTypes } from '../common/ImageLoader';
import { PublicSiteStoreState } from '../../redux/public_site_reducer';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { countryLatLng, deviceWidth } from '../../lib/commonData';
import { Button, ButtonTypes } from '../common/Buttons';
import { warningToast, successToast, errorToast } from '../helpers/Toast';
import { ErrorTypes } from '../../types/models';
import { Redirect } from 'react-router-dom';
import { ModalWrapper } from '../common/ModalWrapper';
import Select from 'react-select';
import { ProjectsFilter } from '../projects/ProjectsFilter';

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

	span {
		font-weight: 300;
	}
`;

const Text = styled.input`
	margin: 0 0 20px;
	padding: 15px;
	display: block;
	width: 100%;
	border-radius: 3px;
	border: 1px solid ${props => props.theme.lightGrey};
	color: #333C4E;

	::placeholder {
		color: ${props => props.theme.lightGrey};
		font-weight: 300;
	}
	
`;

const TextArea = styled.textarea`
	margin: 0 0 20px;
	padding: 15px;
	display: block;
	width: 100%;
	border-radius: 3px;
	border: 1px solid ${props => props.theme.lightGrey};
	color: #333C4E;

	::placeholder {
		color: ${props => props.theme.lightGrey};
		font-weight: 300;
	}

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

	h1 {
		font-size: 45px;
		font-family: ${props => props.theme.fontRobotoCondensed};
		margin-top: 100px;
	}

	p {
		max-width: 580px;
	}
`;

const SDGForm = styled.div`
	margin: 50px 0;
`;

const FormSection = styled.div`
	display: flex;
	align-items: center;
	flex-direction: column;
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
	padding: 40px 50px 0;
	width: 640px;
	max-width: 100%;
	box-shadow: 0 8px 16px -2px rgba(0,0,0,0.03);

	h3 {
		font-size: 23px;
		font-family: ${props => props.theme.fontRobotoCondensed};
		margin-bottom: 20px;

		span {
			color: #A11C43;
		}
	}

	p {

	}
`;

const LogoThumb = styled.img`
	height: 60px;
`;

const ImageWrapper = styled.section`
	:hover {
		border: 1px solid #333C4E;
	}

	margin-bottom: 20px;
	border-radius: 3px;
	border: 1px solid white;

	transition: 0.3s all ease;

	p {
		margin-bottom: 0;
	}
`;

const Submit = styled.button`
	background: #4A9F46;
	color: white;
	text-tranform: uppercase;
	font-weight: 400;
	font-family: ${props => props.theme.fontRobotoCondensed};
	width: 100%;
	border: 0;
	height: 40px;
	margin-bottom: 20px;
	cursor: pointer; 
`;

const Back = styled.button`
	width: 100%;
	border: 1px solid #A11C43;
	background: white;
	color: #A11C43;
	height: 40px;
	font-family: ${props => props.theme.fontRobotoCondensed};
	cursor: pointer;
	margin-bottom: 20px;

	:focus {
		outline: none;
	}

	:hover {
		background: #a11c4354;
	}
`;

const Next = Back.extend`
	color: white;
	background: #A11C43;
`;

const ButtonContainer = styled.div`
	background: white;
	margin-bottom: 50px;
	padding: 20px 50px 30px;
	width: 640px;
	max-width: 100%;
	
	div {
		width: 100%;
	}

	@media (min-width: ${deviceWidth.mobile}px) {
		justify-content: space-between;
		display: flex;

		div {
			width: 45%;
		}
	}
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
	currentStep: number;
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
	youtube: string;
	
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

export class VentureCreate extends React.Component<StateProps, State> {

	state = {
		currentStep: 1,
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
		youtube: ''
	};

	busyLedgering = false;

	componenDidMount() {
		console.log(this.state);
	}
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
		let newProject = this.state.project;
		newProject.longDescription = this.createMarkup();
		console.log('2', newProject);
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
						// PDS URL NEEDS TO BE THAT OF THE FEATURED PROJECT
						this.props.ixo.claim.createClaim(JSON.parse(projectObj), signature, this.state.project.serviceEndpoint).then((res: any) => {
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
		if (prop === 'countryOfOrigin') {
			newProject.founder[prop] = event.value;
		} else if (prop === 'projectLocation') {
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
		let youtube = this.state.youtube.trim();
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
			if (youtube.length > 0 ) {
				link = link + '<a href="' + youtube + '" target="_blank"><img src="/socialmedia/youtube.svg" /></a>';
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

		let descr = long + '\n';
		if ( UNSDGs.length > 0 ) {
			descr = descr + '\n### How does your project solve for the UN SDGs?\n'
				+ UNSDGs + '\n';
		}
		if ( goals.length > 0 ) {
			descr = descr + '\n### Goal for 2030 and beyond\n'
			+ goals + '\n';
		}
		descr = descr
			// + this.projectMediaLink()
			+ this.socialMediaLinks();
		return descr;
	}

	fixTextForMarkup = (txt) => {
		// ensure double line feeds and remove trailing linefeed
		let newTxt = txt.replace(/\n/g, '\n\n');
		newTxt = newTxt.trim();
		return txt;
	}

	handleSDGs = ( hasSelected?: boolean, filterIndexes?: number[] ) => {
		
		if (hasSelected === true) {
			let newProject = this.state.project;
			newProject.sdgs = filterIndexes.map((val, k) => {
				return `${val}`;
			});
			// @ts-ignore
			if (!newProject.sdgs.includes('18')) {
				newProject.sdgs.push('18');
			}
			this.setState({project: newProject, projectJson: JSON.stringify(newProject)});
		}
	}

	changeStep = (step: number) => {
		window.scrollTo(0, 100); 
		const currStep = this.state.currentStep + step;
		this.setState({ currentStep : currStep});
	}

	render() {

		// Custom styling for select boxes
		const colourStyles = {
			control: styles => ({ ...styles, backgroundColor: 'white', height: '50px', borderRadius: '3px', borderColor: '#B6B6B6' }),
			placeholder: styles => ({ ...styles, color: '#B6B6B6' }),
			singleValue: styles => ({ ...styles, color: '#333C4E', fontWeight: '400' })
		};

		// List of countries for select boxes
		const countries = countryLatLng.map( (v) => {
			return (
				{ label: v.country, value: v.alpha2}
			);
		});
		countries.push({label: 'Global', value: 'Global'});

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
							<p>Launch your venture for all to see the positive impact you’re making on the world. Remember that your venture should have the intention of achieving one of the 18 Sustainable Development Goals. </p>
						</div>
					</Intro>
				</Container>
				<SDGForm>
					<FormSection>
							<InnerSection style={{ display: this.state.currentStep === 1 ? 'block' : 'none'}}>
								<h3>Step {this.state.currentStep}<span>/4</span>: Your venture</h3>
								<Text className="hidden" placeholder="Project datastore url example: http://104.155.142.57:5000/ or http://beta.elysian.ixo.world:5000/" value={this.state.project.serviceEndpoint} onChange={this.handlePdsUrlChange} />
								<Text className="hidden" placeholder="Impact Action" value={this.state.project.impactAction} onChange={(ev) => this.handlePropertyChanged('impactAction', ev)}/>

								<Label>Your Name</Label>
								<Text placeholder="John Smith" value={this.state.project.ownerName} onChange={this.handleOwnerNameChanged} />

								<Label>Your Email</Label>
								<Text placeholder="john@gmail.com" value={this.state.project.ownerEmail} onChange={this.handleOwnerEmailChanged} />
								
								<Label>What is the name of your venture?</Label>
								<Text placeholder="E.g Raise your voice against discrimination" value={this.state.project.title} onChange={(ev) => this.handlePropertyChanged('title', ev)}/>
								
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
								<Label>A picture is worth a thousand words. Upload a picture that represents your venture <span>(recommended size 1080x720)</span></Label>
								<ImageWrapper><ImageLoader quality={imageQuality.medium} styleType={styleTypes.sdgFutures} placeholder="Add file" imageWidth={960} aspect={16 / 9} imageCallback={this.handleImage}/></ImageWrapper>
							</InnerSection>
							<InnerSection  style={{ display: this.state.currentStep === 2 ? 'block' : 'none'}}>
								<h3>Step {this.state.currentStep}<span>/4</span>: Your venture (continued)</h3>
								<Label>Describe your venture in full detail</Label>
								<TextArea placeholder="Venture detail" value={this.state.lngDescr} onChange={(ev) => this.setState({lngDescr: ev.target.value})}/>
								
								<Label>Facebook</Label>
								<Text placeholder="https://www.facebook.com/venture" value={this.state.facebook} onChange={(ev) => this.setState({facebook: ev.target.value})}/>
								
								<Label>Twitter</Label>
								<Text placeholder="https://twitter.com/venture" value={this.state.twitter} onChange={(ev) => this.setState({twitter: ev.target.value})}/>
								
								<Label>Instagram</Label>
								<Text placeholder="https://www.instagram.com/venture" value={this.state.instagram} onChange={(ev) => this.setState({instagram: ev.target.value})}/>
								
								<Label>Website</Label>
								<Text placeholder="https://www.venture.com" value={this.state.websiteLink} onChange={(ev) => this.setState({websiteLink: ev.target.value})}/>
								
								<Label>Github</Label>
								<Text placeholder="https://www.github.com/venture" value={this.state.github} onChange={(ev) => this.setState({github: ev.target.value})}/>
								
								<Label>Youtube</Label>
								<Text placeholder="https://www.youtube.com/venture" value={this.state.youtube} onChange={(ev) => this.setState({youtube: ev.target.value})}/>
							</InnerSection>
							<InnerSection  style={{ display: this.state.currentStep === 3 ? 'block' : 'none'}}>
								<h3>Step {this.state.currentStep}<span>/4</span>: SDGs</h3>
								<Label>Select one or more SDGs that apply to your venture</Label>
								<ProjectsFilter handleFilter={(filter, idxs) => this.handleSDGs(filter, idxs)} exclude18th={true}/> <br/>
								
								<Label>What does your venture solve for the sustainable development?</Label>
								<TextArea placeholder="E.g Eliminate food wastage" value={this.state.UNSDGs} onChange={(ev) => this.setState({UNSDGs: ev.target.value})}/>
								
								<Label>Goal for 2030 and beyond</Label>
								<TextArea placeholder="E.g Building better infrastructure for food distribution in the future" value={this.state.goals} onChange={(ev) => this.setState({goals: ev.target.value})}/>
							</InnerSection>
							<InnerSection  style={{ display: this.state.currentStep === 4 ? 'block' : 'none'}}>
								<h3>Step {this.state.currentStep}<span>/4</span>: Founding Organization</h3>
								<Label>Name of founding organisation</Label>
								<Text placeholder="E.g. Future of Humanity" value={this.state.project.founder.name} onChange={(ev) => this.handleFounderPropertyChanged('name', ev)}/>
								
								<Label>Contact email</Label>
								<Text placeholder="E.g info@futureofhumanity.com" value={this.state.project.founder.email} onChange={(ev) => this.handleFounderPropertyChanged('email', ev)}/>
								<Label>Country of origin</Label>
								<Select
									options={countries}
									onChange={(ev) => this.handlePropertyChanged('countryOfOrigin', ev)}
									className="selector"
									placeholder="E.g Switzerland"
									styles={colourStyles}
								/>

								<Label>Short description of founding organisation</Label>
								<Text placeholder="E.g Future of Humanity is a decentralized and distributed communities and technology stack for the United Nations SDG’s." value={this.state.project.founder.shortDescription} onChange={(ev) => this.handleFounderPropertyChanged('shortDescription', ev)}/>

								<Label>Website URL of Organisation</Label>
								<Text placeholder="E.g https://www.futureofhumanity.com" value={this.state.project.founder.websiteURL} onChange={(ev) => this.handleFounderPropertyChanged('websiteURL', ev)}/>
								
								<Label>Add link to the logo of the founding Organisation</Label>
								<Text placeholder="Founder logoLink" value={this.state.project.founder.logoLink} onChange={(ev) => this.handleFounderPropertyChanged('logoLink', ev)}/>
								{this.state.project.founder.logoLink.length > 0 && <LogoThumb src={this.state.project.founder.logoLink} alt=" invalid image URL" />}
							</InnerSection>
							<ButtonContainer>
								<div>
									{this.state.currentStep > 1 && <Back onClick={() => this.changeStep(-1)}>BACK</Back>}
								</div>
								<div>
									{this.state.currentStep < 4 && <Next onClick={() => this.changeStep(1)}>NEXT</Next>}
									{this.state.currentStep === 4 && <Submit onClick={this.handleCreateProject}>SUBMIT VENTURE</Submit>}
								</div>
							</ButtonContainer>
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

export const VentureCreateConnected = (connect(
	mapStateToProps
)(VentureCreate));