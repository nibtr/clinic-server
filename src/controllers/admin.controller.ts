import { STAFF_TYPE } from "../constant";
import { getPersonnelFollowingType } from "./common.controller";
import { messageResponse } from "../utils/messageResponse";
import { NextFunction, Request, Response } from "express";


// export const postStaff = async (
//   request: Request,
//   response: Response,
//   next: NextFunction
// ) => {
//   console.log(request.body);
//   const { name, nationalID, dob, gender, phone } = request.body;

//   if (phone.length !== 10) {
//     response.status(400).json({ message: "Phone number is invalid" });
//     return;
//   }

//   if (gender !== MALE_GENDER && gender !== FEMALE_GENDER) {
//     response
//       .status(400)
//       .json({ message: "gender code is M(male) or F(female)" });
//     return;
//   }

//   if (nationalID.length !== 12) {
//     response.status(400).json({ message: "nationalID is invalid" });
//     return;
//   }

//   try {
//     const personnel = await prismaClient.personnel.create({
//       data: {
//         name,
//         nationalID,
//         dob: new Date(dob),
//         gender,
//         phone,
//         type: STAFF_TYPE,
//       },
//     });

//     const _ = await prismaClient.staff.create({
//       data: {
//         Personel: {
//           connect: {
//             id: personnel.id,
//           },
//         },
//       },
//     });

//     response.status(201).json(personnel);
//   } catch (error) {
//     next(error);
//   }
// };

export const getStaffs = getPersonnelFollowingType(STAFF_TYPE);

