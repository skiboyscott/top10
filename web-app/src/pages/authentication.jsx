import { useContext, useState } from "react"
import { AuthContext } from "../components/authcontext";
import { useNavigate } from "react-router-dom";



/* const EmailConfirmation = () => {

    return(
        <div id="emailConfirmationScreen" class="auth-section hidden">
            <div style="text-align: center;">
                <div style="font-size: 64px; margin-bottom: 20px;">📧</div>
                <h2 style="color: #2d3748; margin-bottom: 16px; font-size: 24px;">Check Your Email!</h2>
                <p style="color: #4a5568; margin-bottom: 8px; font-size: 16px;">We've sent a confirmation link to:</p>
                <div style="background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%); color: white; padding: 12px 20px; border-radius: 12px; font-weight: 600; margin: 16px 0; display: inline-block; font-size: 16px;" id="confirmationEmailDisplay"></div>
                <p style="color: #4a5568; margin-bottom: 24px; line-height: 1.5;">Click the link in your email to activate your account and start voting on weather!</p>
                
                <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-top: 24px;">
                    <button class="auth-btn" onclick="backToLogin()" style="flex: 1; max-width: 200px; background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);">
                        ✅ Got it!
                    </button>
                    <button class="auth-btn" onclick="resendConfirmationEmail()" style="flex: 1; max-width: 200px; background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);">
                        📮 Resend Email
                    </button>
                </div>
                
                <p style="color: #718096; font-size: 14px; margin-top: 20px; line-height: 1.4;">
                    Don't see the email? Check your spam folder or try resending.<br/>
                    The confirmation link will expire in 24 hours.
                </p>
            </div>
        </div>

    )
} */

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
    const {toggleView} = props
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
            <div style={style.authToggle}>Don't have an account? {' '}
                <button style={style.toggleButton} type="button" onClick={toggleView}>Create one here</button>
            </div>
        </div>
    )
};

export const Authentication = () => {
    const [toggleSignIn, setToggleSignIn] = useState(false)

    const toggleView = () => {
        setToggleSignIn(!toggleSignIn)
    }

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
            {toggleSignIn ? 
                <SignUp {...{toggleView}} />
            :
                <SignIn {...{toggleView}} />
            }
        </div>
        
    )
};