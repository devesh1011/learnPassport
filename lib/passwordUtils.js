const bcrypt = require("bcrypt");

const validPassword = async (password, hash) => {
    const isValid = await bcrypt.compare(password, hash);
    return isValid;
}

const genPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
};

module.exports = {
    validPassword, genPassword
}