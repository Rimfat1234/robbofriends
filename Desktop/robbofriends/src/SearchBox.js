import React from "react";

const SearchBox = ({ searchfield, searchchange }) => {
    return (
        <div className="pa2">
            <input 
                className="pa3 ba b--gold bg-green"
                type="search"
                placeholder="Search robots"
                onChange={searchchange}
            />
        </div>
    );
};

export default SearchBox;
