import React, { Component } from 'react';
import './index.css';
import pluk from '../../functions';

export default class Page2 extends Component {
    componentDidMount() {
      pluk.fetch({
        api: '/documents/get',
        success: p => {
          console.log(p);
        }
      });
    };

    render() {
      const { parent, history } = this.props;
      const { user } = parent.state;
      
      return <div>
        <h1>Page 2</h1>
        <h2>Hello, {user.displayName}</h2>
        <button onClick={() => history.push('/')}>Go to Home</button>
      </div>;
    };
};