const fs = require('fs');
const login = require("./login.js");
const moment = require('moment-timezone');
const getChannelList = require("./channel-list.js");
const getChannelProgram = require("./channel-program.js");
const xmlGenerator = require("./xml-generator.js");
require('dotenv').config()

let accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6IjY0MzIyMSJ9.eyJzZXNzaW9uQ29udHJvbCI6eyJzZXNzaW9uQ29udHJvbEVuYWJsZWQiOmZhbHNlLCJtYXhTZXNzaW9ucyI6Mn0sImRldmljZUlkIjoiNjhlZDQ1ZjI1M2MyNDYxZDVkYWQ3NjRiIiwidGVuYW50SWQiOiJuYWdyYSIsImFjY291bnRJZCI6IjY4YzZkMTdmYjYzNjIwMmE1ZDVjNTQ5YiIsImN1cnJlbnRVc2VyUHJvZmlsZSI6eyJtYXhBZ2VSYXRpbmciOjE4LCJfaWQiOiI2OGVkNDVmMjhlYjliZjA1NWVlYTBiNjEiLCJjaGlsZFByb2ZpbGUiOmZhbHNlLCJzZWdtZW50SWRzIjpbImRlZmF1bHRJZCJdfSwidHlwIjoiRGV2QXV0aE4iLCJkZXZpY2VHcm91cFNlc3Npb25MaW1pdFByb2ZpbGVJZCI6IkRFRkFVTFQiLCJvbk5ldHdvcmsiOnRydWUsImdlb0Jsb2NrRXhlbXB0IjpmYWxzZSwiY2FjaGVLZXkiOiJTRlV4TVRrME9qRTRPa0p5YjNkelpYSSIsImZpeGVkX2V4cCI6MTkxODIzNTk0NSwicGFyZW50YWxDb250cm9sIjp7InJhdGluZ1RocmVzaG9sZCI6eyJIQ1JTIjoiaHUtNiJ9fSwicGxheW91dERldmljZUNsYXNzIjoiQnJvd3NlciIsImZpbHRlcmluZ0luZm9ybWF0aW9uIjp7ImJpbGxpbmctY291bnRyeS1jb2RlIjoiSFUxMTk0In0sImRldmljZVByb2ZpbGVJZCI6IkJyb3dzZXIiLCJibG9ja2luZ0luZm9ybWF0aW9uIjp7fSwiZXhwIjoxNzYwNTU5NTQ1LCJ2ZXIiOiIxLjAiLCJhY2NvdW50UHJvZmlsZUlkIjoiU1RBTkRBUkQiLCJiaWxsaW5nQ291bnRyeUNvZGUiOiJIVTExOTQifQ._kX8KKzXeXMcjwow2dfea_qg2JqDGeWCLQOKHGXi-5c";
let tzoffset = moment.tz('Europe/Budapest').utcOffset();

login(process.env.ONE_TV_USER, process.env.ONE_TV_PASSWORD)
.then(async (loginResponse) => {
    //console.log("Login response: ", loginResponse);
    accessToken = loginResponse.access_token;
    await getProgram();
});

const getProgram = async () => {
    const channelList = await getChannelList(accessToken);
    const forDays = 3; // days
    const channels = [];
    const programme = [];
    //console.log(channelIdList);
    //console.log(channelIdList.length);
    /*let ch = {
	e: "MediaPressTV_155"
    };*/
    for (let ch of channelList.services) {
        channels.push({
            "@id": ch.e,
            "display-name": {
                "@lang": "hu",
                "#text": ch.editorial?.longName
            },
            "icon": {
                "@src": "https://imageservice.production4ig.opentv.com/images/v1/image/channel/" + ch.e + "/logo?aspect=16x9&height=32&imageFormat=webp"
            }
        });
        for (let d = 0; d < forDays; d++) {
            const date = moment().add(d, 'days').format('YYYY-MM-DD');
            const program = await getChannelProgram(accessToken, ch.e, date);
            //fs.writeFileSync('programme-' + date, JSON.stringify(program, null, 2));
            console.log("Program length for channel " + ch.e + " on date " + date + ": " + program.length);
            //console.log(program.length);
            for (let prg of program) {
		const prgType = prg.editorial.contentType != "movie" ? "episode" : "movie";
		const prog = {
//                    "@start": moment(prg.airingStartTime * 1000).add(tzoffset / 60, 'hours').format('YYYYMMDDHHmmss ZZ'),
//                    "@stop": moment(prg.airingEndTime * 1000).add(tzoffset / 60, 'hours').format('YYYYMMDDHHmmss ZZ'),
                    "@start": moment(prg.airingStartTime * 1000).format('YYYYMMDDHHmmss ZZ'),
                    "@stop": moment(prg.airingEndTime * 1000).format('YYYYMMDDHHmmss ZZ'),
                    "@channel": prg.serviceRef,
                    "title": {
                        "@lang": "hu",
                        "#text": prg.Title
                    },
                    "desc": {
                        "@lang": "hu",
                        "#text": prg.Description ? prg.Description : ""
                    },
                    "icon": [
                         {
                             "@src": "https://imageservice.production4ig.opentv.com/images/v1/image/" + prgType + "/" + prg.id + "/" +
                                      (prgType == "episode" ? "episode" : "contentimage") +
                                      "?aspect=16x9&imageFormat=webp&width=320"
                         }
                    ]
                };
		if (prg.SeasonNumber && prg.EpisodeNumber) {
                            prog['episode-num'] =  [
                                {
                                    '@system': 'onscreen',
                                    '#text': 'S'+prg.SeasonNumber+'E'+prg.EpisodeNumber
                                }
                            ]
                            if (prg.Episode) {
                                prog['sub-title'] =  [
                                    {
                                        '@lang': 'hu',
                                        '#text': prg.Episode
                                    }
                                ]
                            }
                        }

                programme.push(prog);
            }
        }
        //break;
    }

    const newXml = await xmlGenerator(channels, programme);
    fs.writeFileSync('guide.xml', newXml);
};

//getProgram();