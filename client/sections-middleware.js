/** @format */
/**
 * External dependencies
 */
import config from 'config';
import page from 'page';

/**
 * Internal dependencies
 */
import { activateNextLayoutFocus } from 'state/ui/layout-focus/actions';
import { bumpStat } from 'state/analytics/actions';
import * as LoadingError from 'layout/error';
import * as controller from './controller/index.web';
import { pathToRegExp } from './utils';
import { receiveSections, load } from './sections-helper';

import sections from './sections';
receiveSections( sections );

const _loadedSections = {};

function activateSection( sectionDefinition, context, next ) {
	const dispatch = context.store.dispatch;

	controller.setSection( sectionDefinition )( context );
	dispatch( { type: 'SECTION_SET', isLoading: false } );
	dispatch( activateNextLayoutFocus() );
	next();
}

async function loadSection( sectionDefinition, context, next ) {
	const { dispatch } = context.store;

	dispatch( { type: 'SECTION_SET', isLoading: true } );

	// If the section chunk is not loaded within 400ms, report it to analytics
	const loadReportTimeout = setTimeout(
		() => dispatch( bumpStat( 'calypso_chunk_waiting', sectionDefinition.name ) ),
		400
	);

	try {
		const requiredModule = await load( sectionDefinition.name, sectionDefinition.module );
		await requiredModule.default( controller.clientRouter );
		_loadedSections[ sectionDefinition.module ] = true;
		activateSection( sectionDefinition, context, next );
	} catch ( error ) {
		console.error( error ); // eslint-disable-line
		if ( ! LoadingError.isRetry() && process.env.NODE_ENV !== 'development' ) {
			LoadingError.retry( sectionDefinition.name );
		} else {
			dispatch( { type: 'SECTION_SET', isLoading: false } );
			LoadingError.show( context, sectionDefinition.name );
		}
	} finally {
		// If the load was faster than the timeout, this will cancel the analytics reporting
		clearTimeout( loadReportTimeout );
	}
}

function createPageDefinition( path, sectionDefinition ) {
	const pathRegex = pathToRegExp( path );

	page( pathRegex, async function( context, next ) {
		const envId = sectionDefinition.envId;

		if ( envId && envId.indexOf( config( 'env_id' ) ) === -1 ) {
			return next();
		}

		const loadedSection = _loadedSections[ sectionDefinition.module ];
		if ( loadedSection ) {
			if ( loadedSection !== true ) {
				await loadedSection;
			}
			return activateSection( sectionDefinition, context, next );
		}

		_loadedSections[ sectionDefinition.module ] = loadSection( sectionDefinition, context, next );
	} );
}

export const setupRoutes = () => {
	sections.forEach( section =>
		section.paths.forEach( path => createPageDefinition( path, section ) )
	);
};
