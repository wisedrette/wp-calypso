/** @format */
/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Card from 'components/card';
import FormButton from 'components/forms/form-button';

class PendingListItem extends Component {
	render() {
		const { purchase, translate } = this.props;

		const onComplete = () => {};
		const onAbandon = () => {};
		const onSupport = () => {};

		return (
			<Card className={ 'pending-payments__list-item' }>
				<span className="pending-payments__list-item-wrapper">
					<div className="pending-payments__list-item-details">
						<div className="pending-payments__list-item-title">{ purchase.productName }</div>
						<div className="pending-payments__list-item-purchase-type">
							{ purchase.paymentType }
						</div>
						<div className="pending-payments__list-item-purchase-date">
							{ purchase.totalCostDisplay }
						</div>
						<div className="pending-payments__list-item-actions">
							<FormButton type="button" isPrimary={ false } onClick={ onSupport }>
								{ translate( 'Contact Support' ) }
							</FormButton>
							<FormButton type="button" isPrimary={ false } onClick={ onAbandon }>
								{ translate( 'Abandon Payment' ) }
							</FormButton>
							<FormButton type="button" isPrimary={ true } onClick={ onComplete }>
								{ translate( 'Complete Payment' ) }
							</FormButton>
						</div>
					</div>
				</span>
			</Card>
		);
	}
}

PendingListItem.propTypes = {
	isPlaceholder: PropTypes.bool,
	purchase: PropTypes.object,
};

export default localize( PendingListItem );
