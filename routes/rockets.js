const axios = require('axios');
const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    axios.get('https://launchlibrary.net/1.4/rocket/1')
        .then(data => res.json(data.data))
        .catch(console.warn);
});

router.get('/stats', function(req, res, next) {
    const getYtdCountPromise = getYtdCount();
    const getNextLaunchPromise = getNextLaunch();
    Promise.all([getYtdCountPromise, getNextLaunchPromise]).then(json => res.json(json));
});

function getNextLaunch() {
    return axios.get('https://launchlibrary.net/1.4/launch/next/1')
        .then(data => ({ nextlaunch: data.data.launches[0].windowstart, nextcountry: data.data.launches[0].location.countryCode }));
}

function getYtdCount() {
    return axios.get('https://launchlibrary.net/1.4/launch/2018-01-01/2018-10-21') // TODO: MAKE THIS DYNAMIC
        .then(data => ({ getYtdCount: data.data.total }));
}

module.exports = router;
