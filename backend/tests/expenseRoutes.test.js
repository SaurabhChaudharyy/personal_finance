const { describe } = require("node:test");
const { pool } = require("../config/db");

jest.mock("../config/db", () => ({
  pool: {
    query: jest.fn(),
  },
}));

const {
  saveExpense,
  getExpense,
  getIncome,
  updateIncome,
  deleteExpense,
  updateExpense,
} = require("../controllers/expenseController");

describe("Expense Controller", () => {
  const mockRequest = {};
  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("saveExpense", () => {
    it("should return 400 for missing data", async () => {
      mockRequest.body = {};
      await saveExpense(mockRequest, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Date, category, amount, and userId are required.",
      });
    });

    it("should save expense and return 201 with saved data", async () => {
      const expenseData = {
        date: "2024-05-22",
        category: "Groceries",
        amount: 50,
        description: "Weekly shopping",
        userId: 8,
      };
      mockRequest.body = expenseData;
      const mockResult = { rows: [{ ...expenseData, id: 1 }] };
      pool.query.mockResolvedValueOnce(mockResult);

      await saveExpense(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult.rows[0]);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO expenses"),
        expect.arrayContaining([
          expenseData.date,
          expenseData.category,
          expenseData.amount,
          expenseData.description,
          expenseData.userId,
        ])
      );
    });

    it("should catch errors and return 400", async () => {
      mockRequest.body = { date: "2024-05-22", category: "Groceries" };
      pool.query.mockRejectedValueOnce(new Error("Database error"));

      await saveExpense(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Date, category, amount, and userId are required.",
      });
    });
  });

  describe("GET /get/:userId", () => {
    // Function returns 200 status code with expenses data for valid user ID
    it("should return 200 status code with expenses data for valid user ID", async () => {
      const req = { params: { userId: `8` } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await getExpense(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });

    it("should handle non-existent user ID with an empty result set", async () => {
      const req = { params: { userId: "999" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await getExpense(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
    });
  });

  describe("GET /get/income/:userId", () => {
    it("should return 200 status with correct income data when valid userId is provided", async () => {
      const req = { params: { userId: "8" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await getIncome(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ totalincome: "55000.00" }]);
    });

    it("should return an empty array when no income data exists for the provided userId", async () => {
      const req = { params: { userId: "999" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await getIncome(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe("PUT /put/updateincome/:userId", () => {
    it("should update the income when a record already exists", async () => {
      const req = { params: { userId: "8" }, body: { newIncome: 5000 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockRows = [{ userid: "8", totalincome: 3000 }];
      require("../config/db").pool.query = jest
        .fn()
        .mockResolvedValueOnce({ rows: mockRows })
        .mockResolvedValueOnce({ rows: [{ userid: "8", totalincome: 5000 }] });

      await require("../controllers/expenseController").updateIncome(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ userid: "8", totalincome: 5000 });
    });

    it("should return a 400 error when newIncome is missing", async () => {
      const req = { params: { userId: "123" }, body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await require("../controllers/expenseController").updateIncome(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Income and userId are required.",
      });
    });
  });

  describe("DELETE /delete/:id", () => {
    it("should return the deleted expense data when the expense is successfully deleted", async () => {
      const req = { params: { id: "8" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockExpenseData = { id: "8", name: "Lunch", amount: 15.0 };

      pool.query = jest
        .fn()
        .mockResolvedValue({ rowCount: 1, rows: [mockExpenseData] });

      await deleteExpense(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockExpenseData);
    });

    it("should return a 404 error when the expense with the given ID does not exist", async () => {
      const req = { params: { id: "999" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      pool.query = jest.fn().mockResolvedValue({ rowCount: 0, rows: [] });

      await deleteExpense(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Expense not found" });
    });
  });

  describe("PUT /put/:id", () => {
    it("should update the expense successfully when all required fields are provided", async () => {
      const req = {
        body: {
          id: 15,
          date: "2023-01-01",
          category: "Food",
          amount: 100,
          description: "Lunch",
          userid: 8,
        },
      };
      const jsonMock = jest.fn();
      const statusMock = jest.fn(() => ({ json: jsonMock }));
      const res = { status: statusMock };

      await updateExpense(req, res);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(expect.any(Object));
    });

    it("should return an error when required fields are missing", async () => {
      const req = {
        body: {
          id: 1,
          date: "",
          category: "",
          amount: null,
          description: "Lunch",
          userid: null,
        },
      };
      const jsonMock = jest.fn();
      const statusMock = jest.fn(() => ({ json: jsonMock }));
      const res = { status: statusMock };

      await updateExpense(req, res);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: "Date, category, amount, and userId are required.",
      });
    });
  });
});
