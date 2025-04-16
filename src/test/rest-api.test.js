import { beforeAll, beforeEach, describe, test, expect } from "vitest";

let jwtToken;

beforeAll(async () => {
  const res = await fetch(
    "https://tokenservice-jwt-2025.fly.dev/token-service/v1/request-token",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "rozaa",
        password: "123456",
      }),
    }
  );

  jwtToken = await res.text();
});

describe("GET /movies", () => {
  let createdMovie;

  beforeEach(async () => {
    const res = await fetch("https://tokenservice-jwt-2025.fly.dev/movies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        title: "Testfilm",
        description:
          "Det här är en testfilm som används för att testa API:et med Vitest.",
        director: "Testregissör",
        productionYear: 2025,
      }),
    });

    console.log("POST-status:", res.status);
    const body = await res.text();
    console.log("Svar från POST:", body);

    try {
      createdMovie = JSON.parse(body);
    } catch (err) {
      console.error("Kunde inte parsa JSON från POST-svaret:", err);
    }
  });

  test("should return an array of movies including the newly created one", async () => {
    const res = await fetch("https://tokenservice-jwt-2025.fly.dev/movies", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(res.status).toBe(200);

    const data = await res.json();

    const movieExists = data.some(
      (movie) => movie.title === createdMovie.title
    );

    expect(movieExists).toBe(true);
  });
});
