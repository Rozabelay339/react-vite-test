import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { server } from "./mocks/server"

import GetMovies from "../pages/GetMovies"

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("GetMovies", () => {
    it("hämtar och visar filmer efter inloggning", async () => {
        render(<GetMovies />)

        const button = screen.getByText((content) => content.includes("Logga in och hämta filmer"))

        fireEvent.click(button)

        await waitFor(() => {
            expect(screen.getByText(/The Matrix/)).toBeInTheDocument()
            expect(screen.getByText(/Titanicc/)).toBeInTheDocument()
            expect(screen.getByText(/Test film/)).toBeInTheDocument()
        })
    })
})
