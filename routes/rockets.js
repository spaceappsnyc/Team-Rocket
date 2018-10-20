const axios = require('axios');
const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    axios.get('https://launchlibrary.net/1.4/rocket/1')
        .then(data => res.json(data.data))
        .catch(console.warn);
});


module.exports = router;
