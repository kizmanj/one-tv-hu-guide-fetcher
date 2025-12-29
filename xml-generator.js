const xmlbuilder = require('xmlbuilder');
const fs = require('fs');

const buildXml = async (channels, programme) => {
    let tv = {
            tv: {
                '@generator-info-name': 'me',
                'channel': channels,
                'programme': programme
            }
        };


    let root = xmlbuilder
        .create(tv, { encoding: 'utf-8' });

    let newXml = root.end({ pretty: true });

    //console.log(newXml);
    return newXml;
};

module.exports = buildXml;