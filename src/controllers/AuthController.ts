import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { UserService } from "../services/UserService";
import { AdminService } from "../services/AdminService";
import { DepartmentService } from "../services/DepartmentService";
import { EmailUserDepartmentService } from "../services/EmailUserDepartmentService";
import { FolderAccessService } from "../services/FolderAccessService";
import {
  resetCodeMailOptions,
  resetCodes,
  resetTokens,
} from "../helper/EmailData";
import { EmailHelper } from "../helper/EmailHelper";

export class AuthController {
  private authService = new AuthService();
  private userService = new UserService();
  private emailUserDepartmentService = new EmailUserDepartmentService();
  private adminService = new AdminService();
  private departmentService = new DepartmentService();
  private folderAccessService = new FolderAccessService();

  registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, emails, cpf, rg, cnpj, phone, cod, password } = req.body;

      /* 
        interface Email {
          email: string;
          department: string;
        }
      */

      const userExists = await this.userService.getUserByKey(
        "mainEmail",
        emails[0].email
      );
      if (userExists) {
        res.status(400).send("Email já cadastrado.");
        return;
      }

      const hashedPassword = await this.authService.hashPassword(password);
      const user = {
        name,
        mainEmail: emails[0].email,
        password: hashedPassword,
        role: "user",
        cpf,
        rg,
        cnpj,
        phone,
        cod,
      };

      const newUser = await this.userService.createUser(user);

      for (const email of emails) {
        const emailUserDepartment = {
          email: email.email,
          department: email.department,
          user: newUser,
        };
        await this.emailUserDepartmentService.createAssociation(
          emailUserDepartment
        );
      }

      res.status(201).send("Usuário registrado com sucesso!");
    } catch (error) {
      console.log(error);
      res.status(500).send("Erro ao cadastrar usuário.");
    }
  };

  registerAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, phone, password } = req.body;
      const adminUserExists = await this.adminService.getAdminByEmail(email);
      if (adminUserExists) {
        res.status(400).send("Email já cadastrado.");
        return;
      }
      const hashedPassword = await this.authService.hashPassword(password);
      const adminUser = {
        name,
        mainEmail: email,
        password: hashedPassword,
        role: "admin",
        phone,
      };
      await this.adminService.createAdmin(adminUser);
      res.status(201).send("Usuário registrado com sucesso!");
    } catch (error) {
      res.status(500).send("Erro ao cadastrar usuário.");
    }
  };

  registerDepartment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, phone, password, department, folderAccess } =
        req.body;

      /* 
        interface FoldersAccess {
          foldername: string;
        }
      */

      const departmentUserExists =
        await this.departmentService.getDepartmentByEmail(email);
      if (departmentUserExists) {
        res.status(400).send("Email já cadastrado.");
        return;
      }
      const hashedPassword = await this.authService.hashPassword(password);
      const departmentUser = {
        name,
        email: email,
        password: hashedPassword,
        role: "department",
        phone,
        department,
      };
      const newDepartment = await this.departmentService.createDepartment(
        departmentUser
      );

      folderAccess.forEach(async (folder: { foldername: string }) => {
        await this.folderAccessService.createFolderAccess({
          foldername: folder.foldername,
          department: newDepartment,
        });
      });
      res.status(201).send("Usuário registrado com sucesso!");
    } catch (error) {
      console.log(error);
      res.status(500).send("Erro ao cadastrar departamento.");
    }
  };

  loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, cpf, password } = req.body;
      const key = email ? "mainEmail" : cpf ? "cpf" : "cpnj";
      const userExists = await this.userService.getUserByKey(
        key,
        req.body[key]
      );

      if (!userExists) {
        res.status(400).send(key + " ou senha incorretos.");
        return;
      }

      const validPassword = await this.authService.verifyPassword(
        password,
        userExists.password
      );

      if (!validPassword) {
        res.status(400).send("Email ou senha incorretos.");
        return;
      }

      const token = await this.authService.generateToken({
        id: userExists.id,
        email: userExists.mainEmail,
        department: null,
        role: "user",
      });
      res.status(200).send(token);
    } catch (error) {
      res.status(500).send("Erro ao fazer login.");
    }
  };

  loginDepartment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      const departmentUserExists =
        await this.departmentService.getDepartmentByEmail(email);
      if (!departmentUserExists) {
        res.status(400).send("Email ou senha incorretos.");
        return;
      }

      const validPassword = await this.authService.verifyPassword(
        password,
        departmentUserExists.password
      );

      if (!validPassword) {
        res.status(400).send("Email ou senha incorretos.");
        return;
      }

      const token = await this.authService.generateToken({
        id: departmentUserExists.id,
        email: departmentUserExists.email,
        department: departmentUserExists.department,
        role: "department",
      });
      res.status(200).send(token);
    } catch (error) {
      res.status(500).send("Erro ao fazer login.");
    }
  };

  loginAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      const adminUserExists = await this.adminService.getAdminByEmail(email);
      if (!adminUserExists) {
        res.status(400).send("Email ou senha incorretos.");
        return;
      }

      const validPassword = await this.authService.verifyPassword(
        password,
        adminUserExists.password
      );

      if (!validPassword) {
        res.status(400).send("Email ou senha incorretos.");
        return;
      }

      const token = await this.authService.generateToken({
        id: adminUserExists.id,
        email: adminUserExists.email,
        department: "admin",
        role: "admin",
      });
      res.status(200).send(token);
    } catch (error) {
      res.status(500).send("Erro ao fazer login.");
    }
  };

  generateCode = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    const userExists = await this.userService.getUserByEmail(email);
    if (!userExists) {
      res.status(400).send("Email não cadastrado.");
      return;
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    resetCodes.set(email, { code, expiresAt });

    try {
      await EmailHelper.sendMail({
        to: email,
        subject: "Password Reset Code",
        text: resetCodeMailOptions.text(code),
        html: resetCodeMailOptions.html(code),
      });

      res
        .status(200)
        .json({ message: "If the email exists, a reset code has been sent." });
    } catch (error) {
      res.status(500).json({ error: "Failed to send reset code." });
    }
  };

  verifyCode = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, code } = req.body;

      const resetCode = resetCodes.get(email);
      if (!resetCode || resetCode.code !== code) {
        res.status(400).send("Invalid reset code.");
        return;
      }

      const now = new Date();
      if (now > resetCode.expiresAt) {
        res.status(400).send("Reset code has expired.");
        return;
      }

      const token = this.authService.generateEmailToken(email, code);

      resetTokens.set(token, {
        email,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      });

      resetCodes.delete(email);

      res.status(200).send({ token });
    } catch (error) {
      res.status(500).send("Erro ao enviar código de redefinição.");
      return;
    }
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token, password } = req.body;

      const resetToken = resetTokens.get(token);
      if (!resetToken) {
        res.status(400).send("Invalid reset token.");
        return;
      }

      const now = new Date();
      if (now > resetToken.expiresAt) {
        res.status(400).send("Reset token has expired.");
        return;
      }

      const hashedPassword = await this.authService.hashPassword(password);

      await this.userService.updatePasswordByEmail(
        resetToken.email,
        hashedPassword
      );

      resetTokens.delete(token);

      res.status(200).send("Password reset successfully.");
    } catch (error) {
      res.status(500).send("Erro ao redefinir senha.");
      return;
    }
  };

  updatePasswordWithPassword = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { oldPassword, newPassword } = req.body;

      if (!req.user) {
        res.status(400).send("User not found.");
        return;
      }

      const { id } = req.user;

      const userExists = await this.userService.getUserById(Number(id));
      if (!userExists) {
        res.status(400).send("User not found.");
        return;
      }

      const validPassword = await this.authService.verifyPassword(
        oldPassword,
        userExists.password
      );
      if (!validPassword) {
        res.status(400).send("Invalid old password.");
        return;
      }

      const hashedPassword = await this.authService.hashPassword(newPassword);

      await this.userService.updatePasswordById(Number(id), hashedPassword);

      res.status(200).send("Password updated successfully.");
    } catch (error) {
      console.log(error);
      res.status(500).send("Erro ao atualizar senha.");
      return;
    }
  };
}
