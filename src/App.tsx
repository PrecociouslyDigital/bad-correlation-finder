import * as React from 'react';
import './App.css';
import firebase from './firebase/firebase';
import { UserInfo } from 'firebase';
import { FirebaseAuth } from 'react-firebaseui';
import {Collapsable, Collapse} from './Collapsable';
import NewCorrelate from './NewCorrelate';
import Daily from './Daily';

export default class App extends React.Component {
  state:GlobalAppState;
  
  constructor(props:{}) {
    super(props);
    this.state = {
      unfinished:{
        daily:{
        }
      },
      userInfo:null,
      userFirebaseRef : null,
      signedIn: false
    };
    this.logout = this.logout.bind(this);
  }
  render() {
    const dailies :JSX.Element[] = [];
    if(this.state.userFirebaseRef){
      for(const key in this.state.unfinished.daily){
        dailies.push(
                      <Collapsable refName={"daily" + key} readableName={"Daily Tasks For " + key} show={this.state.unfinished.daily[key]}>
                        <Daily firebaseRef={this.state.userFirebaseRef} idString={key}/>
                      </Collapsable>
                    );
      }
    }
    return (
      <div className='container-fluid'>
        <nav className='navbar navbar-expand-lg navbar-dark bg-primary'>
          <button className ='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarNavDropdown' aria-controls='navbarNavDropdown' aria-expanded='false' aria-label='Toggle navigation'>
              <span className='navbar-toggler-icon'></span>
          </button>

          <a className='navbar-brand mr-auto' href='#'>Navbar</a>
          
          <div className='navbar-collapse collapse'>
            <ul className='navbar-nav mr-auto'>
                <li className='nav-item active'>
                    <a className='nav-link' href='#'>Home <span className='sr-only'>(current)</span></a>
                </li>

            </ul>
            <ul className='navbar-nav'>
            {this.state.signedIn ?
              <button className='btn btn-primary ' onClick={this.logout}>Log Out</button>
            :
              <li className="dropdown">
                <a className="dropdown-toggle" data-toggle="dropdown" href="#">Login
                <span className="caret"></span></a>
                <ul className="dropdown-menu dropdown-menu-right">
                  <FirebaseAuth uiConfig={{
                    signInFlow: 'popup',
                    signInOptions: [
                      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                      firebase.auth.EmailAuthProvider.PROVIDER_ID
                    ],
                    callbacks:{
                      signInSuccess:()=>{this.mountListeners(); return false}
                    }
                  }} firebaseAuth={firebase.auth()}/>
                </ul>
              </li>
            }
            </ul>
          </div>
        </nav>
        {this.state.signedIn ?
          <div className='container-fluid'>
            <div className='row'>
              You're Logged In
              <Collapse>
                <Collapsable refName="firebaseRef" readableName="Firebase Url">
                  <pre>
                    {JSON.stringify(this.state.userFirebaseRef.toJSON(),null,4)}
                  </pre>
                </Collapsable>
                <Collapsable refName="NewCorrelate" readableName="New Correlate">
                  <NewCorrelate userFirebaseRef={this.state.userFirebaseRef}/>
                </Collapsable>
                {dailies}
              </Collapse>
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
    );//TODO: change this at some point
  }


  logout() {
    firebase.auth().signOut();
  }
  
  mountListeners(){
    this.state.userFirebaseRef.child('unfinished').once('value',(snapshot)=>{
      let data = snapshot.val();
      if(data){
        if(data[new Date().toISOString()] === undefined){
          this.state.userFirebaseRef.child("unfinished").child(new Date().toISOString()).set(true);
        }
      }
    });
    let updateFunction = (snapshot)=>{
      if(snapshot){
        this.setState({unfinished : {
            daily:{
              [snapshot.key] : snapshot.val()
            }
          }
        });
      }
    };
    this.state.userFirebaseRef.child('unfinished').on('child_added',updateFunction);
    this.state.userFirebaseRef.child('unfinished').on('child_changed',updateFunction);
    this.state.userFirebaseRef.child('unfinished').on('child_removed',(snapshot)=>{
      if(snapshot){
        this.setState({unfinished : {
          [snapshot.key] : false
        }});
      }
    });
  }
  
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          signedIn:true,
          user:user,
          userFirebaseRef:firebase.database().ref(`users/${user.uid}`)
        });
        this.mountListeners();
      }else{
        this.setState({
          signedIn:false,
          user : null,
          userFirebaseRef:null
        });
      } 
    });
    
  }
}

export interface GlobalAppState {
      userInfo : UserInfo ; 
      userFirebaseRef: firebase.database.Reference ;
      signedIn: boolean;
      unfinished:{
        daily: {
          [key: string] : boolean;
        };
      }
}

