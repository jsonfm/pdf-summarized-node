import { Router, Response } from "express";

// schemas
import { LoginFormSchema, SignupFormSchema } from "@/schemas/auth/forms";

// validators
import { validateSchema } from "@/schemas/validator";

// types
import type { LoginFormSchemaType, SignupFormSchemaType } from "@/schemas/auth/forms";
import type { CustomRequest } from "@/types/common/requests";

// services
import { UsersService } from "@/services/users.service";
import { encrypt } from "@/helpers/encrypt";

export const router = Router();
const usersService = new UsersService();

router.post(
  "/login",
  validateSchema(LoginFormSchema),
  async (request: CustomRequest<LoginFormSchemaType>, response: Response) => {
    const form = request.parsed.body;
    const user = await usersService.findOneByEmail(form.email);
    if (!user) {
      return response.status(404).json({ error: `user with email '${form.email}' not found` });
    }
    const passwordIsValid = encrypt.comparepassword(user.password, form.password);
    if (!passwordIsValid) {
      return response.status(401).json({ error: `wrong password` });
    }
    const tokens = encrypt.generateAccessAndRefreshTokens({ sub: user.id });
    return response.status(200).json({ message: "welcome", data: tokens });
  },
);

router.post(
  "/signup",
  validateSchema(SignupFormSchema),
  async (request: CustomRequest<SignupFormSchemaType>, response: Response) => {
    const form = request.parsed.body;
    const user = await usersService.findOneByEmail(form.email);
    if (user) {
      return response.status(400).json({ error: `user with email '${form.email}' already exists` });
    }
    const password = encrypt.encryptpass(form.password);
    const data = { email: form.email, password };
    await usersService.save(data);
    return response.status(201).json({ message: `user with email '${form.email}' registered` });
  },
);
