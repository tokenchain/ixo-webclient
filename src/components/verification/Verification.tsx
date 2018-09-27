import * as React from 'react';
import styled from 'styled-components';
import { UserInfo } from '../../types/models';

import { connect } from 'react-redux';
import { PublicSiteStoreState } from '../../redux/public_site_reducer';
import { successToast, errorToast, warningToast } from '../helpers/Toast';
import { ModalWrapper } from '../common/ModalWrapper';

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
	margin: 5px 0;
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

export interface State {
	hasKeySafe: boolean;
	hasDid: boolean;
	didDoc: any;
	isDidLedgered: boolean;
	toastShown: boolean;
	isModalOpen: boolean;
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
		isModalOpen: false
	};

	busyLedgering = false;

	componentDidMount() {
		this.checkState();
		setTimeout(() => this.checkState(), 2000);
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
			this.props.ixo.user.getDidDoc(this.state.didDoc.did).then((didResponse: any) => {
				if (didResponse.did) {
						this.setState({isDidLedgered: true, didDoc: didResponse});
				}
			});
		} else if (this.props.ixo && this.state.didDoc && !this.state.isDidLedgered) {
			this.setState({isDidLedgered: true});
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
					{this.getIcon(this.state.hasKeySafe)} <strong><a onClick={() => this.toggleModal(true)} target="_blank">Install ixo Keysafe</a> and refresh your browser</strong>
					<span>ixo Keysafe is your connection to the ixo blockchain. It is a secure identity vault that allows you to manage your profile and sign transactions on your ventures.</span>
				</CheckItem>
			);
		} else {
			return (
				<CheckItem>
					{this.getIcon(this.state.hasKeySafe)} <strong><a href={keysafeDownloadURL} target="_blank">Install ixo Keysafe</a> and refresh your browser</strong>
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
		console.log(this.state.didDoc);
		if (this.props.ixo && this.state.didDoc && !this.state.isDidLedgered && !this.busyLedgering) {
			let payload = {didDoc: this.state.didDoc};
			this.busyLedgering = true;
			this.props.keysafe.requestSigning(JSON.stringify(payload), (error, signature) => {
				if (!error) {
					this.props.ixo.user.registerUserDid(payload, signature).then((response: any) => {
						if (response.code === 0) {
							successToast('Did document was ledgered successfully');
							this.setState({isDidLedgered: true});
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

	render() {
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
					<div className="row">
						<div className="col-md-12">
							<img src={verificationImg} alt="Verification image" />
							{this.getKeysafeInstalledText()}
							{this.getKeysafeStateText()}
							{this.getLedgeredText()}
						</div>
					</div>
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
