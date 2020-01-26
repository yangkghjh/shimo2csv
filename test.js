import { shimo2csv } from './index.js';
import { config } from './config.js';

const task = {
    name: "HOTEL",
    type: "sheet",
    guid: "GJKh3RTPRcwJcYWK",
};

// const path = "./files";

shimo2csv(task, config.Cookie, {
    ColNum: 7,
    StartRow: 4,
    StartCol: 1,
}).then((data) => {
    console.log(data);
});
