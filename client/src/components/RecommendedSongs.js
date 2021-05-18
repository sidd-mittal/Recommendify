import React, {Component} from 'react';

class RecommendedSongs extends Component {
    state = {
        selectedSong: {},
        songState: false,
        allSelectedBoolean: true,
        mousedOverComp: -1,
    };

    componentDidMount() {

    }

    songClicked = (song) => {
        if (song.preview_url) {
            if (song.id === this.state.selectedSong.id) {
                if (this.state.songState) {
                    this.setState({songState: false});
                    this.refs.audio_player.pause();
                } else {
                    this.setState({songState: true});
                    this.refs.audio_player.play();
                }
            } else {
                this.setState({selectedSong: song}, () => {
                    this.setState({songState: true});
                    this.refs.audio_player.load();
                    this.refs.audio_player.play();
                })
            }
        }
    };
    getAlbumImage = imageArr => {
        if (imageArr.length !== 0) {
            return imageArr[imageArr.length - 1].url;
        } else {
            return null;
        }
    };

    render() {
        return (
            <div className="suggested-songs-container">
                <div className="song-container-title">
                    <div className="select-tracks-title">Select tracks</div>
                    <div
                        className="select-tracks-number">{this.props.suggestedSongs.filter(song => song.selected).length}/{this.props.suggestedSongs.length}</div>
                    {this.props.suggestedSongs.length > 0 &&
                    <div onClick={() => {
                        this.props.selectDeselectAll(this.state.allSelectedBoolean);
                        this.setState({allSelectedBoolean: !this.state.allSelectedBoolean});
                    }}
                         className="select-all-deselect">{this.state.allSelectedBoolean ? 'Select All' : 'Deselect All'}
                    </div>
                    }
                </div>
                <div className="songs-playlist-col">
                    <div style={{display: 'none'}}>
                        <audio ref="audio_player" className="audio-control" controls>
                            <source src={this.state.selectedSong.preview_url}/>
                        </audio>
                    </div>

                    {/*{this.props.suggestedSongs.length > 0 &&*/}
                    {/*<div className="song-cant-play">some songs can't be played :(</div>}*/}
                    <div className="songs-list-col">
                        {this.props.suggestedSongs.map((song, index) => {
                            return (
                                <div key={song.id}
                                     onClick={(event) => {
                                         event.stopPropagation();
                                         if (this.state.mousedOverComp === index) {
                                             this.setState({mousedOverComp: -1});
                                             if (this.state.songState) {
                                                 this.songClicked(song);
                                             }
                                         } else {
                                             this.setState({mousedOverComp: index});
                                             this.setState({songState: false});
                                             this.refs.audio_player.pause();
                                         }
                                     }}>
                                    {this.state.mousedOverComp === index ?
                                        <div className="song-container" key={song.id}>
                                            {song.preview_url ?
                                                <div onClick={(event) => {
                                                    event.stopPropagation();
                                                    this.songClicked(song);
                                                }}
                                                     className="song-music-icon">
                                                    {this.state.songState && this.state.selectedSong.id === song.id ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                             viewBox="0 0 24 24">
                                                            <path d="M11 22h-4v-20h4v20zm6-20h-4v20h4v-20z"/>
                                                        </svg>
                                                        :
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                             viewBox="0 0 24 24">
                                                            <path d="M3 22v-20l18 10-18 10z"/>
                                                        </svg>
                                                    }
                                                </div>
                                                :
                                                <div className="song-music-icon">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50"
                                                         viewBox="0 0 24 24">
                                                        <path
                                                            d="M1 13h-1v-1h1v1zm22-1h-1v1h1v-1zm-20-1h-1v3h1v-3zm18 0h-1v3h1v-3zm-14 0h-1v3h1v-3zm10-1h-1v5h1v-5zm-12 0h-1v5h1v-5zm14-1h-1v7h1v-7zm-10 0h-1v7h1v-7zm2-2h-1v10h1v-10zm4 0h-1v10h1v-10zm-2-2h-1v14h1v-14z"/>
                                                    </svg>
                                                </div>

                                            }
                                            <div className="song-div">
                                                <div className="song-name">{song.name}</div>
                                                <div
                                                    className="song-artists">{song.artists.map(artist => artist.name).join(", ")}</div>
                                            </div>
                                            {this.getAlbumImage(song.album.images) ?
                                                <div className="album-image"
                                                     style={{backgroundImage: `url(${this.getAlbumImage(song.album.images)})`}}/> :
                                                null

                                            }
                                            <div className="song-select-icon" onClick={(event) => {
                                                this.props.selectSong(index);
                                                event.stopPropagation();
                                            }}>
                                                {!song.selected ?
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"
                                                         viewBox="0 0 24 24">
                                                        <path
                                                            d="M5.344 19.442l-1.186 1.628c-2.305-1.995-3.842-4.85-4.107-8.07h2c.255 2.553 1.48 4.819 3.293 6.442zm16.605-6.442c-.256 2.56-1.487 4.831-3.308 6.455l1.183 1.631c2.315-1.997 3.858-4.858 4.125-8.086h-2zm-19.898-2c.256-2.561 1.487-4.832 3.309-6.456l-1.183-1.631c-2.317 1.996-3.86 4.858-4.126 8.087h2zm4.927-7.633c1.477-.864 3.19-1.367 5.022-1.367 1.839 0 3.558.507 5.039 1.377l1.183-1.624c-1.817-1.105-3.941-1.753-6.222-1.753-2.272 0-4.39.644-6.201 1.741l1.179 1.626zm12.863-.438l-1.186 1.628c1.813 1.624 3.039 3.889 3.294 6.443h2c-.265-3.221-1.802-6.076-4.108-8.071zm-2.817 17.703c-1.478.864-3.192 1.368-5.024 1.368-1.84 0-3.56-.508-5.042-1.378l-1.183 1.624c1.818 1.106 3.943 1.754 6.225 1.754 2.273 0 4.392-.644 6.203-1.742l-1.179-1.626z"/>
                                                    </svg>
                                                    :
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"
                                                         viewBox="0 0 24 24">
                                                        <circle cx="12" cy="12" r="12"/>
                                                    </svg>
                                                }
                                            </div>
                                        </div>
                                        :
                                        <div className="song-div-basic">
                                            <span className="song-basic-name">{song.name}</span>
                                            {this.getAlbumImage(song.album.images) ?
                                                <div onClick={()=>window.open(song.external_urls.spotify, '_blank')} className="album-image"
                                                     style={{backgroundImage: `url(${this.getAlbumImage(song.album.images)})`}}/> :
                                                null

                                            }
                                        </div>
                                    }
                                </div>
                            )
                        })}
                    </div>
                    {this.props.suggestedSongs.length === 0 &&
                    <div className="songs-suggested-text">Songs will be added here when artists are selected...</div>}
                </div>
            </div>
        );
    }
}

export default RecommendedSongs;
