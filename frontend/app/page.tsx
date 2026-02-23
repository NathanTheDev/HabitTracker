
'use client';

import { useState } from 'react';
import axios from 'axios';
import { EmailForm } from './compnents/auth/email';
import { OtpForm } from './compnents/auth/otp';

export default function Auth() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState('email');

    const handleEmailSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post('http://localhost:3001/auth/authenticate', {
                email: email,
            });

            setStep('otp');

        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post('http://localhost:3001/auth/magic', {
                email, otp
            });

            console.log("WOOOOOOOOOOOOOOOOOOO");

        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen bg-neutral-200">
            <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                        {step === 'email' ? 'Sign in to your account' : 'Confirm your OTP code'}
                    </h1>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {step === 'email' ? (
                        <EmailForm handleSubmit={handleEmailSubmit} setEmail={setEmail} loading={loading} />
                    ) : (
                            <OtpForm handleSubmit={handleOtpSubmit} setOtp={setOtp} loading={loading} />
                        )}

                </div>
            </div>
        </div>
    );
}

