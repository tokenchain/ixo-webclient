import * as React from 'react';
import {
	ComposableMap,
	ZoomableGroup,
	Geographies,
	Geography,
	Markers,
	Marker,
	Lines,
	Line,
} from 'react-simple-maps';
import styled from 'styled-components';

const MapWrapper = styled.div`

	path:focus {
		outline: none!important;
	}

	g.rsm-marker {
    outline-width: 0px;
	}
`;

const geographyPaths = require('../../lib/maps/world-50m-simplified.json');

export class LatLng {
	coordinate = null;
	constructor(lat: number, lon: number) {
		this.coordinate = {lat: lat, lon: lon};
	}

	lon() {
		return this.coordinate.lon;
	}

	lat() {
		return this.coordinate.lat;
	}
}

export interface ParentProps {
	markers: LatLng[];
}

export class WorldMap extends React.Component<ParentProps> {

	render() {
		return (
			<MapWrapper>
				<ComposableMap height="800" style={{ width: '100%', outline: 'none!important' }}>
					<ZoomableGroup zoom={1.5}>
					<Geographies geography={geographyPaths}>
					{(geographies, projection) => geographies.map((geography, index) => (
						<Geography
							key={index}
							geography={geography}
							projection={projection}
							style={{
								default: {
									fill: '#ebe8e8',
									stroke: '#f8f7f7',
									strokeWidth: 0.5,
									outline: 'none!important',
								},
								hover:   { fill: '#dbd8d8' },
								pressed: { fill: '#dbd8d8' },
							}}
						/>
					))}
					</Geographies>
					<Markers style={{outlineWidth: '0px'}}>
						{this.props.markers.map( (value: LatLng, i: number) => {
							return (
								<Marker 
										key={i}
										marker={{ coordinates: [ value.lon(), value.lat() ] }}
										style={{
											default: { fill: '#4A9F46' },
											hover:   { fill: '#FFFFFF' },
											pressed: { fill: '#FFFFFF' },
											outline: 'none!important',
											outlineWidth: '0px',
										}
										}
								>
									<circle cx={0} cy={0} r={3} filter="url(#glow)"/>
									<defs>
										<filter id="glow" width="180%" height="180%" filterUnits="userSpaceOnUse">
											<feGaussianBlur in="SourceGraphic"  stdDeviation="5"/> {/* stdDeviation is how much to blur */}
											<feComponentTransfer>
											<feFuncA type="linear" slope="3"/> {/* slope is the opacity of the shadow */}
											</feComponentTransfer>
											<feMerge> 
												<feMergeNode/>
												<feMergeNode in="SourceGraphic"/>
											</feMerge>
										</filter>
									</defs>
								</Marker>
							);
						})}
					</Markers>
					<Lines>
						<Line />
					</Lines>
					</ZoomableGroup>
				</ComposableMap>
			</MapWrapper>
		);
	}
}