const express = require('express')
const userRepo = require('./repositories/users')

const app = express();

app.use(express.urlencoded({extended: true}));

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

// const bodyParser = (req, res, next) => {
//     if(req.method === 'POST'){
//         req.on('data', (data)=> {
//             const parsedDta = data.toString('utf8').split('&');
//             let body = {};
//             parsedDta.forEach(element => {
//                 let param = element.split('=');
//                 body[param[0]] = param[1]
//             });
//             req.body = body;
//             next();
//         });
//     }
//     else
//         next();
// };

app.post('/', async (req, res) => {
    const {email, pwd, pwdConfirm} = req.body;
    const existingUser = await userRepo.getOneBy({email: email});
    if(existingUser) {
        return res.send("<p>Email is already in use!</p>");
    }
    if(pwd !== pwdConfirm) {
        return res.send("<p>Passwords must match</p>");
    }
    res.send("<p>Account created!</p>");
});

app.listen('3000', () => {
    console.log('Listening on port: 3000');
});