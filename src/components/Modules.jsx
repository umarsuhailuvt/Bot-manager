import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import doctor from "../assets/images/doctor.png";
import start from "../assets/images/start.png";
import cancel from "../assets/images/cancel.png";
import booking from "../assets/images/booking.png";
import register from "../assets/images/register.png";
import lab from "../assets/images/lab.svg";
import Modal from "./Chat";
import axios from "axios";
import ApiConstants from "../api/apiConstants";


// fake data
const getItems = (count, offset = 0) =>
  [
    {
      id: "1",
      content: "Start",
      image: start
    },
    {
      id: "2",
      content: "Appoinment Booking",
      image: booking
    },
    {
      id: "3",
      content: "Talk to doctor",
      image: doctor
    },
    {
      id: "4",
      content: "Lab Support",
      image: lab
    },

    {
      id: "5",
      content: "Register a patient",
      image: register
    },
    {
      id: "6",
      content: "End",
      image: cancel
    }
  ];

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  width: "250px",
  height: "100px",
  // change background colour if dragging
  background: isDragging ? "#eaeaea" : "white",
  boxShadow: "5px grey",
  border: "1px solid grey",
  //   margin: "5px auto",
  borderRadius: "10px",
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: "#344955",
  padding: grid,
  minHeight: "80vh",
  width: "100%",
  display: "flex",
  alignItems: "center",
  flexDirection: "column"
});
const secondListStyle = isDraggingOversecond => ({
  background: "rgb(192, 218, 191)",
  padding: grid,
  minHeight: "80vh",
  width: "100%",
  display: "flex",
  alignItems: "center",
  flexDirection: "column"
});
class Modules extends Component {
  state = {
    items: getItems(),
    selected: [],
    messages: [],
    modalOpen: false
  };

  /**
   * A semi-generic way to handle multiple lists. Matches
   * the IDs of the droppable container to the names of the
   * source arrays stored in the state.
   */
  id2List = {
    droppable: "items",
    droppable2: "selected"
  };

  getList = id => this.state[this.id2List[id]];

  onDragEnd = result => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index
      );

      let state = { items };

      if (source.droppableId === "droppable2") {
        state = { selected: items };
      }

      this.setState(state);
    } else {
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );

      this.setState({
        items: result.droppable,
        selected: result.droppable2
      });
    }
  };
  closeModal = e => {
    this.setState({
      modalOpen: false
    });
  };
  handleSubmit = e => {
    let data = [];
    this.state.selected.map(items => {
      data.push(items.id);
      return items.id;
    });

    if (this.state.selected.length < 1) {
      alert("please select any module");
    } else {
      axios({
        method: "post",
        url: `${ApiConstants.BASE_URL}?options=[${data}]`
      }).then(response => {
        const { messages } = this.state;

        messages.push({
          message: response,
          from: "bot"
        });
      });

      this.setState({
        modalOpen: true
      });
    }
  };
  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (
      <div className="container wrapper">
        <div className="row  bot-wrapper" style={{ margin: "0 auto" }}>
          <DragDropContext onDragEnd={this.onDragEnd} className="row">
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div className="col m-2" style={{ background: "#344955" }}>
                  <h3 className="m-2 text-white">Available Modules</h3>
                  <div
                    className="m-2 col"
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {this.state.items.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            <img
                              src={item.image}
                              alt={item.content}
                              style={{ maxWidth: "50px" }}
                            />
                            {item.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>

            <Droppable droppableId="droppable2">
              {(provided, snapshot) => (
                <div
                  className="col m-2"
                  style={{ background: "rgb(192, 218, 191)" }}
                >
                  <h3 className="m-2">Active Modules</h3>

                  <div
                    className="m-2 "
                    ref={provided.innerRef}
                    style={secondListStyle(snapshot.isDraggingOversecond)}
                  >
                    {this.state.selected.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            <img
                              src={item.image}
                              alt={item.content}
                              style={{ maxWidth: "50px" }}
                            />
                            {item.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <button
          className="btn btn-primary float-right call-button"
          onClick={this.handleSubmit}
        >
          Build Bot
        </button>
        {this.state.modalOpen && (
          <Modal handleClose={this.closeModal} >
            
          </Modal>
        )}
      </div>
    );
  }
}

export default Modules;
