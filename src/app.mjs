import gradient from 'gradient-string';
import inquirer from 'inquirer';

import * as wabrConsole from './utilities/wabrConsole.mjs';
import * as _c from './constant.mjs';
import { executeAdbCommand } from './utilities/adb.mjs';
import { figletPromise } from './utilities/figletPromise.mjs';
import wait from './utilities/wait.mjs';
import printCenter from './utilities/printCenter.mjs';
import {createBackup,checkBackups} from './utilities/backup.mjs'
const titleLength = 117
console.clear();
await wait(100);

const welcome = async () => {
    await figletPromise({ msg: 'Welcome To WABR', print: true });
    await printCenter({str : 'WhatsApp Backup and Restore',maxLength:titleLength, gradient : gradient.atlas.multiline})
    await printCenter({str : 'By Ron',maxLength:titleLength, gradient : gradient.pastel.multiline})
    wabrConsole.colorText({
        data: `
        Backup and restore whatsapp chats.
        No internet is required
    `,
        color: 'white',
        print: true
    });
    let backups = await backup();
    switch (backups.status) {
        case true:
            showbackups(backups);
            break;
        case false:
            if (!backups.status) {
                wabrConsole.colorText({
                    data: backups.msg,
                    color: 'red',
                    print: true
                });
            }
            
            tryToCheckWhatsAppStatus();

            break;
    }
};
const checkWhatsAppStatus = async () => {
    // console.log(gradient.pastel.multiline('Available Devices :\n'));
    const device = await getDevices();
    const res = await executeAdbCommand(_c.commands.CHECK_WHATSAPP_BACKUP, { deviceId: device.deviceId }).catch((err) => err);
    if (res) {
        console.log(gradient.summer.multiline('Whatsapp BACKUP is available :\n'));
        return {status: true, device};
    }
    wabrConsole.colorText({
        data: 'NO Whatsapp BACKUP found :\n',
        color: 'red',
        print: true
    });

    return {status : false, device};
};
const backup = async () => {
    const res = await checkBackups();
    return res;
};

const showbackups= async(backups)=>{
    backups?.res?.forEach(backup=>{
        console.log(`
        backup for - ${backup.deviceId},
        time - ${backup.time.toString()}
        `)
    })
};

const getDevices = async () => {
    const res = await executeAdbCommand(_c.commands.GET_ALL_DEVICES);
    let values = {};
    let choices = [];

    if (res.status) {
        // choices = res.res.map((d) =>`deviceId : ${d.deviceId} || authorized : ${d.authorized?'YES' : 'NO'}  || product: ${d.product} || model: ${d.model} || device: ${d.device}`);
        choices = res.res.map((d) => {
            let o = `${d.model}(${d.device} - ${d.deviceId}) --[ ${(!d.authorized && 'NOT ') || ''}AUTHORIZED ]`;
            values[o] = d;
            return o;
        });
    }
    console.log('\n\n\n')
    const answers = await inquirer.prompt({
        name: 'available_devices',
        type: 'list',
        message: `${gradient.pastel.multiline('Please select one of the Available Devices :')}`,
        choices
    });

    return values[answers['available_devices']];
};

const tryToCheckWhatsAppStatus = async ()=>{
    const checkWhatsAppStatusRes = await checkWhatsAppStatus();
    if(!checkWhatsAppStatusRes.status){
        const answers = await inquirer.prompt({
            name: 'tryAgain',
            type: 'list',
            message: 'Do you want to try again?',
            choices : ['YES','NO']
        });
        if(answers['tryAgain'] != 'YES') return;
        return tryToCheckWhatsAppStatus();
    }
    takeBackup({device :checkWhatsAppStatusRes.device})
}

const takeBackup = async ({device})=>{
    const successCode = await createBackup({device});
    if(successCode == 1){
        wabrConsole.colorText({
            data: 'FAILED TO GET BACKUP.\n Try again',
            color: 'red',
            print: true
        });
        tryToCheckWhatsAppStatus();
    }
    startRestoration({device})
}
const startRestoration = async ({device})=>{

}

await welcome();
