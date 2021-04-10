const express = require('express');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const productsAdminRouter = require('./routes/admin/products');
const productRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const PORT = process.env.PORT || 3000

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(cookieSession({keys: ['fuqqufq3']}));
app.use(authRouter);
app.use(productRouter);
app.use(productsAdminRouter);
app.use(cartRouter);

app.listen(PORT, () => {
    console.log(`Listening on ${ PORT }`);
});