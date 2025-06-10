import { useContext, useState } from "react"
import { AuthContext } from "../components/authcontext";
import { useSearchParams, useNavigate } from "react-router-dom";

export const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const {confirmPasswordReset} = useContext(AuthContext)

    const accessToken = searchParams.get('access_token');

    const handleReset = async () => {
        if (!password) {
            setError('Please enter a new password');
            return;
        }

        if (!accessToken) {
            setError('Invalid or missing access token');
            return;
        }
        console.log(accessToken)

        const error = await confirmPasswordReset(password, accessToken);

        if (error) {
            setError(error.message);
            setMessage('');
        } else {
            setMessage('Password successfully updated! You can now sign in.');
            setError('');
            setPassword('');
            setTimeout(() => {
                navigate('/authentication');
            }, 3000);
        }
    };

    const style = {
        inputGroup: {
            marginBottom: '16px',
        },
        label: {
            display: 'block',
            color: '#4a5568',
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: '6px',
        },
        input: {
            width: '100%',
            padding: '12px 16px',
            border: '2px solid #e2e8f0',
            borderRadius: '10px',
            fontSize: '16px',
            background: 'white',
        },
        authBtn: {
            width: '100%',
            background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
            color: 'white',
            border: 'none',
            padding: '14px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: '12px',
        },
        message: {
            color: 'green',
        },
        error: {
            color: 'red',
        },
    };

    return (
        <div>
            <h3 style={{ textAlign: 'center', marginBottom: '16px', color: '#2d3748' }}>
                Choose a New Password
            </h3>
            <div style={style.inputGroup}>
                <label style={style.label}>New Password</label>
                <input
                    style={style.input}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your new password"
                    required
                />
            </div>
            <button style={style.authBtn} onClick={handleReset}>
                Update Password
            </button>
            {message && <p style={style.message}>{message}</p>}
            {error && <p style={style.error}>{error}</p>}
        </div>
    );
}

const ForgotPassword = (props) => {
    const {toggleView} = props
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const {resetPassword} = useContext(AuthContext)

    const handleReset = async () => {
        const error  = await resetPassword(email)
        if (error) {
            setError(error.message);
            setMessage('');
        } else {
            setMessage('Password reset email sent! Check your inbox.');
            setError('');
        }
    };

    const style = {
        inputGroup: {
            marginBottom: '16px',
        },
        label: {
            display: 'block',
            color: '#4a5568',
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: '6px',
        },
        input: {
            width: '100%',
            padding: '12px 16px',
            border: '2px solid #e2e8f0',
            borderRadius: '10px',
            fontSize: '16px',
            background: 'white',
        },
        authBtn: {
            width: '100%',
            background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
            color: 'white',
            border: 'none',
            padding: '14px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: '12px',
        },
        toggleButton: {
            background: 'none',
            border: 'none',
            color: '#4299e1',
            fontWeight: 600,
            cursor: 'pointer',
            textDecoration: 'underline',
            padding: 0,
            fontSize: '14px',
        },
        message: {
            color: 'green',
        },
        error: {
            color: 'red',
        },
    };

    return (
        <div>
            <h3 style={{ textAlign: 'center', marginBottom: '16px', color: '#2d3748' }}>
                Forgot your password?
            </h3>
            <div style={style.inputGroup}>
                <label style={style.label}>Email</label>
                <input
                    style={style.input}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                />
            </div>
            <button style={style.authBtn} onClick={handleReset}>
                Send Reset Email
            </button>
            {message && <p style={style.message}>{message}</p>}
            {error && <p style={style.error}>{error}</p>}
            <div style={{ textAlign: 'center' }}>
                <button style={style.toggleButton} onClick={toggleView}>
                    Back to Sign In
                </button>
            </div>
        </div>
    );
};

const SignUp = (props) => {
    const {toggleView} = props
    const { signUp } = useContext(AuthContext);
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();

    const handleSignUp = async () => {
        try {
            const { user } = await signUp(email, password, name);
            if (user) {
                navigate('/')
                alert("Signed up successfully! Check your email for a verification email to confirm sign up!");
            }
        } catch (error) {
            setEmail('')
            setName('')
            setPassword('')
            alert(error.message);
        }
    };

    const style = {
        inputGroup: {
            marginBottom: '16px',
        },
        label: {
            display: 'block',
            color: '#4a5568',
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: '6px',
        },
        input: {
            width: '100%',
            padding: '12px 16px',
            border: '2px solid #e2e8f0',
            borderRadius: '10px',
            fontSize: '16px',
            background: 'white',
            transition: 'border-color 0.2s',
            // note: inline styles can’t do :focus styles,
            // you’d have to handle focus styles via CSS or JS
        },
        authBtn: {
            width: '100%',
            background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
            color: 'white',
            border: 'none',
            padding: '14px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            marginBottom: '12px',
        },
        authToggle: {
            textAlign: 'center',
            color: '#4a5568',
            fontSize: '14px',
        },
        toggleButton: {
            background: 'none',
            border: 'none',
            color: '#4299e1',
            fontWeight: 600,
            cursor: 'pointer',
            textDecoration: 'underline',
            padding: 0,
            fontSize: '14px',
        },
        heading: {
            textAlign: 'center',
            marginBottom: '16px',
            color: '#2d3748',
        },
    };

    return(
        <div>
            <h3 style={{textAlign: 'center', marginBottom: '16px', color: '#2d3748'}}>Join the Community!</h3>
            <div style={style.inputGroup}>
                <label style={style.label} for="signupName">Name</label>
                <input style={style.input} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
            </div>
            <div style={style.inputGroup}>
                <label style={style.label} for="signupEmail">Email</label>
                <input style={style.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required />
            </div>
            <div style={style.inputGroup}>
                <label style={style.label} for="signupPassword">Password</label>
                <input style={style.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Choose a password" required />
            </div>
            <button style={style.authBtn} onClick={handleSignUp}>Create Account</button>
            <div style={style.authToggle}>
                Already have an account? <button style={style.toggleButton} onClick={toggleView}> Sign in here</button>
            </div>
        </div>

    )
};

const SignIn = (props) => {
    const {toggleView, goToForgot} = props
    const { signIn } = useContext(AuthContext);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();

    const handleSignIn = async () => {
        try {
            const { user } = await signIn(email, password);
            if (user) {
                navigate('/')
            }
        } catch (error) {
            setEmail('')
            setPassword('')
            alert(error.message);
        }
    }

    const style = {
        inputGroup: {
            marginBottom: '16px',
        },
        label: {
            display: 'block',
            color: '#4a5568',
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: '6px',
        },
        input: {
            width: '100%',
            padding: '12px 16px',
            border: '2px solid #e2e8f0',
            borderRadius: '10px',
            fontSize: '16px',
            background: 'white',
            transition: 'border-color 0.2s',
            // note: inline styles can’t do :focus styles,
            // you’d have to handle focus styles via CSS or JS
        },
        authBtn: {
            width: '100%',
            background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
            color: 'white',
            border: 'none',
            padding: '14px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            marginBottom: '12px',
        },
        authToggle: {
            textAlign: 'center',
            color: '#4a5568',
            fontSize: '14px',
        },
        toggleButton: {
            background: 'none',
            border: 'none',
            color: '#4299e1',
            fontWeight: 600,
            cursor: 'pointer',
            textDecoration: 'underline',
            padding: 0,
            fontSize: '14px',
        },
        heading: {
            textAlign: 'center',
            marginBottom: '16px',
            color: '#2d3748',
        },
    };

    return (
        <div>
            <h3 style={style.heading}>Welcome Back!</h3>
            <div style={style.inputGroup}>
                <label style={style.label}>Email</label>
                <input style={style.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required/>
            </div>
            <div style={style.inputGroup}>
                <label style={style.label}>Password</label>
                <input style={style.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" required />
            </div>
            <button style={style.authBtn} type="submit" onClick={handleSignIn}>Sign In</button>
            <div style={style.authToggle}>
                <button style={style.toggleButton} type="button" onClick={goToForgot}>Forgot Password?</button>
            </div>
            <div style={style.authToggle}>Don't have an account? {' '}
                <button style={style.toggleButton} type="button" onClick={toggleView}>Create one here</button>
            </div>
        </div>
    )
};

export const Authentication = () => {
    const [authView, setAuthView] = useState('signIn'); 

    const style = {
        authSection: {
            background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(226, 232, 240, 0.5)',
        },
    }

    return(
        <div style={style.authSection}>
            {authView === 'signIn' && <SignIn toggleView={() => setAuthView('signUp')} goToForgot={() => setAuthView('forgot')} />}
            {authView === 'signUp' && <SignUp toggleView={() => setAuthView('signIn')} />}
            {authView === 'forgot' && <ForgotPassword toggleView={() => setAuthView('signIn')} />}
        </div>
        
    )
};