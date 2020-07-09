import React from 'react';
import './searchbar.css';

class SearchBar extends React.Component {
    constructor(props){
        super(props);

        this.state = {term: ''};
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
    }

    search(){
        this.props.onSearch(this.state.term);
    }

    handleTermChange(event){
        this.setState({term: event.target.value});
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    render() {
        return (
            <div className="SearchBar">
                <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange}/>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a onClick={this.search}>SEARCH</a>
            </div>
        );
    }
}

export default SearchBar;