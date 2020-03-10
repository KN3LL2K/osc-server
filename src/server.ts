import * as express from 'express'
import * as http from 'http'
import * as io from 'socket.io'
import * as osc from 'osc'
import { getIPAddresses } from './utils'

const PORT = 8080
const HOST = '192.168.50.89'
const SELF = '0.0.0.0'
const UDP_SEND = 3000
const UDP_REC = 3001

const app = express()
const server = http.createServer(app)
const socket = io(server)
const udpPort = new osc.UDPPort({localAddress: SELF, localPort: UDP_REC})

udpPort.on('ready', () => {
  const addresses = getIPAddresses()
  console.log('addresses', addresses)
})



const store = {}

const sendAndReply = (message, callback) => {
  console.log(`TALOS => BRIDGE: ${JSON.stringify(message)}`)
  store[message.address] = callback
  udpPort.send(message, HOST, UDP_SEND)
  
}
    udpPort.on('message', res => {
      console.log('CYPERUS => BRIDGE', JSON.stringify(res))
      store[res.address](res)
    })

socket.on('connection', socket => {
  console.log('Socket connected to Client')
  socket.on('/cyperus/address', sendAndReply)
  socket.on('/cyperus/list/main', sendAndReply)
  socket.on('/cyperus/list/bus', sendAndReply)
  socket.on('/cyperus/list/bus_port', sendAndReply)
  socket.on('/cyperus/add/bus', sendAndReply)
  socket.on('/cyperus/list/module/port', sendAndReply)
  socket.on('/cyperus/add/module/sine', sendAndReply)
  socket.on('/cyperus/add/module/delay', sendAndReply)
  socket.on('/cyperus/add/module/envelope_follower', sendAndReply)
  socket.on('/cyperus/add/connection', sendAndReply)
})

udpPort.open()
server.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})
