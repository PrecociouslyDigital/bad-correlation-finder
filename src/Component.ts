import * as React from 'react';
import update from 'immutability-helper';

export default class Component<T> extends React.Component<T> {
    protected updateState(updateTarget: any) {
        this.setState(update(this.state, updateTarget));
    }
}