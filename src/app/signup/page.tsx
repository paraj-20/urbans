import styles from '@/components/auth.module.css';
import Link from 'next/link';
import AuthForm from '@/components/AuthForm';

export default function SignupPage() {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h2>JOIN URBANS</h2>
                    <p>Create an account to complete checkout and manage your preferences.</p>
                </div>
                <AuthForm type="signup" />
                <div className={styles.footerRow}>
                    <p>Already have an account? <Link href="/login">Log in</Link></p>
                </div>
            </div>
        </div>
    );
}
