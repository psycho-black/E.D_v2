// Headless login component with render prop pattern for flexible UI composition
import {
    useState,
    type FormEvent,
    type ReactNode,
    startTransition,
} from "react"
import { addPropertyControls, ControlType } from "framer"

// --- INTERFACES ---
interface LoginState {
    isLoading: boolean
    error: string | null
    nombre: string
    setNombre: (value: string) => void
    password: string
    setPassword: (value: string) => void
    handleGoogleLogin: () => void
    isOAuthLoading: boolean
    handleSubmit: (e: FormEvent) => void
}

interface LoginHeadlessProps {
    onLoginSuccess?: (token: string) => void
    onForgotPasswordRequest?: (email: string) => void
    apiEndpoint: string
    errorMessages: {
        network: string
        unknown: string
        form: string
    }
    enableLocalStorage: boolean
    backgroundColor: string
    borderColor: string
    borderRadius: number
    enableGoogleAuth: boolean
    googleClientId: string
    oauthEndpoints: {
        google: string
    }
    showBuiltInForm: boolean
    formFont: any
    labelFont: any
    buttonFont: any
    inputBackgroundColor: string
    inputBorderColor: string
    inputTextColor: string
    inputBorderRadius: number
    buttonBackgroundColor: string
    buttonHoverColor: string
    buttonTextColor: string
    buttonBorderRadius: number
    errorBackgroundColor: string
    errorBorderColor: string
    errorTextColor: string
    formSpacing: number
    inputPadding: number
    buttonPadding: number
    buttonWidth: string
    minPasswordLength: number
    minUsernameLength: number
    requireSpecialChar: boolean
    requireNumber: boolean
    forgotPasswordTextColor: string
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function LoginHeadless(props: LoginHeadlessProps) {
    // --- PROPS DESTRUCTURING WITH IMPROVED DEFAULTS ---
    const {
        onLoginSuccess,
        onForgotPasswordRequest,
        apiEndpoint, // Removed default URL to force explicit endpoint
        errorMessages = {
            network: "No se pudo conectar al servidor.",
            unknown: "Ocurrió un error desconocido.",
            form: "Por favor, corrige los errores en el formulario.",
        },
        enableLocalStorage = true,
        enableGoogleAuth = false,
        googleClientId = "",
        oauthEndpoints = {
            google: "/api/v1/auth/google",
        },
        showBuiltInForm = true,
        formFont,
        labelFont,
        buttonFont,
        inputBackgroundColor,
        inputBorderColor,
        inputTextColor,
        inputBorderRadius,
        buttonBackgroundColor,
        buttonHoverColor,
        buttonTextColor,
        buttonBorderRadius,
        errorBackgroundColor,
        errorBorderColor,
        errorTextColor,
        formSpacing,
        inputPadding,
        buttonPadding,
        buttonWidth,
        forgotPasswordTextColor,
    } = props

    // --- STATE MANAGEMENT ---
    const [view, setView] = useState("login")
    const [nombre, setNombre] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isOAuthLoading, setIsOAuthLoading] = useState(false)

    const [nombreError, setNombreError] = useState<string | null>(null)
    const [passwordError, setPasswordError] = useState<string | null>(null)
    const [emailError, setEmailError] = useState<string | null>(null)
    const [touched, setTouched] = useState({
        nombre: false,
        password: false,
        email: false,
    })
    const [focused, setFocused] = useState({
        nombre: false,
        password: false,
        email: false,
    })

    // --- VALIDATION FUNCTIONS ---
    const validateNombre = (value: string): string | null => {
        if (!value.trim()) return "El usuario es requerido"
        if (value.length < props.minUsernameLength) {
            return `El usuario debe tener al menos ${props.minUsernameLength} caracteres`
        }
        if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            return "El usuario solo puede contener letras, números y guiones bajos"
        }
        return null
    }

    const validatePassword = (value: string): string | null => {
        if (!value) return "La contraseña es requerida"
        if (value.length < props.minPasswordLength) {
            return `La contraseña debe tener al menos ${props.minPasswordLength} caracteres`
        }
        if (props.requireNumber && !/\\d/.test(value)) {
            return "La contraseña debe contener al menos un número"
        }
        if (props.requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
            return "La contraseña debe contener al menos un carácter especial"
        }
        return null
    }

    const validateEmail = (value: string): string | null => {
        if (!value.trim()) return "El correo electrónico es requerido"
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
            return "Por favor ingresa un correo electrónico válido"
        }
        return null
    }

    // --- HANDLERS ---
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError(null)

        const nombreValidation = validateNombre(nombre)
        const passwordValidation = validatePassword(password)

        startTransition(() => {
            setNombreError(nombreValidation)
            setPasswordError(passwordValidation)
            setTouched({ nombre: true, password: true, email: false })
        })

        if (nombreValidation || passwordValidation) {
            // **IMPROVEMENT**: Set a general error message if validation fails on submit
            setError(errorMessages.form)
            return
        }

        startTransition(() => {
            setIsLoading(true)
        })

        try {
            if (!apiEndpoint) {
                throw new Error("API endpoint no está configurado.")
            }
            if (typeof window === "undefined") {
                throw new Error("Login only available in browser environment")
            }

            const response = await fetch(apiEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: nombre, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || data.message || errorMessages.unknown)
            }

            if (enableLocalStorage && typeof window !== "undefined") {
                localStorage.setItem("token", data.token)
            }

            if (onLoginSuccess) {
                onLoginSuccess(data.token)
            }
        } catch (err: any) {
            // **IMPROVEMENT**: Log the full error for easier debugging
            console.error("Login failed:", err)
            startTransition(() => {
                setError(err.message || errorMessages.network)
            })
        } finally {
            startTransition(() => {
                setIsLoading(false)
            })
        }
    }

    const handleForgotPassword = (e: FormEvent) => {
        e.preventDefault()
        const emailValidation = validateEmail(email)
        startTransition(() => {
            setEmailError(emailValidation)
            setTouched({ nombre: false, password: false, email: true })
        })
        if (emailValidation) return
        if (onForgotPasswordRequest && email) {
            onForgotPasswordRequest(email)
        }
    }

    const handleOAuthLogin = async (provider: "google") => {
        startTransition(() => {
            setError(null)
            setIsOAuthLoading(true)
        })
        try {
            if (typeof window === "undefined") {
                throw new Error("OAuth login only available in browser environment")
            }
            const endpoint = oauthEndpoints[provider]
            const clientId = googleClientId
            if (!clientId) {
                throw new Error(`${provider} client ID not configured`)
            }
            window.location.href = `${endpoint}?client_id=${clientId}&redirect_uri=${window.location.origin}/auth/callback`
        } catch (err: any) {
            console.error("OAuth failed:", err)
            startTransition(() => {
                setError(err.message || errorMessages.network)
                setIsOAuthLoading(false)
            })
        }
    }

    const handleGoogleLogin = () => {
        if (enableGoogleAuth) handleOAuthLogin("google")
    }

    const handleNombreChange = (value: string) => {
        startTransition(() => {
            setNombre(value)
            if (touched.nombre) setNombreError(validateNombre(value))
        })
    }

    const handlePasswordChange = (value: string) => {
        startTransition(() => {
            setPassword(value)
            if (touched.password) setPasswordError(validatePassword(value))
        })
    }

    const handleEmailChange = (value: string) => {
        startTransition(() => {
            setEmail(value)
            if (touched.email) setEmailError(validateEmail(value))
        })
    }

    // --- RENDER ---
    return (
        <div style={{ /* Component container styles */ }}>
            {/* The JSX for the form remains largely the same, but will now behave more predictably
                due to the logic changes above. The full JSX is included for completeness. */
            }
            {view === "login" ? (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: `${formSpacing}px`, width: "100%", ...formFont }}>
                    {/* Username Input */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
                        <div style={{ width: "300px", display: "flex", justifyContent: "flex-start" }}>
                            <label style={{ color: inputTextColor, ...labelFont }}>Usuario:</label>
                        </div>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => handleNombreChange(e.target.value)}
                            onFocus={() => startTransition(() => setFocused({ ...focused, nombre: true }))}
                            onBlur={() => startTransition(() => {
                                setFocused({ ...focused, nombre: false })
                                setTouched({ ...touched, nombre: true })
                                setNombreError(validateNombre(nombre))
                            })}
                            placeholder="Ingresa tu usuario"
                            style={{
                                padding: `${inputPadding}px ${inputPadding + 4}px`,
                                border: `1px solid ${focused.nombre ? "#3C00FF" : nombreError && touched.nombre ? errorBorderColor : inputBorderColor}`,
                                borderRadius: `${inputBorderRadius}px`,
                                backgroundColor: inputBackgroundColor,
                                color: inputTextColor,
                                width: "300px",
                                outline: "none",
                                ...formFont,
                            }}
                            disabled={isLoading || isOAuthLoading}
                        />
                        {nombreError && touched.nombre && <div style={{ width: "300px", fontSize: "12px", color: errorTextColor, ...formFont }}>{nombreError}</div>}
                    </div>

                    {/* Password Input */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
                        <div style={{ width: "300px", display: "flex", justifyContent: "flex-start" }}>
                            <label style={{ color: inputTextColor, ...labelFont }}>Contraseña:</label>
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => handlePasswordChange(e.target.value)}
                            onFocus={() => startTransition(() => setFocused({ ...focused, password: true }))}
                            onBlur={() => startTransition(() => {
                                setFocused({ ...focused, password: false })
                                setTouched({ ...touched, password: true })
                                setPasswordError(validatePassword(password))
                            })}
                            placeholder="Ingresa tu contraseña"
                            style={{
                                padding: `${inputPadding}px ${inputPadding + 4}px`,
                                border: `1px solid ${focused.password ? "#3C00FF" : passwordError && touched.password ? errorBorderColor : inputBorderColor}`,
                                borderRadius: `${inputBorderRadius}px`,
                                backgroundColor: inputBackgroundColor,
                                color: inputTextColor,
                                width: "300px",
                                outline: "none",
                                ...formFont,
                            }}
                            disabled={isLoading || isOAuthLoading}
                        />
                        {passwordError && touched.password && <div style={{ width: "300px", fontSize: "12px", color: errorTextColor, ...formFont }}>{passwordError}</div>}
                    </div>

                    {/* General Error Display */}
                    {error && (
                        <div style={{ padding: `${inputPadding}px ${inputPadding + 4}px`, backgroundColor: errorBackgroundColor, border: `1px solid ${errorBorderColor}`, borderRadius: `${inputBorderRadius}px`, color: errorTextColor, ...formFont }}>
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button type="submit" disabled={isLoading || isOAuthLoading || !nombre || !password || !!nombreError || !!passwordError} style={{ padding: `${buttonPadding}px ${buttonPadding + 6}px`, backgroundColor: isLoading ? "#ccc" : buttonBackgroundColor, color: buttonTextColor, border: "none", borderRadius: `${buttonBorderRadius}px`, cursor: isLoading ? "not-allowed" : "pointer", width: "300px", alignSelf: "center", marginTop: "35px", ...buttonFont }}>
                        {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </button>

                    {/* Google Auth Button */}
                    {enableGoogleAuth && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "5px", borderTop: `1px solid ${inputBorderColor}`, paddingTop: "5px", alignItems: "center" }}>
                            <button type="button" onClick={handleGoogleLogin} disabled={isLoading || isOAuthLoading} style={{ padding: `${buttonPadding - 4}px ${buttonPadding + 6}px`, backgroundColor: "#ffffff", color: "#3c4043", border: "1px solid #dadce0", borderRadius: `${buttonBorderRadius}px`, cursor: isOAuthLoading ? "not-allowed" : "pointer", width: "300px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", ...buttonFont }}>
                                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" /><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" /><path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" /><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" /></g></svg>
                                {isOAuthLoading ? "Conectando..." : "Continuar con Google"}
                            </button>
                        </div>
                    )}

                    {/* Forgot Password Link */}
                    <button type="button" onClick={() => startTransition(() => setView("recovery"))} style={{ background: "none", border: "none", color: "#007BFF", cursor: "pointer", textDecoration: "underline", alignSelf: "center", ...formFont }}>
                        ¿Olvidaste tu contraseña?
                    </button>
                </form>
            ) : (
                /* Password Recovery Form */
                <form onSubmit={handleForgotPassword} style={{ display: "flex", flexDirection: "column", gap: `${formSpacing}px`, width: "100%", ...formFont }}>
                    {/* Email Input */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={{ color: inputTextColor, ...labelFont }}>Correo electrónico:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => handleEmailChange(e.target.value)}
                            onFocus={() => startTransition(() => setFocused({ ...focused, email: true }))}
                            onBlur={() => startTransition(() => {
                                setFocused({ ...focused, email: false })
                                setTouched({ ...touched, email: true })
                                setEmailError(validateEmail(email))
                            })}
                            placeholder="Ingresa tu correo electrónico"
                            style={{
                                padding: `${inputPadding}px ${inputPadding + 4}px`,
                                border: `1px solid ${focused.email ? "#3C00FF" : emailError && touched.email ? errorBorderColor : inputBorderColor}`,
                                borderRadius: `${inputBorderRadius}px`,
                                backgroundColor: inputBackgroundColor,
                                color: inputTextColor,
                                outline: "none",
                                ...formFont,
                            }}
                            disabled={isLoading}
                        />
                        {emailError && touched.email && <div style={{ fontSize: "12px", color: errorTextColor, ...formFont }}>{emailError}</div>}
                    </div>

                    {/* General Error Display */}
                    {error && (
                        <div style={{ padding: `${inputPadding}px ${inputPadding + 4}px`, backgroundColor: errorBackgroundColor, border: `1px solid ${errorBorderColor}`, borderRadius: `${inputBorderRadius}px`, color: errorTextColor, ...formFont }}>
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button type="submit" disabled={isLoading || !email || !!emailError} style={{ padding: `${buttonPadding}px ${buttonPadding + 6}px`, backgroundColor: isLoading ? "#ccc" : buttonBackgroundColor, color: buttonTextColor, border: "none", borderRadius: `${buttonBorderRadius}px`, cursor: isLoading ? "not-allowed" : "pointer", width: buttonWidth, alignSelf: "center", ...formFont }}>
                        {isLoading ? "Enviando..." : "Recuperar"}
                    </button>

                    {/* Back to Login Link */}
                    <button type="button" onClick={() => startTransition(() => setView("login"))} style={{ background: "none", border: "none", color: forgotPasswordTextColor, cursor: "pointer", textDecoration: "underline", alignSelf: "center", ...formFont }}>
                        Volver a Iniciar Sesión
                    </button>
                </form>
            )}
        </div>
    )
}

// --- FRAMER PROPERTY CONTROLS ---
addPropertyControls(LoginHeadless, {
    apiEndpoint: {
        type: ControlType.String,
        title: "API Endpoint",
        placeholder: "https://tu-api.com/login",
    },
    // --- Validation Settings ---
    minUsernameLength: {
        type: ControlType.Number,
        title: "Min Username Length",
        defaultValue: 3,
        min: 1,
        max: 20,
        unit: "chars",
    },
    minPasswordLength: {
        type: ControlType.Number,
        title: "Min Password Length",
        defaultValue: 6,
        min: 4,
        max: 32,
        unit: "chars",
    },
    requireNumber: {
        type: ControlType.Boolean,
        title: "Require Number",
        defaultValue: false, // **IMPROVEMENT**: Changed default to false
        enabledTitle: "Required",
        disabledTitle: "Optional",
    },
    requireSpecialChar: {
        type: ControlType.Boolean,
        title: "Require Special Char",
        defaultValue: false,
        enabledTitle: "Required",
        disabledTitle: "Optional",
    },
    // --- Other properties from the original code ---
    // (Keeping them for completeness)
    backgroundColor: { type: ControlType.Color, title: "Background", defaultValue: "#f9f9f9" },
    borderColor: { type: ControlType.Color, title: "Border", defaultValue: "#cccccc" },
    borderRadius: { type: ControlType.Number, title: "Radius", defaultValue: 8, min: 0, max: 50, unit: "px" },
    errorMessages: {
        type: ControlType.Object,
        title: "Error Messages",
        controls: {
            network: { type: ControlType.String, title: "Network Error", defaultValue: "No se pudo conectar al servidor." },
            unknown: { type: ControlType.String, title: "Unknown Error", defaultValue: "Ocurrió un error desconocido." },
            form: { type: ControlType.String, title: "Form Error", defaultValue: "Por favor, corrige los errores en el formulario." },
        },
    },
    enableLocalStorage: { type: ControlType.Boolean, title: "Local Storage", defaultValue: true },
    enableGoogleAuth: { type: ControlType.Boolean, title: "Google Login", defaultValue: false },
    googleClientId: { type: ControlType.String, title: "Google Client ID", hidden: ({ enableGoogleAuth }) => !enableGoogleAuth },
    oauthEndpoints: {
        type: ControlType.Object,
        title: "OAuth Endpoints",
        controls: { google: { type: ControlType.String, title: "Google Endpoint", defaultValue: "/api/v1/auth/google" } },
        hidden: ({ enableGoogleAuth }) => !enableGoogleAuth,
    },
    showBuiltInForm: { type: ControlType.Boolean, title: "Show Built-in Form", defaultValue: true },
    onForgotPasswordRequest: { type: ControlType.EventHandler },
    formFont: { type: ControlType.Font, title: "Form Font" },
    labelFont: { type: ControlType.Font, title: "Label Font" },
    buttonFont: { type: ControlType.Font, title: "Button Font" },
    inputBackgroundColor: { type: ControlType.Color, title: "Input BG", defaultValue: "#FFFFFF" },
    inputBorderColor: { type: ControlType.Color, title: "Input Border", defaultValue: "#EEEEEE" },
    inputTextColor: { type: ControlType.Color, title: "Input Text", defaultValue: "#000000" },
    inputBorderRadius: { type: ControlType.Number, title: "Input Radius", defaultValue: 4, min: 0, max: 20, unit: "px" },
    buttonBackgroundColor: { type: ControlType.Color, title: "Button BG", defaultValue: "#007bff" },
    buttonHoverColor: { type: ControlType.Color, title: "Button Hover", defaultValue: "#0056b3" },
    buttonTextColor: { type: ControlType.Color, title: "Button Text", defaultValue: "#FFFFFF" },
    buttonBorderRadius: { type: ControlType.Number, title: "Button Radius", defaultValue: 4, min: 0, max: 20, unit: "px" },
    errorBackgroundColor: { type: ControlType.Color, title: "Error BG", defaultValue: "#fee" },
    errorBorderColor: { type: ControlType.Color, title: "Error Border", defaultValue: "#fcc" },
    errorTextColor: { type: ControlType.Color, title: "Error Text", defaultValue: "#c33" },
    formSpacing: { type: ControlType.Number, title: "Spacing", defaultValue: 12, min: 4, max: 32, unit: "px" },
    inputPadding: { type: ControlType.Number, title: "Input Padding", defaultValue: 8, min: 4, max: 20, unit: "px" },
    buttonPadding: { type: ControlType.Number, title: "Button Padding", defaultValue: 10, min: 4, max: 20, unit: "px" },
    buttonWidth: { type: ControlType.String, title: "Button Width", defaultValue: "300px" },
    forgotPasswordTextColor: { type: ControlType.Color, title: "Forgot Pass Text", defaultValue: "#007bff" },
})
