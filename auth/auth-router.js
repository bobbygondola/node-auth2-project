const router = require("express").Router();
const db = require('../users/user-helpers');
const bcrypt = require('bcryptjs');

//post/ register
router.post('/register', (req,res) => {
    const { username, password, department } = req.body;
    //hash
    const rounds = 8;
    const hash = bcrypt.hashSync(password, rounds);
    //function
    db.addUser({username, password:hash, department})
    .then(user => {
        res.status(200).json(user)
    })
    .catch(err => {
        console.log('error in register', err)
        res.status(500).json({message: 'error registering sorry!'})
    })
})

//post/ login
router.post('/login', (req,res) => {
    const { username, password } = req.body;
    db.findBy({ username })
    .then(([user]) => {
        console.log("USER IN LOGIN",user)
        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.user = {id: user.id, username: user.username}
            res.status(200).json({welcome: user.username, session: req.session})
        } else {
            res.status(401).json({message: "you can not pass!!!"})
        }
    })
    .catch(err => res.send(err));
})
//delete/ logout
router.delete("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy(error => {
            if(error){
                res.status(500).json({message: "couldnt log out"});
            } else {
                res.status(204).end();
            }
        })
    } else {
        res.status(204).end();
    }
})

module.exports=router;