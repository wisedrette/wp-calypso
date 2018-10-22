/** @format */

/**
 * External dependencies
 */

import page from 'page';
import React from 'react';

/**
 * Internal dependencies
 */
import reducer from './state/reducer';
import HelloDollyPage from './hello-dolly-page';
import { navigation, siteSelection } from 'my-sites/controller';
import { makeLayout, render as clientRender } from 'controller';
import { addReduxReducer } from 'lib/redux-bridge';

const render = ( context, next ) => {
	context.primary = <HelloDollyPage />;
	next();
};

export default async function() {
	await addReduxReducer( [ 'extensions', 'helloDolly' ], reducer );

	page( '/hello-dolly/:site?', siteSelection, navigation, render, makeLayout, clientRender );
}
