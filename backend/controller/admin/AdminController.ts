import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import asyncHandler from 'express-async-handler';
import { IAdminService } from '../../interfaces/admin/IAdminService';
import { HttpStatusCode } from '../../enums/HttpStatusCode';
import { StatusMessage } from '../../enums/StatusMessage';
import { getReceiverSocketId, io } from "../../socket/socket";
import AdminTokenService from '../../utils/adminTokenService';

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
                const adminAccessToken = AdminTokenService.generateAdminAccessToken(admin._id.toString(),admin.role);
                const adminRefreshToken = AdminTokenService.generateAdminRefreshToken(admin._id.toString(),admin.role)
                AdminTokenService.setAdminTokenCookies(res, adminAccessToken, adminRefreshToken);
                res.status(HttpStatusCode.OK).json({
                    _id: admin._id,
                    email: admin.email,
                    role:admin.role,
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
            res.cookie("adminAccessToken", "", {
                httpOnly: true,
                expires: new Date(0),
            });
            res.cookie('adminRefreshToken', '', { 
                httpOnly: true, 
                expires: new Date(0) 
              });
            res.status(HttpStatusCode.OK).json({ message: StatusMessage.SUCCESS });
            console.log('log Out success')
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
            if(updatedUser?.status==false){
                const socketId = getReceiverSocketId(userId);
                if (socketId) {
                  io.to(socketId).emit('forceLogout');
                }
            }
            res.status(HttpStatusCode.OK).json({ message: 'User status updated', user: updatedUser });
        } catch (error) {
            console.error(error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
        }
    });

    fetchPayments = asyncHandler(async (req: Request, res: Response) => {
        try {
            const payments = await this.adminService.getPayments();
            res.status(HttpStatusCode.OK).json(payments);
          } catch (error) {
            console.log(error)
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
          }
    });

    getDashboardMasterData = asyncHandler(async(req:Request,res:Response)=>{
        try{
            const masterData = await this.adminService.dashBoardMasterData()
            res.status(HttpStatusCode.OK).json(masterData)
        }catch (error) {
            console.log(error)
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
          }
    })


    getUserChartData = asyncHandler(async(req: Request, res: Response) => {
        try {
          const { timeRange } = req.query;
          
          if (!timeRange || !['day', 'month', 'year'].includes(timeRange as string)) {
            res.status(400).json({ message: 'Invalid time range' });
            return 
          }
    
          const data = await this.adminService.getUserChartData(timeRange as 'day' | 'month' | 'year');
          res.status(200).json(data);

        } catch (error) {
          res.status(500).json({ message: 'Error fetching user chart data', error });
        }
      })
    
      getPaymentChartData = asyncHandler(async(req: Request, res: Response) => {
        try {
          const { timeRange } = req.query;
          
          if (!timeRange || !['day', 'month', 'year'].includes(timeRange as string)) {
             res.status(400).json({ message: 'Invalid time range' });
             return
          }
    
          const data = await this.adminService.getPaymentChartData(timeRange as 'day' | 'month' | 'year');
          res.status(200).json(data);
        } catch (error) {
          res.status(500).json({ message: 'Error fetching payment chart data', error });
        }
      })

      getUserReports = asyncHandler(async(req:Request, res: Response)=>{
        try {
            const reports = await this.adminService.getReportsWithMessages();
            res.status(200).json({
              success: true,
              data: reports,
            });
          } catch (err:unknown) {
            const error = err as Error
            res.status(500).json({
              success: false,
              message: "Failed to fetch reports.",
              error: error.message,
            });
          }
      })

      updateReportStatus = asyncHandler(async (req: Request, res: Response) => {
        const { reportId } = req.params;
        const { status } = req.body;
        if (!['Pending', 'Reviewed', 'Resolved'].includes(status)) {
             res.status(400).json({ message: 'Invalid status value' });
             return
        }
        try {
            const updatedReport = await this.adminService.updateReportStatus(reportId, status);
            if (!updatedReport) {
                 res.status(404).json({ message: 'Report not found' });
                 return
            }
            res.status(200).json({ message: 'Report status updated successfully', data: updatedReport });
            return
        } catch (error) {
            console.error(error);
             res.status(500).json({ message: 'Internal server error' });
             return
        }
    })

    createPlanFeature = asyncHandler(async (req: Request, res: Response) => {
      const { feature } = req.body;
  
      if (!feature || !feature.code || !feature.name) {
           res.status(400).json({ message: "Feature code and name are required" });
           return
      }
  
      const newFeature = await this.adminService.createPlanFeature(feature);
  
      if (!newFeature) {
          res.status(400).json({ message: "Invalid feature" });
          return
      }
  
      res.status(201).json({ message: "New Plan Feature is created", data: newFeature });
  });

  getPlanFeatures = asyncHandler(async(req:Request, res:Response)=>{
    const PlanFeatures = await this.adminService.getPlanFeatures()
    console.log('PlanFeatures',PlanFeatures)
    if(!PlanFeatures){
      res.status(400).json({ message: "No features" });
    }
    res.status(200).json(PlanFeatures)
  })
  
}