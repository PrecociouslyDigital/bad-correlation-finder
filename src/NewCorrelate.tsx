import * as React from 'react';
import firebase from './firebase/firebase';

export default class NewCorrelate extends React.Component<{userFirebaseRef:firebase.database.Reference}>{
    state : {
      type:string;
      name:string;
      frequency:string;
    } = {
        type:"booly",
        name:"",
        frequency:"hourly"
      };
    constructor(props:{userFirebaseRef:firebase.database.Reference}) {
      super(props);
      this.resetState();
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
    resetState(){
      this.setState({
        type:"booly",
        name:"",
        frequency:"hourly"
      });
    }
    
    render(){
        return(
            <form className = "list-group list-group-flush form-horizontal" onSubmit={this.handleSubmit}>
                <div className="form-group form-row justify-content-between align-items-center">
                    <label htmlFor="name" className="control-label col-lg-auto">Task Name</label>
                    <input type="text" onChange={this.handleChange} className="form-control col-lg-auto" id="name" aria-describedby="nameHelp" placeholder="Enter name" value={this.state.name} required />
                    <small id="nameHelp" className="form-text text-muted">Describe your task here</small>
                  </div>
                  <div className="form-group form-row justify-content-between align-items-center">
                    <label htmlFor="frequency" className="control-label col-lg-auto">Frequency</label>
                    <select className="form-control col-lg-auto" id="frequency" onChange={this.handleChange} value={this.state.frequency} required>
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                    </select>
                  </div>
                  <div className="form-group form-row justify-content-between align-items-center">
                    <label htmlFor="type" className="control-label col-lg-auto">Type</label>
                    <select className="form-control col-lg-auto" id="type" onChange={this.handleChange} value={this.state.type} required>
                        <option value="booly">True/False</option>
                        <option value="numbery">Numeric</option>
                    </select>
                  </div>
                  <div className="form-group form-row">
                    <button type="submit col-lg-auto" className="btn btn-primary">Submit</button>
                  </div>
            </form>
        );
    }
    handleChange(e:any) {
      this.setState({
        [e.target.id]: e.target.value
      });
    }
    handleSubmit(e:any) {
      e.preventDefault();
      this.props.userFirebaseRef.child('correlates').child(this.state.frequency).update({
        [this.state.name] : this.state.type
      });
      this.resetState();
    }
    

}
