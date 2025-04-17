import { beforeAll, beforeEach, afterEach, describe, test, expect } from "vitest";

let jwtToken;

beforeAll(async () => {
  const res = await fetch(
    "https://tokenservice-jwt-2025.fly.dev/token-service/v1/request-token",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "rozaa", password: "123456" }),
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
        title: "filmFilm",
        description: "Det här är en testfilm som används för att testa API:et med Vitest.",
        director: "regissör regissör regissör",
        productionYear: 2020,
      }),
    });

    const body = await res.text();
    try {
      createdMovie = JSON.parse(body);
    } catch (err) {
      console.error("❌ Kunde inte parsa JSON från POST-svaret:", err);
    }
  });

  afterEach(async () => {
    if (createdMovie?.id) {
      await fetch(`https://tokenservice-jwt-2025.fly.dev/movies/${createdMovie.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
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

    const movieExists = data.some((movie) => movie.title === createdMovie.title);
    expect(movieExists).toBe(true);
  });

  test("GET /movies returnerar status 200 och en film", async () => {
    const res = await fetch("https://tokenservice-jwt-2025.fly.dev/movies", {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    const data = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.some(m => m.title === createdMovie.title)).toBe(true);
  });

  test("GET /movies/{id} returnerar rätt film", async () => {
    const res = await fetch(
      `https://tokenservice-jwt-2025.fly.dev/movies/${createdMovie?.id}`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    const text = await res.text();
    const data = JSON.parse(text);

    expect(res.status).toBe(200);
    expect(data.title).toBe(createdMovie.title); 
  });

});
