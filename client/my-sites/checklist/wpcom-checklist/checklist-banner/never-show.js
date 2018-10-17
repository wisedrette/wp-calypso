/** @format */
/**
 * External dependencies
 */
import { get } from 'lodash';
import store from 'store';

const storeKeyForNeverShow = 'sitesNeverShowChecklistBanner';

export function getNeverShowBannerStatus( siteId ) {
	const sitesNeverShowBanner = store.get( storeKeyForNeverShow );
	return get( sitesNeverShowBanner, String( siteId ) );
}

export function setNeverShowBannerStatus( siteId, value ) {
	const sitesNeverShowBanner = store.get( storeKeyForNeverShow ) || {};
	sitesNeverShowBanner[ `${ siteId }` ] = value;
	store.set( storeKeyForNeverShow, sitesNeverShowBanner );
}
