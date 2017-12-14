import * as React from 'react';
import update from 'immutability-helper';

export default class Component<T, S={}> extends React.Component<T, S> {
    protected updateState(updateTarget: {}) {
        this.setState(update(this.state, updateTarget));
    }
}