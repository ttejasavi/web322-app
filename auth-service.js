const mongoose = require('mongoose');
let User;
const bcrypt = require('bcryptjs');

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("connectionString");

        db.on('error', (err) => {
            reject(err);
        });
        db.once('open', () => {
            User = db.model("users", userSchema);
            resolve();
        });
    });
};

module.exports.registerUser = function (userData) {
    return new Promise(function (resolve, reject) {
        bcrypt.hash(userData.password, 10).then((hash) => {
            userData.password = hash;

            let newUser = new User(userData);

            newUser.save((err) => {
                if (err) {
                    if (err.code === 11000) {
                        reject("User Name already taken");
                    } else {
                        reject("There was an error creating the user: " + err);
                    }
                } else {
                    resolve();
                }
            });
        }).catch((err) => {
            reject("There was an error encrypting the password");
        });
    });
};

module.exports.checkUser = function (userData) {
    return new Promise(function (resolve, reject) {
        User.find({ userName: userData.userName }).then((users) => {
            if (users.length === 0) {
                reject("Unable to find user: " + userData.userName);
            } else {
                bcrypt.compare(userData.password, users[0].password).then((result) => {
                    if (result === false) {
                        reject("Incorrect Password for user: " + userData.userName);
                    } else {
                        users[0].loginHistory.push({
                            dateTime: new Date().toString(),
                            userAgent: userData.userAgent,
                        });

                        User.updateOne(
                            { userName: users[0].userName },
                            { $set: { loginHistory: users[0].loginHistory } }
                        ).then(() => {
                            resolve(users[0]);
                        }).catch((err) => {
                            reject("There was an error verifying the user: " + err);
                        });
                    }
                });
            }
        }).catch((err) => {
            reject("Unable to find user: " + userData.userName);
        });
    });
};
