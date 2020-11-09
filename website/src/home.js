import React from 'react';

import {TopNav} from './components/navs.js';
import SearchBox from './components/search.js';
import TableBox from './components/table.js';


export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchVal: ''
        };
    }

    handleSearchChange = (e) => {
        this.setState({searchVal: e.target.value});
    }

    render() {
        return (
            <>
            <TopNav />

            <div className="container">
                <SearchBox value={this.state.searchVal} onChange={this.handleSearchChange} />

                <TableBox searchVal={this.state.searchVal} />
            </div>
            
            <AboutSection />
            </>
        );
    }
}


function AboutSection() {
    return (
        <div className="section">
            <div className="container">
                <div className="col">
                    <h3 id="about">About</h3>
                    <p>
                        Translating (or internationalising) a piece of software is not 
                        an easy task. Using translation tools, such as Google Translate, 
                        is neither productive nor very accurate. 
                    </p>
                    <p>
                        Open Translations project aims to provide accurate and verified translations 
                        for commonly used terms in software.
                    </p>
                </div>
                <div className="col">
                    <h3>Contribute</h3>
                    <p>
                        Contribute more translations or fix mistakes on <a href="https://github.com/bhch/open-translations">GitHub</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}