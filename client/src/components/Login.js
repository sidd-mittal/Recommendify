import React, {Component} from 'react';
import '../css/Dashboard.css';

function Login () {
    const SERVER_URL = process.env.REACT_APP_SERVER_URL;
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
    const initialPage = () => {
        window.location = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${SERVER_URL}/login&response_type=code&scope=user-follow-read%20user-read-private%20playlist-modify-private`;
    };

    return (
        <div className="entry">
            <span className="login-title">Spotify Recommendation App</span>
            <div className="login-div" onClick={initialPage}>
                <img className="spotify-img" alt="Spotify"
                     src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/500px-Spotify_logo_without_text.svg.png"/>
                <button>Login With Spotify</button>
            </div>
        </div>
    );
}

export default Login;
