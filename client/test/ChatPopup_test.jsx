import assert from "assert";
import React from "react";
import sinon from "sinon";
import {shallow} from "enzyme";

import ChatPopup from "../src/components/ChatPopup";

describe("ChatPopup", () => {
  it("renders a basic chat popup", (done) => {
    const popup = shallow(<ChatPopup name="User" />);
    assert.equal(popup.find("header").text(), "User");

    const messageList = popup.find(".chat-popup--messages");
    assert.equal(messageList.length, 1);
    assert.equal(messageList.find(".chat-popup--message").length, 0);

    assert.equal(popup.find("input[type='text']").length, 1);
    assert.equal(popup.find("button[type='submit']").length, 1);
    assert.equal(popup.find(".chat-popup--placeholder").length, 1);

    done();
  });

  it("renders the message history", (done) => {
    const messageHistory = [
      {content: "Hello!", sender: "1"},
      {content: "Hey there!"},
    ];
    const popup = shallow(<ChatPopup name="User" history={messageHistory} />);

    const messages = popup.find(".chat-popup--message");
    assert.equal(messages.length, 2);
    assert.equal(messages.at(0).text(), "Hello!");
    assert.equal(messages.at(1).text(), "Hey there!");

    assert.equal(popup.find("li.received").length, 1);
    assert.equal(popup.find("li.sent").length, 1);

    done();
  });

  it("enables the Send button when text is typed", (done) => {
    const popup = shallow(<ChatPopup name="User" />);

    let sendButton = popup.find("button[type='submit']");
    assert(sendButton.props().disabled);

    popup.setProps({message: "A message!"});
    assert.equal(popup.find("input[type='text']").props().value, "A message!");

    sendButton = popup.find("button[type='submit']");
    assert(!sendButton.props().disabled);

    done();
  });

  it("calls the onSend function when the Send button is clicked", (done) => {
    const onSendMock = sinon.stub();
    const popup = shallow(<ChatPopup name="User" message="A message" onSend={onSendMock} />);

    popup.find("button[type='submit']").simulate("click");
    assert(onSendMock.calledOnce);

    done();
  });

  it("calls the onClose function when the close button is clicked", (done) => {
    const onCloseMock = sinon.stub();
    const eventMock = {stopPropagation: sinon.stub()};
    const popup = shallow(<ChatPopup name="User" onClose={onCloseMock} />);

    popup.find(".chat-popup--close").simulate("click", eventMock);
    assert(onCloseMock.calledOnce);
    assert(eventMock.stopPropagation.calledOnce);

    done();
  });
});
