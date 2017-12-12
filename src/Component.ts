import * as React from 'react';
import update from 'immutability-helper';

export default class Component<T> extends React.Component<T> {
    protected updateState(updateTarget: {}) {
        this.setState(update(this.state, updateTarget));
    }
}