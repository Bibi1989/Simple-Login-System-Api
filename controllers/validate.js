
const joi = require('@hapi/joi')

const validateRegister = (data) => {
    const schema = joi.object({
        firstname: joi.string().trim().required(),
        lastname: joi.string().trim().required(),
        email: joi.string().trim().email().required(),
        password: joi.string().trim().min(6).required(),
        username: joi.string().trim().min(4)
    })

    const { error } = schema.validate(data, {abortEarly: false, stripUnknown: true })
    
    return {
        error
    }
}

module.exports.validateRegister = validateRegister