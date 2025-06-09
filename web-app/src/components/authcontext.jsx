import React, { createContext, useEffect, useState } from 'react';
import supabase from './supabaseClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null)
	const [loggedIn, setLoggedIn] = useState(false);
	const [userName, setUserName] = useState(null);
	const [votedToday, setVotedToday] = useState(false);
	const [todaysVotesData, setTodaysVotesData] = useState({yesVotes: null, noVotes: null, totalVotes: null})

	const signUp = async (email, password, name) => {
		if (email || password || name) {

			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: { name },
					emailRedirectTo: window.location.origin,
				},
			});
			
			if (error) throw error;
			return data;
		}
	};

	const signIn = async (email, password) => {
        if (!email || !password) {
            alert('Please enter both email and password');
            return null;
        }

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            setLoggedIn(true);
            setUserName(data.user.user_metadata?.name || '');
			setUser(data.user);

            // Optional: Store session in localStorage (Supabase already uses localStorage under the hood)
            // Optional: Load weather data, stats, etc. if needed here
			return data;

        } catch (error) {
            console.error('❌ Login error:', error);
            alert(error.message);
        }
    };

	const signOut = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) throw error;
		setUserName(null);
		setLoggedIn(false);
		setVotedToday(false)
		setUser(null)
	};
	
    const submitVote = async (vote, weatherData) => {
		if (!weatherData) {
			return;
		}

		try {
			const voteData = {
				user_id: user.id,
				user_email: user.email,
				is_top10: vote,
				temperature: weatherData.temperature,
				conditions: weatherData.conditions,
				humidity: weatherData.humidity,
				wind_speed: weatherData.windSpeed,
				uv_index: weatherData.uvIndex,
				feels_like: weatherData.feelsLike,
				pressure: weatherData.pressure,
				visibility: weatherData.visibility,
				location: weatherData.location,
				user_agent: navigator.userAgent,
				is_manual_entry: weatherData.isManualEntry || false
			};

			const { error } = await supabase
				.from('weather_votes')
				.insert([voteData]);

			if (error) {
				throw new Error('❌ Supabase error details:', error.message);
			}

			setVotedToday(true);
			loadTodaysStats()

		} catch (error) {
			console.error('❌ Vote submission error:', error);
		}
    } 

	const loadTodaysStats = async () => {
		try {
			const today = new Date().toISOString().split('T')[0];
			
			const { data, error } = await supabase
				.from('weather_votes')
				.select('is_top10')
				.eq('date', today);

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

	const checkIfVotedToday = async (user) => {
		if (!user) return;

		try {
			const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
			const { data, error } = await supabase
			.from('weather_votes')
			.select('id')
			.eq('user_id', user.id)
			.eq('date', today);
			
			if (error) throw error;
			
			setVotedToday(data.length > 0);
		} catch (error) {
			console.error('❌ Error checking vote status:', error);
		}
	};

	useEffect(() => {
		loadTodaysStats()
	}, [])

	useEffect(() => {
		const getSession = async () => {
			const { data: { session } } = await supabase.auth.getSession();
			if (session?.user) {
				setUserName(session.user.user_metadata?.name || session.user.email);
				setLoggedIn(true);
				setUser(session.user)
				await checkIfVotedToday(session.user);
			}
		};
		
		getSession();
		
		const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
			if (session?.user) {
			setUserName(session.user.user_metadata?.name || session.user.email);
			setLoggedIn(true);
			setUser(session.user)
			await checkIfVotedToday(session.user);
		} else {
			setUserName(null);
			setLoggedIn(false);
			setVotedToday(false);
			setUser(null)
		}
		});

		return () => {
			listener.subscription.unsubscribe();
		};
	}, []);

	return (
		<AuthContext.Provider
			value={{
				loggedIn,
				userName,
				votedToday,
				todaysVotesData,
				setUserName,
				setVotedToday,
				signUp,
				signIn,
				signOut,
				submitVote
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
