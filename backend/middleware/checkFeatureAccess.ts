import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import TokenService from '../utils/tokenService';

export const checkFeatureAccess = (featureCode: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

      const user = await User.findById(decodedAccess.userId)
        .select('-password');
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const now = new Date();
      const subscription = user.subscription;

      if ( !subscription || !subscription.isPremium || !subscription.planId || 
          (subscription.planExpiryDate && new Date(subscription.planExpiryDate) <= now)) {
        res.status(403).json({
          code: 'SUBSCRIPTION_REQUIRED',
          message: 'This feature requires an active subscription'
        });
        return;
      }

      if (!Array.isArray(subscription.features) || !subscription.features.includes(featureCode)) {
        res.status(403).json({
          code: 'FEATURE_NOT_INCLUDED',
          message: 'This feature is not included in your current plan',
        });
        return;
      }
      console.log('checked feature')
      next();
    } catch (error) {
      console.error('Error in feature access check:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};