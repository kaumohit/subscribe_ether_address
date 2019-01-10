const express = require('express');
const app = express();
require('./controllers/monitor')

app.listen(3000, err => {
    if (err) {
        console.log(err)
    } else {
        console.log('Port running on server 3000')
    }
});