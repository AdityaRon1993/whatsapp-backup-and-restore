import figlet from 'figlet';
import gradient from 'gradient-string';

const figletPromise = (options) =>
    new Promise((resolve, reject) => {
        figlet(
            options.msg,
            {
                horizontalLayout: 'full'
            },
            function (err, data) {
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }
                if (options?.print) {
                    console.log(gradient.pastel.multiline(data));
                }
                resolve(gradient.pastel.multiline(data));
            }
        );
    });

export { figletPromise };
