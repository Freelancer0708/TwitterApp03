import type { AppProps } from 'next/app';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import '../styles/styles.css';

const NavBar = () => {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <div className='navlist'>
            <Link href="/" className='navbtn'>Home</Link>
            {isAuthenticated ? (
                <>
                    <span className='navbtn'>Welcome, {user?.username}</span>
                    <button onClick={logout} className='navbtn'>Logout</button>
                </>
            ) : (
                <Link href="/login" className='navbtn'>Login</Link>
            )}
        </div>
    );
};

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (router.pathname === '/login' && isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    return <>{children}</>;
};

export default function App({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
            <NavBar />
            <AuthGuard>
                <Component {...pageProps} />
            </AuthGuard>
        </AuthProvider>
    );
}
