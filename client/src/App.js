import './App.css';
import io from 'socket.io-client';
import RoomForm from './components/RoomForm';
import 'antd/dist/antd.css';

const socket = io.connect("http://localhost:3001")

function App() {
  return (
    <>
       
        <RoomForm socket={socket}/>
      
    </>
  );
}

export default App;
