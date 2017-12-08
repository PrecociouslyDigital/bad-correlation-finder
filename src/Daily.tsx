import * as React from 'react';
import firebase from './firebase/firebase';
import * as NumericInput from "react-numeric-input";


export default class Daily extends React.Component<{
  idString: string;
  firebaseRef: firebase.database.Reference;
}>{
  static dailyWidgets : {
    [key:string] : (a:string, b:Daily)=>JSX.Element;
  } = {
    "booly" : function(title, thisRef){
      return (
        <div className="btn-group form-group">
          <label className="btn btn-success">
            <input type="radio" name={title} value="true" checked={thisRef.state.data[title] === true} onChange={thisRef.handleChange} required/> Yes
          </label>
          <label className="btn btn-warning">
            <input type="radio" name={title} value="undefined" checked={thisRef.state.data[title] === undefined} onChange={thisRef.handleChange} required/> Not Sure
          </label>
          <label className="btn btn-danger">
            <input type="radio" name={title} value="false" checked={thisRef.state.data[title] === false} onChange={thisRef.handleChange} required/> No
          </label>
        </div>
      );
    },
    "numery" : function(title, thisRef){
      return (
        <div className="form-group">
          <label htmlFor={title} className="control-label col-md-4">{title}</label>
          <NumericInput name={title} className="form-control col-md-8" value={thisRef.state.data[title]} onChange={thisRef.handleChange} required/>
        </div>
      );
    }
  }
  state:{
    correlates:{
      [key:string] : string;  
    };
    data : {
      [key:string] : any;
    }
  } = {
    correlates:{},
    data:{},
  };
  
  constructor(props:{
    idString: string;
    firebaseRef: firebase.database.Reference;
  }){
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  
  render() {
    const correlates: JSX.Element[] = [];
    for(const key in this.state.correlates){
      correlates.push(Daily.dailyWidgets[this.state.correlates[key]](key, this));
    }
    return (
        <form onSubmit={this.handleSubmit}>
          {correlates}
        </form>
    );
  }
  
  handleChange(e:{
    target:{
      name:string;
      value:string;
    }
  }) {
      const name = e.target.name;
      let value: any = e.target.value;
      if(value === "true") value = true;
      if(value === "false") value = false;
      if(value === "undefined") value = undefined;
      this.props.firebaseRef.child('dalies').child(this.props.idString).child(name).set(value);
    }
  
  
  componentDidMount() {
    this.props.firebaseRef.child('correlates/daily').on('value', (snapshot)=>{
      if(snapshot){
        this.setState({correlates : snapshot.val()});
      }
    });
    this.props.firebaseRef.child('dalies').child(this.props.idString).on('value', (snapshot)=>{
      if(snapshot){
        this.setState({data : snapshot.val()});
      }
    });
  }
  
  handleSubmit(e:any) {
    e.preventDefault();
    this.props.firebaseRef.child('unfinished')
                              .child(this.props.idString)
                              .set(
                                new Date().toISOString() === this.props.idString 
                                ? false 
                                : null);
  }
}
