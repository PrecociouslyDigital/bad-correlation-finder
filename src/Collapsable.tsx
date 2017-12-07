import * as React from 'react';
class Collapsable extends React.Component<{
  refName : string;
  readableName:string;
}>{
  render(){
    return (
      <div className='card'>
      <div className='card-header' role='tab' id='heading{props.refName}'>
        <h5 className='mb-0'>
          <a data-toggle='collapse' data-parent='#accordion' href='#{props.refName}' aria-expanded='true' aria-controls='{props.refName}'>
            {this.props.readableName}
          </a>
        </h5>
      </div>
      <div id='{props.refName}' className='collapse show' role='tabpanel' aria-labelledby='headingOne'>
        <div className='card-block'>
          {this.props.children}
        </div>
      </div>
    </div>
    
    );
  }
}

export default Collapsable;