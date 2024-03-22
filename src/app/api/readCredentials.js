const fs = require('fs').promises; // Use the promises version of fs for better readability
const phpFilePath = './pbnscred.php';

const readCredentials = async () => {
    try {
        const data = await fs.readFile(phpFilePath, 'utf8');
        const matches = data.match(/(\$[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*)\s*=\s*("[^"]*"|'[^']*'|[^\s;]+)/g);
        if (matches) {
            const variables = matches.reduce((acc, match) => {
                const parts = match.split('=').map(part => part.trim());
                acc[parts[0]] = parts[1].replace(/"/g, '').replace(/'/g, '');
                return acc;
            }, {});
            const mysqlConfig = {
                config: {
                    host: variables.$servername,
                    database: variables.$dbname,
                    user: variables.$username,
                    password: variables.$password,
                }
            }
            const credentials={
                accessKeyId: variables.$s3key,
                secretAccessKey: variables.$s3secretkey,
            }
            return {mysqlConfig, credentials};
        }
    } catch (err) {
        console.error('Error reading PHP file:', err);
        throw err; // Rethrow the error for handling at a higher level if needed
    }
};
export default readCredentials



