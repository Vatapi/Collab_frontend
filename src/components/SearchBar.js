import React from 'react';
import PropTypes from 'prop-types';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search : '',
    };
  };

  handle_change = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });
  };

  render() {
    return (
      <form>
        <h4>Sign Up</h4>
        <label htmlFor="search">Search</label>
        <input
          type="text"
          name="search"
          value={this.state.search}
          onChange={this.handle_change}
        />
        <input type="submit"  onClick={e => this.props.handle_buttonclick(e,this.state)}/>
      </form>
    );
  }
}

export default SearchBar;

SearchBar.propTypes = {
  handle_buttonclick: PropTypes.func.isRequired
}
