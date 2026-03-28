"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import styles from './auth.module.css';

interface AuthFormProps {
    type: 'login' | 'signup';
}

type AuthStep = 'email' | 'password' | 'google' | 'signup';

export default function AuthForm({ type }: AuthFormProps) {
    const [step, setStep] = useState<AuthStep>('email');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const router = useRouter();
    const { refreshUser } = useAuth();

    const finishAuth = async () => {
        await refreshUser();
        const returnUrl = sessionStorage.getItem('urbans_return_url');
        if (returnUrl) {
            sessionStorage.removeItem('urbans_return_url');
            router.push(returnUrl);
        } else {
            router.push('/');
        }
    };

    const handleEmailCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch('/api/auth/check-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            if (!data.exists) {
                setStep('signup'); // Proceed to manual signup
            } else if (data.provider === 'google') {
                setStep('google'); // Explicitly lock to Google Login
            } else {
                setStep('password'); // Render manual password field
            }
        } catch (err: any) {
            setError(err.message || 'Failed to verify email');
        } finally {
            setLoading(false);
        }
    };

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const endpoint = step === 'signup' ? '/api/auth/signup' : '/api/auth/login';
            const body = step === 'signup' ? { name, email, password } : { email, password };

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Authentication failed');

            await finishAuth();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setError('');
        setLoading(true);
        try {
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: credentialResponse.credential })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Google authentication failed');

            await finishAuth();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    // --- Render Google Step ---
    if (step === 'google') {
        return (
            <div className={styles.formContainer} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', alignItems: 'center' }}>
                <button type="button" onClick={() => setStep('email')} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <ArrowLeft size={16} /> Back
                </button>
                <div style={{ textAlign: 'center', color: '#fff', fontSize: '1.1rem', fontWeight: 'bold' }}>
                    This account uses Google
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>
                    Please click below to continue signing in securely.
                </div>
                
                {error && <div className={styles.error} style={{ width: '100%' }}>{error}</div>}
                
                <div style={{ pointerEvents: loading ? 'none' : 'auto', opacity: loading ? 0.7 : 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google authentication failed. Please try again.')}
                        theme="outline" 
                        shape="rectangular"
                        text={type === 'login' ? 'continue_with' : 'signin_with'}
                        size="large"
                    />
                </div>
            </div>
        );
    }

    // --- Render Standard/Password/Signup Steps ---
    return (
        <form className={styles.form} onSubmit={step === 'email' ? handleEmailCheck : handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
            {step !== 'email' && (
                <button type="button" onClick={() => setStep('email')} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', padding: 0, marginBottom: '0.5rem' }}>
                    <ArrowLeft size={16} /> Back
                </button>
            )}

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.inputGroup}>
                <label htmlFor="email">Email Address</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hello@example.com"
                    required
                    readOnly={step !== 'email'}
                    style={step !== 'email' ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                />
            </div>

            {step === 'signup' && (
                <div className={styles.inputGroup} style={{ animation: 'fadeIn 0.3s' }}>
                    <label htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required
                    />
                </div>
            )}

            {(step === 'password' || step === 'signup') && (
                <div className={styles.inputGroup} style={{ animation: 'fadeIn 0.3s' }}>
                    <label htmlFor="password">Password</label>
                    <div className={styles.passwordWrapper}>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            className={styles.passwordToggle}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>
            )}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'PROCESSING...' : (step === 'email' ? 'CONTINUE' : (step === 'signup' ? 'CREATE ACCOUNT' : 'LOGIN'))}
            </button>

            {step === 'email' && (
                <>
                    <div className={styles.divider}>OR</div>
                    <div className={styles.googleBtnWrapper} style={{ pointerEvents: loading ? 'none' : 'auto', opacity: loading ? 0.7 : 1 }}>
                        <div style={loading ? { display: 'none' } : { width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError('Google authentication failed.')}
                                theme="outline" 
                                shape="rectangular"
                                text={type === 'login' ? 'continue_with' : 'signup_with'}
                                size="large"
                            />
                        </div>
                    </div>
                </>
            )}
        </form>
    );
}
