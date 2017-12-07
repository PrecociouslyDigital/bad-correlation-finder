import * as React from 'react';
import './App.css';
import firebase, { auth, provider } from './firebase/firebase';
import {UserInfo} from 'firebase';


class App extends React.Component {
  state : GlobalAppState;
  
  constructor(props : {}){
    super(props);
    this.state = {
    }
    this.login = this.login.bind(this, ); 
    this.logout = this.logout.bind(this);
  }
  render() {
    return (
      <div className='container-fluid'>
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
                <button className='btn btn-primary ' onClick={this.state.user ? this.logout : this.login}>{this.state.user ? 'Log Out' : 'Log In'}</button>
            </ul>
          </div>
        </nav>
        {this.state.user ?
          <div className='container-fluid'>
            <div className='row'>
              You're Logged In
              {this.state.user.userFirebaseRef.toString()}
            </div>
            <div className='row'>
              <div id='accordion' role='tablist' aria-multiselectable='true' className='col-lg-12'>
                
              </div>
            </div>
          </div>
            :
            <div className='row'>
              <div className='col-lg-12'>
                YOU'RE NOT SIGNED IN.
              </div>
            </div>
        }
      </div>
    );
  }


  logout() {
    auth.signOut();
  }
  login() {
    auth.signInWithPopup(provider);
  }
  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          user:{
            user:user,
            userFirebaseRef:firebase.database().ref(`users/${user.uid}`)
          }
        });
      }else{
        this.setState({
          user:null,
        });
      } 
    });
  }


}

interface GlobalAppState {
      
      user?:{
        userInfo : UserInfo; 
        userFirebaseRef: firebase.database.Reference;
      }   // <-- add this line
}

export default App;
