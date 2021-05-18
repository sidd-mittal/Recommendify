import React from 'react';

const SelectedArtists = ({selectedArtists, getArtistImage, selectedArtistClicked}) => {
    return (
        <div className="selected-artists">
            {selectedArtists.map((artist, index) => {
                return (
                    <div onClick={() => selectedArtistClicked(index)} className="selected-artists-img-div"
                         key={artist.id}>
                        {getArtistImage(artist.images) ?
                            <div className="selected-artist-img"
                                 style={{backgroundImage: `url(${getArtistImage(artist.images)})`}}/> :
                            <div className="selected-artist-img default">
                                <svg className="default-selected-user-pic" xmlns="http://www.w3.org/2000/svg"
                                     viewBox="0 0 24 24">
                                </svg>
                            </div>}
                        <div className="middle-selected">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                            </svg>
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

export default SelectedArtists;
