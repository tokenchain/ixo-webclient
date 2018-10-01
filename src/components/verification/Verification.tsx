import * as React from 'react';
import styled from 'styled-components';
import { UserInfo } from '../../types/models';

import { connect } from 'react-redux';
import { PublicSiteStoreState } from '../../redux/public_site_reducer';
import { successToast, errorToast, warningToast } from '../helpers/Toast';
import { ModalWrapper } from '../common/ModalWrapper';
import { validateEmail } from '../../utils/formatters';
import { Spinner } from '../common/Spinner';
import { Redirect } from 'react-router-dom';
import Project from 'ixo-module/dist/src/project';

const verificationImg = require('../../assets/images/verification/verification.svg');
const Icon = styled.i`
	font-size: 20px;
	top: 5px;
	left: 0;
	position: absolute;
    margin-right: 15px;
`;

const GreenI = Icon.extend`
	&&{:before {
		color: #4A9F46;
	}}
`;

const GreyI = Icon.extend`
	&&{:before {
		color: #C6C4C4;
	}}
`;

const CheckItem = styled.p`
	line-height: 1.5;
	margin: 5px 0 15px;
	padding-left: 35px;
	position: relative;
	transition: color 0.3s ease;
	font-size: 18px;

	strong {
		display: block;
	}

	&&{a {
		text-decoration: underline;
		color: #282828;
	}}

	&&{a:hover {
		text-decoration: underline;
		cursor: pointer;
		color: #A11C43;
	}}

	span {
		font-size: 14px;
		display: block;
	}
`;

const ModalContainer = styled.div`
	width: 360px;
	margin:0 auto;
	max-width: 100%;
	padding-bottom: 20px;

	p {
		font-weight: 300;
		font-size: 15px;
		color: #282828;
	}

	a {
		color: #282828;
		margin:30px 0;
		font-weight: 500;
		text-decoration: underline;

		:hover {
			color: #A11C43;
		}
	}
`;

const Exclamation = styled.span`
	color: #A11C43;
	font-size: 80px;
	font-family: arial;
	width: 112px;
	display: block;
	height: 112px;
	background: white;
	border: 0.7px solid #CBCBCB;
	text-align: center;
	border-radius: 50%;
	margin: 0 auto 25px;
`;

const ValidationSection = styled.div`
	background: white;
    padding: 40px 50px 0;
    width: 640px;
    max-width: 100%;
	margin: 66px auto 125px;
	padding: 30px 45px 50px;

	h3 {
		font-size: 26px;
		font-family: ${props => props.theme.fontRobotoCondensed};
	}
`;

const VerifyImage = styled.img`
	margin: 10px 0 30px;
	max-width: 100%;
`;

const Row = styled.div`

	h1 {
		font-size: 45px;
		font-family: ${props => props.theme.fontRobotoCondensed};
		margin-top: 100px;
	}
`;

const Intro = styled.p`
	max-width: 580px;
`;

const Label = styled.label`
	color: #333C4E;
	font-weight: 400;

	span {
		font-weight: 300;
	}
`;

const Error = Label.extend`
	color: red;
	font-size: 12px;
	margin: 0;
`;

const Text = styled.input`
	margin: 0;
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

const Button = styled.button`
	width: 100%;
	border: 1px solid #A11C43;
	background: #A11C43;
	color: white;
	height: 40px;
	font-family: ${props => props.theme.fontRobotoCondensed};
	cursor: pointer;
	margin: 30px 0;

	:focus {
		outline: none;
	}

	:hover {
		background: #a11c4354;
	}
`;

export interface State {
	hasKeySafe: boolean;
	hasDid: boolean;
	didDoc: any;
	isDidLedgered: boolean;
	toastShown: boolean;
	isModalOpen: boolean;
	allChecksPassed: boolean;
	email: string;
	emailValid: boolean;
	checkingLedgered: boolean;
	shouldRedirect: boolean;
	projectData: Object;
}

export interface ParentProps {
	ixo?: any;
	userInfo: UserInfo;
	keysafe: any;
}

export class Verification extends React.Component<ParentProps, State> {

	state = {
		hasKeySafe: false,
		hasDid: false,
		didDoc: null,
		isDidLedgered: false,
		toastShown: false,
		isModalOpen: false,
		allChecksPassed: false,
		checkingLedgered: false,
		email: '',
		emailValid: true,
		shouldRedirect: false,
		projectData: null
	};

	busyLedgering = false;

	componentDidMount() {
		this.getProjectData();
		this.checkState();
		setTimeout(() => this.checkState(), 2000);
	}

	getProjectData = () => {
		this.props.ixo.project.getProjectByProjectDid(process.env.REACT_APP_FEATURED_PROJECT).then((response: any) => {
			const project: Project = response.data;
			this.setState({
				projectData: project
			});
		}).catch((result: Error) => {
			errorToast(result.message);
		});
	}

	checkState = () => {
		// If the user has a keysafe and but the hasKeySafe not set then set state
		if (this.props.keysafe && !this.state.hasKeySafe) {
			this.props.keysafe.getDidDoc((error, response) => {
				if (error) {
					this.setState({hasKeySafe: true });
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
		if (this.props.ixo && this.state.didDoc && !this.state.isDidLedgered) {
			this.setState({checkingLedgered: true});
			this.props.ixo.user.getDidDoc(this.state.didDoc.did).then((didResponse: any) => {
				if (didResponse.did) {
						this.setState({isDidLedgered: true, didDoc: didResponse, allChecksPassed: true});
				}
				this.setState({checkingLedgered: false});
			}).catch((err) => {
				this.setState({checkingLedgered: false});
			});
		} 
	}

	getIcon = (condition) => {
		if (condition) {
			return <GreenI className={'icon-registration-yes'} />;
		} else {
			return <GreyI className={'icon-register-no'} />;
		}
	}

	getKeysafeInstalledText = () => {
		const chrome   = navigator.userAgent.indexOf('Chrome') > -1;
		const firefox  = navigator.userAgent.indexOf('Firefox') > -1;
		let keysafeDownloadURL = '';

		if (chrome === true) {
			keysafeDownloadURL = 'https://chrome.google.com/webstore/detail/ixo-keysafe/nnlfaleaeoefglohpacnfgoeldfakkjk';
		} else if (firefox === true) {
			keysafeDownloadURL = 'https://addons.mozilla.org/en-US/firefox/addon/ixo-keysafe/';
		}

		if (keysafeDownloadURL === '') {
			return (
				<CheckItem>
					{this.getIcon(this.state.hasKeySafe)} <strong><a onClick={() => this.toggleModal(true)} target="_blank">Install ixo Keysafe</a></strong>
					<span>ixo Keysafe is your connection to the ixo blockchain. It is a secure identity vault that allows you to manage your profile and sign transactions on your ventures.</span>
				</CheckItem>
			);
		} else {
			return (
				<CheckItem>
					{this.getIcon(this.state.hasKeySafe)} <strong><a href={keysafeDownloadURL} target="_blank">Install ixo Keysafe</a></strong>
					<span>ixo Keysafe is your connection to the ixo blockchain. It is a secure identity vault that allows you to manage your profile and sign transactions on your ventures.</span>
				</CheckItem>
			);
		}
	}

	getKeysafeStateText = () => {
		return (
			<CheckItem>
				{this.getIcon(!!this.state.didDoc)} <strong>Sign in and unlock ixo Keysafe</strong>
			</CheckItem>
		);
	}

	getLedgeredText = () => {
		return (
			<CheckItem>
				{this.getIcon(this.state.isDidLedgered)} <strong>{this.state.isDidLedgered === true ? 'Register your identity' : <a onClick={this.ledgerDid} target="_blank">Register your identity</a>} on the ixo blockchain</strong>
				<span>By registering, you are cryptographically verifying your identity to ensure all your interactions within SDG Futures are secure.</span>
			</CheckItem>
		);
	}

	ledgerDid = () => {
		if (this.props.ixo && this.state.didDoc && !this.state.isDidLedgered && !this.busyLedgering) {
			let payload = {didDoc: this.state.didDoc};
			this.busyLedgering = true;
			this.props.keysafe.requestSigning(JSON.stringify(payload), (error, signature) => {
				if (!error) {
					this.props.ixo.user.registerUserDid(payload, signature).then((response: any) => {
						if (response.code === 0) {
							successToast('Did document was ledgered successfully');
							this.setState({isDidLedgered: true, allChecksPassed: true});
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

	toggleModal = (booleanVal: boolean) => {
		this.setState({isModalOpen: booleanVal});
	}

	renderModalHeading = () => {
		return {
			title: 'BROWSER NOTICE',
			width: '365'
		};
	}

	handleCreateAgent = () => {

		if (this.state.email.length === 0 || validateEmail(this.state.email) === false) {
			this.setState({emailValid: false});
		} else {
			this.setState({emailValid: true});
			const agentData = {
				email: this.state.email,
				// @ts-ignore
				name: this.props.userInfo.didDoc.name,
				role: 'SA',
				agentDid: this.props.userInfo.didDoc.did,
				projectDid: process.env.REACT_APP_FEATURED_PROJECT
			};
			this.props.keysafe.requestSigning(JSON.stringify(agentData), (error: any, signature: any) => {
				if (!error) {
					// PDS URL NEEDS TO BE THAT OF THE FEATURED PROJECT
					this.props.ixo.agent.createAgent(agentData, signature, this.state.projectData.serviceEndpoint).then((res) => {
						if (res.error !== undefined) {
							errorToast(res.error.message);
						} else {
							successToast(`Successfully registered`);
							this.setState({shouldRedirect: true});
						}
					});
				} else {
					errorToast('PDS is not responding');
				}
			});
		}
	}

	handleEmailChange = (e) => {
		const val = e.target.value;
		this.setState({email: val});
	}

	handleIsServiceAgent = () => {
		for (let agent of this.state.projectData.agents) {
			if (agent.did === this.state.didDoc.did) {
				return true;
			}
		}
		return false;
	}
	
	handleFinalSection = () => {
		if (this.state.allChecksPassed) {

			let ButtonSection = null;
			if (this.state.projectData !== null) {
				if (this.handleIsServiceAgent() === false) {
					ButtonSection = (
						<React.Fragment>
							<Label>Your Email</Label>
							<Text placeholder="john@gmail.com" value={this.state.email} onChange={this.handleEmailChange} />
							{this.state.emailValid === false && <Error>Please fill in a valid email</Error>}
							<Button onClick={this.handleCreateAgent}>Apply now</Button>	
						</React.Fragment>
						);
				} else {
					ButtonSection = (
						<React.Fragment>
							<p><strong>You are registered already. You can proceed below</strong></p>
							<Button onClick={() => this.setState({shouldRedirect: true})}>Apply now</Button>	
						</React.Fragment>
					);
				}
			}
			return (
				<React.Fragment>
				<p>You're all set! One final step before you can apply for your Venture. When clicking below, a popup will appear that prompts you to sign a request to access the Venture-creation page</p>
				<p>This ensures that your new decentralized identity is linked to your Venture</p>
				{ButtonSection}
			</React.Fragment>
			);
		} else if (this.state.checkingLedgered === true) {
			return (
				<Spinner info="Checking registered status..." />
			);
		} else {
			return '';
		}
	}

	render() {
		if (this.state.shouldRedirect === true) {
			return <Redirect to="/create-project" />;
		}
		return (
			<React.Fragment>
				<div className="container">
					<ModalWrapper
						isModalOpen={this.state.isModalOpen}
						handleToggleModal={(val) => this.toggleModal(val)}
						header={this.renderModalHeading()}
					>
						<ModalContainer>
							<Exclamation>!</Exclamation>
							<p>Applying to launch a venture requires <a href="https://web3.foundation/" target="_blank">Web 3.0</a> technology integration. This is currently only supported on <a href="https://www.google.com/chrome/" target="_blank">Chrome</a> and <a href="https://www.mozilla.org/en-US/firefox/new/" target="_blank">Firefox.</a> </p>
						</ModalContainer>
					</ModalWrapper>
					<Row className="row">
						<div className="col-md-12">
							<h1>Launch a Venture</h1>
							<Intro>Launch your venture for all to see the positive impact you’re making on the world. Remember that your venture should have the intention of achieving one of the 18 Sustainable Development Goals. </Intro>
							<ValidationSection>
								<h3>Make sure to complete the steps below to launch your SDG Futures venture</h3>
								<VerifyImage src={verificationImg} alt="Verification image" />
								<p>* Please refresh your browser after each step</p>
								{this.getKeysafeInstalledText()}
								{this.getKeysafeStateText()}
								{this.getLedgeredText()}
								<hr/>
								{this.handleFinalSection()}
							</ValidationSection>
						</div>
					</Row>
				</div>
			</React.Fragment>
		);
	}
}

function mapStateToProps(state: PublicSiteStoreState) {
	return {
		ixo: state.ixoStore.ixo,
		userInfo: state.loginStore.userInfo,
		keysafe: state.keysafeStore.keysafe
	};
}

export const VerificationConnected = connect<{}, {}, ParentProps>(mapStateToProps)(Verification as any);
