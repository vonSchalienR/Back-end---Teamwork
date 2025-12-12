// __tests__/authorize.test.js
const { requireAuth, requireAdmin } = require("../src/middleware/authorize");
const User = require("../src/app/models/User");

// simple req / res / next mock tool
const createMock = (session) => {
  const req = {
    // make sure session always be an object
    session: session || {},
    originalUrl: "/protected",
  };

  const res = {
    redirectedTo: null,
    statusCode: 200,
    body: null,
    redirect(url) {
      this.redirectedTo = url;
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    send(msg) {
      this.body = msg;
      return this;
    },
  };

  const next = jest.fn();

  return { req, res, next };
};

describe("requireAuth middleware", () => {
  test("calls next when session has userId", async () => {
    const { req, res, next } = createMock({ userId: "123" });

    await requireAuth(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.redirectedTo).toBeNull();
  });

  test("redirects to /login when no userId in session", async () => {
    const { req, res, next } = createMock(); 

    await requireAuth(req, res, next);

    expect(req.session.returnTo).toBe("/protected");
    expect(res.redirectedTo).toBe("/login");
    expect(next).not.toHaveBeenCalled();
  });
});

describe("requireAdmin middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("redirects to /login when not logged in", async () => {
    const { req, res, next } = createMock(); 

    await requireAdmin(req, res, next);

    expect(req.session.returnTo).toBe("/protected");
    expect(res.redirectedTo).toBe("/login");
    expect(next).not.toHaveBeenCalled();
  });

  test("calls next when user is admin", async () => {
    // model findById().lean() return admin 
    jest.spyOn(User, "findById").mockReturnValue({
      lean: () => ({ _id: "123", role: "admin" }),
    });

    const { req, res, next } = createMock({ userId: "123" });

    await requireAdmin(req, res, next);

    expect(User.findById).toHaveBeenCalledWith("123");
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBe(200);
    expect(res.redirectedTo).toBeNull();
  });

  test("returns 403 when user is not admin", async () => {
    // model findById().lean() return normal user
    jest.spyOn(User, "findById").mockReturnValue({
      lean: () => ({ _id: "123", role: "user" }),
    });

    const { req, res, next } = createMock({ userId: "123" });

    await requireAdmin(req, res, next);

    expect(User.findById).toHaveBeenCalled();
    expect(res.statusCode).toBe(403);
    expect(res.body).toBe("Forbidden");
    expect(next).not.toHaveBeenCalled();
  });

  test("returns 403 when user not found", async () => {
    // model findById().lean() return null
    jest.spyOn(User, "findById").mockReturnValue({
      lean: () => null,
    });

    const { req, res, next } = createMock({ userId: "123" });

    await requireAdmin(req, res, next);

    expect(User.findById).toHaveBeenCalled();
    expect(res.statusCode).toBe(403);
    expect(res.body).toBe("Forbidden");
    expect(next).not.toHaveBeenCalled();
  });
});
