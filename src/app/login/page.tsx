import styles from '@/components/auth.module.css';
import Link from 'next/link';
import AuthForm from '@/components/AuthForm';

export default function LoginPage() {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h2>WELCOME BACK</h2>
                    <p>Enter your details to access your account.</p>
                </div>
                <AuthForm type="login" />
                <div className={styles.footerRow}>
                    <p>Don't have an account? <Link href="/signup">Sign up</Link></p>
                </div>
            </div>
        </div>
    );
}
