
const bcrypt = require('bcrypt');

async function hashThis(word){
    const result = await bcrypt.hash(word,10);
    console.log(result);
}

hashThis('password0');