import React, { createContext, useEffect, useState } from 'react';
import supabase from '../utils/supabaseClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [userAccount, setUserAccount] = useState(null)
	const [userName, setUserName] = useState(null);
	const [votedTodayData, setVotedTodayData] = useState({});
	const [locationDate, setLocationDate] = useState('')

	const signUp = async (email, password, name) => {
		if (email && password && name) {
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
			} else {
				throw new Error('Please provide email, password, and name');
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
            
            setUserName(data.user.user_metadata?.name || '');
			setUserAccount(data.user);
			return data;

        } catch (error) {
            console.error('❌ Login error:', error);
        }
    };

	const signOut = async () => {
		try {
			const { error } = await supabase.auth.signOut({ scope: 'local' });
				if (error) {
				return;
			}
			setUserName(null);
			setVotedTodayData({});
			setUserAccount(null);
		} catch (err) {
			console.error('Exception during sign out:', err);
		}
	};

	const resetPassword = async (email) => {
		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: 'https://top10weather/#/reset-password?type=recovery',
		});
		return error;
	};

    const submitVote = async (vote, weatherData) => {
		if (!weatherData) {
			return;
		}

		try {
			const voteData = {
				user_id: userAccount.id,
				user_email: userAccount.email,
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
				is_manual_entry: weatherData.isManualEntry || false,
				date: locationDate
			};

			const { error } = await supabase
				.from('weather_votes')
				.insert([voteData]);

			if (error) {
				throw new Error('❌ Supabase error details:', error.message);
			}

			checkIfVotedToday(userAccount)
		} catch (error) {
			console.error('❌ Vote submission error:', error);
		}
    }

	const changeVote = async () => {
		try {
			const { error } = await supabase
				.from('weather_votes')
				.delete()
				.eq('user_id', userAccount.id)
				.eq('date', locationDate)

			if (error) {
				throw new Error('❌ Error deleting vote: ' + error.message);
			}

			return true

		} catch (error) {
			console.error('❌ changeVote error:', error);
		}
	};

	const checkIfVotedToday = async (user) => {
		if (!user) return;

		try {
			const today = locationDate;
			const { data, error } = await supabase
			.from('weather_votes')
			.select('id, is_top10')
			.eq('user_id', user.id)
			.eq('date', today);
			
			if (error) throw error;
			if (data.length > 0) {
				setVotedTodayData(data[0]);
			}
			
		} catch (error) {
			console.error('❌ Error checking vote status:', error);
		}
	};

	useEffect(() => {
		if (userAccount && locationDate) {
			checkIfVotedToday(userAccount)
		}
	}, [userAccount, locationDate])

	useEffect(() => {
		const getSession = async () => {
			try {
				const { data: { session }, error } = await supabase.auth.getSession();
		
				if (error) {
					console.error('Error fetching session:', error);
				}
				
				if (session?.user) {
					setUserName(session.user.user_metadata?.name || session.user.email);
					
					setUserAccount(session.user);
				} else {
					setUserName(null);
					
					setUserAccount(null);
				}
			} catch (err) {
				console.error('Exception in getSession:', err);
			}
		};
		
		getSession();

		if (locationDate) {
			
			const { data: listener } = supabase.auth.onAuthStateChange( (_event, session) => {
				if (session?.user) {
					setUserName(session.user.user_metadata?.name || session.user.email);
					setUserAccount(session.user)
				} else {
					setUserName(null);
					setUserAccount(null)
				}
			});
			
			return () => {
				listener.subscription.unsubscribe();
			};
		}
	}, [locationDate]);

	return (
		<AuthContext.Provider
			value={{
				userName,
				votedTodayData,
				locationDate,
				setUserName,
				setVotedTodayData,
				signUp,
				signIn,
				signOut,
				resetPassword,
				submitVote,
				changeVote,
				setLocationDate
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
