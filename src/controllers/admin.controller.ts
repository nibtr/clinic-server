import { NextFunction, Request, Response } from "express";
import prismaClient from "../utils/prismaClient";
import { STAFF_TYPE } from "../constant";
import { messageResponse } from "../utils/messageResponse";

export const getStaff = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    let { limit, page } = request.query;

    if (!limit) {
      return response
        .status(400)
        .json(messageResponse(400, "limit is required"));
    }

    if (!page) {
      page = "0";
    }

    const [total, listStaff] = await prismaClient.$transaction([
      prismaClient.personnel.count({
        where: {
          type: STAFF_TYPE,
        },
      }),
      prismaClient.personnel.findMany({
        skip: Number(limit) * Number(page),
        take: Number(limit),
        where: {
          type: STAFF_TYPE,
        },
      }),
    ]);

    return response.status(200).json(
      messageResponse(200, {
        list: listStaff,
        total,
      })
    );
  } catch (error) {
    next(error);
  }
};

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
