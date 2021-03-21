const fs = require('fs');

class UsersRepository {
    constructor(filename) {
        if(!filename) {
            throw new Error('Filename is required');
        }
        this.filename = filename;

        try{
            fs.accessSync(this.filename);
        }
        catch(error) {
            fs.writeFileSync(this.filename, '[]');
        }
    }
}

new UsersRepository('users.json');