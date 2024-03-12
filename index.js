require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');

const songRouter = require('./routes/songs')

const app = express()

app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path)
    next();
})

const allowedOrigins = ['http://localhost:3000', 'https://ritmo-one.vercel.app/', 'https://ritmo-git-main-iyasuh.vercel.app/']

app.use(cors({
      origin: allowedOrigins,
    })
);

app.use('/api', songRouter)

mongoose.connect(process.env.MOGO_URI)
.then(() => {
    console.log('[INFO] Connected to MongoDB')
})
.catch((error) => {
    console.log(error)
})

if (process.env.NODE_ENV !== "test"){
    app.listen(process.env.PORT, function(){
        console.log('[INFO] Server listening on port', process.env.PORT)
    });
}
// module.exports = {
//     app: app
// }
module.exports = app;