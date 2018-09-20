import * as React from 'react';
import styled from 'styled-components';

const Container = styled.div`
	padding: 10px 40px 10px;
	background: linear-gradient(0deg, #F1F0F0 0%, #D6D6D6 100%);
	color: white;
`;
export const LayoutWrapper: React.SFC<{}> = ({children}) => {
	return (
		<Container className="container-fluid">
			{children}
		</Container>
	);
};