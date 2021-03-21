const express = require('express')

const app = express();

app.get('/', (req, res) => {
    res.send(`
        <form method="POST">
            <input placeholder="Email" name="email">
            <input placeholder="Password" name="pwd">
            <input placeholder="Password Confirmation" name="pwdConfirm">
            <button>Sign Up</button>
        </form>
    `);
});

const bodyParser = (req, res, next) => {
    if(req.method === 'POST'){
        req.on('data', (data)=> {
            const parsedDta = data.toString('utf8').split('&');
            let body = {};
            parsedDta.forEach(element => {
                let param = element.split('=');
                body[param[0]] = param[1]
            });
            req.body = body;
            next();
        });
    }
    else
        next();
};

app.post('/', bodyParser, (req, res) => {
    console.log(req.body);
    res.send(req.body);
});

app.listen('3000', () => {
    console.log('Listening on port: 3000');
});