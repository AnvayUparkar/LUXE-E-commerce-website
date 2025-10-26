// Use dynamic API base URL from .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

interface User {
    id: number;
    username: string;
    email: string;
    budget: number;
}

interface Item {
    id: number;
    name: string;
    price: number;
    barcode: string;
    description: string;
}

export const marketApi = {
    // Get all market items
    getMarketItems: async (): Promise<Item[]> => {
        const response = await fetch(`${API_BASE_URL}/market`);
        if (!response.ok) {
            throw new Error('Failed to fetch market items');
        }
        return response.json();
    },

    // Register new user
    register: async (username: string, email: string, password: string): Promise<{ message: string; user_id: number }> => {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });
        if (!response.ok) {
            throw new Error('Registration failed');
        }
        return response.json();
    },

    // Login user
    login: async (username: string, password: string): Promise<{ message: string; user: User }> => {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        if (!response.ok) {
            throw new Error('Login failed');
        }
        return response.json();
    },

    // Purchase item
    purchaseItem: async (itemId: number, userId: number): Promise<{ message: string; new_budget: number }> => {
        const response = await fetch(`${API_BASE_URL}/purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ item_id: itemId, user_id: userId }),
        });
        if (!response.ok) {
            throw new Error('Purchase failed');
        }
        return response.json();
    },

    // Sell item
    sellItem: async (itemId: number, userId: number): Promise<{ message: string; new_budget: number }> => {
        const response = await fetch(`${API_BASE_URL}/sell`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ item_id: itemId, user_id: userId }),
        });
        if (!response.ok) {
            throw new Error('Sale failed');
        }
        return response.json();
    },
};