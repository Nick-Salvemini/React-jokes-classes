import React, { Component } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

class JokeList extends Component {
  constructor(props) {
    super(props);
    this.state = { jokes: [] };
  }

  componentDidMount() {
    if (this.state.jokes.length === 0) this.getJokes();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.jokes.length !== prevState.jokes.length) {
      this.getJokes();
    }
  }

  getJokes = async () => {
    let j = [...this.state.jokes];
    let seenJokes = new Set(j.map(joke => joke.id));
    try {
      while (j.length < this.props.numJokesToGet || 10) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        let { status, ...jokeObj } = res.data;

        if (!seenJokes.has(jokeObj.id)) {
          seenJokes.add(jokeObj.id);
          j.push({ ...jokeObj, votes: 0 });
        } else {
          console.error("duplicate found!");
        }
      }
      this.setState({ jokes: j });
    } catch (e) {
      console.log(e);
    }
  };

  generateNewJokes = () => {
    this.setState({ jokes: [] });
  };

  vote = (id, delta) => {
    this.setState({
      jokes: this.state.jokes.map(joke =>
        joke.id === id ? { ...joke, votes: joke.votes + delta } : joke
      )
    });
  };

  render() {
    const { jokes } = this.state;

    if (jokes.length) {
      let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

      return (
        <div className="JokeList">
          <button className="JokeList-getmore" onClick={this.generateNewJokes}>
            Get New Jokes
          </button>

          {sortedJokes.map(j => (
            <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />
          ))}
        </div>
      );
    }

    return null;
  }
}

export default JokeList;