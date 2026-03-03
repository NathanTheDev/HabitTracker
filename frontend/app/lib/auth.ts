
import api, { setAccessToken } from "./axios";

export async function authenticate(email: string) {
    const res = await api.post('http://localhost:3001/auth/authenticate', {
        email
    });

    return res.data;
};

export async function magic(email: string, token: string) {
    const res = await api.post('http://localhost:3001/auth/magic', {
        email, otp: token
    });

    console.log("token", res.data);
    setAccessToken(res.data.accessToken);


    const response = await api.get('http://localhost:3001/user/me');
    console.log(response.data);
};

