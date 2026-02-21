"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import styles from './auth.module.css';

interface AuthFormProps {
    type: 'login' | 'signup';
}

export default function AuthForm({ type }: AuthFormProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { refreshUser } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const endpoint = type === 'login' ? '/api/auth/login' : '/api/auth/signup';
            const body = type === 'login' ? { email, password } : { name, email, password };

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            await refreshUser();

            // Attempt to retrieve intended destination from sessionStorage if we came from checkout
            const returnUrl = sessionStorage.getItem('urbans_return_url');
            if (returnUrl) {
                sessionStorage.removeItem('urbans_return_url');
                router.push(returnUrl);
            } else {
                router.push('/');
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            {error && <div className={styles.error}>{error}</div>}

            {type === 'signup' && (
                <div className={styles.inputGroup}>
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

            <div className={styles.inputGroup}>
                <label htmlFor="email">Email Address</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hello@example.com"
                    required
                />
            </div>

            <div className={styles.inputGroup}>
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

            <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'PROCESSING...' : (type === 'login' ? 'LOGIN' : 'SIGN UP')}
            </button>
        </form>
    );
}
