//@ts-nocheck
const DataStore = require('nedb-promises');
const Ajv = require('ajv');
const borrowSchema = require('./schemas/borrowSchema');

class BorrowStore {
    constructor() {
        const ajv = new Ajv({
            allErrors: true,
            useDefaults: true
        });

        this.schemaValidator = ajv.compile(borrowSchema);
        const dbPath = `${process.cwd()}/borrowers.db`;
        this.db = DataStore.create({
            filename: dbPath,
            timestampData: true,
            autoload: true
        });
    }

    validate(data) {
        return this.schemaValidator(data);
    }

    create(data) {
        const isValid = this.validate(data);
        if (isValid) {
            return this.db.insert(data);
        }
    }

    read(_id) {
        return this.db.findOne({_id}).exec();
    }

    readAll() {
        return this.db.find();
    }

    remove(_id) {
        return this.db.remove({_id});
    }

    clear() {
        return this.db.remove({}, { multi: true });
    }
}

module.exports = BorrowStore