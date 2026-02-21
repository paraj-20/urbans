"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from '@/components/auth.module.css';

export default function SettingsPage() {
    const { user, refreshUser, logout } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ text: '', type: '' });
    const router = useRouter();

    if (!user) {
        if (typeof window !== 'undefined') router.push('/login');
        return null;
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMsg({ text: '', type: '' });

        try {
            const res = await fetch('/api/user/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name || undefined, password: password || undefined })
            });
            if (res.ok) {
                setMsg({ text: 'Settings updated successfully', type: 'success' });
                setPassword('');
                await refreshUser();
            } else {
                const data = await res.json();
                setMsg({ text: data.error || 'Update failed', type: 'error' });
            }
        } catch {
            setMsg({ text: 'An error occurred', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to permanently delete your account?')) return;

        try {
            const res = await fetch('/api/user/settings', { method: 'DELETE' });
            if (res.ok) {
                await logout();
                router.push('/');
            }
        } catch {
            setMsg({ text: 'Delete failed', type: 'error' });
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h2>ACCOUNT SETTINGS</h2>
                    <p>Update your personal details below.</p>
                </div>

                {msg.text && (
                    <div className={styles.error} style={{ background: msg.type === 'success' ? 'rgba(0,255,148,0.1)' : '', color: msg.type === 'success' ? 'var(--accent)' : '#ff4444' }}>
                        {msg.text}
                    </div>
                )}

                <form className={styles.form} onSubmit={handleUpdate}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="name">Username</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">New Password (optional)</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Leave blank to keep unchanged"
                        />
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? 'SAVING...' : 'SAVE CHANGES'}
                    </button>
                </form>

                <div className={styles.footerRow} style={{ marginTop: '1rem' }}>
                    <p>Danger zone: <button onClick={handleDelete} style={{ background: 'none', border: 'none', color: '#ff4444', textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'inherit' }}>Delete Account</button></p>
                </div>
            </div>
        </div>
    );
}
