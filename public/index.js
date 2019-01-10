function DbEntry() {
    require('dotenv').config();
    const validator = require("email-validator");
    const Web3 = require('web3');
    const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURAPROVIDER));
    const db = require('./../models/user')
    let email = document.getElementById('inputEmail');
    let address = document.getElementById('EtherAddress');
    console.log('inside Db entry')
    if (validator.validate(email)) {
        if (web3.utils.isAddress(address)) {
            db.insertMany([{
                email,
                address
            }]).then((result) => {
                alert('Successfully Added to Databse');
            }).catch(err => {
                alert('Address already subscribed');
            })
        } else {
            alert('Invalid ethereum address')
        }
    } else {
        alert('Email does not exist')
    }
}