import * as React from 'react';
import './App.css';
import /*firebase*/ { auth, provider } from './firebase/firebase';
import {UserInfo} from 'firebase';


class App extends React.Component {
  state : GlobalAppState;
  constructor(props : {}){
    super(props);
    this.state = {
      currentItem: '',
      username: '',
      items: [],
    }
    this.login = this.login.bind(this); 
    this.logout = this.logout.bind(this);

  }
  render() {
    return (
      <div className='container'>
        <nav className='navbar navbar-expand-lg navbar-dark bg-primary'>
          <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarNavDropdown' aria-controls='navbarNavDropdown' aria-expanded='false' aria-label='Toggle navigation'>
              <span className='navbar-toggler-icon'></span>
          </button>
          
          <a className='navbar-brand mr-auto' href='#'>Navbar</a>
          
          <div id='navbarNavDropdown' className='navbar-collapse collapse'>
            <ul className='navbar-nav mr-auto'>
                <li className='nav-item active'>
                    <a className='nav-link' href='#'>Home <span className='sr-only'>(current)</span></a>
                </li>

            </ul>
            <ul className='navbar-nav'>
              {this.state.user ?
                <button className='btn btn-primary ' onClick={this.logout}>Log Out</button>                
                :
                <button className='btn btn-primary ' onClick={this.login}>Log In</button>              
              }
            </ul>
          </div>
        </nav>

      </div>
    );
  }


  handleChange(e :any) {
    /* ... */
  }
  logout() {
    // we will add the code for this in a moment, but need to add the method now or the bind will throw an error
  }
  login() {
    auth.signInWithPopup(provider) 
      .then((result) => {
        const user : UserInfo = result.user;
        this.setState({
          user
        });
      });
  }

}

interface GlobalAppState {
      currentItem: string,
      username: string,
      items: string[],
      user?: UserInfo  // <-- add this line
}

export default App;
