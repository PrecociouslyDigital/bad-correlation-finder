import * as React from 'react';
export class Collapsable extends React.Component<{
  refName : string;
  readableName:string;
  show ?: boolean;
}>{
  render(){
    return (
      <div className='card'>
      <div className='card-header' role='tab' id={"heading" + this.props.refName}>
        <h5 className='mb-0'>
          <a data-toggle='collapse' /*data-parent='#accordion' We want multiple open I think*/ href={"#" + this.props.refName} aria-expanded='true' aria-controls={this.props.refName}>
            {this.props.readableName}
          </a>
        </h5>
      </div>
      <div id={this.props.refName} className={'collapse' + this.props.show ? 'show' : '' } role='tabpanel' aria-labelledby={this.props.refName}>
        <div className='card-block'>
          {this.props.children}
        </div>
      </div>
    </div>
    
    );
  }
}

export class Collapse extends React.Component{
  render(){
    return(
      <div id="accordion" role="tablist" aria-multiselectable="true">
        {this.props.children}
      </div>
    );
  }
}


