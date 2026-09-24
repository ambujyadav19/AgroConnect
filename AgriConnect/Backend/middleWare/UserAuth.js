const jwt = require('jsonwebtoken')
const { Farmer } = require('../connect/SchemaDb')

function UserAuth(req,resp,next) {
    const body = req.body
    Farmer.findOne({
        username: body.username,
        password: body.password
    })
    .then(function(value){
        if(value){
            next()
        }
        else{
            alert("User doesn't exist!")
            resp.status(403).json({
                msg: "User does't exist"
            })
        }
    })

}

module.exports = UserAuth