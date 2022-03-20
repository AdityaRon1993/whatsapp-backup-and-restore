import chalk from 'chalk';
import boxen from 'boxen';

const log = (param) => {
    const greeting = chalk.white.bold(param);

    const boxenOptions = {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'green',
        backgroundColor: '#555555'
    };
    const msgBox = boxen(greeting, boxenOptions);
    console.group(msgBox);
    // console.log(param)
};

const error = async (param,print=true)=> {
    colorText({
        data: param,
        color: 'red',
        print: print
    });
    return
}
const colorText = ({ data, color, print = false }) => {
    const msg = chalk?.[color].bold(data);
    if (print) console.log(msg);
    return msg;
};

export { log, colorText ,error};
