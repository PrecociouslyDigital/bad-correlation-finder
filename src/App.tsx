import * as React from 'react';
import './App.css';
import firebase from './firebase/firebase';
import { UserInfo } from 'firebase';
import { FirebaseAuth } from 'react-firebaseui';
import { Collapsable, Collapse } from './Collapsable';
import NewCorrelate from './NewCorrelate';
import Daily from './Daily';
import Hourly from './Hourly';
import Component from './Component';
import * as moment from 'moment';
import * as cron from 'node-cron';

export default class App extends Component<{},GlobalAppState> {
  
  constructor(props: {}) {
    super(props);
    this.state = {
      unfinished: {
        daily: {
        }
      },
      userInfo: null,
      userFirebaseRef : null,
      signedIn: false
    };
    this.logout = this.logout.bind(this);
  }
  render() {
    const dailies: JSX.Element[] = [];
    if (this.state.userFirebaseRef) {
      for (const key in this.state.unfinished.daily) {
        const show = this.state.unfinished.daily[key];
        dailies.push(
                      <Collapsable 
                        refName={'daily' + key}
                        readableName={'Daily Tasks For ' + moment(key, timeFormat).calendar(null, calendarFormat)}
                        show={show} 
                        octicon={!show ? "check" : undefined}
                        octiconClass="text-success"
                      >
                        <Daily firebaseRef={this.state.userFirebaseRef} dateString={key} key={key}/>
                      </Collapsable>
                    );
      }
    }
    return (
      <div className="container-fluid">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
          </button>

          <a className="navbar-brand mr-auto" href="#">Navbar</a>
          
          <div className="navbar-collapse collapse">
            <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                    <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
                </li>

            </ul>
            <ul className="navbar-nav">
            {this.state.signedIn ?
              <button className="btn btn-primary " onClick={this.logout}>Log Out</button>
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
                    callbacks: {
                      signInSuccess: () => {this.mountListeners(); return false; }
                    }
                  }} firebaseAuth={firebase.auth()}/>
                </ul>
              </li>
            }
            </ul>
          </div>
        </nav>
        {this.state.signedIn ?
          <div className="container-fluid">
            <div className="row justify-content-lg-around">
              <Collapse>
                <Collapsable refName="NewCorrelate" key="NewCorrelate" readableName="New Correlate" show={false}>
                  <NewCorrelate userFirebaseRef={this.state.userFirebaseRef}/>
                </Collapsable>
                <Collapsable refName="Hourlies" key="Hourlies" readableName={"Hourlies for " + moment().format("hA")}  show={true}>
                  <Hourly dateString={moment().format(timeFormat)} hour={moment().hour().toString()} firebaseRef={this.state.userFirebaseRef}/>
                </Collapsable>
                {dailies}
              </Collapse>
            </div>
            
          </div>
            :
            <div className="row">
              <div className="col-lg-12"> 
                YOU'RE NOT SIGNED IN.
              </div>
            </div>
        }
      </div>
    ); //TODO: change this at some point
  }

  logout() {
    firebase.auth().signOut();
  }
  
  mountListeners() {
    this.state.userFirebaseRef.child('unfinished').child('daily').once('value', (snapshot) => {
      let data = snapshot.val();
      if (data) {
        if (data[moment().format(timeFormat)] !== undefined) {
          return;
        }
      }
      this.state.userFirebaseRef.child('unfinished').child('daily').child(moment().format(timeFormat)).transaction((val) =>{
        if(val == null) return true;
        return undefined;
      });
    });
    let updateFunction = (snapshot) => {
      if (snapshot) {
        this.updateState({unfinished : {
            daily: {
              [snapshot.key] : {
                $set: snapshot.val()
              }
            }
          }
        });
      }
    };
    this.state.userFirebaseRef.child('unfinished').child('daily').on('child_added', updateFunction);
    //Hackiness to allow animation
    this.state.userFirebaseRef.child('unfinished').child('daily').on('child_changed', (snapshot)=>setTimeout(()=>updateFunction(snapshot), 500));
    this.state.userFirebaseRef.child('unfinished').child('daily').on('child_removed', (snapshot) => {
      if (snapshot) {
        this.updateState({unfinished : {
            daily: {
              [snapshot.key] : {
                $set: false
              }
            }
          }
        });
      }
    });
    cron.schedule('3 * * * *', ()=>{
      this.forceUpdate();
    });
  }
  
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.updateState({
          $merge: {
            signedIn: true,
            user: user,
            userFirebaseRef: firebase.database().ref(`users/${user.uid}`)
          }
        });
        this.mountListeners();
      } else {
        this.updateState({
          $merge: {
            signedIn: false,
            user : null,
            userFirebaseRef: null
          }
        });
      } 
    });
    
  }
}

export interface GlobalAppState {
      userInfo: UserInfo ; 
      userFirebaseRef: firebase.database.Reference ;
      signedIn: boolean;
      unfinished: {
        daily: {
          [key: string]: boolean;
        };
      };
}

export const timeFormat: string = 'MM-DD-YYYY';

export const calendarFormat = {
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[Yesterday]',
    lastWeek: '[Last] dddd',
    sameElse: 'MMMM DDDD YYYY'
};