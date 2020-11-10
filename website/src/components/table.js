import React from 'react';
import langs from '../translations';
import icons from '../icons'; 


export default function TableBox(props) {
    const inputLangCode = 'en';
    const inputLang = langs[inputLangCode];
    const outputLangCodes = ['es', 'de', 'hi'];

    if (props.searchVal.trim())
        return (
            <TableFiltered 
                {...props} 
                inputLangCode={inputLangCode} 
                inputLang={inputLang}
                outputLangCodes={outputLangCodes}
            />
        );
    else
        return (
            <TableAll 
                {...props} 
                inputLangCode={inputLangCode} 
                inputLang={inputLang}
                outputLangCodes={outputLangCodes}
            />
        );
}


function TableAll(props) {
    /* Renders all terms */

    const inputLang = props.inputLang;
    const outputLangCodes = props.outputLangCodes;

    const headers = [inputLang._meta.name];

    for (let i = 0; i < outputLangCodes.length; i++) {
        const outputLang = langs[outputLangCodes[i]];
        if (outputLang)
            headers.push(outputLang._meta.name);
    }

    const categGroups = {};

    for (let term in inputLang) {
        if (term.startsWith('_'))
            continue;

        let tags = inputLang[term].tags;

        for (let i = 0; i < tags.length; i++) {
            let tag = tags[i];

            if (!categGroups.hasOwnProperty(tag)) {
                categGroups[tag] = [];
            }

            categGroups[tag].push(term);
        }
    }

    const rows = [];

    for (let categ in categGroups) {
        rows.push(
            <tr className="category" key={'categ_row_' + categ}>
                <td>{toTitleCase(categ)}</td>
                {outputLangCodes.map((i) => <td key={'categ_empty_col_' + i}></td>)}
            </tr>
        );

        let categTerms = categGroups[categ];
        for (let i = 0; i < categTerms.length; i++) {
            let term = categTerms[i];

            const termData = inputLang[term];

            let termColFirst = getInputLangTermCol(term, termData);


            let termColRest = [];
            for (let j = 0; j < outputLangCodes.length; j++) {
                let outputLang = langs[outputLangCodes[j]];

                if (!outputLang)
                    continue;

                let value = outputLang[term].value;

                termColRest.push(getOutputLangTermCol(value));
            }

            rows.push(<tr>{termColFirst}{termColRest}</tr>);
        }
    }

    return (
        <div className="table-box">
            <table>
                <thead>
                    <tr>
                        {headers.map((i) => <th key={'header_' + i}>{i}</th>)}
                    </tr>
                </thead>

                <tbody>
                    {rows}
                </tbody>
            </table>
        </div>
    );
}


function TableFiltered(props) {
    /* Renders filtered terms */
    
    const inputLang = props.inputLang;
    const outputLangCodes = props.outputLangCodes;
    const searchVal = props.searchVal.trim().toLowerCase();

    const headers = [inputLang._meta.name];

    for (let i = 0; i < outputLangCodes.length; i++) {
        const outputLang = langs[outputLangCodes[i]];
        if (outputLang)
            headers.push(outputLang._meta.name);
    }

    const terms_startMatch = [];
    const terms_containMatch = [];

    for (let term in inputLang) {
        if (term.startsWith('_'))
            continue;

        let _term = term.trim().toLowerCase();

        if (_term.startsWith(searchVal))
            terms_startMatch.push(term);
        else if (_term.includes(searchVal))
            terms_containMatch.push(term);
    }

    const terms = terms_startMatch.concat(terms_containMatch);

    const rows = [];

    for (let i = 0; i < terms.length; i++) {
        let term = terms[i];
        const termData = inputLang[term];
        rows.push(
            <tr className="category">
                <td>{toTitleCase(termData.tags.join(', '))}</td>
                {outputLangCodes.map((i) => <td></td>)}
            </tr>
        );

        let termColFirst = getInputLangTermCol(term, termData);

        let termColRest = [];
        for (let j = 0; j < outputLangCodes.length; j++) {
            let outputLang = langs[outputLangCodes[j]];

            if (!outputLang)
                continue;

            let value = outputLang[term].value;

            termColRest.push(getOutputLangTermCol(value));
        }

        rows.push(<tr>{termColFirst}{termColRest}</tr>);
    }

    if (!rows.length)
        rows.push(<tr className="empty-search"><td colspan={outputLangCodes.length + 1}>Nothing found</td></tr>);

    return (
        <div className="table-box has-filters">
            <table>
                <thead>
                    <tr>
                        {headers.map((i) => <th key={'header_' + i}>{i}</th>)}
                    </tr>
                </thead>

                <tbody>
                    {rows}
                </tbody>
            </table>
        </div>
    );
}

class CopyButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hasFeedback: false
        };
    }
    handleClick = (e) => {
        if (!navigator.clipboard)
            return;

        navigator.clipboard.writeText(this.props.text)
        .then(this.showFeedback);
    }

    showFeedback = () => {
        if (this.state.hasFeedback)
            return;

        this.setState({hasFeedback: true}, () => setTimeout(this.hideFeedback, 500));
    }

    hideFeedback = () => {
        this.setState({hasFeedback: false});
    }

    render() {
        let className = 'copy-button';
        if (this.state.hasFeedback)
            className += ' success';

        return (
            <>
            <button 
                type="button" 
                className={className} 
                title="Copy" 
                onClick={this.handleClick}
            >
                <icons.clipboard />
            </button>
            {this.state.hasFeedback && <span className="copy-feedback"></span>}
            </>
        );
    }
}


function getInputLangTermCol(term, termData) {
    /* returns term column for input lang */

    return (
        <td>
            <div className="term">
                <span>{term} <CopyButton text={term} /></span>
                {termData.variants 
                    ? Object.keys(termData.variants).map((variant) => {
                        if (!termData.variants[variant])
                            return <span>{variant} <CopyButton text={variant} /></span>;

                        return (
                            <span>{variant} <span className="bracket">({termData.variants[variant]})</span></span>
                        );
                    }) 
                    : null
                }
            </div>
            <div className="description">
                {termData.description}
            </div>
        </td>
    );
}


function getOutputLangTermCol(value) {
    /* returns the term column for output lang */

    return (
        <td>
            {typeof value === 'object' && value !== null ?
                Object.keys(value).map((key) => {
                    return (
                        <div className="term">
                            <span>{key} <CopyButton text={key} /></span>
                            <div className="comments">{value[key]}</div>
                        </div>
                    );
                })
                :
                <div className="term">
                    <span>{value || '-'} <CopyButton text={value || '-'} /></span>
                </div>
            }
        </td>
    );

}


function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}