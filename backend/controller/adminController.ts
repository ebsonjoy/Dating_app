// import asyncHandler from 'express-async-handler';
// import { Request, Response } from 'express';
// import AdminService from '../services/adminService';
// import generateAdminToken from '../utils/generateAdminToken'; 


// class AdminController{
// // Admin Authentication (Login)
//  authAdmin = asyncHandler(async (req: Request, res: Response) => {
//   const { email, password } = req.body;
//   const admin = await AdminService.authenticateAdmin(email, password);
//   if (admin) {
//     generateAdminToken(res,admin._id.toString())
//     res.status(200).json({
//       _id: admin._id,
//       email: admin.email,
//      });
//   } else {
//     res.status(401);
//     throw new Error('Invalid email or password');
//   }
// });

// // Admin Registration (Create new admin)
//   registerAdmin = asyncHandler(async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   try {
//     await AdminService.registerAdmin(email, password);
//     res.status(201).json({ message: 'Admin created successfully' });
//   } catch (error) {
   
//     if (error instanceof Error) {
//       res.status(400).json({ message: error.message });
//     } else {
//       res.status(400).json({ message: 'Unknown error occurred' });
//     }
//   }
// });
// // logout admin
//   logoutAdmin = asyncHandler(async (req: Request, res: Response) => {
//   res.cookie("jwt", "", {
//       httpOnly: true,
//       expires: new Date(0), 
//   });
//   res.status(200).json({ message: "Admin Logged Out" });
// });



//  getAllUsers = asyncHandler(async(req,res)=>{
//   try{
//     const users = await AdminService.getAllUsers()
//     res.status(200).json(users)
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   }catch(err:any){
//     console.log(err);
//     res.status(500).json({ message: 'Error fetching users'})
//   }
// })


//  updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
//   const { userId } = req.params;
//   const { newStatus } = req.body;  
//   try {
//     const updatedUser = await AdminService.toggleUserStatus(userId, newStatus);
    
//     res.status(200).json({ message: 'User status updated', user: updatedUser });
//   } catch (error) {
//     console.log(error);
    
//     res.status(500).json({ message: 'Error updating user status' });
//   }
// });

// }

// export default new AdminController();
