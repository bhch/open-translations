function SearchIon() {
    return (
        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-search" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z"/>
            <path fillRule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"/>
        </svg>
    );
}

function SearchBox(props) {
    let className = "search-box clearfix";
    if (props.value.trim()) {
        className += " minimal";
    }

    return (
        <div className={className}>
            <h2 className="text-center">Translations for your apps and websites</h2>

            <form method="GET" onSubmit={(e) => e.preventDefault()}>
                <input 
                    type="text" 
                    className="search-input" 
                    placeholder="Search a term..." 
                    value={props.value} 
                    onChange={props.onChange} 

                />
                
                <button type="submit" className="search-button">
                    <SearchIon />
                </button>
            </form>
        </div>
    );
}


export default SearchBox;