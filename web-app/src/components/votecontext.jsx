import React, { createContext, useContext, useEffect, useState } from 'react';
import supabase from '../utils/supabaseClient';
import { AuthContext } from './authcontext';
import { WeatherContext } from './weathercontext';

export const VoteContext = createContext();

export const VoteProvider = ({ children }) => {
	const [todaysVotesData, setTodaysVotesData] = useState({
		yesVotesCity: null,
		noVotesCity: null,
		totalVotesCity: null,
		yesVotesState: null,
		noVotesState: null,
		totalVotesState: null
	});
	const { locationDate, votedToday } = useContext(AuthContext);
	const { location } = useContext(WeatherContext);

	const loadTodaysStats = async () => {
		try {
			const today = locationDate;

			const [city, state] = location.split(',').map(str => str.trim());

			const { data, error } = await supabase
				.from('weather_votes')
				.select('is_top10, location')
				.eq('date', today);

			if (error) {
				console.error('❌ Supabase query error:', error);
				throw error;
			}

			let yesVotesCity = 0;
			let noVotesCity = 0;
			let totalVotesCity = 0;
			let yesVotesState = 0;
			let noVotesState = 0;
			let totalVotesState = 0;

			data.forEach(vote => {
				const [voteCity, voteState] = vote.location.split(',').map(str => str.trim());

				// State match
				if (voteState === state) {
					totalVotesState++;
					if (vote.is_top10) yesVotesState++;
					else noVotesState++;

					// City + state match
					if (voteCity === city) {
						totalVotesCity++;
						if (vote.is_top10) yesVotesCity++;
						else noVotesCity++;
					}
				}
			});

			setTodaysVotesData({
				yesVotesCity,
				noVotesCity,
				totalVotesCity,
				yesVotesState,
				noVotesState,
				totalVotesState
			});
		} catch (error) {
			console.error('❌ Error loading stats:', error);
		}
	};

	useEffect(() => {
		if (locationDate && location) {
			loadTodaysStats();
		}
	}, [locationDate, votedToday, location]);


	return (
		<VoteContext.Provider
			value={{
				todaysVotesData
			}}
		>
			{children}
		</VoteContext.Provider>
	);
};
