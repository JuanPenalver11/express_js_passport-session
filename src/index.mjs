import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport'; // npm i passport to this you need to add the strategy you want to follow
//passport do not require express-session. Howeverm they work very well together. 
//passport will map the user with the session id. 
import './strategies/local-strategy.mjs';

import { users } from './data/usersdata.mjs';

const app = express();

app.use(express.json());
app.use(cookieParser('helloWorld'));
app.use(
    session({
        secret:'holi',
        saveUninitialized:false,
        resave:false,
        cookie:{
            maxAge:60000 * 60,
        },
    })
);
//passport needs to go right after session and before routes 
app.use(passport.initialize()); // ---> needs to be called to initialize passport before the authentification of users
app.use(passport.session()); // --> comes after initialize and it is used to ensure that passport works all over the sessions

//end point we will use to match with local-stratedies to authentify the user 
//passport.authenticate needs us to indicate the type of strategy we have install.
app.post('/api/auth', passport.authenticate('local'), (request, response)=>{
    response.sendStatus(200)
})

app.get('/api/auth/status', (request, response)=>{
    console.log('status get endpoint')
    console.log(request.user)
    return request.user ? response.send(request.user) : response.sendStatus(401)
})

app.post('/api/auth/logout', (request, response)=>{
    if(!request.user) return sendStatus(401);
    //if the user is not logged and try to log out send 401 
    // to log out from a session there is a method named logout()
    // it takes an error as argument in case error needs to be handle
    request.logout((err)=>{
        if(err) response.sendStatus(400)
        return response.status(200).send('You have been logged out')
    })
})

const PORT = process.env.PORT || 4000;

app.listen(PORT, ()=>{
    console.log(`PORT in ${PORT}`)
})