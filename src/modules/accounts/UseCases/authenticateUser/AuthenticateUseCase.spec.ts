import { AppError } from "@shared/errors/AppError";
import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUseCase } from "./AuthenticateUseCase";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";

let authenticateUserUseCase: AuthenticateUseCase;
let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;

describe("Authenticate user", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    authenticateUserUseCase = new AuthenticateUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to authenticate a user", async () => {
    const user: ICreateUserDTO = {
      driver_license: "qweqe",
      email: "weqoew@sdasso.com",
      password: "qweq",
      name: "User test",
    };

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toHaveProperty("token");
  });

  it("should not be able to authenticate a nonexistent user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "fdasafds@dfsa.com",
        password: "12123",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to authenticate with invalid password", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        driver_license: "qweqe",
        email: "weqoew@sdasso.com",
        password: "qweq",
        name: "User test",
      };

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "sqeq",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
