const express = require('express');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(cookieSession({keys: ['fuqqufq3']}));
app.use(authRouter);

app.listen('3000', () => {
    console.log('Listening on port: 3000');
});