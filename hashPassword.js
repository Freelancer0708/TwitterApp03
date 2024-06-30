const bcrypt = require('bcrypt');

const hashPassword = async () => {
    const password = 'user01';  // 登録したいパスワード
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`Hashed Password: ${hashedPassword}`);
};

hashPassword().catch(err => console.error('Error hashing password:', err));
