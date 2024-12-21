import User from "../models/User";
import { Request, Response, NextFunction } from 'express';
import TokenService from '../utils/tokenService';

export const checkSubscription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            res.status(401).json({ message: 'Access token is missing' });
            return;
        }

        const decodedAccess = TokenService.verifyAccessToken(accessToken);

        if (!decodedAccess) {
            res.status(401).json({ message: 'Invalid or expired token' });
            return;
        }

        const user = await User.findById(decodedAccess.userId).select('-password');

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const subscription = user.subscription || {};
        const { isPremium, planExpiryDate } = subscription;
        const now = new Date();

        if (isPremium || (planExpiryDate && new Date(planExpiryDate) > now)) {
            next(); 
            return;
        }
        res.status(403).json({
            code: 'SUBSCRIPTION_EXPIRED',
            message: 'Your free access has expired. Please subscribe to continue using premium features.',
        });
    } catch (error) {
        console.error('Error in subscription check:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
