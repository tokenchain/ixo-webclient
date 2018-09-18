export const SDGArray = [
	{ ico: 'nopoverty', title: 'NO POVERTY', color: '#D33A44', shortText: 'Economic growth must be inclusive to provide sustainable jobs and promote equality.', url: 'https://www.un.org/sustainabledevelopment/poverty/' },
	{ ico: 'zerohunger', title: 'ZERO HUNGER', color: '#D5A84F', shortText: 'The food and agriculture sector offers key solutions for development, and is central for hunger and poverty eradication.', url: 'https://www.un.org/sustainabledevelopment/hunger/'},
	{ ico: 'goodhealth', title: 'GOOD HEALTH AND WELL-BEING', color: '#629E51', shortText: 'Ensuring healthy lives and promoting the well-being for all at all ages is essential to sustainable development.', url: 'https://www.un.org/sustainabledevelopment/health/' },
	{ ico: 'qualityeducation', title: 'QUALITY EDUCATION', color: '#B73336', shortText: 'Obtaining a quality education is the foundation to improving people’s lives and sustainable development.', url: 'https://www.un.org/sustainabledevelopment/education/' },
	{ ico: 'genderequality', title: 'GENDER EQUALITY', color: '#DC4E3A', shortText: 'Gender equality is not only a fundamental human right, but a necessary foundation for a peaceful, prosperous and sustainable world.', url: 'https://www.un.org/sustainabledevelopment/gender-equality/' },
	{ ico: 'cleanwater', title: 'CLEAN WATER AND SANITATION', color: '#5DBDE2', shortText: 'Clean, accessible water for all is an essential part of the world we want to live in.', url: 'https://www.un.org/sustainabledevelopment/water-and-sanitation/' },
	{ ico: 'affordableenergy', title: 'AFFORDABLE AND CLEAN ENERGY', color: '#F3C546', shortText: 'Energy is central to nearly every major challenge and opportunity.', url: 'https://www.un.org/sustainabledevelopment/energy/' },
	{ ico: 'decentwork', title: 'DECENT WORK AND ECONOMIC GROWTH', color: '#962B45', shortText: 'Sustainable economic growth will require societies to create the conditions that allow people to have quality jobs.', url: 'https://www.un.org/sustainabledevelopment/economic-growth/' },
	{ ico: 'industry', title: 'INDUSTRY, INNOVATION AND INFRASTRUCTURE', color: '#E17240', shortText: 'Investments in infrastructure are crucial to achieving sustainable development.', url: 'https://www.un.org/sustainabledevelopment/infrastructure-industrialization/' },
	{ ico: 'reduced', title: 'REDUCED INEQUALITIES', color: '#CD3681', shortText: 'To reduce inequalities, policies should be universal in principle, paying attention to the needs of disadvantaged and marginalized populations.', url: 'https://www.un.org/sustainabledevelopment/inequality/' },
	{ ico: 'sustainablecities', title: 'SUSTAINABLE CITIES AND COMMUNITIES', color: '#EBA046', shortText: 'There needs to be a future in which cities provide opportunities for all, with access to basic services, energy, housing, transportation and more.', url: 'https://www.un.org/sustainabledevelopment/cities/' },
	{ ico: 'consumption', title: 'RESPONSIBLE CONSUMPTION AND PRODUCTION', color: '#B88E40', shortText: 'Responsible Production and Consumption', url: 'https://www.un.org/sustainabledevelopment/sustainable-consumption-production/' },
	{ ico: 'climateaction', title: 'CLIMATE ACTION', color: '#507D4C', shortText: 'Climate change is a global challenge that affects everyone, everywhere.', url: 'https://www.un.org/sustainabledevelopment/climate-change-2/' },
	{ ico: 'lifebelowwater', title: 'LIFE BELOW WATER', color: '#4896CF', shortText: 'Careful management of this essential global resource is a key feature of a sustainable future.', url: 'https://www.un.org/sustainabledevelopment/oceans/' },
	{ ico: 'lifeonland', title: 'LIFE ON LAND', color: '#72B757', shortText: 'Sustainably manage forests, combat desertification, halt and reverse land degradation, halt biodiversity loss.', url: 'https://www.un.org/sustainabledevelopment/biodiversity/' },
	{ ico: 'peace', title: 'PEACE, JUSTICE AND STRONG INSTITUTIONS', color: '#31699B', shortText: 'Access to justice for all, and building effective, accountable institutions at all levels.', url: 'https://www.un.org/sustainabledevelopment/peace-justice/' },
	{ ico: 'partnership', title: 'PARTNERSHIPS FOR THE GOALS', color: '#244868', shortText: 'Revitalize the global partnership for sustainable development.', url: 'https://www.un.org/sustainabledevelopment/globalpartnerships/' }
];

export const deviceWidth = {
	mobile: '576',
	tablet: '768',
	desktop: '992',
	desktopLarge: '1200',
};
export const imgArray = () => {
	const tempArray: string[] = [];
	for (let i = 0; i < 9; i++) {
		tempArray[i] = require(`../assets/images/image${i + 1}.jpg`);
	}
	return tempArray;
};
export const iconUpload = () => {
	return require('../assets/images/icon-upload.svg');
};
export const SocialMediaLinks = ['http://www.instagram.com', 'http://www.twitter.com', 'http://www.facebook.com', 'http://www.website.com'];
const countryLatLng = require('../lib/maps/countryLatLng.json');
var isoCountriesTmp = {};
var isoCountriesLatLngTmp = {};

countryLatLng.map( (value) => {
	isoCountriesTmp[value.alpha2] = value.country;
	isoCountriesLatLngTmp[value.alpha2] = {lat: value.latitude, lng: value.longitude};
});

export const isoCountries = isoCountriesTmp;
export const isoCountriesLatLng = isoCountriesLatLngTmp;

// tslint:disable-next-line:max-line-length
export const testProjectData = JSON.stringify(require('./json/project.json'));
export const blankProjectData = JSON.stringify(require('./json/blankProject.json'));

export const claimJson = JSON.stringify(require('./json/claimForm.json'));
export const onboardJson = JSON.stringify(require('./json/onboardingForm.json'));
export const testClaimSchema = JSON.stringify(require('./json/claimSchema.json'));
export const agentJson = JSON.stringify(require('./json/agentForm.json'));

export const testClaimForm = '{}';
export const testAgentData = '{"email":"don@ixo.com","name":"Don","role":"EA","agentDid":"did:sov:Tp25vz5iHoLJ4ktk7pKYC6","projectDid":"did:ixo:3vDYCPWvwCsj9Co3RqXp3z"}';
export const testSig = {
	type: 'ed25519-sha-256',
	created: '2018-06-06T09:18:47Z',
	creator: 'did:sov:Tp25vz5iHoLJ4ktk7pKYC6',
	publicKey: 'BGcahyLmkPeuteRemDXMUPu1W9Tc6ghuCSud4mD7fTG3',
	signatureValue: '6A548060AEB78449D17C1B825F941028728ADBBD5A4952CDF7782F128B2582A648D0697670AA3164434B8C27D18FDC213333DE7A8ADC574940B509B6B2AD590E'
};
export const formJson = {
	'fields': [
		{
			'label': 'Name',
			'name': 'name',
			'type': 'text'
		},
		{
			'label': 'Number',
			'name': 'Number',
			'type': 'number'
		},
		{
			'label': 'theimage',
			'name': 'theimage',
			'type': 'image'
		},
		{
			'label': 'Owner email',
			'name': 'email',
			'type': 'text'
		},
		{
			'label': 'About',
			'name': 'about',
			'type': 'textarea'
		},
		{
			'label': 'Country',
			'name': 'country',
			'type': 'country'
		},
		{
			'label': 'Agent Template',
			'name': 'agentTemplate.name',
			'type': 'template'
		},
		{
			'label': 'Attended School',
			'name': 'attended',
			'type': 'select',
			'options': [
				{
					'label': 'Yes',
					'value': 'true'
				},
				{
					'label': 'No',
					'value': 'false'
				}
			]
		}
	]
};