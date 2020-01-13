import React, { Component } from "react";
// import "../assets/css/Bubbles.scss";
export default class Bubbles extends Component {
  render() {
    return (
      <div>
        <div className="Rside-chat">
          <p>{this.props.rightMessage}</p>
          <span className="time">{this.props.time}</span>
        </div>
      </div>
    );
  }
}
