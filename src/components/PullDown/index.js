import React from 'react';
import './styles.css';

import PropTypes from 'prop-types';

import PullDownItem from './PullDownItem';

function PullDown(props) {
	return (
		<ul className="pull-down">
			<div className="pull-down__separate-line"></div>
			{props.suggestions.map((suggestion, index) => (
				<PullDownItem
					key={suggestion + index}
					pullDownId={`pull-down-${index}`}
					suggestion={suggestion}
					searchSource={props.searchSource}
					onSuggestionClick={props.onSuggestionClick}
				/>
			))}
		</ul>
	);
}

PullDown.propTypes = {
	searchSource: PropTypes.string,
	suggestions: PropTypes.array,
	onSuggestionClick: PropTypes.func,
};

export default PullDown;
