const channelListBaseUrl = 'https://api.production4ig.opentv.com/metadata/delivery/GLOBAL/btv/services';
const channelListParams = {
  sort: JSON.stringify([[ "editorial.tvChannel", 1 ]]),
  filter: JSON.stringify({ "technical.deviceType": { "$in": [ "Browser" ] } }),
  limit: 10000
};
const channelListQuery = new URLSearchParams(channelListParams).toString();
const channelListUrl = `${channelListBaseUrl}?${channelListQuery}`;

const fetchChannelList = async (accessToken) => {
    const response = await fetch(channelListUrl, {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + accessToken
        }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    return await response.json();
}

module.exports = fetchChannelList;