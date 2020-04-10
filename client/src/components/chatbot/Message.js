import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import '../../components/style_css.css';

const Message = (props) => {

    let message='';

    if(Array.isArray(props.text)){
        message=props.text[0];
    }else{
        message=props.text;
    }

    return (
        <div className="col s12 m8 offset-m2 l6 offset-l3" >
            <div className="card-panel grey lighten-5 z-depth-1">
                <div className="row valign-wrapper">
                    {props.speaks==='bot' &&
                        <div className="btn-floating btn-large waves-effect waves-light red indexZ" >{props.speaks}</div>
                    }
                    <div className="col s10">
                        <TextareaAutosize className="textarea" value={message}/>
                    </div>
                    {props.speaks==='user' &&
                        <div className="btn-floating btn-large waves-effect waves-light red indexZ" style={{float: 'right'}} >{props.speaks}</div>
                    }
                </div>
            </div>
        </div>

    );
};

export default Message;
