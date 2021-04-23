import {app} from './app';
import {config} from './config';
import * as http from "http";
import {usersController} from "./controller/user.controller";
import {linkListController} from "./controller/linkList.controller";

app.use('/rest/users', usersController.router);
app.use('/rest/linklist', linkListController.router)

let allowedExt = [
    '.js',
    '.ico',
    '.css',
    '.png',
    '.jpg',
    '.woff2',
    '.woff',
    '.ttf',
    '.svg',
];

const appPath = __dirname +  '/dist/hello-world/';

app.get('/*', function (req, res) {
    if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
        res.sendFile(`${appPath}${req.url}`);
    } else {
        res.sendFile(appPath + 'index.html');
    }
});

const server = http.createServer(app);
server.listen(config.port, () => console.log(`App running on: http://localhost:${config.port}`));
