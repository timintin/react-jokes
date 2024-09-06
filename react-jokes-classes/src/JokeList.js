import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

const JokeList = ({ numJokesToGet = 5 }) => {
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load jokes from localStorage if available
  useEffect(() => {
    const savedJokes = JSON.parse(localStorage.getItem("jokes") || "[]");
    if (savedJokes.length) {
      setJokes(savedJokes);
      setIsLoading(false);
    } else {
      getJokes();
    }
  }, []);

  // Save jokes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("jokes", JSON.stringify(jokes));
  }, [jokes]);

  // Retrieve jokes from API
  const getJokes = async () => {
    try {
      let jokes = [];
      let seenJokes = new Set();

      while (jokes.length < numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        let { ...joke } = res.data;

        if (!seenJokes.has(joke.id)) {
          seenJokes.add(joke.id);
          jokes.push({ ...joke, votes: 0, locked: false });
        }
      }
      setJokes(jokes);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const generateNewJokes = () => {
    setIsLoading(true);
    getJokes();
  };

  const vote = (id, delta) => {
    setJokes((jokes) =>
      jokes.map((j) =>
        j.id === id ? { ...j, votes: j.votes + delta } : j
      )
    );
  };

  const resetVotes = () => {
    setJokes((jokes) =>
      jokes.map((j) => ({ ...j, votes: 0 }))
    );
    localStorage.removeItem("jokes");
  };

  const toggleLock = (id) => {
    setJokes((jokes) =>
      jokes.map((j) =>
        j.id === id ? { ...j, locked: !j.locked } : j
      )
    );
  };

  if (isLoading) return <div>Loading jokes...</div>;

  return (
    <div className="JokeList">
      <button onClick={generateNewJokes}>New Jokes</button>
      <button onClick={resetVotes}>Reset Votes</button>
      {jokes.map((j) => (
        <Joke
          key={j.id}
          text={j.joke}
          votes={j.votes}
          vote={(delta) => vote(j.id, delta)}
          locked={j.locked}
          toggleLock={() => toggleLock(j.id)}
        />
      ))}
    </div>
  );
};

export default JokeList;
