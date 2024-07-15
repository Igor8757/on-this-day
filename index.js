const axios = require('axios');
const { client_id, client_secret } = require('./secrets')

const TOKEN_URL = "https://meta.wikimedia.org/w/rest.php/oauth2/access_token";

async function getWikiToken() {
    const postData = {
        grant_type: 'client_credentials',
        client_id,
        client_secret
    };
    try {
        const response = await axios.post(TOKEN_URL, postData, 
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        return response.data.access_token
    } catch (error) {
        console.error('Error fetching token:', error.message);
    }
}


async function makeGetRequest() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2,'0');
    const day = String(today.getDate()).padStart(2,'0');
    const url = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${month}/${day}`;

    const token = await getWikiToken()
    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Api-User-Agent': 'on-this-day igor8757@gmail.com'
            }
        });

        return response.data
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
}

async function getRandomEvent() {
    const wikiData = await makeGetRequest()

    const events = wikiData?.events;
    if(!events) {
        console.log("Something went wrong :(")
        return
    }

    const randomIndex = Math.floor(Math.random() * events.length);
    const chosenEvent = events[randomIndex];

    fixedYear = chosenEvent.year >= 0 ? chosenEvent.year : (chosenEvent.year * -1) + " BC";
    const fact =  `On this day, at ${fixedYear}, ${chosenEvent.text}`

    console.log(fact)
    return fact;
}

 getRandomEvent();
