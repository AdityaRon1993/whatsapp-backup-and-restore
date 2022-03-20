import inquirer from 'inquirer';


const list = async ({name,message,choices}) =>{
    const ans = await inquirer.prompt({
        name,
        type: 'list',
        message,
        choices
    });
    return ans[name]
}

const prompt = async ({name,message,_default})=>{
    await inquirer.prompt({
        name,
        type: 'input',
        message,
        default() {
          return _default;
        },
      });
}

export {list}