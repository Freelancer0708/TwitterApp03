import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(200).json({ isAuthenticated: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        return res.status(200).json({ isAuthenticated: true, user: decoded });
    } catch (err) {
        return res.status(200).json({ isAuthenticated: false });
    }
}
