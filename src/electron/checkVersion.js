import https from 'https'
import { version } from './package.json'

function getRelease () {
    return new Promise ((resolve, reject) => {

        const req = https.request({
            "method": "GET",
            "hostname": "api.github.com",
            "path": "/repos/AppSaloon/socket.io-tester/releases/latest",
            "headers": {
                "User-Agent": "socket.io-tester"
            }
        }, function (res) {
            const chunks = []

            res.on("data", function (chunk) {
                chunks.push(chunk)
            })

            res.on("end", function () {
                const body = Buffer.concat(chunks)
                if ( res.statusCode !== 200 ) return reject(JSON.parse(body.toString()))
                return resolve(JSON.parse(body.toString()))
            })
        })

        req.end()

    })
}

let win = {isReady: false}

async function checkVersion (appWindow) {
    win = appWindow
    try {
        const release = await getRelease()
        if ( Object.prototype.toString.apply(release).slice(8, -1) === 'Object' && release.name !== `v${version}` )
            sendMessageToWindow({channel: 'showUpdateNotification', message: release.name})
    }
    catch (error) {
        sendMessageToWindow({channel: 'showUpdateErrorNotification', message: error})
    }
}

export default checkVersion

function sendMessageToWindow ({channel, message}) {
    if ( win.isReady )
        win.webContents.send(channel, message)
    else
        setTimeout(() => {
            sendMessageToWindow({channel, message})
        }, 1000)
}
