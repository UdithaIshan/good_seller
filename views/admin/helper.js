module.exports = {
 errorHandler : (errors, prop) => {
        try {
            return errors.mapped()[prop].msg;
        } catch (error) {
            return '';
        }
    },
}