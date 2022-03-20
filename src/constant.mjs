const commands = {
    GET_ALL_DEVICES: 'Get All Devices',
    CHECK_WHATSAPP_BACKUP: 'Check for whatsapp Backup'
};

const excecute = {
    GET_ALL_DEVICES: 'devices -l',
    CHECK_WHATSAPP_BACKUP: (deviceId) => `-s ${deviceId} shell ls /storage/self/primary/Android/media/com.whatsapp/WhatsApp`,
    DOWNLOAD_WHATSAPP_BACKUP :(deviceId) => `/storage/self/primary/Android/media/com.whatsapp/WhatsApp`
};

export { commands, excecute };
