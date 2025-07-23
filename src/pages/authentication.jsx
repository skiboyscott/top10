import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../components/authcontext";
import { useNavigate } from "react-router-dom";
import supabase from "../utils/supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const containerStyle = `bg-white rounded-2xl p-5 border border-gray-200/50 sm:min-w-[325px] md:min-w-[400px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.45)]`
const pageStyle = "flex min-h-screen flex-col justify-start items-center sm:pt-2 md:pt-24"

const Title = (props) => {
    const {text} = props

    return(
        <h3 className="text-center text-2xl font-semibold text-gray-800 mb-4">{text}</h3>
    )
}

const LabeledInput = (props) => {
    const {label, type, value, onChange, placeholder, required} = props
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const actualType = isPassword && showPassword ? "text" : type;

    return(
        <div className="flex flex-col mb-4">
            <label className="text-lg font-medium text-gray-600 mb-3">{label}</label>
            {isPassword ? (
                <div className="relative">
                    <input type={actualType} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} className="px-4 py-3 border-2 border-gray-300 rounded-lg text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 w-full pr-12" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className=" absolute inset-y-0 right-0 p-3 pr-4 flex items-center text-gray-500">
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                </div>
            ) : (
                <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} className="px-4 py-3 border-2 border-gray-300 rounded-lg text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-400" />
            )}
        </div>
    )
}

const Button = (props) => {
    const {text} = props

    return(
        <button type={'submit'} className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 rounded-lg text-base font-semibold hover:opacity-90 transition my-4">
            {text}
        </button>
    )
}

const AuthToggle = (props) => {
    const {text, link, buttonText} = props
    const navigate = useNavigate();

    return(
        <div class="text-center text-gray-600 text-sm m-1">
            {text && text} <button type="button" class="text-blue-400 font-semibold underline cursor-pointer text-sm p-0 bg-transparent border-none" onClick={() => navigate(link)}> {buttonText}</button>
        </div>
    )
}

const Message = (props) => {
    const {message} = props

    return(
        message && <p className="text-green-600 text-sm text-center">{message}</p>
    )
}

const Error = (props) => {
    const {error} = props

    return(
        error && <p className="text-green-600 text-sm text-center">{error}</p>
    )
}

export const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const processResetLink = async () => {
            const hash = window.location.hash.substring(1);
            const params = new URLSearchParams(hash);

            const access_token = params.get('access_token');
            const refresh_token = params.get('refresh_token');

            if (access_token && refresh_token) {
                const { error } = await supabase.auth.setSession({
                    access_token,
                    refresh_token,
                });

                if (error) {
                    console.error('Error setting session:', error.message);
                }
            } else {
                console.error('Missing tokens in URL');
            }
        };

        processResetLink();
    }, []);

    const handleReset = async (event) => {
        event.preventDefault();
        if (!password) {
            setError('Please enter a new password');
            return;
        }

        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            setError(error.message);
            setMessage('');
        } else {
            setMessage('Password successfully updated! You can now sign in.');
            setError('');
            setPassword('');
            setTimeout(() => {
                navigate('/sign-in');
            }, 3000);
        }
    };

    return (
        <div class={pageStyle}>
            <div className={containerStyle}>
                <form onSubmit={handleReset}>
                    <Title text={'Choose a New Password'} />
                    <LabeledInput label={'New Password'} type={'password'} value={password} onChange={setPassword} placeholder={'Enter your new password'} required={true} />
                    <Button text={'Update Password'} />
                    <Message message={message} />
                    <Error error={error} />
                </form>
            </div>
        </div>
    );
};

export const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const {resetPassword} = useContext(AuthContext)

    const handleReset = async (e) => {
        e.preventDefault(); 
        const error  = await resetPassword(email)
        if (error) {
            setError(error.message);
            setMessage('');
        } else {
            setMessage('Password reset email sent! Check your inbox.');
            setError('');
            setEmail('')
        }
    };

    return (
        <div class={pageStyle}>
            <div className={containerStyle}>
                <form onSubmit={handleReset}>
                    <Title text={'Forgot your password?'} />
                    <LabeledInput label={'Email'} type={"email"} value={email} onChange={setEmail} placeholder={"your@email.com"} required />
                    <Button text={'Send Reset Email'} />
                    <Message message={message} />
                    <Error error={error} />
                    <AuthToggle link={'/sign-in'} buttonText={'Back to Sign In'} />
                </form>
            </div>
        </div>
    );
};

export const SignUp = () => {
    const { signUp } = useContext(AuthContext);
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    /* const [role, setRole] = useState(''); */
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault(); 
        try {
            const { user } = await signUp(email, password, name);
            if (user) {
                navigate('/')
                alert("Signed up successfully! Check your email for a verification email to confirm sign up!");
            }
        } catch (error) {
            console.log(error)
            /* setEmail('')
            setName('')
            setPassword('') 
            setRole('')*/
            alert('Error trying to sign up, please try again later.');
        }
    };

    return(
        <div class={pageStyle}>
            <div className={containerStyle}>
                <form onSubmit={handleSignUp}>
                    <Title text={'Sign Up!'} />
                    <LabeledInput label={'Name'} type={"text"} value={name} onChange={setName} placeholder={"Your Name"} required={true} />
                    <LabeledInput label={'Email'} type={"email"} value={email} onChange={setEmail} placeholder={"your@email.com"} required={true} />
                    <LabeledInput label={'Password'} type={"password"} value={password} onChange={setPassword} placeholder={"Your password"} required={true} />
                    <Button text={'Create Account'} />
                    {/* <div style={style.inputGroup}>
                        <label style={style.label} htmlFor="signupRole">Role</label>
                        <select
                        style={style.input}
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                        >
                        <option value="">Select a role</option>
                        <option value="doctor">Doctor</option>
                        <option value="patient">Patient</option>
                        </select>
                        </div> */}
                    <AuthToggle text={'Already have an account?'} link={'/sign-in'} buttonText={'Sign in here'} />
                </form>
            </div>
        </div>

    )
};

export const SignIn = () => {
    const { signIn } = useContext(AuthContext);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault(); 
        try {
            const { user } = await signIn(email, password);
            if (user) {
                navigate('/')
            }
        } catch (error) {
            setEmail('')
            setPassword('')
            alert('Failed to login please try again later');
        }
    }

    return (
        <div class={pageStyle}>
            <div className={containerStyle}>
                <form onSubmit={handleSignIn}>
                    <Title text={'Welcome Back!'} />
                    <LabeledInput label={'Email'} type={"email"} value={email} onChange={setEmail} placeholder={"your@email.com"} required={true} />
                    <LabeledInput label={'Password'} type={"password"} value={password} onChange={setPassword} placeholder={"Your password"} required={true} />
                    <Button text={'Sign In'} />
                    <AuthToggle link={'/forgot-password'} buttonText={'Forgot Password?'} />
                    <AuthToggle text={'No account?'} link={'/sign-up'} buttonText={'Create one here'} />
                </form>
            </div>
        </div>
    )
};


