// channel program
// https://api.production4ig.opentv.com/metadata/v1/epg?
// channel=MediaPressTV_43&
// deviceType=Browser&
// fields=%5B%22editorial.technicals%22%2C%22editorial.id%22%2C%22editorial.title%22%2C%22editorial.Ratings%22%2C%22editorial.Description%22%2C%22editorial.seriesRef%22%2C%22editorial.SeasonNumber%22%2C%22editorial.episodeNumber%22%2C%22editorial.Images%22%2C%22editorial.PromoImages%22%2C%22editorial.CUStartDate%22%2C%22editorial.CUEndDate%22%2C%22editorial.type%22%2C%22editorial.Countries%22%2C%22editorial.contentType%22%2C%22id%22%2C%22seriesRef%22%2C%22contentRef%22%2C%22serviceRef%22%2C%22isStartOver%22%2C%22isCatchUp%22%2C%22period%22%2C%22title%22%2C%22Title%22%2C%22SeriesTitle%22%2C%22CUStartDate%22%2C%22CUEndDate%22%2C%22Description%22%2C%22Rating%22%2C%22Ratings%22%2C%22links%22%2C%22type%22%2C%22isSTCU%22%2C%22isLTCU%22%2C%22isnPvr%22%2C%22nPvrSupport%22%2C%22SeasonNumber%22%2C%22EpisodeNumber%22%2C%22episodeNumber%22%2C%22Episode%22%2C%22Countries%22%2C%22airingStartTime%22%2C%22airingEndTime%22%2C%22clientLiveTrickModeControl%22%2C%22clientVODTrickModeControl%22%2C%22clientRecordingTrickModeControl%22%2C%22clientTimeshiftControl%22%2C%22clientGlobalBlackoutControl%22%2C%22clientMobileOOHCatchupControl%22%2C%22clientMobileLiveOOHStreamingControl%22%2C%22clientMobileRestartOOHControl%22%2C%22clientMobileOOHNpvrControl%22%2C%22clientWebBlackoutControl%22%2C%22clientWebRestartControl%22%5D&
// from=1760306400&
// to=1760392799
const moment = require('moment');
const channelProgramBaseUrl = 'https://api.production4ig.opentv.com/metadata/v1/epg';
const today = moment().format('YYYY-MM-DD');

const fetchChannelProgram = async (accessToken, channelId, date = today) => {
    console.log("Fetching program for channel: " + channelId + " on date: " + date);
    const channelListParams = {
        channel: channelId,
        deviceType: "Browser",
        fields: JSON.stringify(["editorial.technicals","editorial.id","editorial.title","editorial.Ratings","editorial.Description","editorial.seriesRef","editorial.SeasonNumber","editorial.episodeNumber","editorial.Images","editorial.PromoImages","editorial.CUStartDate","editorial.CUEndDate","editorial.type","editorial.Countries","editorial.contentType","id","seriesRef","contentRef","serviceRef","isStartOver","isCatchUp","period","title","Title","SeriesTitle","CUStartDate","CUEndDate","Description","Rating","Ratings","links","type","isSTCU","isLTCU","isnPvr","nPvrSupport","SeasonNumber","EpisodeNumber","episodeNumber","Episode","Countries","airingStartTime","airingEndTime","clientLiveTrickModeControl","clientVODTrickModeControl","clientRecordingTrickModeControl","clientTimeshiftControl","clientGlobalBlackoutControl","clientMobileOOHCatchupControl","clientMobileLiveOOHStreamingControl","clientMobileRestartOOHControl","clientMobileOOHNpvrControl","clientWebBlackoutControl","clientWebRestartControl"]),
        from: Math.floor((new Date(date + ' 00:00:00').getTime() / 1000)).toString().trim(),
        to: Math.floor((new Date(date + ' 23:59:59').getTime() / 1000)).toString().trim()
    };
    //console.log(channelListParams.from,  channelListParams.to);
    //console.log(1760479200, channelListParams.from, channelListParams.from - 1760479200)
    //console.log(1760565599, channelListParams.to, channelListParams.to - 1760565599)
    const channelProgramQuery = new URLSearchParams(channelListParams).toString();
    const channelProgramUrl = `${channelProgramBaseUrl}?${channelProgramQuery}`;

    //console.log("Channel Program URL: " + channelProgramUrl);
    const response = await fetch(channelProgramUrl, {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + accessToken,
            "Content-Type": "application/json",
            "Accept": "application/json, text/plain, */*",
            'Accept-Language': 'hu_HU',
            "Referer": "https://www.one-tv.hu/",
            "Origin": "https://www.one-tv.hu",
            'Nagra-Device-Type': 'Browser',
            'Nagra-Target': 'tv',
            'NV-Tenant-Id': 'nagra',
          'Sec-CH-UA': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
          'Sec-CH-UA-Mobile': '?0',
          'Sec-CH-UA-Platform': '"Windows"',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'cross-site',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
          'X-Auth-Service-Id': '4iGSSO'
        }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const resultPayload = await response.json();

    return resultPayload.results[0].programmes;
}

module.exports = fetchChannelProgram;