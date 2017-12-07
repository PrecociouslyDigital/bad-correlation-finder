import * as React from 'react';
import Collapsable from './Collapsable';
import firebase from './firebase/firebase';

class Daily extends React.Component<{
  dateString: string;
  firebaseRef: firebase.database.Reference;
}>{
  state:{
    correlates:{
      [key:string] : string;  
    };
    data : {
      [key:string] : any;
    }
  }
  render() {
    return (
      <Collapsable refName={this.props.dateString} readableName={'Correlates for' + this.props.dateString}>
        <form>
          //Iterator goes here
        </form>
      </Collapsable>
    );
  }
  componentDidMount() {
    this.props.firebaseRef.child('correlates/daily').on('value', (snapshot)=>{
      if(snapshot){
        this.setState({correlates : snapshot.val()});
      }
    });
    this.props.firebaseRef.child(`dalies/${this.props.dateString}`).on('value', (snapshot)=>{
      if(snapshot){
        this.setState({data : snapshot.val()});
      }
    });
  }
}

export default Daily;