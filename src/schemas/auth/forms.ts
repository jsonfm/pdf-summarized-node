import { z } from "zod";

export const LoginFormSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export const SignupFormSchema = z.object({
  body: z
    .object({
      email: z.string().email(),
      password: z.string(),
      passwordConfirm: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: "Passwords don't match",
      path: ["confirm"], // path of error
    }),
});

export type LoginFormSchemaType = z.infer<typeof LoginFormSchema>;
export type SignupFormSchemaType = z.infer<typeof SignupFormSchema>;
