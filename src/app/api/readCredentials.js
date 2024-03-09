const fs = require('fs').promises; // Use the promises version of fs for better readability
const phpFilePath = 'c:/inetpub/wwwroot/pbnscred.php';

const getmysqlConfig = async () => {
    try {
        const data = await fs.readFile(phpFilePath, 'utf8');
        const matches = data.match(/(\$[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*)\s*=\s*("[^"]*"|'[^']*'|[^\s;]+)/g);
        if (matches) {
            const variables = matches.reduce((acc, match) => {
                const parts = match.split('=').map(part => part.trim());
                acc[parts[0]] = parts[1];
                return acc;
            }, {});
            const mysqlConfig = {
                config: {
                    host: (variables.$servername).replace(/"/g, '').replace(/'/g, ''),
                    database: (variables.$dbname).replace(/"/g, '').replace(/'/g, ''),
                    user: (variables.$username).replace(/"/g, '').replace(/'/g, ''),
                    password: (variables.$password).replace(/"/g, '').replace(/'/g, ''),
                }
            }
            return mysqlConfig;
        }
    } catch (err) {
        console.error('Error reading PHP file:', err);
        throw err; // Rethrow the error for handling at a higher level if needed
    }
};
export default getmysqlConfig



