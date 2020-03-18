import React, { Component } from 'react';
import axios from "axios/index";
import Cookies from 'universal-cookie';
import { v4 as uuid } from 'uuid';
import Message from './Message';
const Validator = require("validator");

const cookies = new Cookies();

class Chatbot extends Component {

    messagesEnd;
    constructor(props) {
        super(props);

        // This binding is necessary to make `this` work in the callback
        this._handleInputKeyPress = this._handleInputKeyPress.bind(this);

        this.hide = this.hide.bind(this);
        this.show = this.show.bind(this);

        this.state = {
            name: "React",
            messages: [],
            showBot: true
        };

        if (cookies.get('userID') === undefined) {
            cookies.set('userID', uuid(), { path: '/' });
        }
        console.log(cookies.get('userID'));
    }


    async df_text_query (text) {
        let says = {
            speaks: 'user',
            msg: {
                text : {
                    text: text
                }
            }
        }
        this.setState({ messages: [...this.state.messages, says]});

        try {
            const res = await axios.post('/api/df_text_query',  {text, userID: cookies.get('userID')});
            for (let msg of res.data.fulfillmentMessages) {

                says = {
                    speaks: 'bot',
                    msg: msg
                }

                this.setState({ messages: [...this.state.messages, says]});
            }
        } catch (e) {
            says = {
                speaks: 'bot',
                msg: {
                    text : {
                        text: "I'm having troubles. I need to terminate. will be back later"
                    }
                }
            };

            this.setState({ messages: [...this.state.messages, says]});

            let that = this;
            setTimeout(function(){
                that.setState({ showBot: false})
            }, 2000);
        }
    };


    async df_event_query(event) {
        try {
            const res = await axios.post('/api/df_event_query',  {event, userID: cookies.get('userID')});
            for (let msg of res.data.fulfillmentMessages) {


                let says = {
                    speaks: 'bot',
                    msg: msg
                }
                this.setState({ messages: [...this.state.messages, says]});
            }
        } catch (e) {
            let says = {
                msg: {
                    text : {
                        text: "I'm having troubles. I need to terminate. will be back later"
                    }
                }
            };
            this.setState({ messages: [...this.state.messages, says]});

            let that = this;
            setTimeout(function(){
                that.setState({ showBot: false})
            }, 2000);
        }
    };

    componentDidMount() {
        this.df_event_query('Welcome');
    }

    componentDidUpdate() {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
        if(this.talkInput){
            this.talkInput.focus();
        }
    }

    show(event) {
        event.preventDefault();
        event.stopPropagation();
        this.setState({showBot: true});
    }

    hide(event) {
        event.preventDefault();
        event.stopPropagation();
        this.setState({showBot: false});
    }

    renderMessages(returnedMessages) {
        if (returnedMessages) {
            return returnedMessages.map((message, i) => {
                    return <Message key={i} speaks={message.speaks} text={message.msg.text.text}/>;
                }
            )
        } else {
            return null;
        }
    }

    _handleInputKeyPress(e) {
        if (e.key === 'Enter' && !Validator.isEmpty(e.target.value) && e.target.value.replace(/\s/g, '').length!==0) {
            this.df_text_query(e.target.value);
            e.target.value = '';
        }
    }

    render() {

        if(this.state.showBot) {
            return (
                <div style={{ minHeight: 500, maxHeight: 500, width:400, position: 'absolute', bottom: 0, right: 0, border: '1px solid lightgray'}}>
                    <nav>
                        <div className="nav-wrapper">
                            <div className="brand-logo">ChatBot</div>
                            <ul id="nav-mobile" className="right hide-on-med-and-down">
                                <li><a href="/" onClick={this.hide}>Close</a></li>
                            </ul>
                        </div>
                    </nav>

                        <div id="chatbot"  style={{ minHeight: 388, maxHeight: 388, width:'100%', overflow: 'auto'}}>

                            {this.renderMessages(this.state.messages)}
                            <div ref={(el) => { this.messagesEnd = el; }}
                                 style={{ float:"left", clear: "both" }}>
                            </div>
                        </div>
                        <div className=" col s12" >
                            <input name="input" style={{margin: 0, paddingLeft: '1%', paddingRight: '1%', width: '98%'}} ref={(input) => { this.talkInput = input; }} placeholder="type a message:"  onKeyPress={this._handleInputKeyPress} id="user_says" type="text"/>
                        </div>

                    </div>
            );
        } else {

            return(
                <div style={{ minHeight: 40, maxHeight: 500, width:400, position: 'absolute', bottom: 0, right: 0, border: '1px solid lightgray'}}>
                    <nav>
                        <div className="nav-wrapper">
                            <div className="brand-logo">ChatBot</div>
                            <ul id="nav-mobile" className="right hide-on-med-and-down">
                                <li><a href="/" onClick={this.show}>Show</a></li>
                            </ul>
                        </div>
                    </nav>
                    <div ref={(el) => { this.messagesEnd = el; }}
                         style={{ float:"left", clear: "both" }}>
                    </div>
                </div>
            );
        }
    }
}
export default Chatbot;