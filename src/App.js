import React, { Component } from 'react';
import Nav from './components/Nav';
import SignupForm from './components/SignUpForm';
import LoginForm from './components/LoginForm';
import './App.css';
import SearchBar from './components/SearchBar';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayed_form: '',
      logged_in: localStorage.getItem('token') ? true : false,
      username: '',
      email: '',
      projects: '',
      yourprojects: '',
    };
  }

  componentDidMount() {
    if (this.state.logged_in) {
      fetch('http://localhost:8000/projects/current_user/', {
        headers: {
          Authorization: `JWT ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(json => {
          this.setState({
            username: json.username,
            email: json.email
          });
        });
    };
    fetch('http://localhost:8000/projects/views/' , {
      method: 'GET'
    })
    .then(res => res.json())
    .then(json => {
      let title = '';
      for (let i=0;i<json.length;i++) {
        title += json[i].title + " ,";
      }
      this.setState({
        projects: title,
      });
    })
    .catch(error => {
      console.log(error);
    });
  }

  my_projects = (data) => {
    console.log(data)
    fetch(`http://localhost:8000/projects/views/?search=${data}` , {
      method: 'GET'
    })
    .then(res => res.json())
    .then(json => {
      let title = '';
      for (let i=0;i<json.length;i++) {
        title += json[i].title + " ,";
      }
      this.setState({
        yourprojects: title,
      });
    })
    .catch(error => {
      console.log(error);
    });
  }

  handle_login = (e, data) => {
    e.preventDefault();
    fetch('http://localhost:8000/token-auth/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        localStorage.setItem('token', json.token);
        this.setState({
          logged_in: true,
          displayed_form: '',
          username: json.user.username,
          email: json.user.email
        }, () => {
          this.my_projects(this.state.username);
        });
      });
  };

  handle_signup = (e, data) => {
    e.preventDefault();
    fetch('http://localhost:8000/projects/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        localStorage.setItem('token', json.token);
        this.setState({
          logged_in: true,
          displayed_form: '',
          username: json.username,
          email: json.email
        }, () => {
          this.my_projects(this.state.username);
        });
      });
  };

  handle_logout = () => {
    localStorage.removeItem('token');
    this.setState({
      logged_in: false,
      username: '' ,
      email: ''
    });
  };

  display_form = form => {
    this.setState({
      displayed_form: form
    });
  };

  handle_buttonclick = (e , data) => {
    e.preventDefault();
    let api_url;
    if (data.search !== '') {
      api_url = `http://localhost:8000/projects/views/?search=${data.search}`;
    } else {
      api_url = 'http://localhost:8000/projects/views/' ;
    };
    console.log(api_url);
    fetch(api_url , {
      method: 'GET'
    })
    .then(res => res.json())
    .then(json => {
      let title = '';
      for (let i=0;i<json.length;i++) {
        title += json[i].title + " ,";
      }
      this.setState({
        projects: title,
      });
    })
    .catch(error => {
      console.log(error);
    });
  };

  render() {
    let form;
    switch (this.state.displayed_form) {
      case 'login':
        form = <LoginForm handle_login={this.handle_login} />;
        break;
      case 'signup':
        form = <SignupForm handle_signup={this.handle_signup} />;
        break;
      default:
        form = null;
    }

    return (
      <div className="App">
        <Nav
          logged_in={this.state.logged_in}
          display_form={this.display_form}
          handle_logout={this.handle_logout}
        />
        {form}
        <h3>
          {this.state.logged_in
            ?
            <div>
              <p>
              Hello, {this.state.username}, your email is, {this.state.email} and the
              projects are {this.state.projects }
              </p>
              <br/>
              <p>**** LEFT HAND SIDE ****</p>
              <br/>
              <p>
              your projects are {this.state.yourprojects}
              </p>
              <br/>
              <SearchBar handle_buttonclick={this.handle_buttonclick} />
            </div>
            : 'Please Log In'}
        </h3>
      </div>
    );
  }
}

export default App;
