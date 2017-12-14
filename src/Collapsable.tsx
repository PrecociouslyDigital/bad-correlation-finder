import * as React from 'react';
import Component from './Component'
import * as octicon from 'octicons';

export class Collapsable extends Component<{
  refName: string;
  readableName: string;
  show ?: boolean;
  octicon ?: string;
  octiconClass ?: string;
}> {
  render() {
    return (
    <div className="card col-lg-4" style={{padding: 0}}>
      <div className="card-header" role="tab" id={'heading' + this.props.refName}>
        <h5 className="mb-0">
          <a className={this.props.show ? '' : 'collapsed'} data-toggle="collapse" href={'#' + this.props.refName} aria-expanded="true" aria-controls={this.props.refName}>
            {this.props.readableName}
          </a>
          {this.props.octicon ? 
            <span className={this.props.octiconClass ? this.props.octiconClass : ""} dangerouslySetInnerHTML={{__html:octicon[this.props.octicon].toSVG()}}></span>
            : <div></div>
          }
        </h5>
      </div>
      <div className="col-lg-12">
        <div 
         id={this.props.refName}
         className={'collapse ' + (this.props.show ? 'show' : '')} 
         role="tabpanel" 
         aria-labelledby={this.props.refName} 
        >
          <div className="card-block">
            {this.props.children}
          </div>
        </div>
      </div>
    </div>
    
    );
  }
}

export class Collapse extends React.Component {
  render() {
    return(
      <div id="accordion" role="tablist" aria-multiselectable="true" className="row w-100 justify-content-around">
        {this.props.children}
      </div>
    );
  }
}
