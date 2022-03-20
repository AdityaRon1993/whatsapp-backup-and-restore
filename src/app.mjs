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
            console.log(
                gradient.pastel.multiline(
                    `
Before we backup Whatsapp Chat there are some prerequisites :
        1. You need to enable debugging Mode
                a. Go to 'SETTINGS'
                b. Go to 'About phone'
                c. Click on 'Build number' 7 times
                    (a snack notification should popup stating - 'No need, you are already a developer')
                d. go back to 'SETTINGS' and click on 'SYSTEM'
                e. scroll down to 'Developer options' and click on it
                f. Turn on USB debugging.
                g. Connect your phone to the system`
                )
            );
            await printCenter({
                str: '*******************************************************************************************************',
                maxLength: titleLength,
                gradient: gradient.atlas.multiline
            });

            console.log(
                gradient.pastel.multiline(` 
            while using the application a popup might appear on your device asking to 
                                    Allow USB debugging ?
                h. click on 'Always allow from this computer' and click on 'Allow'`)
            );
            await printCenter({
                str: '*******************************************************************************************************',
                maxLength: titleLength,
                gradient: gradient.atlas.multiline
            });

            console.log(
                gradient.pastel.multiline(`            
        2. Create Backup from Whatsapp
                a. Click on the 3 dots(menu) on the top right of your screen
                b. Click on 'settings'
                c. click on 'Chats'
                d. click on 'Chat backup'
                e. click on Backup to Google Drive
                f. select 'Never'
                g. Click on the Green Backup Button`)
            );
            await printCenter({
                str: '*******************************************************************************************************',
                maxLength: titleLength,
                gradient: gradient.atlas.multiline
            });

            console.log(
                gradient.pastel.multiline(`                This will create the chat backup on your Android phone.
                This process might take some time`)
            );
            await printCenter({
                str: '*******************************************************************************************************',
                maxLength: titleLength,
                gradient: gradient.atlas.multiline
            });



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
    console.log(selecedDevice);
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
    while(!sDevice?.authorized){
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
            continue;
        }
        sDevice =device;
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
    selecedDevice = await getDevices();
    const backups = await checkBackups();
    const values = {};
    let choices = backups?.res?.map((backup) => {
        const key = `backup for(${backup.deviceId})[${backup.time.toLocaleString()}] || restorable - ${backup.success}`;
        values[key] = backup;
        return key;
    });
    const restorationRes = await list({
        name: 'backup or restore',
        message: gradient.pastel.multiline('Do you want to Create a backup or Restore a previous backup?'),
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
    console.log(gradient.pastel.multiline('WhatsApp Backup has been restored\n\n\n'));
};

await welcome();
