import gradient from 'gradient-string';

import * as wabrConsole from './utilities/wabrConsole.mjs';
import * as _c from './constant.mjs';
import { executeAdbCommand } from './utilities/adb.mjs';
import { figletPromise } from './utilities/figletPromise.mjs';
import wait from './utilities/wait.mjs';
import printCenter from './utilities/printCenter.mjs';
import { createBackup, checkBackups } from './utilities/backup.mjs';
import { list } from './utilities/enquire.mjs';
import { restoreBackup } from './utilities/restore.mjs';
import {backupinfo,restoreInfo} from './utilities/info.mjs'
const titleLength = 117;
let selecedDevice = {};
let isRestoreSelected = false;
console.clear();
await wait(100);

const welcome = async () => {
    await figletPromise({ msg: 'Welcome To WABR', print: true });
    await printCenter({ str: 'WhatsApp Backup and Restore', maxLength: titleLength, gradient: gradient.atlas.multiline });
    await printCenter({ str: 'By Ron', maxLength: titleLength, gradient: gradient.pastel.multiline });
    wabrConsole.colorText({
        data: `
        Backup and restore whatsapp chats.
        No internet is required
    `,
        color: 'white',
        print: true
    });

    // CREATE INFO
    console.log(
        gradient.pastel.multiline(`
    This application can only backup and restore Whatsapp chat for Android.
    IOS is not supported as dev doesnt own any IOS device.



    `)
    );

    //ASK BACKUP RESTORE

    const bOr = await list({
        name: 'backup or restore',
        message: gradient.pastel.multiline('Do you want to Create a backup or Restore a previous backup?'),
        choices: ['BACKUP', 'RESTORE']
    });
    console.log(bOr);
    switch (bOr) {
        case 'BACKUP':
           
            await backupinfo(titleLength);
            const continuePrompt = await list({
                name: 'continue Prompt',
                message: gradient.pastel.multiline('Ready To Continue'),
                choices: ['YES']
            });
            createWhatsappBackup();
            isRestoreSelected = false;
            break;
        case 'RESTORE':
            isRestoreSelected = true;
            createWhatsappRestoration();
            break;
    }
};

const createWhatsappBackup = async () => {
    selecedDevice = {};
    selecedDevice = await getDevices();
    let isbackUpAvailable = await checkWhatsAppStatus();
    if (!isbackUpAvailable.status) {
        const tryAgain = await list({
            name: 'tryAgain',
            message: gradient.pastel.multiline('No WhatsApp backup Found.\n Do you want to try again'),
            choices: ['YES', 'NO']
        });
        if (tryAgain == 'YES') return createWhatsappBackup();
        else return process.exit(1);
    }

    const _continue = await list({
        name: 'Continue',
        message: gradient.pastel.multiline('Do you want to continue and take a backup of your WhatsApp Chat'),
        choices: ['YES', 'NO']
    });
    if (_continue != 'YES') process.exit(1);

    const { status } = await takeBackup();
    if (!status) {
        const tryAgain = await list({
            name: 'tryAgain',
            message: gradient.pastel.multiline('Failed To store.\n Do you want to try again'),
            choices: ['YES', 'NO']
        });
        if (tryAgain == 'YES') return createWhatsappBackup();
        else return process.exit(1);
    }
    wabrConsole.log('WHATSAPP BACKED UP SUCCESSFULLY');
    const restorePrompt = await list({
        name: 'restore prompt',
        message: gradient.pastel.multiline('Do you want to start Restoration Process'),
        choices: ['YES', 'NO']
    });
    if (restorePrompt == 'YES') {
        isRestoreSelected = true;
        return createWhatsappRestoration();
    } else return process.exit(1);
};

const getDevices = async () => {
    let sDevice;
    while (!sDevice?.authorized) {
        console.log('\n\n');
        const res = await executeAdbCommand(_c.commands.GET_ALL_DEVICES);
        let values = {};
        let choices = [];
        if (res.status) {
            choices = res.res.map((d) => {
                let o = `${d.model}(${d.device} - ${d.deviceId}) --[ ${(!d.authorized && 'NOT ') || ''}AUTHORIZED ]`;
                values[o] = d;
                return o;
            });
        }
        if (choices.length == 0) {
            await wabrConsole.error('No devices found');

            await list({
                name: 'no_device_available',
                message: gradient.pastel.multiline('Enable Debugger mode and connect device.'),
                choices: ['I Have connected device']
            });
            continue;
        }
        let device =
            values[
                await list({
                    name: 'available_devices',
                    message: gradient.pastel.multiline('Please select one of the Available Devices :'),
                    choices
                })
            ];
        if (!device?.authorized) {
            await wabrConsole.error('Device is not Authorised. \nPlease Allow Authorisation');
            await printCenter({
                str: '*******************************************************************************************************',
                maxLength: titleLength,
                gradient: gradient.atlas.multiline
            });

            console.log(
                gradient.pastel.multiline(` 
            while using the application a popup might appear on your device asking to 
                                    Allow USB debugging ?
                    click on 'Always allow from this computer' and click on 'Allow'\n`)
            );
            await printCenter({
                str: '*******************************************************************************************************',
                maxLength: titleLength,
                gradient: gradient.atlas.multiline
            });
            continue;
        }
        sDevice = device;
    }
    return sDevice;
};

const checkWhatsAppStatus = async () => {
    const res = await executeAdbCommand(_c.commands.CHECK_WHATSAPP_BACKUP, { deviceId: selecedDevice?.deviceId }).catch((err) => err);
    if (res) {
        console.log(gradient.summer.multiline('Whatsapp BACKUP is available\n'));
        return { status: true };
    }
    wabrConsole.colorText({
        data: 'NO Whatsapp BACKUP found :\n',
        color: 'red',
        print: true
    });

    return { status: false };
};

const takeBackup = async () => {
    const successCode = await createBackup({ device: { ...selecedDevice } });
    if (successCode == 1) {
        wabrConsole.colorText({
            data: 'FAILED TO GET BACKUP.\n Try again',
            color: 'red',
            print: true
        });
    }
    return { status: successCode == 0 };
};

const createWhatsappRestoration = async () => {
    console.log('\n\n\n');
    isRestoreSelected = true;
    selecedDevice = {};
    await restoreInfo(titleLength);
    let _continue = await list({
        name: 'Continue',
        message: gradient.pastel.multiline('Do you want to continue and restore your WhatsApp Chat'),
        choices: ['YES', 'NO']
    });
    if (_continue != 'YES') process.exit(1);

    selecedDevice = await getDevices();
    const backups = await checkBackups();
    const values = {};
    let choices = backups?.res?.map((backup,i) => {
        const key = `${i+1}. backup for(${backup.deviceId})[${backup.time.toLocaleString()}] || restorable - ${backup.success ? 'YES' :'NO'}`;
        values[key] = backup;
        return key;
    });
    const restorationRes = await list({
        name: 'backup or restore',
        message: gradient.pastel.multiline('Please select a backup to restore'),
        choices
    });
    let userSelection = values[restorationRes];
    if (!userSelection?.success) {
        wabrConsole.error(`${restorationRes} is not restorable.\n`);
        const tryAgain = await list({
            name: 'tryAgain',
            message: gradient.pastel.multiline('Please select any other backup to restore'),
            choices: ['YES', 'NO']
        });
        if (tryAgain == 'YES') return createWhatsappRestoration();
        else return process.exit(1);
    }
    let output = await restoreBackup({ deviceId: selecedDevice.deviceId, backupFilename: userSelection.filename });
    if (output == 1) {
        wabrConsole.colorText({
            data: 'FAILED TO GET BACKUP.\n Try again',
            color: 'red',
            print: true
        });
    }
    await printCenter({
        str: '*******************************************************************************************************',
        maxLength: titleLength,
        gradient: gradient.atlas.multiline
    });
    console.log(
        gradient.pastel.multiline(`
            WhatsApp Backup has been restored
            1. Login to whatsapp
            2. WhatsApp will detect chat backup
            3. Click on Restore
            `)
    );

    await printCenter({
        str: '*******************************************************************************************************',
        maxLength: titleLength,
        gradient: gradient.atlas.multiline
    });
    let _end = await list({
        name: 'Continue',
        message: gradient.pastel.multiline('Restoration is complete'),
        choices: ['Quit','Start Again']
    });
    if(_end == 'Start Again'){
        return welcome()
    }
};

await welcome();
