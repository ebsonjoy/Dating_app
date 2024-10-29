import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import asyncHandler from 'express-async-handler';
import { IAdminService } from '../../interfaces/admin/IAdminService';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import generateAdminToken from '../../utils/generateAdminToken'; 
import { StatusMessage } from '../../enums/StatusMessage';

@injectable()
export class AdminController{
    constructor(
        @inject('IAdminService') private readonly adminService : IAdminService
    ){}
    login = asyncHandler(async (req: Request, res: Response) => {
        const { email, password } = req.body;
        try {
            const admin = await this.adminService.authenticateAdmin(email, password);
            if (admin) {
                generateAdminToken(res, admin._id.toString());
                res.status(HttpStatusCode.OK).json({
                    _id: admin._id,
                    email: admin.email,
                });
            } else {
                res.status(HttpStatusCode.UNAUTHORIZED).json({ message: StatusMessage.UNAUTHORIZED });
            }
        } catch (error) {
            console.error(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
        }
    });
    

    register = asyncHandler(async (req: Request, res: Response) => {
        const { email, password } = req.body;
        try {
            await this.adminService.registerAdmin(email, password);
            res.status(HttpStatusCode.CREATED).json({ message: StatusMessage.CREATED_SUCCESS });
        } catch (error) {
            res.status(HttpStatusCode.BAD_REQUEST).json({ message: error instanceof Error ? error.message : StatusMessage.BAD_REQUEST });
        }
    });
    

    logout = asyncHandler(async (req: Request, res: Response) => {
        try {
            res.cookie("jwt", "", {
                httpOnly: true,
                expires: new Date(0),
            });
            res.status(HttpStatusCode.OK).json({ message: StatusMessage.SUCCESS });
        } catch (error) {
            console.error(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
        }
    });
    

    getAllUsers = asyncHandler(async (req: Request, res: Response) => {
        try {
            const users = await this.adminService.getAllUsers();
            res.status(HttpStatusCode.OK).json(users);
        } catch (error) {
            console.error(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
        }
    });

    updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.params;
        const { newStatus } = req.body;
        try {
            const updatedUser = await this.adminService.toggleUserStatus(userId, newStatus);
            res.status(HttpStatusCode.OK).json({ message: 'User status updated', user: updatedUser });
        } catch (error) {
            console.error(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
        }
    });
    
}