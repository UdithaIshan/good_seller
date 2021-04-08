const crypto = require('crypto');
const util = require('util');
const Repository = require("./repository");

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository{
  async create(userData) {
    userData['id'] = this.randomId();
    const salt = crypto.randomBytes(8).toString('hex');
    const hash = await scrypt(userData.password, salt, 128);
    const records = await this.getAll();
    const record = {...userData, password: `${hash.toString('hex')}.${salt}`};

    records.push(record);
    await this.writeAll(records);

    return record;
  }

  async compare(saved, input) {
    const [hash, salt] = saved.split('.');
    const computedHash = await scrypt(input, salt, 128);
    return computedHash.toString('hex') === hash;
  }

}

module.exports = new UsersRepository('users.json');