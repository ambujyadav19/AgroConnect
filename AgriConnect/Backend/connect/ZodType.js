const zod = require('zod')

const createUser = zod.object({
    email: zod.string(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string(),
    expenditure: zod.number(),
    income: zod.number(),
    profit: zod.number(),
    loss: zod.number(),
    farmName: zod.string(),
    farmLocation: zod.string(),
})

module.exports = {
    createUser: createUser
}