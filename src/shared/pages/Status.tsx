import React from 'react';
import { Link } from 'react-router-dom';

export default class Home extends React.Component<any> {
  render() {
    return (
      <div>
        STATUS :)
        <br /> go <Link to="/">home</Link>
      </div>
    );
  }
}
