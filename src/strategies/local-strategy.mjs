import passport from "passport";
import { Strategy } from "passport-local"; //--> va en correlacion con el tipo de estrategia que indicaste
import { users } from "../data/usersdata.mjs";
//al instalar passport - hay multiples de estrategia facebook, google, token nosotros estamos utilizando
//local

//this function stores the information from the user that has inizialized the session 
passport.serializeUser((user, done )=>{
    console.log('serialize id')
    console.log(user)
    
    done(null, user.id) // you need to pass the id has the id is unique for the user // username or password 
    // can be modified, id will not. it is always the same. 
});

//deserialize is a function that obtains the rest of the user's information through the id and
// introduces it to the request
passport.deserializeUser((id, done) => {
    console.log('deserialize id')
    console.log(id)
    try{
        const findUser = users.find((user) => user.id === id);
        if(!findUser) throw Error ('User not found') 
        done(null, findUser)   
    } catch(err){
        done(err, null)
    }
})


//passport is going to to call serealizeUSer once to log in the user 
//then passport will use deserealizeUSer to make the rest of request 

export default passport.use(
  // this validate the user
  new Strategy((username, password, done) => {
    console.log(username);
    console.log(password);
    try {
      const findUser = users.find((user) => user.username === username);
      //try finding the user 
      if (!findUser) throw Error("User not found");
      //if the user is not found throw an error
      if (findUser.password !== password) throw Error("Password not valid");
      //if the password is invalid throw an error 
      done(null, findUser)
      //if not of the above appens and everything match the work is done and you should return the userfinded
    } catch (err) {
        //if there has been an error, then then work is done but the user has no access and youi respond with an error
        done(err, null);
        
    }
  })
);

