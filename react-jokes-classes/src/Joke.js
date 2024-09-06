import React from "react";
import "./Joke.css";

/** A single joke, along with vote up/down buttons and lock button. */

const Joke = ({ vote, votes, text, locked, toggleLock }) => {
  return (
    <div className="Joke">
      <div className="Joke-votearea">
        <button onClick={() => vote(+1)}>
          <i className="fas fa-thumbs-up" />
        </button>

        <button onClick={() => vote(-1)}>
          <i className="fas fa-thumbs-down" />
        </button>

        {votes}
      </div>

      <div className="Joke-text">{text}</div>

      <div className="Joke-lockarea">
        <button onClick={toggleLock}>
          {locked ? "Unlock" : "Lock"}
        </button>
      </div>
    </div>
  );
};

export default Joke;
