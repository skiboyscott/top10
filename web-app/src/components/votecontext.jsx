import React, { createContext, useContext, useEffect, useState } from 'react';
import supabase from '../utils/supabaseClient';
import { AuthContext } from './authcontext';
import { WeatherContext } from './weathercontext';

export const VoteContext = createContext();

export const VoteProvider = ({ children }) => {
	const [todaysVotesData, setTodaysVotesData] = useState({yesVotes: null, noVotes: null, totalVotes: null})
    const {locationDate, votedToday} = useContext(AuthContext)
    const {location} = useContext(WeatherContext)

	const loadTodaysStats = async () => {
		try {
			const today = locationDate
			
			const { data, error } = await supabase
				.from('weather_votes')
				.select('is_top10')
				.eq('date', today)
                .eq('location', location);

			if (error) {
				console.error('❌ Supabase query error:', error);
				throw error;
			}

			if (data) {

				const yesVotes = data.filter(vote => vote.is_top10).length;
				const noVotes = data.filter(vote => !vote.is_top10).length;
				const totalVotes = data.length;
				
				setTodaysVotesData({yesVotes: yesVotes, noVotes: noVotes, totalVotes: totalVotes})
			}

		} catch (error) {
			console.error('❌ Error loading stats:', error);
			console.error('❌ Error details:', error.message);
		}
	}

	useEffect(() => {
		if (locationDate) {
			loadTodaysStats()
		}
	}, [locationDate, votedToday])


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
