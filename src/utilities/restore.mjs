import fs, { fdatasync, renameSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { adbStartRestoration } from './adb.mjs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backupLocation = path.join(__dirname, '..', '..', 'backups');

const restoreBackup = async ({ deviceId, backupFilename }) => {
<<<<<<< HEAD
    let fileLocation = path.join(backupLocation,backupFilename,'TEST')
=======
    let fileLocation = path.join(backupLocation,backupFilename,'WhatsApp')
>>>>>>> 22516b1dc5e7a4ec576957dd7d0ae0d027246c3b
    const isExists = fs.existsSync(fileLocation);
    if(!isExists) return 1;
    const output = await adbStartRestoration({
        deviceId: deviceId,
        backupLocation : fileLocation
        
    });
    return output;
};
export { restoreBackup };
