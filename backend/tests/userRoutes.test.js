const { describe } = require("node:test");
const { pool } = require("../config/db");
const { bcrypt } = require("bcryptjs");

jest.mock("../config/db", () => ({
  pool: {
    query: jest.fn(),
  },
}));

const { registerUser, authUser } = require("../controllers/userController");
const generateToken = require("../config/generateToken");

describe("User Controller", () => {
  const mockRequest = {};
  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("signUp", () => {
    it("should register user successfully with valid email and password", async () => {
      const req = {
        body: { email: "test@example.com", password: "password123" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await registerUser(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User registered successfully",
        token: expect.any(String),
      });
    });

    it("should fail registration with status 400 if email is missing", async () => {
      const req = { body: { password: "password123" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await registerUser(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email and Password are required!",
      });
    });
  });

  describe("login", () => {
    it("should return a success message and token when credentials are correct", async () => {
      const req = {
        body: { email: "user@example.com", password: "password123" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const bcryptCompareMock = jest
        .spyOn(bcrypt, "compare")
        .mockResolvedValue(true);
      const poolQueryMock = jest
        .spyOn(pool, "query")
        .mockResolvedValueOnce({
          rows: [{ id: 15, email: "user@example.com", password: "$2a$10$..." }],
        })
        .mockResolvedValueOnce({ rows: [{ id: 15 }] });
      const generateTokenMock = jest
        .spyOn(generateToken, "generateToken")
        .mockReturnValue("fakeToken123");

      await authUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Signin successful",
        token: "fakeToken123",
        userId: 1,
      });
      bcryptCompareMock.mockRestore();
      poolQueryMock.mockRestore();
      generateTokenMock.mockRestore();
    });
  });
  it("should return an error message when email or password is empty", async () => {
    const req = { body: { email: "", password: "" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await authUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "email and password are required",
    });
  });
});
