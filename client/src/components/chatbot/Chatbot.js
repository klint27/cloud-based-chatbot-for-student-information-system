import React, { Component } from 'react';
import axios from "axios/index";
import Cookies from 'universal-cookie';
import { v4 as uuid } from 'uuid';
import Message from './Message';
import '../../components/style_css.css';

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
        };
        this.setState({ messages: [...this.state.messages, says]});

        try {
            const res = await axios.post('/api/df_text_query',  {text, userID: cookies.get('userID')});
            for (let msg of res.data.fulfillmentMessages) {

                says = {
                    speaks: 'bot',
                    msg: msg
                };

                this.setState({ messages: [...this.state.messages, says]});
            }
        } catch (e) {
            says = {
                speaks: 'bot',
                msg: {
                    text : {
                        text: "I'm having troubles. Check your internet connection..."
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
                };
                this.setState({ messages: [...this.state.messages, says]});
            }
        } catch (e) {
            let says = {
                msg: {
                    text : {
                        text: "I'm having troubles. Check your internet connection..."
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
                    <div className="chatbotstyle" style={{ minHeight: 200, maxHeight: 500, minWidth:250, right: 20,     position: 'fixed', bottom: 0, border: '1px solid lightgray'}}>
                        <nav>
                            <div className="nav-wrapper red darken-1">
                                <div className="brand-logo">ChatBot</div>
                                <ul id="nav-mobile" className="right hide-on-med-and-down">
                                    <li><a href="/" onClick={this.hide}>Close</a></li>
                                </ul>
                            </div>
                        </nav>

                        <div style={{ minHeight: 388, maxHeight: 388, width:'100%', overflow: 'auto', backgroundColor: "white"}}>

                            {this.renderMessages(this.state.messages)}
                            <div ref={(el) => { this.messagesEnd = el; }}
                                 style={{ float:"left", clear: "both" }}>
                            </div>
                        </div>
                        <div className=" col s12" style={{backgroundColor: "white"}}>
                            <input name="input" style={{margin: 0, paddingLeft: '1%', paddingRight: '1%', width: '98%'}} ref={(input) => { this.talkInput = input; }} placeholder="type a message:"  onKeyPress={this._handleInputKeyPress} id="user_says" type="text"/>
                        </div>

                    </div>
            );
        } else {
            return(
                    <div className="btn-floating btn-large waves-effect waves-light red indexZ"
                         onClick={this.show}
                         style={{ minHeight: 70, maxHeight: 70, width:70, position: 'fixed', bottom: 40, right: 50, border: '1px solid lightgray'}}>
                        <i className="fas fa-comments"/>
                        <div ref={(el) => { this.messagesEnd = el; }}
                         style={{ float:"left", clear: "both" }}>
                    </div>
            </div>
            );
        }
    }
}
export default Chatbot;