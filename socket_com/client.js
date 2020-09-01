const
    io = require("socket.io-client"),
    ioClient = io.connect("http://3.20.78.29:8080");

const { exec } = require('child_process');

// ioClient.on("seq-num", (msg) => console.info(msg));
ioClient.on('connect', function(data) {
    ioClient.emit('joined', 'Hello World from client');
});

// ioClient.on('acknowledge', function(data) {
//     alert(data);
// });

ioClient.on('response on', function (msg) {
    console.log('light on ' + msg + ' from server');
    exec('./LORtest ' +msg, (err, stdout, stderr) => {
        if (err) {
            //some err occurred
            console.error(err);
        } else {
            // the *entire* stdout and stderr (buffered)
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
        }
    });
});

ioClient.on('response off', function (msg) {
    console.log('light off ' + msg + ' from server');
    exec('ps aux | grep "LORtest ' + msg + '"', (err, stdout, stderr) => {
        if (err) {
            console.error(err)
        } else {
            // console.log(`stdout: ${stdout}`);
            // console.log(`stderr: ${stderr}`);
            let process_arr = stdout.split(/\r?\n/);
            process_arr.forEach(function(item) {
                let p_infos = item.split(/\s+/);
                console.log(`pid: ${p_infos[1]}`);
                exec('kill ' + p_infos[1], (err, stdout, stderr) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log(`stdout: ${stdout}`);
                        console.log(`stderr: ${stderr}`);
                    }
                });
            });
        }
    })
});
