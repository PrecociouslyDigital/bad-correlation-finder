import * as React from 'react';
import './App.css';


class App extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm">
            One of three columns
          </div>
          <div className="col-sm">
            It is now {Date().toLocaleString()}
          </div>
          <div className="col-sm">
            One of three columns
          </div>
        </div>
      </div>
    );
  }
}

export default App;
