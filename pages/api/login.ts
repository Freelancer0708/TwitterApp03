import type { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { username, password } = req.body;

        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        });

        const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);

        const users = rows as any[];

        if (users.length > 0) {
            const user = users[0];
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
                res.setHeader('Set-Cookie', cookie.serialize('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 3600,
                    path: '/'
                }));
                res.status(200).json({ success: true, user: { id: user.id, username: user.username } });
            } else {
                res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        connection.end();
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
