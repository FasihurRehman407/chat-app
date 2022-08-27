import React from 'react'
import { Button, Form, Input, Col, Row, Statistic   } from 'antd';
import { NumberOutlined, UserOutlined } from '@ant-design/icons';
import { useState, useEffect} from 'react';
import Chat from './Chat'

export default function RoomForm({socket}) {

  const [loading, setLoading] = useState(true);
  const [vals, setVals] = useState({
    username:'',
    roomId:''
  });

  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});

  useEffect(() => {
    forceUpdate({});
  }, []);

  const onFinish = async (values) => {
    setVals(values)
    setLoading(false)
    form.resetFields();
    await socket.emit('join_room', values.roomId)


  };
  return (
    <>
    <div className='bg-dark p-3 pb-5'>

    <h3 className='text-white text-center py-3'>{loading? "Join Room" : "You have joind the Room"}</h3>

   { loading ? <div style={{width:'45%', marginLeft:'auto', marginRight:'auto'}}>
      <Form form={form} name="horizontal_login" layout="inline" onFinish={onFinish}>
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="roomId"
        rules={[
          {
            required: true,
            message: 'Please input Room ID!',
          },
        ]}
      >
        <Input
          prefix={<NumberOutlined className="site-form-item-icon" />}
          type="text"
          placeholder="Room ID"
        />
      </Form.Item>
      <Form.Item shouldUpdate>
        {() => (
          <Button
          style={{backgroundColor:'#5cb85c', border:'none',color:'white'}}
            htmlType="submit"
            disabled={
              !form.isFieldsTouched(true) ||
              !!form.getFieldsError().filter(({ errors }) => errors.length).length
            }
          >
          Enter
          </Button>
        )}
      </Form.Item>
    </Form>
    </div> : 
    <div className='row stats'>
      <div className='col-3'></div>
      <div className='col-3 text-center'>
      <Statistic title="Username" value={vals.username} valueStyle={{color:'white'}} />
      </div>
      <div className='col-3 text-center'>
      <Statistic title="Room ID" valueStyle={{color:'white'}} value={vals.roomId.replace(/,/g , "")} />
      </div>
      <div className='col-3'></div>

    </div>
    
    
    }
    </div>
    {

      !loading ? 
      <div className='container'>
      <Chat vals={vals} socket={socket} loading={loading} setLoading={setLoading}/>
    </div> : "" 
    }
    </>
    
  )
}
