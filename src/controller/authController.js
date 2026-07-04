const jwt = require('jsonwebtoken')
const {users} = require('../data/users')

//auth login
const login = (req, res) => {
    try{
        const {name, password} = req.body;

        const user = users.find(u => u.name === name && u.password === password);

        if(user){
            return res.status(404).json({message: 'user is not found'})
        }

        const token = jwt.sign({id: user.id, name: user.name}, process.env.JWT_SECRET)

        res.status(200).json({
            token,  
            user: {
                id: user.id,
                name: user.name
            }
        })
    }catch(err){
        res.status(500).json({message: err.message})
    }
}


const getUser = (req,res) => {
    const {getOneUser} = require('../data/users')

    const users = getOneUser(req.user.id)
    res.json(users)
}

module.exports = {login, getUser}