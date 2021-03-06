const {
  CategoryColorLine,
  ReaderNavigationMenuSearchButton,
  ReaderNavigationMenuCloseButton,
  ReaderNavigationMenuDisplaySettingsButton,
  LoadingMessage,
}                      = require('./Misc');
const React            = require('react');
const ReactDOM         = require('react-dom');
const $                = require('./sefaria/sefariaJquery');
const Sefaria          = require('./sefaria/sefaria');
const classNames       = require('classnames');
const PropTypes        = require('prop-types');
const Footer           = require('./Footer');
const SearchResultList = require('./SearchResultList');
import Component from 'react-class';


class SearchPage extends Component {
    constructor(props) {
      super(props);
      this.state = {};
    }
    render () {
        var fontSize       = 62.5; // this.props.settings.fontSize, to make this respond to user setting. disabled for now.
        var style          = {"fontSize": fontSize + "%"};
        var classes        = classNames({readerNavMenu: 1, noHeader: this.props.hideNavHeader});
        var contentClasses = classNames({content: 1, hasFooter: this.props.panelsOpen === 1});
        var isQueryHebrew  = Sefaria.hebrew.isHebrew(this.props.query);
        return (<div className={classes} key={this.props.query}>
                  {this.props.hideNavHeader ? null :
                    (<div className="readerNavTop search">
                      <CategoryColorLine category="Other" />
                      <ReaderNavigationMenuCloseButton onClick={this.props.close}/>
                      <ReaderNavigationMenuDisplaySettingsButton onClick={this.props.openDisplaySettings} />
                      <SearchBar
                        initialQuery = { this.props.query }
                        updateQuery = { this.props.onQueryChange } />
                    </div>)}
                  <div className={contentClasses}>
                    <div className="contentInner">
                      <div className="searchContentFrame">
                          <h1 className={classNames({"hebrewQuery": isQueryHebrew, "englishQuery": !isQueryHebrew})}>
                            &ldquo;{ this.props.query }&rdquo;
                          </h1>
                          <div className="searchControlsBox">
                          </div>
                          <div className="searchContent" style={style}>
                              <SearchResultList
                                  query = { this.props.query }
                                  appliedFilters = {this.props.appliedFilters}
                                  onResultClick={this.props.onResultClick}
                                  updateAppliedFilter = {this.props.updateAppliedFilter}
                                  updateAppliedOptionField={this.props.updateAppliedOptionField}
                                  updateAppliedOptionSort={this.props.updateAppliedOptionSort}
                                  registerAvailableFilters={this.props.registerAvailableFilters}
                                  availableFilters={this.props.availableFilters}
                                  filtersValid={this.props.filtersValid}
                                  exactField={this.props.exactField}
                                  broadField={this.props.broadField}
                                  field={this.props.field}
                                  sortType={this.props.sortType}/>
                          </div>
                      </div>
                    </div>
                    { this.props.panelsOpen === 1 ? 
                      <footer id="footer" className={`interface-${this.props.interfaceLang} static sans`}>
                        <Footer />
                      </footer> 
                      : null }
                  </div>
                </div>);
    }
}
SearchPage.propTypes = {
    query:                    PropTypes.string,
    appliedFilters:           PropTypes.array,
    settings:                 PropTypes.object,
    panelsOpen:               PropTypes.number,
    close:                    PropTypes.func,
    onResultClick:            PropTypes.func,
    onQueryChange:            PropTypes.func,
    updateAppliedFilter:      PropTypes.func,
    updateAppliedOptionField: PropTypes.func,
    updateAppliedOptionSort:  PropTypes.func,
    registerAvailableFilters: PropTypes.func,
    availableFilters:         PropTypes.array,
    filtersValid:             PropTypes.bool,
    hideNavHeader:            PropTypes.bool,
    exactField:               PropTypes.string,
    broadField:               PropTypes.string,
    field:                    PropTypes.string,
    sortType:                 PropTypes.oneOf(["relevance","chronological"])
};
SearchPage.defaultProps = {
  appliedFilters: []
};


class SearchBar extends Component {
    constructor(props) {
      super(props);

      this.state = {query: props.initialQuery};
    }
    handleKeypress(event) {
        if (event.charCode == 13) {
            
            this.updateQuery();
            // Blur search input to close keyboard
            $(ReactDOM.findDOMNode(this)).find(".readerSearch").blur();
        }
    }
    updateQuery() {
        if (this.props.updateQuery) {
            this.props.updateQuery(this.state.query)
        }
    }
    handleChange(event) {
        this.setState({query: event.target.value});
    }
    render () {
        return (
            <div>
                <div className="searchBox">
                    <input 
                      className="readerSearch"
                        id="searchInput"
                        title="Search for Texts or Keywords Here"
                        value={this.state.query}
                        onKeyPress={this.handleKeypress} 
                        onChange={this.handleChange} 
                        placeholder="Search"/>
                    <ReaderNavigationMenuSearchButton onClick={this.updateQuery} />
                </div>
                <div className="description"></div>
            </div>
        )
    }
}
SearchBar.propTypes = {
    initialQuery: PropTypes.string,
    updateQuery: PropTypes.func
};


module.exports = SearchPage;
