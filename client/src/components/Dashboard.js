import React, {Component} from 'react';
import '../css/Dashboard.css';
import {
    getRecommendationsBasedOnSeed,
    getUserInfo,
    getArtists,
} from '../helperFunctions/spotifyAPIHelperFunctions';
import Search from './Search'
import SelectedArtists from './SelectedArtists'
import RecommendedSongs from './RecommendedSongs'
import CreatePlaylist from './CreatePlaylist'
import MusicDataSlider from './MusicDataSlider'

class Dashboard extends Component {
    state = {
        userInfo: {},
        followedArtists: [],
        getSongsBFA: false,
        artistSearchInput: "",
        searchedArtists: [],
        selectedArtists: [],
        suggestedSongs: [],
        options: false,
        optionsValues: {
            acousticness: {value: 0.30, option: "disabled"},
            danceability: {value: 0.30, option: "disabled"},
            energy: {value: 0.70, option: "target"},
            valence: {value: 0.70, option: "disabled"},
            instrumentalness: {value: 0.70, option: "target"},
            liveness: {value: 0.70, option: "target"},
            popularity: {value: 0.70, option: "target"},
        },
        optionsChanged: false,
    };

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.selectedArtists.map(artist => artist.id).toString() !== this.state.selectedArtists.map(artist => artist.id).toString()) {
            await this.getRecommendedSongs();
        }
        if (this.state.optionsChanged) {
            await this.getRecommendedSongs()
        }
    }

    async componentDidMount() {
        if (!localStorage.getItem("access_token") || !localStorage.getItem("refresh_token")) {
            this.props.history.push("/login");
        } else {
            this.props.gettingNewAccessToken.then(async () => {
                const access_token = localStorage.getItem("access_token");
                this.setState({
                })
            });
        }
    }

    getRecommendedSongs = async () => {
        if (this.state.selectedArtists.length > 0) {
            this.setState({
                optionsChanged: false,
                suggestedSongs:
                    await getRecommendationsBasedOnSeed(localStorage.getItem("access_token"), this.state.selectedArtists.map(artist => artist.id), this.state.optionsValues)
            });
        } else {
            if (!this.state.options) {
                this.setState({suggestedSongs: []});
            }
        }

    };

    artistClicked = (indexSearching) => {
        const selectedIndex = this.state.selectedArtists.findIndex(artist => artist.id === this.state.searchedArtists[indexSearching].id);
        const newArtist = {...this.state.searchedArtists[indexSearching]};
        newArtist.clicked = !newArtist.clicked;
        if (selectedIndex !== -1) {
            this.setState({
                selectedArtists: [...this.state.selectedArtists.slice(0, selectedIndex), ...this.state.selectedArtists.slice(selectedIndex + 1)],
                searchedArtists: [...this.state.searchedArtists.slice(0, indexSearching), newArtist, ...this.state.searchedArtists.slice(indexSearching + 1)],
            })
        } else {
            if (this.state.selectedArtists.length < 5) {
                this.setState({
                    selectedArtists: [...this.state.selectedArtists, this.state.searchedArtists[indexSearching]],
                    searchedArtists: [...this.state.searchedArtists.slice(0, indexSearching), newArtist, ...this.state.searchedArtists.slice(indexSearching + 1)],
                })
            }
        }
    };

    changeArtistSearchInput = value => {
        this.setState({artistSearchInput: value}, () => {
            getArtists(localStorage.getItem("access_token"), this.state.artistSearchInput)
                .then(res => this.setState({
                    searchedArtists: res.artists.items.map(artist => {
                        if (this.state.selectedArtists.some(sArtist => sArtist.id === artist.id)) {
                            artist.clicked = true;
                        }
                        return artist
                    })
                }));
        });
    };

    getArtistImage = imageArr => {
        if (imageArr.length !== 0) {
            return imageArr[imageArr.length - 2].url;
        } else {
            return null;
        }
    };

    selectedArtistClicked = index => {
        const searchedArtistIndex = this.state.searchedArtists.findIndex(artist => artist.id === this.state.selectedArtists[index].id);
        if (searchedArtistIndex !== -1) {
            const newArtist = {...this.state.searchedArtists[searchedArtistIndex]};
            newArtist.clicked = !newArtist.clicked;
            this.setState({
                searchedArtists: [...this.state.searchedArtists.slice(0, searchedArtistIndex), newArtist, ...this.state.searchedArtists.slice(searchedArtistIndex + 1)],
            });
        }
        this.setState({
            selectedArtists: [...this.state.selectedArtists.slice(0, index), ...this.state.selectedArtists.slice(index + 1)]
        });
    };

    selectDeselectAll = (boolean) => {
        this.setState({
            suggestedSongs: this.state.suggestedSongs.map(song => {
                song.selected = boolean;
                return song;
            })
        });
    };

    selectSong = (index) => {
        const newSong = {...this.state.suggestedSongs[index]};
        newSong.selected = !newSong.selected;
        this.setState({
            suggestedSongs: [...this.state.suggestedSongs.slice(0, index), newSong, ...this.state.suggestedSongs.slice(index + 1)],
        });
    };

    changeOptionsValue = (option, value) => {
        if (this.state.optionsValues[option].value === value) {
            return;
        }
        const optionsValues = {...this.state.optionsValues};
        optionsValues[option].value = value;
        this.setState({optionsValues: optionsValues});
    };

    changeFunction = (newOption, optionKey) => {
        if (this.state.optionsValues[optionKey].option === newOption) {
            return;
        }
        const optionsValues = {...this.state.optionsValues};
        optionsValues[optionKey].option = newOption;
        this.setState({optionsValues: optionsValues, optionsChanged: true});
    };

    sliderMouseUp = (key) => {
        if (this.state.optionsValues[key].option !== 'disabled') {
            this.setState({optionsChanged: true});
        }
    };

    render() {
        return (
            <div className="main">
                <div className="main-content">
                    <Search artistSearchInput={this.state.artistSearchInput}
                            changeArtistSearchInput={this.changeArtistSearchInput}/>
                    <div className="search-results">
                        {this.state.searchedArtists.map((artist, index) => {
                            return (
                                <div className="artist-name-img" key={artist.id}>
                                    <div onClick={() => this.artistClicked(index)}
                                         className={`artist-img-upper ${artist.clicked ? "clicked" : ""}`}>
                                        {this.getArtistImage(artist.images) ?
                                            <div className={`artist-img ${artist.clicked ? "clicked" : ""}`}
                                                 style={{backgroundImage: `url(${this.getArtistImage(artist.images)})`}}/> :
                                            <div className={`artist-img ${artist.clicked ? "clicked" : ""}`}>
                                            </div>}
                                        <div className={`middle ${artist.clicked ? "clicked" : ""}`}>
                                        </div>
                                    </div>
                                    <div className="artist-name">{artist.name}</div>
                                </div>
                            )
                        })}
                        <div style={{height: this.state.options ? 200 : 0}}
                             className={`expand-content ${!this.state.options ? "hidden" : ""}`}>
                            <div onClick={() => this.setState({options: !this.state.options})} className="pull-tab">
                            </div>
                            <div onClick={(e) => e.stopPropagation()} className="options-content">
                                {[
                                    {key: "acousticness", value: "Acousticness"},
                                    {key: "danceability", value: "Danceability"},
                                    {key: "energy", value: "Energy"},
                                    {key: "valence", value: "Valence"},
                                ].map(option =>
                                    <MusicDataSlider
                                        sliderMouseUp={() => this.sliderMouseUp(option.key)}
                                        changeFunction={(newOption) => this.changeFunction(newOption, option.key)}
                                        optionFunction={this.state.optionsValues[option.key].option}
                                        key={option.key}
                                        optionName={option.value}
                                        value={this.state.optionsValues[option.key].value}
                                        changeValue={(value) => this.changeOptionsValue(option.key, value)}/>
                                )}
                            </div>

                        </div>
                    </div>
                    {this.state.searchedArtists.length === 0 &&
                    <div className="search-artists-text">Search for artists to be considered in the algorithm...</div>}
                    {this.state.selectedArtists.length > 0 &&
                    <SelectedArtists selectedArtistClicked={this.selectedArtistClicked}
                                     selectedArtists={this.state.selectedArtists}
                                     getArtistImage={this.getArtistImage}/>}
                </div>
                <div className="side-bar">
                    <RecommendedSongs selectSong={this.selectSong} selectDeselectAll={this.selectDeselectAll}
                                      suggestedSongs={this.state.suggestedSongs}/>
                    <CreatePlaylist
                        tracks={this.state.suggestedSongs.filter(track => track.selected).map(track => track.uri)}
                        userID={this.state.userInfo.id}/>
                </div>
                <div className="background"/>
            </div>
        );
    }
}

export default Dashboard;