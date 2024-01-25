import { Server, Socket } from 'socket.io';
import mongoose from "mongoose"
import Document from "./document.model"
import dotenv from "dotenv"

dotenv.config();

mongoose.connect(process.env.MONGODB_URI!)

const defaultValue = ""

const io = new Server(3001, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);


    socket.on("get-document", async (id) => {
        const document = await findOrCreateDocument(id);
        socket.join(id);
        socket.emit("load-document", document!.data);
        socket.on("send-changes", delta => {
            socket.broadcast.to(id).emit("recieve-changes", delta)
        })
        socket.on("save-document", async (data) => {
            await Document.findByIdAndUpdate(id, { data })
        })
    })
});

async function findOrCreateDocument(id: String) {
    if (id == null) {
        return
    }
    const document = await Document.findById(id);
    if (document) {
        return document;
    } else {
        return await Document.create({ _id: id, data: defaultValue })
    }
}