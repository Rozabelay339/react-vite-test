import { useState } from "react"
import Movies from "../components/Movies"

const GetMovies = () => {
    const [jwtToken, setJwtToken] = useState(null)

    const login = async () => {
        const res = await fetch(
            "https://tokenservice-jwt-2025.fly.dev/token-service/v1/request-token",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: "rozaa", password: "123456" })
            }
        )

        let jwtToken = await res.text()

        setJwtToken(jwtToken)
    }

    return jwtToken ? (
        <Movies jwtToken={jwtToken} />
    ) : (
        <button onClick={login}>Logga in och hämta filmer</button>
    )
}

export default GetMovies
