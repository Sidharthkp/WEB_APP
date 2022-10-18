var db = require('../config/connection')
let collection = require('../config/collections');
const bcrypt = require('bcrypt');
let objectId = require('mongodb').ObjectId;

module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.Password = await bcrypt.hash(userData.Password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                resolve(data.insertedId);
            })
        })
    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let status = true;
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userData.Email })
            if (user) {
                bcrypt.compare(userData.Password, user.Password).then((result) => {
                    if (result) {
                        console.log("Login Success");
                        response.user = user;
                        response.status = true;
                        resolve(response);
                    } else {
                        console.log("Login Failed");
                        resolve({ status: false })
                    }
                })
            } else {
                console.log("Login Failed");
                resolve({ status: false })
            }
        })
    },
    getAllUser: () => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(user)
        })
    },
    deleteUser: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).deleteOne({ _id: objectId(userId) }).then((response) => {
                // console.log(response);
                resolve(response);
            })
        })
    },
    getUserDetails: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(userId) }).then((users) => {
                resolve(users);
            })
        })
    },
    updateUser: (userId, userDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).updateOne({ _id: objectId(userId) }, {
                $set: {
                    Name: userDetails.Name,
                    Email: userDetails.Email,
                    Password: userDetails.Password
                }
            }).then((response) => {
                resolve()
            })
        })
    }
}