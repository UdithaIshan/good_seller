const { validationResult } = require('express-validator');

module.exports = {
    hanldeErrors(templateFunc, callback) {
        return async (req, res, next) => {
            const errors = validationResult(req);

            let data = {};

            if(!errors.isEmpty()) {
                data = await callback(req);
                return res.send(templateFunc({ errors, ...data }));
            }

            next();
        }
    },
    authCheck(req, res, next) {
        if(!req.session.ID) {
            return res.redirect('/signin');
        }
        next();
    }
}