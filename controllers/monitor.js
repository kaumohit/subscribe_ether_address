require('dotenv').config();
const Web3 = require('web3');
const provider = process.env.INFURAPROVIDER;
const web3 = new Web3(provider);
const async = require('async')
const db = require('./../models/level');
const user = require('./../models/user')
const sendEmail = require('./sendEmail')
web3.eth.getBlockNumber()
    .then((blockno) => {
        db.put('lastBlock', blockno).then((result) => {
            console.log('Last Block initialized to value : ', blockno)
            startCron(blockno);
        }).catch(e => {
            console.log(e)
        });
    }).catch(error => {
        console.log('Unable to fetch Latest ethereum block')
    });

let blockParser = (blockno) => {
    db.get('lastBlock').then(lastBlock => {
        lastBlock = lastBlock.toString();
        lastBlock = Number(lastBlock);
        if (blockno > lastBlock) {
            let transactionData = []
            web3.eth.getBlock(blockno).then(blockData => {
                console.log('Block Number : ', blockData.number)
                console.log('Number of transactions : ', blockData.transactions.length)
                async.each(blockData.transactions, (txnHash, callback) => {
                    web3.eth.getTransaction(txnHash).then(txnData => {
                        transactionData.push(txnData)
                        callback()
                    }).catch(err => {
                        console.log('Cannot fetch transaction data')
                    })

                }, (error) => {
                    console.log('Processed Transactions : ', transactionData.length)
                    for (txn of transactionData) {
                        user.findOne({
                            $or: [{
                                address: txn.from
                            }, {
                                address: txn.to
                            }]
                        }).then(data => {
                            if (data != null) {
                                console.log({
                                    data
                                })
                                if (web3.eth.getCode(data.address) == '0x') {
                                    let subject;
                                    if (data.from == address) {
                                        subject = `You sent ${Number(data.value)} ETH to ${data.to}`
                                    } else {
                                        subject = `You received ${Number(data.value)} ETH from ${data.from}`
                                    }
                                    if (sendEmail(data.email, subject, txn))
                                        console.log('Email sent successfully')
                                    else
                                        console.log('Error sending email')
                                } else {
                                    //let receipt = await web3.eth.getTransactionReceipt();
                                }
                            }
                        }).catch(err => {
                            console.log(err)
                        })
                    }
                })
                db.put('lastBlock', blockno).then((result) => {
                    console.log('Last Block updated : ', blockno)
                }).catch(e => {
                    console.log(e)
                });
            }).catch(err => {
                //console.log(err);
                //console.log('Waiting for block')
            })
        } else {
            console.log('recursive call')
        }
    })
}

let startCron = (blockno) => {
    setInterval(() => {
        db.get('lastBlock').then(lastBlock => {
            lastBlock = lastBlock.toString();
            lastBlock = Number(lastBlock)
            blockParser(lastBlock + 1);
        })
    }, 1000)
}