const request = require("supertest");
const express = require("express");
const expenseRouter = require("../routes/expenseRoutes");
const {
  saveExpense,
  updateExpense,
  deleteExpense,
  getExpense,
  getIncome,
  updateIncome,
} = require("../routes/expenseRoutes");

jest.mock("../controllers/expenseController", () => ({
  saveExpense: jest.fn(),
  updateExpense: jest.fn(),
  deleteExpense: jest.fn(),
  getExpense: jest.fn(),
  getIncome: jest.fn(),
  updateIncome: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use("/api/expense", expenseRouter);

describe("Expense Router", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("POST /api/expense/save should call saveExpense controller", async () => {
    const mockRequest = {
      date: "2004-04-04",
      category: "rent",
      amount: "5000",
      description: "rent",
      userId: 13,
    };
    await request(app).post("/api/expense/save").send(mockRequest).expect(200);

    expect(saveExpense).toHaveBeenCalled();
  });

  test("GET /api/expense/get/:userId should call getExpense controller", async () => {
    await request(app).get("/api/expense/get/13").expect(200);

    expect(getExpense).toHaveBeenCalled();
  });

  test("GET /api/expense/get/income/:userId should call getIncome controller", async () => {
    await request(app).get("/api/expense/get/income/13").expect(200);

    expect(getIncome).toHaveBeenCalled();
  });

  test("PUT /api/expense/put/updateincome/:userId should call updateIncome controller", async () => {
    const mockRequest = {
      newIncome: 760000,
    };
    await request(app)
      .put("/api/expense/put/updateincome/13")
      .send(mockRequest)
      .expect(200);

    expect(updateIncome).toHaveBeenCalled();
  });

  test("PUT /api/expense/put/:id should call updateExpense controller", async () => {
    const mockRequest = {
      id: 28,
      date: "2024-06-05",
      category: "utilities",
      amount: "16000.00",
      description: "month",
      userid: 13,
    };
    await request(app)
      .put("/api/expense/put/abc123")
      .send(mockRequest)
      .expect(200);

    expect(updateExpense).toHaveBeenCalled();
  });

  test("DELETE /api/expense/delete/:id should call deleteExpense controller", async () => {
    await request(app).delete("/api/expense/delete/28").expect(200);

    expect(deleteExpense).toHaveBeenCalled();
  });
});
