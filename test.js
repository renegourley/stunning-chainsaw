import React, { useState, useEffect } from "react";

const CharacterMovies = ({ characterName }) => {
    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`https://swapi.dev/api/people/?search=${characterName}`);
                const data = await response.json();
                for (let i = 0; i < data.results.length; i++) {
                    if (data.results[i].name === characterName) {
                        const films = await Promise.all(data.results[i].films.map(async filmUrl => {
                            const filmResponse = await fetch(filmUrl);
                            return await filmResponse.json();
                        }));
                        setFilms(films);
                        break;
                    }
                }
            } catch (e) {
                setError(e);
            }
            setLoading(false);
        };
        fetchData();
    }, [characterName]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <ul>
            {films.map(film => (
                <li key={film.url}>{film.title}</li>
            ))}
        </ul>
    );
};

export default CharacterMovies;


—-

import React, { useState } from "react";
import CharacterMovies from "./CharacterMovies";

const CharacterSearch = () => {
    const [characterName, setCharacterName] = useState("");

    return (
        <div>
            <form>
                <label>
                    Character name:
                    <input
                        type="text"
                        value={characterName}
                        onChange={e => setCharacterName(e.target.value)}
                    />
                </label>
            </form>
            <CharacterMovies characterName={characterName} />
        </div>
    );
};

export default CharacterSearch;
