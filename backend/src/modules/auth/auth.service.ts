import { IAuthRepository } from "./auth.interface.js";
import { toUserResponse } from "./auth.mapper.js";
import { RegisterUserDTO } from "./auth.schema.js";
import { UserResponseType } from "./auth.types.js";

export class AuthService {
    constructor(private authRepo: IAuthRepository) { }

    async registerUser(data: RegisterUserDTO): Promise<{
        user: UserResponseType;
    }> {
        const newUser = await this.authRepo.createUser(data);
        return {
            user: toUserResponse(newUser)
        };
    }
}