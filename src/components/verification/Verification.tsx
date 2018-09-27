import * as React from 'react';
import styled from 'styled-components';
import { UserInfo } from '../../types/models';

import { connect } from 'react-redux';
import { PublicSiteStoreState } from '../../redux/public_site_reducer';
import { successToast, errorToast, warningToast } from '../helpers/Toast';

const Icon = styled.i`
	font-size: 20px;
	top: 2px;
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
	
	&&{a {
		text-decoration: underline;
	}}

	&&{a:hover {
		text-decoration: underline;
		cursor: pointer;
		color: ${props => props.theme.fontBlue};
	}}
`;

export interface State {
	hasKeySafe: boolean;
	hasDid: boolean;
	didDoc: any;
	isDidLedgered: boolean;
	hasKYC: boolean;
	toastShown: boolean;
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
		hasKYC: false,
		toastShown: false
	};

	busyLedgering = false;

	checkState() {
		// If the user has a keysafe and but the hasKeySafe not set then set state
		if (this.props.keysafe && !this.state.hasKeySafe) {
			this.props.keysafe.getDidDoc((error, response) => {
				if (error) {
					console.log(error);
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
					if (didResponse.credentials.length === 0) {
						// Has no KYC Credential (Should look at the detail here, but right now we only have one type of credential)
						this.setState({isDidLedgered: true, didDoc: didResponse, hasKYC: false});
					} else {
						this.setState({isDidLedgered: true, didDoc: didResponse, hasKYC: true});
					}
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
		if (!this.state.hasKYC) {
			setTimeout(() => this.checkState(), 2000);
		}
	}
	getIcon = (condition) => {
		if (condition) {
			return <GreenI className={'icon-registration-yes'} />;
		} else {
			return <GreyI className={'icon-register-no'} />;
		}
	}

	getKeysafeText = () => {
		if (this.state.hasKeySafe) {
			return (
				<CheckItem>{this.getIcon(this.state.hasKeySafe)}
					{this.getIcon(this.state.hasKeySafe)} You have successfully installed the ixo Keysafe
				</CheckItem>
			);
		} else {
			return <CheckItem>{this.getIcon(this.state.hasKeySafe)} This role requires installing ixo Keysafe.</CheckItem>;
		}
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
							console.log('ledgered successfully');
						} else {
							console.log('unable to ledger at this time');
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

	render() {
		return (
			<div className="container-fluid">
				CONTENT HERE
			</div>
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
