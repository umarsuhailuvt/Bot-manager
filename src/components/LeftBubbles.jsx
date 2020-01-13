import React, { Component } from "react";

export default class LeftBubbles extends Component {
  render() {
    return (
      <div>
        <div className="Lside-chat">
          <p>{this.props.leftMessage}</p>
          <span className="time">{this.props.time}</span>
        </div>
      </div>
    );
  }
}