
import { useRef, KeyboardEvent, ClipboardEvent } from "react"

type Props = {
    handleSubmit: (e: any) => void
    setOtp: (value: string) => void
    loading: boolean
}

export const OtpForm = ({ handleSubmit, setOtp, loading }: Props) => {
    const inputsRef = useRef<Array<HTMLInputElement | null>>([])

    const update = (vals: string[]) => {
        setOtp(vals.join(""))
    }

    const getValues = () =>
        inputsRef.current.map((el) => el?.value ?? "")

    const handleChange = (index: number, value: string) => {
        const sanitized = value.replace(/\D/g, "").slice(-1)
        const el = inputsRef.current[index]
        if (el) el.value = sanitized
        update(getValues())

        if (sanitized && index < 5) {
            inputsRef.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !inputsRef.current[index]?.value && index > 0) {
            inputsRef.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
        pasted.split("").forEach((char, i) => {
            if (inputsRef.current[i]) {
                inputsRef.current[i]!.value = char
            }
        })
        update(getValues())

        const nextEmpty = pasted.length < 6 ? pasted.length : 5
        inputsRef.current[nextEmpty]?.focus()
    }

    return (
        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <label className="block mb-2 text-sm font-medium text-gray-900">
                Your OTP Code
            </label>
            <div className="flex gap-2 justify-center">
                {Array.from({ length: 6 }).map((_, i) => (
                    <input
                        key={i}
                        ref={(el) => { inputsRef.current[i] = el }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        className="w-12 h-12 text-center text-xl font-semibold bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 outline-none"
                        onChange={(e) => handleChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        onPaste={handlePaste}
                    />
                ))}
            </div>
            <button
                type="submit"
                className="w-full text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer disabled:opacity-60"
                disabled={loading}
            >
                {loading ? "Confirming Code..." : "Confirm Code"}
            </button>
        </form>
    )
}
