const mongoose=require( "mongoose" );
const dotenv=require( "dotenv" );
const {Server} = require('socket.io');


//! Listener to be called when any uncaught error(programming error) occurs
process.on( "uncaughtException", ( err ) => {
    console.error( `${err.name} ${err.message}` );
    process.exit( 1 );

} )


dotenv.config( {
    path: "./config.env"
} ); // read all the variables from config.env file and put them in nodejs environment
const app=require( "./app" );

// ! Connecting our App with hoisted datatbase on Atlas Cloud
const DB=process.env.DATABASE.replace( "<password>", process.env.DATABASE_PASSWORD );
// const DB=process.env.DATABASE;
mongoose.connect( DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
} )
    .then( () => console.log( "Database connection successfull!✨✨" ) );


let port=process.env.PORT||3001;
const server=app.listen( process.env.PORT, () => {
    console.log( "Starting the server at 127.0.0.1:"+process.env.PORT );
} );


const io = new Server(server, {
    cors: {
        origin:'http://localhost:3000',
        methods: ["GET","POST"]
    }
});


io.on('connection', (socket)=>{
    console.log("User connected...",socket.id);
    socket.on('join_room', (data)=>{
        socket.join(data)
        console.log(socket.id , 'joined room', data)
    })

    socket.on("send_msg", (data)=>{
        console.log("Message Info : ", data)
        socket.to(data.room).emit("recieve_msg",data)
    })

    io.on('disconnect', (socket)=>{
        console.log("User disconnected", socket.id);
    })
})


process.on( "unhandledRejection", ( err ) => {
    console.error( `${err.name} ${err.message}` );

    server.close( () => {
        process.exit( 1 );
    } )





} )