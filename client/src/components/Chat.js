import React  from 'react'
import './../App.css'
import { Form ,Input , Button, message } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import {useState ,useEffect } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';


export default function Chat({socket , vals, loading , setLoading}) {
  const [form] = Form.useForm();

  const [msgList, setMsgList] = useState([]);

  const sendMsg = async (values)=>{
    const msgData = {
      room: vals.roomId,
      author:vals.username,
      message:values.currMsg,
      time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes() + ':' + new Date(Date.now()).getSeconds()

    }
    await socket.emit("send_msg",msgData)
    setMsgList((list)=> [...list , msgData]);
    form.resetFields();

  }
  
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleExit = ()=>{
    setLoading(true)
  }


  useEffect(() => {
    socket.on("recieve_msg",(data)=>{
      setMsgList((list)=> [...list , data]);
    })
  }, [socket]);

  return (
    <>

<div className="containerr">
  <div className="chatbox">
    <div className="top-bar">
      <div className="avatar"><p>{vals.username.slice(0,1).toUpperCase()}</p></div>
      <div className="name">Live Chat</div>
      <div className="icons">
        <i className="fas fa-phone"></i>
        <i className="fas fa-video"></i>
      </div>
      <div className="menu">
        <Button type='danger' onClick={handleExit}>Exit Room</Button>
      </div>
    </div>
    <div className="middle">
      <div>
        <ScrollToBottom className='middle'>
        {msgList.map((list, i)=>
          {
            return  <div>
              <div key={i} className={`mt-4 px-3 py-1 ${vals.username === list.author ? 'you': 'other'}`}>
              {list.message}
             
            </div>
            <div> 
            {
              vals.username === list.author ?
              <p className='ms-3'>
              <small className='fw-bold'>{list.time} {list.author}</small>
              </p>
              :
              <span style={{marginLeft:'18rem'}}>
              <small className='fw-bold'>{list.time} {list.author}</small>
              </span>
              
            }  
              </div>
            </div>
          })}
          </ScrollToBottom>
      </div>
    </div>
    <div className="bottom-bar">
      <div className="chat" style={{borderTop:'1px solid #0011'}}>
        <Form form={form} layout='inline' onFinish={sendMsg} onFinishFailed={onFinishFailed}>
          <Form.Item name='currMsg' rules={[
          {
            required: true,
            message: "Message can't be empty!",
          },
        ]}>
        <Input  style={{height:'3.3rem', border:'none' , backgroundColor:'#F9FBFF' , marginLeft:'5px'}} placeholder='Type a message...'/>
          </Form.Item>
          <Form.Item>
            <Button htmlType='submit'
             icon={<SendOutlined/>}
             style={{ 
              marginLeft:'7rem',
              marginTop:'0.7rem',
              border:'1px solid rgb(249,251,255)',
              background:'rgb(249,251,255)'       
             }}>
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  </div>
  <div className="messages"></div>
  <div className="profile">
    <div className="avatar"><p>{vals.username.slice(0,1).toUpperCase()}</p></div>
    <div className="mt-5">Room ID : {vals.roomId}</div>
    <div className="">Username : {vals.username.toUpperCase()}</div>
  </div>
  <ul className="people mt-3">
    <li className="person focus">
      <span className="title">Voldemort </span>
      <span className="time">2:50pm</span><br/>
      <span className="preview">What are you getting... Oh, oops...</span>
    </li>
  
  </ul>
</div>



    </>
  )
}
