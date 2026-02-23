
type Props = {
    handleSubmit: (e: any) => void
    setOtp: (value: string) => void
    loading: boolean
}

export const OtpForm = ({ handleSubmit, setOtp, loading }: Props) => {
    return (
        <form className="space-y-4 md:space-y-6" onSubmit={ handleSubmit }>

            <label className="block mb-2 text-sm font-medium text-gray-900">Your OTP Code</label>
            <input
                type="text"
                name="otp"
                id="otp"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder=""
                required={true}
                onChange={(e) => setOtp(e.target.value)}
            />

            <button
                type="submit"
                className="w-full text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center hover: cursor-pointer"
                disabled={loading}
            >
                {loading ? "Confirming Code..." : "Confirm Code"}
            </button>
        </form>
    );
};

