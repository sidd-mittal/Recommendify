import React, {Component} from 'react';
import {createPlaylistAddTracks} from '../helperFunctions/spotifyAPIHelperFunctions'

//TODO select which artists are related
class CreatePlaylist extends Component {
    state = {
        playlistName: "",
        playlistDescription: "",
        playlistCreated: false,
        playlistURL: "",
    };

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.tracks.toString() !== prevProps.tracks.toString()) {
            this.setState({
                playlistCreated: false,
                playlistURL: "",
            })
        }
    }

    createPlaylist = async () => {
        const access_token = localStorage.getItem("access_token");
        const tracks = this.props.tracks;
        const userID = this.props.userID;
        const playlistInfo = {
            name: this.state.playlistName,
            description: this.state.playlistDescription,
            public: false,
        };
        const playlist = await createPlaylistAddTracks(access_token, tracks, userID, playlistInfo);
        this.setState({
            playlistURL: playlist.external_urls.spotify,
            playlistCreated: true,
            playlistName: "",
            playlistDescription: "",
        });
    };

    render() {
        return (
            <div className="suggested-songs-playlist-container">
                {this.props.tracks.length > 0 ?
                    this.state.playlistCreated ?
                        <div className="playlist-created-container">
                            <span className="playlist-created-text">
                                Your playlist was created!<br/>
                                <a rel="noopener noreferrer" target="_blank" className="playlist-created-url" href={this.state.playlistURL}>Click to view</a>
                            </span>
                        </div>
                        :
                        <form className="suggested-songs-playlist-form" onSubmit={(e) => {
                            e.preventDefault();
                            this.createPlaylist()
                        }}>
                            <span className="create-playlist">Create Playlist</span>
                            <div className="input-playlist-name">
                                <input required
                                       onChange={({target}) => this.setState({playlistName: target.value})}
                                       value={this.state.playlistName} placeholder="Playlist name..."/>
                            </div>
                            <div className="input-playlist-description">
                                <input
                                    onChange={({target}) => this.setState({playlistDescription: target.value})}
                                    value={this.state.playlistDescription} placeholder="Playlist description..."/>
                            </div>
                            <button className="suggested-songs-submit-button" type="submit">Create Playlist</button>
                        </form>

                    :
                    <div className="no-songs-create-playlist">
                        No songs yet...
                    </div>
                }
            </div>
        );
    }
}

export default CreatePlaylist;
