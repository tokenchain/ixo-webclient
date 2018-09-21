import * as ReactGA from 'react-ga';

export function fireTracker(url: string) {
	ReactGA.pageview(url);
	console.log('GA tracking fired for page: ', url);
}