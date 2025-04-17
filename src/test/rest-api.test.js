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
      console.error("Kunde inte parsa JSON från POST-svaret:", err, "\nSvar:", body);
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

  test("GET /movies should return 200 and include the newly created movie", async () => {
    const res = await fetch("https://tokenservice-jwt-2025.fly.dev/movies", {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    expect(res.status).toBe(200);

    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);

    const movieExists = data.some((movie) => movie.title === createdMovie.title);
    expect(movieExists).toBe(true);
  });

  test("GET /movies/{id} should return the correct movie", async () => {
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

  test("PUT /movies/{id} updates the movie", async () => {
    const updatedData = {
        title: "Updated Film Title",
        description: "Updated description that meets the required length of at least 30 characters.",
        director: "Updated Director",
        productionYear: 2022,
      };
      
  
    const res = await fetch(
      `https://tokenservice-jwt-2025.fly.dev/movies/${createdMovie.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(updatedData),
      }
    );
  
    if (res.status !== 200) {
      const errorText = await res.text();
      console.log("Error Response:", errorText); // Log the response body for debugging
    }
  
    expect(res.status).toBe(200);
  
    const updatedMovie = await res.json();
    expect(updatedMovie.title).toBe(updatedData.title);
    expect(updatedMovie.description).toBe(updatedData.description);
    expect(updatedMovie.director).toBe(updatedData.director);
    expect(updatedMovie.productionYear).toBe(updatedData.productionYear);
  });
  

  test("DELETE /movies/{id} deletes the movie", async () => {
    const deleteRes = await fetch(
      `https://tokenservice-jwt-2025.fly.dev/movies/${createdMovie.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    expect(deleteRes.status).toBe(204);

    // Try to fetch it again the deleted movie
    const checkRes = await fetch(
      `https://tokenservice-jwt-2025.fly.dev/movies/${createdMovie.id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    expect(checkRes.status).toBe(404);
    createdMovie = null;
  });git 
});
