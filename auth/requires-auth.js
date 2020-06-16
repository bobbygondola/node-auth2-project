//middleware to see if youre logged in
module.exports=(req,res,next) => {
    if(req.session.user){
        next();
    } else {
        res.status(401).json({message: 'youre not logged in bro'})
    }
}