import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface User {
    id: number;
    username: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await axios.get('/api/check-session');
                if (response.data.isAuthenticated) {
                    setIsAuthenticated(true);
                    setUser(response.data.user);
                }
            } catch (error) {
                console.error('Failed to check session:', error);
            }
        };

        checkSession();
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const response = await axios.post('/api/login', { username, password });
            if (response.data.success) {
                setIsAuthenticated(true);
                setUser(response.data.user);
                router.push('/');
            }
        } catch (error) {
            console.error('Failed to login:', error);
        }
    };

    const logout = async () => {
        try {
            await axios.post('/api/logout');
            setIsAuthenticated(false);
            setUser(null);
            router.push('/login');
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
