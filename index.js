import axios from 'axios';
import download from 'download';
import fs from 'fs';
import xlsx from 'xlsx';

async function downloadExcel(item, cookie, tmpPath) {
    let type = 'xlsx';

    const url = 'https://shimo.im/lizard-api/files/' + item.guid + '/export';

    const response = await axios.get(url, {
        params: {
            type: type,
            file: item.guid,
            returnJson: '1',
            name: item.name,
            isAsync: '0'
        },
        headers: {
            Cookie: cookie,
            Referer: 'https://shimo.im/folder/123',
        }
    });

    if (!response.data.redirectUrl) {
        throw new Error(item.name + ' failed, error: ', response.data);
    }

    return download(response.data.redirectUrl).then(data => {
        fs.writeFileSync(tmpPath+item.name+'.xlsx', data);
    });
}

// TODO: 以下三个函数目前均只支持 1-26 列
function getCellID(x, y) {
    return String.fromCharCode(y+64)+x;
}
function getMaxCol(ref) {
    let arr = ref.split(":");
    return arr[1].charCodeAt()-64;
}
function getMaxRow(ref) {
    let arr = ref.split(":");
    return arr[1].replace(/[^0-9]/ig, "");
}

function readRows(rows, worksheet, sheetName, maxCol, maxRow, excelConfig) {
    for (let i = excelConfig.StartRow; i <= maxRow; i++) {
        let row = [sheetName];
        for (let j = excelConfig.StartCol; j <= maxCol; j++) {
            let cellID = getCellID(i, j);
            let cell = worksheet[cellID];
            if (!cell) {
                if (j == excelConfig.StartCol){
                    return;
                }
                row.push('');
            } else {
                row.push(cell.v);
            }
        }
        rows.push(row);
    }
}

export const shimo2csv = async function (item, cookie, excelConfig) {
    const tmpPath = "./tmp/";
    if (!fs.existsSync(tmpPath)) {
        fs.mkdirSync(tmpPath);
    }
    return downloadExcel(item, cookie, tmpPath).then(() => {
        let workbook = xlsx.read(tmpPath+item.name+'.xlsx', {type: 'file'});
        let rows = [];

        workbook.SheetNames.forEach((sheetName) => {
            let worksheet = workbook.Sheets[sheetName];
    
            const range = worksheet['!ref'];
            const maxRow = getMaxRow(range);
            let maxCol = getMaxCol(range);
            maxCol = (maxCol>=excelConfig.ColNum)?maxCol:excelConfig.ColNum;
            readRows(rows, worksheet, sheetName, maxCol, maxRow,excelConfig);
        });
        
        return new Promise(function(resolve) {
            resolve(rows);
        });
    });
};
