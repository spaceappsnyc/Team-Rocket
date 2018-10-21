fetch('http://localhost:3000/rockets/stats')
    .then(response => {
        return response.json();
    }).then(response => {
        const YTDLaunches = response[0].getYtdCount;
        const NextLaunch = new Date(response[1].nextlaunch)
            .toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const NextCountry = response[1].nextcountry;

        const text = `YTD Rocket Launches: \t${YTDLaunches}
        \nNext Launch: \t${NextLaunch} from ${NextCountry}`;
        document.getElementsByClassName('launch-stats')[0].innerHTML = text;
    });
