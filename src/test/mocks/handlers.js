import { http, HttpResponse } from "msw"

export const handlers = [
    http.post(
        "https://tokenservice-jwt-2025.fly.dev/token-service/v1/request-token",
        async ({ request }) => {
            const { username, password } = await request.json()

            if (username === "rozaa" && password === "123456") {
                return new HttpResponse("mocked-jwt-token", {
                    status: 200,
                    headers: { "Content-Type": "text/plain" }
                })
            }

            return HttpResponse.json({ message: "Unauthorized" }, { status: 401 })
        }
    ),

    http.get("https://tokenservice-jwt-2025.fly.dev/movies", ({ request }) => {
        const authHeader = request.headers.get("Authorization")

        if (authHeader === "Bearer mocked-jwt-token") {
            return HttpResponse.json([
                {
                    title: "The Matrix",
                    director: "Wachowskii",
                    description: "En sci-fi-klassiker En sci-fi-klassiker En sci-fi-klassiker",
                    productionYear: 1999,
                    id: 6193,
                    owner: {
                        id: 17,
                        username: "rozaa",
                        password: "$2a$10$jrwq5arsk3ymNIxD1ypusuUC6p0KxSeg4bo9LBqm7tcp0PMoGt0Ou",
                        role: "USER",
                        userConsent: {
                            isTermsAndAgreementsConsented: true,
                            timestamp: "2025-04-13T09:40:17.200Z"
                        }
                    }
                },
                {
                    title: "Titanicc",
                    director: "Wachowskii",
                    description: "En sci-fi-klassiker En sci-fi-klassiker En sci-fi-klassikerrr ",
                    productionYear: 1990,
                    id: 6194,
                    owner: {
                        id: 17,
                        username: "rozaa",
                        password: "$2a$10$jrwq5arsk3ymNIxD1ypusuUC6p0KxSeg4bo9LBqm7tcp0PMoGt0Ou",
                        role: "USER",
                        userConsent: {
                            isTermsAndAgreementsConsented: true,
                            timestamp: "2025-04-13T09:40:17.200Z"
                        }
                    }
                },
                {
                    title: "Test film",
                    director: "Test Director",
                    description: "En sci-fi-klassiker En sci-fi-klassiker En sci-fi-klassiker",
                    productionYear: 2025,
                    id: 7518,
                    owner: {
                        id: 17,
                        username: "rozaa",
                        password: "$2a$10$jrwq5arsk3ymNIxD1ypusuUC6p0KxSeg4bo9LBqm7tcp0PMoGt0Ou",
                        role: "USER",
                        userConsent: {
                            isTermsAndAgreementsConsented: true,
                            timestamp: "2025-04-13T09:40:17.200Z"
                        }
                    }
                }
            ])
        }
        return HttpResponse.json({ message: "Forbidden" }, { status: 403 })
    })
]
