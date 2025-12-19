import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getMe, logoutApi } from "./api";
import { useNavigate } from "react-router-dom";

interface User {
    id: number;
    name: string;
    email: string;
    role: "OWNER" | "SAMITI" | "FARMER" | "DISTRIBUTOR" | "LOGISTICS";
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await getMe();
                setUser(res);
            } catch (error) {
                console.error("Auth check failed", error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = (token: string, userData: User) => {
        setUser(userData);
        // Token is handled by httpOnly cookie, but we can store user data if needed
        // Redirect based on role
        switch (userData.role) {
            case "OWNER":
                navigate("/admin/dashboard");
                break;
            case "SAMITI":
                navigate("/samiti/dashboard");
                break;
            case "FARMER":
                navigate("/farmer/dashboard");
                break;
            case "DISTRIBUTOR":
                navigate("/distributor/dashboard");
                break;
            case "LOGISTICS":
                navigate("/logistics/dashboard");
                break;
            default:
                navigate("/");
        }
    };

    const logout = async () => {
        try {
            await logoutApi();
            setUser(null);
            navigate("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
