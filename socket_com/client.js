const
    io = require("socket.io-client"),
    ioClient = io.connect("https://mkelights.com:8080/");

const { exec } = require('child_process');

ioClient.on('connect', function(msg) {
    console.log('connect from server:');
    ioClient.emit('joined', 'Hello client from device');
});

ioClient.on('response on', function (msg) {
    console.log('light on ' + msg + ' from server');
    exec('./LORController ' +msg, (err, stdout, stderr) => {
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

ioClient.on('all light on', function (msg) {
    console.log('all light on ' + msg + ' from server');
    for (var i=1; i<=16; i++) {
        exec('./LORController ' + i, (err, stdout, stderr) => {
            if (err) {
                //some err occurred
                console.error(err);
            } else {
                // the *entire* stdout and stderr (buffered)
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
            }
        }); 
    }
});

ioClient.on('response off', function (msg) {
    console.log('light off ' + msg + ' from server');
    exec('ps aux | grep "LORController ' + msg + '"', (err, stdout, stderr) => {
        if (err) {
            console.error(err)
        } else {
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
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

ioClient.on('all light off', function (msg) {
    console.log('all light off ' + msg + ' from server');
    exec('ps aux | grep "LORController' + '"', (err, stdout, stderr) => {
        if (err) {
            console.error(err)
        } else {
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
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
