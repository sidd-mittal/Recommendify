import React from 'react';

const Search = ({artistSearchInput, changeArtistSearchInput}) => {
    return (
        <div className="search-block">
            <input value={artistSearchInput}
                   onChange={({target}) => changeArtistSearchInput(target.value)}
                   placeholder="Search for Artists..."/>
        </div>
    );
};

export default Search;
