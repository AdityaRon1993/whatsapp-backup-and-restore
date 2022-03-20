import { exec, spawn } from 'child_process';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import * as _c from '../constant.mjs';

const adb_path = path.join(__dirname, '..', '..', '_adb', process.platform, `./adb${process.platform=='win32'?'.exe':''}`);

const executeAdbCommand = async (command, options = {}) => {
    let output = {
        status: true,
        res: []
    };
    switch (command) {
        case _c.commands.GET_ALL_DEVICES: {
            let rawOutput = await execute(_c.excecute.GET_ALL_DEVICES);
            const d = rawOutput.split('\n').filter((e) => e !== '');
            if (d[0] == 'List of devices attached') {
                output.res = [];
                for (let i = 1; i < d.length; i++) {
                    output.res.push(getDevices(d[i]));
                }
                break;
            }
        }

        case _c.commands.CHECK_WHATSAPP_BACKUP:
            let rawOutput = await execute(_c.excecute.CHECK_WHATSAPP_BACKUP(options?.deviceId))
                .then((res) => true)
                .catch((err) => false);
            return rawOutput;
    }
    return output;
};

const getDevices = (data) => {
    const o = data.split(' ').filter((e) => e !== '');
    let authorized = o[1] !== 'unauthorized';
    const product = o.find((e) => e.indexOf('product:') > -1)?.replace('product:', '');
    const model = o.find((e) => e.indexOf('model:') > -1)?.replace('model:', '');
    const device = o.find((e) => e.indexOf('device:') > -1)?.replace('device:', '');
    let output = {
        deviceId: o[0],
        authorized,
        product,
        model,
        device
    };
    return output;
};

const execute = (command) =>
    new Promise((resolve, reject) => {
        exec(`${adb_path} ${command}`, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            if (stderr) {
                reject(stderr);
                return;
            }
            resolve(stdout);
        });
    });

const adbCreateBackup = ({ deviceId, backupLocation }) =>
    new Promise((response, reject) => {
        let adb = spawn(
            `${adb_path}`,
            [
                `-s`,
                `${deviceId}`,
                `pull`,
                `${_c.excecute.DOWNLOAD_WHATSAPP_BACKUP}`,
                `${backupLocation}`
            ],
            {
                stdio: 'inherit'
            }
        );
        adb.on('exit', function (code) {
            if (code == 0) {
                response(code);
            } else {
                reject(code);
            }
        });
    });
const adbStartRestoration = ({ deviceId, backupLocation }) =>
    new Promise((response, reject) => {
        let adb = spawn(
            `${adb_path}`,
            [
                `-s`,
                `${deviceId}`,
                `push`,
                `${backupLocation}`,
                `${_c.excecute.UPLOAD_WHATSAPP_BACKUP}`
            ],
            {
                stdio: 'inherit'
            }
        );
        adb.on('exit', function (code) {
            if (code == 0) {
                response(code);
            } else {
                reject(code);
            }
        });
    });

export { executeAdbCommand, adbCreateBackup,adbStartRestoration };
