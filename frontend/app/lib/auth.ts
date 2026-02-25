import api, { setAccessToken } from "./axios";

export async function authenticate(email: string) {
    const res = await api.post('http://localhost:3001/auth/authenticate', {
        email
    });

    if (!res.ok) throw new Error('Login failed');
    return res.json();
};

export async function magic(email: string, token: number) {
    const res = await api.post('http://localhost:3001/auth/magic', {
        email, otp
    });
    if (!res.ok) throw new Error('Login failed');

    setAccessToken(res.data.accessToken);


    const response = await axios.get('http://localhost:3001/user/me');
    console.log(response);
};
