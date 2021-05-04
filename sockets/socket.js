const { io }=require('../index');

const Band = require('../models/band') 
const Bands = require('../models/bands') 


const bands = new Bands();

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Ac/Dc'));
bands.addBand(new Band('Police'));
bands.addBand(new Band('Bon Jovi'));

console.log(bands);


//Mensajes Sockets

io.on('connection', client => {
    console.log('Cliente Conectado')

    client.emit('active-bands',bands.getBands());

    client.on('disconnect', () => { 
        console.log('Cliente Desconectado')
    });

    client.on('mensaje',(payload)=>{
        console.log('Mensajeee',payload);
        io.emit('mensaje',{admin:'Nuevo Mensaje'});
    });

    client.on('emitir-mensaje',(payload)=>{
        console.log('nuevo-mensaje',payload);
        client.broadcast.emit('nuevo-mensaje',payload);
    });
    client.on('vote-band',(payload)=>{
        console.log('vote-band',payload);
        bands.voteBand(payload.id);
        io.emit('active-bands',bands.getBands());
    });

    client.on('add-band',(payload)=>{
        console.log('add-band',payload);
        const newBand= new Band(payload.name);
        bands.addBand(newBand);
        io.emit('active-bands',bands.getBands());
    });

    client.on('delete-band',(payload)=>{
        console.log('delete-band',payload);
        bands.deleteBand(payload.id);
        io.emit('active-bands',bands.getBands());
    });
    
});