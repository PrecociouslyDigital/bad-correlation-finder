import * as React from 'react';
import firebase from './firebase/firebase';
import Component from './Component';
import * as moment from 'moment';

export default class Hourly extends Component<{
  dateString: string;
  hour : string;
  firebaseRef: firebase.database.Reference;
}> {
  
  state: {
    correlates: {
      [key: string]: string;  
    };
    data: {
      [key: string]: any;
    }
  } = {
    correlates: {},
    data: {},
  };
  
  constructor(props: {
    dateString: string;
    hour: string;
    firebaseRef: firebase.database.Reference;
  }) {
    super(props);
    this.handleActive = this.handleActive.bind(this);
    this.handleNumber = this.handleNumber.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
  }
  
  instanceRef(): firebase.database.Reference {
    return this.props.firebaseRef.child('hourly').child(this.props.dateString).child(this.props.hour);
  } 
  
  render() {
    const correlates: JSX.Element[] = [];
    for (const key in this.state.correlates) {
      correlates.push(lineWrapper(dailyWidgets[this.state.correlates[key]](key, this)));
    }
    return (
        <form className="list-group list-group-flush form-horizontal" onFocus={this.handleActive} onMouseMove={this.handleActive}>
          {correlates}
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
  
  handleCheck(e: {
    target: {
      name: string;
      checked:boolean;
    }
  }) {
      this.instanceRef().child(e.target.name).set(e.target.checked);
  }
  
  componentDidMount() {
    this.props.firebaseRef.child('correlates/hourly').on('value', (snapshot) => {
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
  }
  
  handleActive() {
    this.instanceRef().transaction((data) => data == null ? true : undefined);
  }
}

const dailyWidgets: {
  [key: string]: (a: string, b: Hourly) => JSX.Element;
} = {
  'booly' : function(title, thisRef) {
    return (
        <div className="form-row justify-content-between align-items-center">
          <label className="form-check-label">
            <input className="form-check-input" type="checkbox" checked={thisRef.state.data[title] === true} onChange={thisRef.handleCheck} name={title} />
            {title}
          </label>
        </div>
    );
  },
  'numbery' : function(title, thisRef) {
    return (
      <div className="form-row justify-content-between align-items-center">
        <label htmlFor={title} className="control-label col-lg-auto">{title}</label>
        <input type="number" name={title} className="form-control col-lg-auto align-self-end" value={thisRef.state.data[title]} onChange={thisRef.handleNumber} required={true}/>
      </div>
    );
  }
};

const lineWrapper = (wrapping: JSX.Element) => (<div className="list-group-item"> {wrapping}</div>);