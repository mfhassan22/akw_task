import { ref, unref, Ref } from 'vue';
import { defineStore } from 'pinia';
import FilesContract from '../contract/FilesContract'
import UserContract from '../contract/UserContract';
// Define interfaces for the user and payload
interface User {
    id: number;
    name: string;
    email: string;
    isAdmin: boolean;
}

interface LoginPayload {
    email: string;
    password: string;
}

interface RegisterPayload {
    email: string;
    password: string;
}

interface AuthResult {
    token: string;
    user: User;
}

export const useUserStore = defineStore('auth', () => {
    const user: Ref<User | null> = ref(null);
    const token: Ref<string | null> = ref(localStorage.getItem('token'));
    const users: Ref<UserContract[] | null> = ref(null);

    async function api(method: string, url: string, payload: Record<string, any> = {}): Promise<any> {
        const response = await fetch(`http://localhost:3333${url}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.value}`
            },
            body: method !== 'GET' ? JSON.stringify(unref(payload)) : null
        });
        return response.json();
    }

    function authenticate(result: AuthResult) {
        token.value = result.token;
        localStorage.setItem('token', token.value);
    }

    async function login(payload: LoginPayload) {
        const result: AuthResult = await api('POST', '/login', payload);
        authenticate(result);
    }

    async function register(payload: RegisterPayload) {
        const result: AuthResult = await api('POST', '/register', payload);
        authenticate(result);
    }

    async function logout() {
        await api('DELETE', '/logout');
        token.value = null;
        user.value = null;
        localStorage.removeItem('token');
    }

    async function userInfo(): Promise<User | null> {
        const result: { user: User } = await api('GET', '/user');
        user.value = result.user;
        return user.value;
    }

    async function userFiles(user_id: number | null): Promise<FilesContract[]> {
        const result: FilesContract[] = (await api('GET', '/userfiles/' + user_id)).data;
        return result;
    }

    async function usersList(): Promise<UserContract[]> {
        const result: UserContract[] = (await api('GET', '/users')).data;
        return result;
    }
    async function getUsersList() {
        users.value = await usersList();
    }

    async function changeUserRole(id: number) {
        await api('GET', '/users/role/' + id)
    }

    return { user, users, token, login, register, logout, userInfo, userFiles, getUsersList, changeUserRole };
});
