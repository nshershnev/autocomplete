import React, { useEffect, useState } from 'react';
import './styles.css';

import PropTypes from 'prop-types';

function PullDownItem(props) {
    const [suggestion, setSuggestion] = useState('');

    const applySuggestionSelection = (searchSource, suggestion) => {
        return suggestion.replace(searchSource, `<b>${searchSource}</b>`);
    };

    useEffect(() => {
        const suggestionWithSelection = applySuggestionSelection(props.searchSource, props.suggestion);
        setSuggestion(suggestionWithSelection);
    }, [props.searchSource, props.suggestion]);

    return (
        <li id={props.pullDownId} className="pull-down-item" tabIndex="0" onClick={() => props.onSuggestionClick(props.suggestion)}>
            <span className="pull-down-item__search"></span>
            <span className="pull-down-item__name" dangerouslySetInnerHTML={{ __html: suggestion }}></span>
        </li>
    );
}

PullDownItem.propTypes = {
    pullDownId: PropTypes.string,
    searchSource: PropTypes.string,
    suggestion: PropTypes.string,
    onSuggestionClick: PropTypes.func,
};

export default PullDownItem;
