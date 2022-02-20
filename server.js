const app = require('./app')
const mongoose =  require('mongoose')


const PORT = process.env.PORT || 3003
const DB = process.env.DATABASE

app.listen(PORT, () => {
    console.log("Server is Running ON " + PORT);
})

mongoose.connect(DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology : true
})
    .then(() => {
    console.log("DATABASE Connection Successful");
    })
    .catch(() => {
    console.log("ERROR..! Database Connection Faild");
})