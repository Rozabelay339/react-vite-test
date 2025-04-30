import { Link, Routes, Route } from "react-router"
import Counter from "./pages/Counter"
import GetMovies from "./pages/GetMovies"

function App() {
    return (
        <>
            <Link to="/get-movies">
                <button>Hämta filmer</button>
            </Link>

            <Link to="/counter">
                <button>Counter</button>
            </Link>
            <main>
                <Routes>
                    <Route path="/counter" Component={Counter} />
                    <Route path="/get-movies" Component={GetMovies} />
                </Routes>
            </main>
        </>
    )
}

export default App
