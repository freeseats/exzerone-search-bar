import React from 'react';
import '../../../public/search.css';
import dateFns from 'date-fns';
import Searchbox from './Searchbox.jsx';
import Calendar from './Calendar.jsx';

class Search extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			party: '2 People',
			time: this.currentTimeMenu(),
			date: dateFns.format(new Date(), 'MMM D, YYYY'),
			calendar: false,
			expand: this.props.searchExpand,
			iconexpand: false
		};
		this.timeSlotRender = this.timeSlotRender.bind(this);
		this.calendarToggleHandler = this.calendarToggleHandler.bind(this);
		this.calendarRender = this.calendarRender.bind(this);
		this.calendarClickHandler = this.calendarClickHandler.bind(this);
		this.partySizeChange = this.partySizeChange.bind(this);
		this.timeSelectHandler = this.timeSelectHandler.bind(this);
		this.dateUpdater = this.dateUpdater.bind(this);
		this.handleClickOutside = this.handleClickOutside.bind(this);
		this.setWrapperRef = this.setWrapperRef.bind(this);
	}

	componentDidMount() {
		document.addEventListener('mousedown', this.handleClickOutside);
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
	}

	setWrapperRef(node) {
		this.wrapperRef = node;
	}

	handleClickOutside(event) {
		if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
			this.setState({ calendar: !this.state.calendar });
		}
	}

	currentTimeMenu() {
		let min;
		if (dateFns.format(new Date(), 'm') < 30) {
			min = '30';
			return `${dateFns.format(new Date(), 'h')}:${min} ${dateFns.format(
				new Date(),
				'A'
			)}`;
		}
		min = '00';
		return `${dateFns.format(
			dateFns.addHours(new Date(), 1),
			'h'
		)}:${min} ${dateFns.format(new Date(), 'A')}`;
	}

	timeSlotRender() {
		const rows = [];
		const hourNow = dateFns.format(new Date(), 'H');
		const minNow = dateFns.format(new Date(), 'm');

		if (
			(hourNow === 23 && minNow > 30) ||
			dateFns.format(this.state.date, 'M D') !==
				dateFns.format(new Date(), 'M D')
		) {
			for (let i = 0; i < 24; i++) {
				if (i === 0) {
					rows.push(
						<option key={i} value={`${i}0:00 AM`}>
							{i + 12}:00 AM
						</option>,
						<option key={`${i}:30`} value={`${i}0:30 AM`}>
							{i + 12}:30 AM
						</option>
					);
				} else if (i > 0) {
					if (i > 12) {
						rows.push(
							<option key={i} value={`${i}:00 PM`}>
								{i - 12}:00 PM
							</option>,
							<option key={`${i}:30`} value={`${i}:30 PM`}>
								{i - 12}:30 PM
							</option>
						);
					} else if (i < 12) {
						rows.push(
							<option key={i} value={`${i}:00 AM`}>
								{i}:00 AM
							</option>,
							<option key={`${i}:30`} value={`${i}:30 AM`}>
								{i}:30 AM
							</option>
						);
					} else if (i === 12) {
						rows.push(
							<option key={i} value={`${i}:00 PM`}>
								{i}:00 PM
							</option>,
							<option key={`${i}:30`} value={`${i}:30 PM`}>
								{i}:30 PM
							</option>
						);
					}
				}
			}
		} else {
			for (let i = hourNow; i < 24; i++) {
				if (i === 0) {
					rows.push(
						<option key={i} value={`${i}0:00 AM`}>
							{i + 12}:00 AM
						</option>,
						<option key={`${i}:30`} value={`${i}0:30 AM`}>
							{i + 12}:30 AM
						</option>
					);
				}
				if (i > 0) {
					if (i > 12) {
						rows.push(
							<option key={i} value={`${i}:00 PM`}>
								{i - 12}:00 PM
							</option>,
							<option key={`${i}:30`} value={`${i}:30 PM`}>
								{i - 12}:30 PM
							</option>
						);
					}
					if (i < 12) {
						rows.push(
							<option key={i} value={`${i}:00 AM`}>
								{i}:00 AM
							</option>,
							<option key={`${i}:30`} value={`${i}:30 AM`}>
								{i}:30 AM
							</option>
						);
					}
					if (i == 12) {
						rows.push(
							<option key={i} value={`${i}:00 PM`}>
								{i}:00 PM
							</option>,
							<option key={`${i}:30`} value={`${i}:30 PM`}>
								{i}:30 PM
							</option>
						);
					}
				}
			}
			if (minNow >= 30) {
				rows.splice(0, 2);
			}
		}
		return (
			<select
				onChange={this.timeSelectHandler}
				className="time-selector"
				name="Select_0"
				aria-label="time"
			>
				{rows}
			</select>
		);
	}

	timeSelectHandler(time) {
		let num = 0;
		if (time.target.value.length === 7) {
			this.setState({ time: time.target.value });
		} else if (time.target.value.length === 8) {
			num = Number(time.target.value.charAt(0) + time.target.value.charAt(1));
			if (num > 12) {
				num -= 12;
				let newTime = time.target.value.slice(2);
				newTime = num + newTime;
				console.log(newTime);
				this.setState({ time: newTime });
			} else {
				this.setState({ time: time.target.value });
			}
		}
	}

	dateUpdater() {
		const date = dateFns.addDays(this.state.date, 1);
		this.setState({ date: dateFns.format(date, 'MMM D, YYYY') });
	}

	calendarToggleHandler(e) {
		e.stopPropagation();
		this.setState({ calendar: !this.state.calendar });
	}

	calendarClickHandler(day) {
		this.setState({ date: dateFns.format(day, 'MMM D, YYYY') }, () => {
			this.setState({ calendar: !this.state.calendar });
		});
	}

	calendarRender() {
		let div = '';
		if (this.state.calendar === false) {
			div = (
				<div onClick={this.calendarToggleHandler} className="date-container">
					<a className="dtp-picker-selector-link date-label-closed dtp-picker-label">
						{this.state.date}
					</a>
					<input className="datepicker-closed dtp-picker-select picker__input" />
					<div className="datepicker-closed" />
				</div>
			);
		} else if (this.state.calendar === true) {
			div = (
				<div
					onClick={this.calendarToggleHandler}
					className="date-container-opened"
				>
					<a className="dtp-picker-selector-link date-label-opened dtp-picker-label">
						{this.state.date}
					</a>
					<input className="datepicker-opened dtp-picker-select picker__input" />
					<div ref={this.setWrapperRef} className="datepicker-opened">
						<Calendar
							date={this.state.date}
							dateUpdater={this.dateUpdater}
							clickHandler={this.calendarClickHandler}
						/>
					</div>
				</div>
			);
		}
		return div;
	}

	partySizeChange(e) {
		console.log(e.target.value);
		let party;
		if (e.target.value === 'Large party') {
			party = e.target.value;
		} else {
			party = `${e.target.value} People`;
		}
		this.setState({ party });
	}

	partySizeRender() {
		const rows = [];
		for (let i = 1; i < 22; i++) {
			if (i === 21) {
				rows.push(
					<option key={i} value="Large party">
						Large Party
					</option>
				);
			} else {
				rows.push(
					<option key={i} value={i}>
						{i} People
					</option>
				);
			}
		}
		return (
			<select onChange={this.partySizeChange} className="party-size-selector">
				{rows}
			</select>
		);
	}

	clickHandler(e) {
		e.preventDefault();
		this.setState({ expand: !this.state.expand });
	}

	render() {
		let expand;
		if (this.props.searchExpand) {
			expand = 'header-search-box-opened';
		} else if (!this.props.searchExpand) {
			expand = 'header-search-box-closed';
		}
		return (
			// <div className="site-header">
			<div className={expand}>
				<div className="close-button">
					<a
						onClick={this.props.expandHandler}
						data-target="#header-search-box"
						className="js-toggle-search"
					>
						<i className="icon-close" />
					</a>
				</div>
				<div className="content-block-header">
					<h3 className="slogan-header">
						<span className="slogan">Find your table for any occasion</span>
					</h3>
				</div>
				<div>
					<form autoComplete="off" className="dtp-picker-form">
						<div className="picker-selectors-container">
							<div className="party-size-container">
								<a
									className="select-label dtp-picker-selector-link"
									tabIndex="-1"
								>
									{this.state.party}
								</a>
								{this.partySizeRender()}
							</div>
							{this.calendarRender()}
							<div className="time-container">
								<a
									className="select-label dtp-picker-selector-link"
									tabIndex="-1"
								>
									{this.state.time}
								</a>
								{this.timeSlotRender()}
							</div>
						</div>
						<Searchbox />
						<input
							type="submit"
							value="Find a Table"
							data-test="search-in-header-dtp-submit"
							className="button dtp-picker-button"
						/>
					</form>
				</div>
			</div>
			// </div>
		);
	}
}

export default Search;
