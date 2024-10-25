const bcrypt = require('bcrypt');
const saltRounds = 10;

export const hashPasswordHelper = async (plainPass: string) => {
    try {
        return await bcrypt.hash(plainPass, saltRounds  )
    } catch (error) {
        console.log(error)
    }
}

export const comparePasswordHelper = async (plainPass: string, hashpassword: string) => {
    try {
        return await bcrypt.compare(plainPass, hashpassword )
    } catch (error) {
        console.log(error)
    }
}