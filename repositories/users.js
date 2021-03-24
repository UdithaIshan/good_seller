const fs = require("fs");
const crypto = require('crypto');

class UsersRepository {
  constructor(filename) {
    if (!filename) {
      throw new Error("Filename is required");
    }
    this.filename = filename;

    try {
      fs.accessSync(this.filename);
    } catch (error) {
      fs.writeFileSync(this.filename, "[]");
    }
  }

  async getAll() {
    return JSON.parse(
      await fs.promises.readFile(this.filename, { encoding: "utf8" })
    );
  }

  async create(userData) {
    userData['id'] = this.randomId();
    const records = await this.getAll();
    records.push(userData);
    this.writeAll(records);
  }

  async writeAll(records) {
    await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
  }

  randomId() {
    return crypto.randomBytes(4).toString('hex');
  }

  async getOne(id) {
    const data = await this.getAll();
    return data.find((record) => record.id === id);
  }

  async delete(id) {
    const data = await this.getAll();
    const filterdData = data.filter((record) => record.id !== id);
    await this.writeAll(filterdData);
  }

  async getOneBy(filters) {
    const data = await this.getAll();
    for (const [key, val] of Object.entries(filters)) {
      const match = data.find((record) => record[key] === val)
      if(match)
        return match;
    }
  }

  async update(id, params) {
    const data = await this.getAll();
    const record = data.find((record) => record.id === id);

    if(!record) {
      throw new Error(`No record for ${id}`);
    }

    Object.assign(record, params);
  }

}

module.exports = new UsersRepository('users.json');