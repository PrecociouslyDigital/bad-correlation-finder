import * as React from 'react';
import firebase from './firebase/firebase';
import Component from './Component';
import { timeFormat } from './App';
import * as moment from 'moment';
import * as parseNumber from 'parse-number'

export default class Daily extends Component<{
  dateString: string;
  firebaseRef: firebase.database.Reference;
}> {
  
  state: {
    correlates: {
      [key: string]: string;  
    };
    data: {
      [key: string]: {};
    }
  } = {
    correlates: {},
    data: {},
  };
  
  constructor(props: {
    dateString: string;
    firebaseRef: firebase.database.Reference;
  }) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNumber = this.handleNumber.bind(this);
  }
  
  instanceRef(): firebase.database.Reference {
    return this.props.firebaseRef.child('daily').child(this.props.dateString);
  } 
  
  render() {
    const correlates: JSX.Element[] = [];
    for (const key in this.state.correlates) {
      correlates.push(lineWrapper(dailyWidgets[this.state.correlates[key]](key, this)));
    }
    return (
        <form onSubmit={this.handleSubmit} className="list-group list-group-flush form-horizontal">
          {correlates}
          {lineWrapper(<div className="form-group form-row">
            <button type="submit col-lg-auto" className="btn btn-primary">Submit</button>
          </div>)}
        </form>
    );
  }
  
  handleNumber(e: {
    target: {
      name: string;
      value: string|number|string[];
    }
  }) {
    this.instanceRef().child(e.target.name).set(Number(e.target.value));
  }
  
  componentDidMount() {
    this.props.firebaseRef.child('correlates/daily').on('value', (snapshot) => {
      if (snapshot) {
        this.updateState({correlates : {$set: snapshot.val()}});
      }
    });
    const updateArrow = (snapshot: firebase.database.DataSnapshot) => {
      this.updateState({
        data : {
          [snapshot.key] : {$set: snapshot.val()}
        }
      });
    };
    this.instanceRef().on('child_added', updateArrow);
    this.instanceRef().on('child_changed', updateArrow);
    this.instanceRef().on('child_removed', (snapshot: firebase.database.DataSnapshot) => {
      this.updateState({
        data : {
          [snapshot.key] : {$set: null}
        }
      });
    });
  }
  
  handleSubmit(e: {
    preventDefault : ()=>void;
  }) {
    e.preventDefault();
    this.props.firebaseRef.child('unfinished')
                              .child('daily')
                              .child(this.props.dateString)
                              // Set false if it's today to just hide, remove if it's a past due one.
                              .set(this.props.dateString === moment().format(timeFormat) ? false : null);
  }
  handleRadioClick(name: string, value: boolean) {
    this.instanceRef().child(name).set(value);
  }
}

const dailyWidgets: {
  [key: string]: (a: string, b: Daily) => JSX.Element;
} = {
  'booly' : function(title, thisRef) {
    // Super not explicit, but should result in only casting non-null types to string. 
    const value = thisRef.state.data[title] == null 
                          ? thisRef.state.data[title] 
                          : thisRef.state.data[title].toString();
    // I know I'm probably committing a cardnial Sin. I don't care at this point tho
    return (
        <div className="form-row justify-content-between align-items-center">
          <label className="control-label col-lg-auto" htmlFor={title}>{title}</label>
          <div className="btn-group col-lg-auto align-self-end" data-toggle="buttons">
            <label 
              className={'btn btn-success ' + value === 'true' ? 'active' : ''}
              onClick={() => thisRef.handleRadioClick(title, true)}
            >
              Yes
            </label>
            <label 
              className={'btn btn-warning ' + value === null ? 'active' : ''}
              onClick={() => thisRef.handleRadioClick(title, null)}
            >
              Not Sure
            </label>
            <label 
              className={'btn btn-danger ' + value === 'false' ? 'active' : ''} 
              onClick={() => thisRef.handleRadioClick(title, false)}
            >
              No
            </label>
          </div>
        </div>
    );
  },
  'numbery' : function(title, thisRef) {
    return (
      <div className="form-row justify-content-between align-items-center">
        <label htmlFor={title} className="control-label col-lg-auto">{title}</label>
        <input type="number" name={title} className="form-control col-lg-auto align-self-end" value={parseNumber(thisRef.state.data[title])} onChange={thisRef.handleNumber} required={true}/>
      </div>
    );
  }
};

const lineWrapper = (wrapping: JSX.Element) => (<div className="list-group-item"> {wrapping}</div>);