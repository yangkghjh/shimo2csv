import axios from 'axios';
import { config } from './config.js';
import Path from 'path';
import download from 'download';
import sleep from 'await-sleep';

const item = {
    name: "HOTEL",
    type: "sheet",
    guid: "GJKh3RTPRcwJcYWK",
};

createExportTask(item, config.Path);

async function createExportTask(item, basePath = '') {
    try {
        let type = '';
        const name = replaceBadChar(item.name);
        if (item.type == 'newdoc' || item.type == 'document') {
            type = 'docx';
        } else if (item.type == 'sheet' || item.type == 'mosheet' || item.type == 'spreadsheet') {
            type = 'xlsx';
        } else if (item.type == 'slide') {
            type = 'pptx';
        } else if (item.type == 'mindmap') {
            const response = await axios.get('https://shimo.im/lizard-api/files/' + item.guid + '?contentUrl=true', {
                headers: {
                    Cookie: config.Cookie,
                    Referer: 'https://shimo.im/folder/123',
                }
            });

            if (!response.data.contentUrl) {
                console.error(item.name, response.data);
                return;
            }

            let url = 'https://shimo.im/api/mindmap/exports?url=' + encodeURIComponent(response.data.contentUrl) + '&format=xmind&name=' + encodeURIComponent(name);
            // console.log(url, Path.join(config.Path, basePath));
            await download(url, basePath);
            return;
        } else {
            console.log('unsupport type: ' + item.type);
            return;
        }

        const url = 'https://shimo.im/lizard-api/files/' + item.guid + '/export';

        const response = await axios.get(url, {
            params: {
                type: type,
                file: item.guid,
                returnJson: '1',
                name: name,
                isAsync: '0'
            },
            headers: {
                Cookie: config.Cookie,
                Referer: 'https://shimo.im/folder/123',
            }
        });

        // console.log(name, response.data)
        // console.log(response.data.redirectUrl, Path.join(config.Path, basePath));
        if (!response.data.redirectUrl) {
            console.error(item.name + ' failed, error: ', response.data);
            return;
        }
        await download(response.data.redirectUrl, basePath);
    } catch (error) {
        console.error(item.name + ' failed, error: ' + error.message);
    }
}

function replaceBadChar(fileName) {
    // 去掉文件名中的无效字符,如 \ / : * ? " < > | 
    fileName = fileName.replace(/[\'\"\\\/\b\f\n\r\t]/g, '_');
    return fileName;
}
