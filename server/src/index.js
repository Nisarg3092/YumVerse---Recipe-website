require('dotenv').config();

const { connectDB }= require('./db/conection');
const app = require('./app');

const PORT = process.env.PORT || 3000

connectDB()
.then(() => {
     app.listen(PORT, () => {
        console.info(`⚙️ Server is running at port : ${PORT}`);
    });
})
.catch((error) => {
    console.error(`MONGO db connection failed !!! : ${error}`);
});