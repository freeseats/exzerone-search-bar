import React from 'react';
import Axios from 'axios';
import _ from 'underscore';
import Autosuggest from 'react-autosuggest';
import '../../../public/searchtheme.css';
import '../../../public/searchbox.css';

class Searchbox extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '',
			suggestions: [],
			restaurants: [],
			cuisines: [
				{ name: 'Japanese' },
				{ name: 'Chinese' },
				{ name: 'New American' },
				{ name: 'Mexican' },
				{ name: 'Korean' },
				{ name: 'Indian' },
				{ name: 'French' },
				{ name: 'Taiwanese' }
			],
			locations: [],
			list: []
		};
		this.queryHandler = this.queryHandler.bind(this);
		this.getSuggestions = this.getSuggestions.bind(this);
		this.getSuggestionValue = this.getSuggestionValue.bind(this);
		this.renderSuggestion = this.renderSuggestion.bind(this);
		this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(
			this
		);
		this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(
			this
		);
		this.renderSectionTitle = this.renderSectionTitle.bind(this);
		this.getSectionSuggestions = this.getSectionSuggestions.bind(this);
	}

	componentDidMount() {
		Axios.get('http://54.226.159.194:80/restaurants')
			.then((result) => {
				const { data } = result;
				const locations = [];
				const restaurants = [];
				data.forEach((info) => {
					locations.push({ name: info.locations });
					restaurants.push({ name: info.restaurants });
				});
				const { list } = this.state;
				list.push(
					{ title: 'Locations', query: locations },
					{ title: 'Cuisines', query: this.state.cuisines },
					{ title: 'Restaurants', query: restaurants }
				);
				this.setState({
					locations,
					restaurants,
					list
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}

	getSuggestions(value) {
		const inputValue = value.trim().toLowerCase();
		const inputLength = inputValue.length;

		if (inputLength === 0) {
			return [];
		}

		return this.state.list
			.map((section) => {
				return {
					title: section.title,
					query: section.query.filter(
						(q) => q.name.toLowerCase().indexOf(inputValue) !== -1
					)
				};
			})
			.filter((section) => section.query.length > 0);
	}

	renderSectionTitle(section) {
		return (
			<h6 className="suggestion-section-title">
				<p className="section-title">{section.title}</p>
			</h6>
		);
	}

	getSectionSuggestions(section) {
		return section.query;
	}

	queryHandler(event, { newValue }) {
		this.setState({
			value: newValue
		});
	}

	getSuggestionValue(suggestion) {
		return suggestion.name;
	}

	renderSuggestion(suggestion) {
		return (
			<div>
				<p className="suggestion">{suggestion.name}</p>
			</div>
		);
	}

	onSuggestionsFetchRequested({ value }) {
		this.setState({ suggestions: this.getSuggestions(value) });
	}

	onSuggestionsClearRequested() {
		this.setState({ suggestions: [] });
	}

	render() {
		const { value, suggestions } = this.state;
		const inputProps = {
			placeholder: 'Location, Restaurant, or Cuisine',
			value,
			onChange: this.queryHandler,
			style: {
				position: 'relative',
				verticalAlign: 'top',
				backgrounColor: 'transparent'
			},
			id: 'dtp-search-single-box',
			name: 'searchText',
			dir: 'auto',
			spellCheck: 'false',
			autoComplete: 'off'
		};
		return (
			<div className="picker-search-container autocomplete">
				<div className="search-icon" />
				<span className="twitter-typehead">
					<Autosuggest
						suggestions={suggestions}
						onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
						onSuggestionsClearRequested={this.onSuggestionsClearRequested}
						getSuggestionValue={this.getSuggestionValue}
						renderSuggestion={this.renderSuggestion}
						getSectionSuggestions={this.getSectionSuggestions}
						inputProps={inputProps}
						multiSection={true}
						renderSectionTitle={this.renderSectionTitle}
					/>
				</span>
			</div>
		);
	}
}

export default Searchbox;
