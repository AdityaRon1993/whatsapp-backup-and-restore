import gradient from 'gradient-string';
import printCenter from './printCenter.mjs';

const backupinfo = async (titleLength) => {
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
    await printCenter({
        str: 'This will create the chat backup on your Android phone.',
        maxLength: titleLength,
        gradient: gradient.atlas.multiline
    });
    await printCenter({
        str: 'This process might take some time',
        maxLength: titleLength,
        gradient: gradient.atlas.multiline
    });
    await printCenter({
        str: '*******************************************************************************************************',
        maxLength: titleLength,
        gradient: gradient.atlas.multiline
    });
    return;
};

const restoreInfo = async (titleLength) => {
    await printCenter({
        str: '*******************************************************************************************************',
        maxLength: titleLength,
        gradient: gradient.atlas.multiline
    });
    console.log(
        gradient.pastel.multiline(
            `
        Before we restoring Whatsapp Chat there are some prerequisites :
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
        2. Make sure WhatsApp is not available or installed in your device. If whatsApp is installed Please uninstall the same.
        3. Install WhatsApp. AND DONOT OPEN THE APP.
               `)
    );
    await printCenter({
        str: '*******************************************************************************************************',
        maxLength: titleLength,
        gradient: gradient.atlas.multiline
    });
    return;
};

export { backupinfo, restoreInfo };
