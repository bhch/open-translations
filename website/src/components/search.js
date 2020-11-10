import icons from '../icons';

function SearchIcon() {
    return (
        <icons.search />
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
                    <SearchIcon />
                </button>
            </form>
        </div>
    );
}


export default SearchBox;