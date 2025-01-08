const { MongoClient } = require("mongodb")
require("dotenv").config();


let dbConnection;

module.exports = {
    connectToDB: (cb) => {
        MongoClient.connect(process.env.dbUrl)
            .then((client) => {
                try {
                    dbConnection = client.db()
                    cb();
                }catch (error){
                    console.log(error);
                    cb(error);
                }
            })
    },
    getDB: () => dbConnection
}