const express = require('express');
const { json } = require('body-parser');
const dbConnect = require('./config/dbconfig');
const farmerRoute = require('./route/farmerRoute');
const vendorRoute = require('./route/vendorRoute');
const adminRoute = require('./route/adminRoute');
const commentRoute = require('./route/commentRoute');
const orderRoute = require('./route/orderRoute');
const cartRoute = require('./route/cartRoute');
const conversationRoute = require('./route/conversationRoute');
const messageRoute = require('./route/messageRoute');
const chatRoute = require('./route/chatRoute');
const paymentRoute = require('./route/paymentRoute');
const cors = require('cors');



const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.static('public'))
app.use(cors());
app.use(json());
app.use(express.urlencoded({extended: false}))
dbConnect();

app.use("/api/farmer", farmerRoute);
app.use("/api/vendor", vendorRoute);
app.use("/api/admin", adminRoute);
app.use("/api/comment", commentRoute);
app.use("/api/order", orderRoute);
app.use("/api/cart", cartRoute);
app.use('/api/conversation', conversationRoute);
app.use('/api/message', messageRoute);
app.use('/api/chat', chatRoute);
app.use('/api/payment', paymentRoute);

app.listen(PORT, ()=> console.log(`Express server listening to PORT ${PORT}`));