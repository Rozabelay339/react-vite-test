import { useEffect, useState } from "react"

const Movies = ({ jwtToken }) => {
    const [movies, setMovies] = useState(null)

    const fetchMovies = async () => {
        const res = await fetch("https://tokenservice-jwt-2025.fly.dev/movies", {
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        })

        const data = await res.json()

        setMovies(data)
    }

    useEffect(() => {
        fetchMovies()
    }, [])

    return movies ? (
        movies.map((movie) => {
            return (
                <div key={movie.id}>
                    <p>Titel: {movie.title}</p>
                    <p>Regissör: {movie.director}</p>
                    <p>Beskrivning: {movie.description}</p>
                    <hr />
                </div>
            )
        })
    ) : (
        <p>Kunde inte hämta filmer</p>
    )
}

export default Movies
