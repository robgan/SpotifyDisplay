import React, { Component } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import './App.css';

const spotifyAPI = new SpotifyWebApi();

class App extends Component {
  constructor() {
    super();
    const params = this.getHashParams();
    const token = params.access_token
    if (token) {
      spotifyAPI.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: {
        name: '',
        artist: '',
        albumArt: ''
      }
    }
  }

  // componentDidMount() {
  //   window.addEventListener('load', this.getNowPlaying());
  // }

  componentDidMount() {
    window.addEventListener('load', this.getNowPlaying());

    this.interval = setInterval(() => this.setState(this.getNowPlaying()), 5000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  // componentWillUnmount() {
  //   clearInterval(this.interval);
  // }

  // componentDidMount() {
  //   console.log("poll");
  //   try {
  //     setInterval(async () => {
  //       this.getNowPlaying();
  //     }, 10000);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  getHashParams() {
    let hashParams = {};
    let e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
      e = r.exec(q);
    }
    return hashParams
  }

  getNowPlaying() {
    console.log("GET")
    spotifyAPI.getMyCurrentPlaybackState()
      .then((response) => {
        this.setState({
          nowPlaying: {
            name: response.item.name,
            artist: response.item.artists.map(function (e) {
              return e.name;
            }).join(', '),
            albumArt: response.item.album.images[0].url
          }
        });
      })
  }

  render() {
    return (
      <div className='spotify' >
        {
          this.state.loggedIn &&
          <div className="flexbox">
            <div class="flexitem" id="albumArt">
              <img src={this.state.nowPlaying.albumArt} />
            </div>
            <div class="flexitem" >
              <p id="songName">Now Playing: {this.state.nowPlaying.name}</p>
              <p id="artists">Artist: {this.state.nowPlaying.artist}</p>
            </div>
          </div>
        }
        {
          this.state.loggedIn &&
          <button onClick={() => this.getNowPlaying()}>
            Check Now Playing
          </button>
        }
        <a id="login" href='http://localhost:8888'> Login to Spotify </a>
      </div >
    );
  }
}

export default App;
