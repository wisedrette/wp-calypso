/** @format */

/**
 * External dependencies
 */
import debugModule from 'debug';
import React from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import { some } from 'lodash';

/**
 * Internal dependencies
 */
import analytics from 'lib/analytics';
import Button from 'components/button';
import CompactCard from 'components/card/compact';
import HappinessEngineers from 'me/help/help-happiness-engineers';
import HelpResult from './help-results/item';
import HelpSearch from './help-search';
import HelpTeaserButton from './help-teaser-button';
import HelpUnverifiedWarning from './help-unverified-warning';
import Main from 'components/main';
import MeSidebarNavigation from 'me/sidebar-navigation';
import PageViewTracker from 'lib/analytics/page-view-tracker';
import QueryUserPurchases from 'components/data/query-user-purchases';
import SectionHeader from 'components/section-header';
import { getCurrentUserId, isCurrentUserEmailVerified } from 'state/current-user/selectors';
import { getSupportSiteLocale } from 'lib/i18n-utils';
import { getUserPurchases, isFetchingUserPurchases } from 'state/purchases/selectors';
import { isWpComBusinessPlan } from 'lib/plans';

/**
 * Module variables
 */
const debug = debugModule( 'calypso:help-search' );

class Help extends React.PureComponent {
	static displayName = 'Help';

	getHelpfulArticles = () => {
		const { supportSiteLocaleSubdomain, translate } = this.props;

		const helpfulResults = [
			{
				link: `https://${ supportSiteLocaleSubdomain }.support.wordpress.com/do-i-need-a-website-a-blog-or-a-website-with-a-blog/`,
				title: translate( 'Do I Need a Website, a Blog, or a Website with a Blog?' ),
				description: translate(
					'If you’re building a brand new site, you might be wondering if you need a website, a blog, or a website with a blog. At WordPress.com, you can create all of these options easily, right in your dashboard.'
				),
			},
			{
				link: `https://${ supportSiteLocaleSubdomain }.support.wordpress.com/business-plan/`,
				title: translate( 'Uploading custom plugins and themes' ),
				description: translate(
					'Learn more about installing a custom theme or plugin using the Business plan.'
				),
			},
			{
				link: `https://${ supportSiteLocaleSubdomain }.support.wordpress.com/all-about-domains/`,
				title: translate( 'All About Domains' ),
				description: translate(
					'Set up your domain whether it’s registered with WordPress.com or elsewhere.'
				),
			},
			{
				link: `https://${ supportSiteLocaleSubdomain }.support.wordpress.com/start/`,
				title: translate( 'Get Started' ),
				description: translate(
					'No matter what kind of site you want to build, our five-step checklists will get you set up and ready to publish.'
				),
			},
			{
				link: `https://${ supportSiteLocaleSubdomain }.support.wordpress.com/settings/privacy-settings/`,
				title: translate( 'Privacy Settings' ),
				description: translate( 'Limit your site’s visibility or make it completely private.' ),
			},
		];

		return (
			<div className="help-results">
				<SectionHeader label={ this.props.translate( 'Most Helpful Articles' ) } />
				{ helpfulResults.map( ( result, index ) => {
					const trackClick = () => {
						debug( 'Suggested result click: ', result.link );
						analytics.tracks.recordEvent( 'calypso_help_suggested_result_click', {
							link: result.link,
							position: index,
						} );
					};

					return (
						<HelpResult
							key={ result.link }
							helpLink={ result }
							iconTypeDescription="book"
							onClick={ trackClick }
						/>
					);
				} ) }
			</div>
		);
	};

	getSupportLinks = () => {
		const { supportSiteLocaleSubdomain, translate } = this.props;
		return (
			<div className="help__support-links">
				<CompactCard
					className="help__support-link"
					href={ `https://${ supportSiteLocaleSubdomain }.support.wordpress.com` }
					target="__blank"
				>
					<div className="help__support-link-section">
						<h2 className="help__support-link-title">{ translate( 'All support articles' ) }</h2>
						<p className="help__support-link-content">
							{ translate(
								'Looking to learn more about a feature? Our docs have all the details.'
							) }
						</p>
					</div>
				</CompactCard>
				<CompactCard
					className="help__support-link"
					href={ `https://${ supportSiteLocaleSubdomain }.support.wordpress.com/video-tutorials/` }
					target="__blank"
				>
					<div className="help__support-link-section">
						<h2 className="help__support-link-title">
							{ translate( 'Quick help video tutorials' ) }
						</h2>
						<p className="help__support-link-content">
							{ translate(
								'These short videos will demonstrate some of our most popular features.'
							) }
						</p>
					</div>
				</CompactCard>
				<CompactCard
					className="help__support-link"
					href="https://dailypost.wordpress.com/blogging-university/"
					target="__blank"
				>
					<div className="help__support-link-section">
						<h2 className="help__support-link-title">
							{ translate( 'Self-guided email courses for site owners and bloggers' ) }
						</h2>
						<p className="help__support-link-content">
							{ translate(
								'Pick from our ever-growing list of free email courses to improve your knowledge.'
							) }
						</p>
					</div>
				</CompactCard>
				<CompactCard
					className="help__support-link"
					href="https://learn.wordpress.com"
					target="__blank"
				>
					<div className="help__support-link-section">
						<h2 className="help__support-link-title">
							{ translate( 'Self-guided online tutorial' ) }
						</h2>
						<p className="help__support-link-content">
							{ translate( 'A step-by-step guide to getting familiar with the platform.' ) }
						</p>
					</div>
				</CompactCard>
				<CompactCard
					className="help__support-link help__support-link-contact"
					href="/help/contact/"
				>
					<div className="help__support-link-section">
						<h2 className="help__support-link-title">{ translate( 'Get in touch' ) }</h2>
						<p className="help__support-link-content">
							{ translate( "Can't find the answer? Drop us a line and we'll lend a hand." ) }
						</p>
					</div>
					<Button className="help__support-link-button" primary>
						{ translate( 'Contact Us' ) }
					</Button>
				</CompactCard>
			</div>
		);
	};

	getCoursesTeaser = () => {
		if ( ! this.props.showCoursesTeaser ) {
			return null;
		}

		return (
			<HelpTeaserButton
				onClick={ this.trackCoursesButtonClick }
				href="/help/courses"
				title={ this.props.translate( 'Courses' ) }
				description={ this.props.translate(
					'Learn how to make the most of your site with these courses and webinars'
				) }
			/>
		);
	};

	trackCoursesButtonClick = () => {
		const { isBusinessPlanUser } = this.props;
		analytics.tracks.recordEvent( 'calypso_help_courses_click', {
			is_business_plan_user: isBusinessPlanUser,
		} );
	};

	getPlaceholders = () => {
		return (
			<Main className="help">
				<MeSidebarNavigation />
				<div className="help-search is-placeholder" />
				<div className="help__help-teaser-button is-placeholder" />
				<div className="help-results is-placeholder" />
				<div className="help__support-links is-placeholder" />
			</Main>
		);
	};

	render() {
		const { isEmailVerified, userId, isLoading } = this.props;

		if ( isLoading ) {
			return this.getPlaceholders();
		}

		return (
			<Main className="help">
				<PageViewTracker path="/help" title="Help" />
				<MeSidebarNavigation />
				<HelpSearch />
				{ ! isEmailVerified && <HelpUnverifiedWarning /> }
				{ this.getCoursesTeaser() }
				{ this.getHelpfulArticles() }
				{ this.getSupportLinks() }
				<HappinessEngineers />
				<QueryUserPurchases userId={ userId } />
			</Main>
		);
	}
}

function purchaseIsWpComBusinessPlan( { productSlug } ) {
	return isWpComBusinessPlan( productSlug );
}

export const mapStateToProps = ( state, ownProps ) => {
	const isEmailVerified = isCurrentUserEmailVerified( state );
	const userId = getCurrentUserId( state );
	const purchases = getUserPurchases( state, userId );
	const isLoading = isFetchingUserPurchases( state );
	const isBusinessPlanUser = some( purchases, purchaseIsWpComBusinessPlan );
	const showCoursesTeaser = ownProps.isCoursesEnabled && isBusinessPlanUser;
	const supportSiteLocaleSubdomain = getSupportSiteLocale();

	return {
		userId,
		isBusinessPlanUser,
		showCoursesTeaser,
		isLoading,
		isEmailVerified,
		supportSiteLocaleSubdomain,
	};
};

export default connect( mapStateToProps )( localize( Help ) );
