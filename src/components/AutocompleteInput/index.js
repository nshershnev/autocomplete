import React, { useCallback, useEffect, useRef, useState } from 'react';
import { get, isNumber } from 'lodash';
import './styles.css';

import PullDown from '../PullDown';
import { getLastWord, getLastTwoWords } from '../../utils/common';
import { SUGGESTIONS_LOWERCASE } from '../../const/suggestions';
import { KEY_CODES } from '../../const/key-codes';

function AutocompleteInput() {
	const searchInputRef = useRef(null);
	const [searchInput, setSearchInput] = useState('');
	const [searchSource, setSearchSource] = useState('');
	const [suggestions, setSuggestions] = useState([]);
	const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(undefined);

	const getWordForAutocomplete = (target, searchInput) => {
		const caretPosition = target.selectionStart;
		const selectedInputRange = searchInput.slice(0, caretPosition);

		const [lastModifiedWord] = getLastWord(selectedInputRange);
		const [lastTwoWords] = getLastTwoWords(selectedInputRange);

		return {
			lastModifiedWord,
			lastTwoWords
		};
	};

	const searchAutocomplete = (searchInput, autocompleteWordLower, suggestions) => (
		suggestions
			.filter((suggestion) => (
				suggestion
					.toLowerCase()
					.indexOf(autocompleteWordLower) === 0
				&&
				searchInput.indexOf(suggestion) !== 0
				&&
				suggestion !== autocompleteWordLower
			))
	);

	const setFocusSearchInput = () => searchInputRef && searchInputRef.current && searchInputRef.current.focus();

	const setFocusPullDownItem = (focusedSuggestionIndex) => {
		const pullDownIdToFocus = document.getElementById(`pull-down-${focusedSuggestionIndex}`);
		pullDownIdToFocus && pullDownIdToFocus.focus();
	};

	const hideSuggestions = () => {
		setSuggestions([]);
		setFocusedSuggestionIndex(undefined);
	};

	const handleAutocompleteSuggestions = (target, searchInput) => {
		const { lastModifiedWord: autocompleteWord, lastTwoWords: autocompletePhrase } = getWordForAutocomplete(target, searchInput);

		const searchSource = autocompletePhrase || autocompleteWord;

		if (searchSource) {
			const autocompleteSuggestions = searchAutocomplete(searchInput, searchSource.toLowerCase(), SUGGESTIONS_LOWERCASE);
			setSearchSource(searchSource.toLowerCase());
			setSuggestions(autocompleteSuggestions);
		}
	};

	const handleChange = ({ target }) => {
		setSearchInput(target.value);

		if (target.value.length > 0) {
			handleAutocompleteSuggestions(target, target.value);
		} else {
			hideSuggestions();
		}
	};

	const handleSuggestionClick = (suggestionToApply) => {
		setSearchInput(suggestionToApply);
		hideSuggestions();
		setFocusSearchInput();
	};

	const handleEnterKeydown = useCallback((suggestions, focusedSuggestionIndex) => {
		const suggestionToApply = get(suggestions, [focusedSuggestionIndex], '');
		setSearchInput(suggestionToApply);

		hideSuggestions();
		setFocusSearchInput();
	}, []);

	const handleArrowUpKeydown = useCallback((suggestionsLength, focusedSuggestionIndex) => {
		if (suggestionsLength > 0) {
			if (isNumber(focusedSuggestionIndex) && focusedSuggestionIndex > 0) {
				setFocusedSuggestionIndex((prevFocusedSuggestionIndex) => --prevFocusedSuggestionIndex);
			} else {
				setFocusedSuggestionIndex(suggestionsLength - 1);
			}
		}
	}, []);

	const handleArrowDownKeydown = useCallback((suggestionsLength, focusedSuggestionIndex) => {
		if (suggestionsLength > 0) {
			if (isNumber(focusedSuggestionIndex) && focusedSuggestionIndex < suggestionsLength - 1) {
				setFocusedSuggestionIndex((prevFocusedSuggestionIndex) => ++prevFocusedSuggestionIndex);
			} else {
				setFocusedSuggestionIndex(0);
			}
		}
	}, []);

	const handleKeydown = useCallback(({ keyCode }) => {
		const keyDownCallbacks = {
			[keyCode === KEY_CODES.ENTER]: () => handleEnterKeydown(suggestions, focusedSuggestionIndex),
			[keyCode === KEY_CODES.ARROW_UP]: () => handleArrowUpKeydown(suggestions.length, focusedSuggestionIndex),
			[keyCode === KEY_CODES.ARROW_DOWN]: () => handleArrowDownKeydown(suggestions.length, focusedSuggestionIndex),
		};

		const selectedHandler = keyDownCallbacks[true];
		selectedHandler && selectedHandler();
	}, [focusedSuggestionIndex, suggestions, handleEnterKeydown, handleArrowUpKeydown, handleArrowDownKeydown]);

	useEffect(() => {
		window.addEventListener('keydown', handleKeydown);

		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
	}, [handleKeydown]);

	useEffect(() => {
		setFocusPullDownItem(focusedSuggestionIndex);
	}, [focusedSuggestionIndex]);

	return (
		<div className={`autocomplete ${suggestions.length > 0 ? 'autocomplete--expanded' : ''}`}>
			<span className="autocomplete__search"></span>
			<input
				type="text"
				name="search-input"
				aria-label="Search"
				maxLength={2048}
				className="autocomplete__input"
				value={searchInput}
				ref={searchInputRef}
				onChange={handleChange}
			/>
			{suggestions.length > 0 && (
				<PullDown
					searchSource={searchSource}
					suggestions={suggestions}
					onSuggestionClick={handleSuggestionClick}
				/>
			)}
		</div>
	);
}

export default AutocompleteInput;
