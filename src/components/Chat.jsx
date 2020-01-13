import React, { Component } from "react";
import axios from "axios";
import ApiConstants from "../api/apiConstants";

export default class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textInput: "",
      messages: []
    };
  }
  componentDidMount() {
    this.scrollToBottom();
  }
  componentDidUpdate() {
    this.scrollToBottom();
  }
  handleInput = value => {
    this.setState({
      textInput: value
    });
  };
  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest"
    });
  };
  handleMessage = () => {
    const { messages, textInput } = this.state;
    let object = [
      ...messages,
      {
        message: textInput,
        from: "user"
      }
    ];
    this.setState({ messages: object, textInput: "" });

    const formdata = new FormData();
    formdata.append("text", textInput);

    axios({
      method: "post",
      url: `${ApiConstants.chat_api}`,
      data: formdata
    }).then(response => {
      const { messages } = this.state;
      console.log(response);

      let object2 = [
        ...messages,
        {
          message: response.data,
          from: "bot"
        }
      ];
      this.setState({ messages: object2 });
    });
  };
  render() {
    const { messages } = this.state;
    return (
      <div
        className="modal show"
        id="exampleModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        style={{ display: "block" }}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Bot Activity
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={this.props.handleClose}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div
              className="modal-body"
              style={{ minHeight: "450px", width: "350px" }}
            >
              <div className="message-wrapper" style={{ width: "100%" }}>
                {this.state.messages &&
                  messages.map((message, index) => {
                    const className =
                      message.from === "bot"
                        ? "messages-left"
                        : "messages-right";
                    return (
                      <div className={className} key={index}>
                        <span style={{ color: "black" }}>
                          {message.message}
                        </span>
                      </div>
                    );
                  })}
                <div
                  style={{ float: "left", clear: "both" }}
                  ref={el => {
                    this.messagesEnd = el;
                  }}
                />
              </div>
              <div
                style={{ position: "absolute", bottom: 0, left: 0, margin: 10 }}
                className="row"
              >
                <input
                  type="text"
                  className="form-control"
                  style={{ width: "80%" }}
                  placeholder="type message here..."
                  onChange={e => this.handleInput(e.target.value)}
                  value={this.state.textInput}
                ></input>
                <button onClick={this.handleMessage} className="send-button">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
