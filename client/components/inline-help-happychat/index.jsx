/** @format */
/**
 * External dependencies
 */
import React from 'react';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import HappychatButton from 'components/happychat/button';

const InlineHelpHappychat = ( { className, ...rest } ) => (
	<HappychatButton className={ classnames( 'inline-help-happychat', className ) } { ...rest } />
);

InlineHelpHappychat.displayName = 'InlineHelpHappychat';

export default InlineHelpHappychat;
