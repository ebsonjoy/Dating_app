import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import asyncHandler from 'express-async-handler';
import { IAdminService } from '../../interfaces/admin/IAdminService';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
// import { StatusMessage } from '../../enums/StatusMessage';
// import { IAdmin } from '../../types/admin.types';
import generateAdminToken from '../../utils/generateAdminToken'; 

@injectable()
export class AdminController{
    constructor(
        @inject('IAdminService') private readonly adminService : IAdminService
    ){}
    login = asyncHandler(async(req:Request, res:Response)=>{
       const { email, password } = req.body;
       const admin = await this.adminService.authenticateAdmin(email,password)
            if(admin){
                generateAdminToken(res,admin._id.toString())
                res.status(HttpStatusCode.OK).json({
                  _id: admin._id,
                  email: admin.email,
                 });
            }else{
                res.status(HttpStatusCode.UNAUTHORIZED)
                throw new Error('Invalid email or password');
            }
    })

    register = asyncHandler(async (req: Request, res: Response) => {
        const { email, password } = req.body;
        try {
            await this.adminService.registerAdmin(email, password);
            res.status(HttpStatusCode.CREATED).json({ message: 'Admin created successfully' });
        } catch (error) {
            res.status(HttpStatusCode.BAD_REQUEST).json({ message: error instanceof Error ? error.message : 'Unknown error occurred' });
        }
    });

    logout = asyncHandler(async (req: Request, res: Response) => {
        res.cookie("jwt", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        res.status(HttpStatusCode.OK).json({ message: "Admin logged out" });
    });

    getAllUsers = asyncHandler(async (req: Request, res: Response) => {
        try {
            const users = await this.adminService.getAllUsers();
            res.status(HttpStatusCode.OK).json(users);
        } catch (error) {
            console.log(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching users' });
        }
    });

     // Update user status
     updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.params;
        const { newStatus } = req.body;
        console.log('successsss',newStatus);
        
        try {
            const updatedUser = await this.adminService.toggleUserStatus(userId, newStatus);
            res.status(HttpStatusCode.OK).json({ message: 'User status updated', user: updatedUser });
        } catch (error) {
            console.log(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Error updating user status' });
        }
    });
}