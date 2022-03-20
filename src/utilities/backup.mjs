import fs, { fdatasync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { adbCreateBackup } from './adb.mjs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backupLocation = path.join(__dirname, '..', '..', 'backups');

const createBackup = async ({ device }) => {
    const isExists = fs.existsSync(backupLocation);
    if (!isExists) {
        fs.mkdirSync(backupLocation);
    }
    let newBackupLocation = path.join(backupLocation, `WABR_${device.deviceId}_${Date.now()}`);
    fs.mkdirSync(newBackupLocation);
    const output = await adbCreateBackup({
        deviceId: device.deviceId,
        backupLocation: newBackupLocation
    });
    if (output == 1) {
        fs.rmSync(newBackupLocation);
    }
    return output;
};

const checkBackups = async () => {
    const isExists = fs.existsSync(backupLocation);
    if (!isExists) {
        return {
            status: false,
            res: [],
            msg: 'NO BACKUPS FOUND'
        };
    }
    const list = fs.readdirSync(backupLocation) || [];
    let backupList = list
        .filter((backup) => backup.indexOf('WABR_') > -1)
        .map((backup) => {
            let [WABR, deviceId, EPOCH] = backup.split('_');
            return {
                deviceId,
                time: new Date(+EPOCH)
            };
        });
    return {
        status : true,
        res :backupList,
        msg : "BACKUPS found"
    };
};

export { createBackup, checkBackups };
