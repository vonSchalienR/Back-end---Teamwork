jest.mock('../src/app/models/User', () => ({
    findById: jest.fn(),
}));

const auth = require('../src/middleware/auth');
const { requireAuth, requireAdmin } = require('../src/middleware/authorize');
const User = require('../src/app/models/User');

const createRes = () => {
    const res = {};
    res.redirect = jest.fn(() => res);
    res.status = jest.fn(() => res);
    res.send = jest.fn(() => res);
    return res;
};

const createReq = (overrides = {}) => ({
    path: '/private',
    method: 'GET',
    originalUrl: '/private',
    session: {},
    ...overrides,
});

const next = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();
});

describe('auth middleware', () => {
    test('allows whitelisted GET /login', () => {
        const req = createReq({ path: '/login', method: 'GET' });
        const res = createRes();

        auth(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(res.redirect).not.toHaveBeenCalled();
    });

    test('allows POST /login', () => {
        const req = createReq({ path: '/login', method: 'POST' });
        const res = createRes();

        auth(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
    });

    test('allows when session has userId', () => {
        const req = createReq({ session: { userId: 'abc' } });
        const res = createRes();

        auth(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
    });

    test('redirects unauthenticated requests and stores returnTo', () => {
        const req = createReq({ session: {} });
        const res = createRes();

        auth(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(req.session.returnTo).toBe('/private');
        expect(res.redirect).toHaveBeenCalledWith('/login');
    });
});

describe('requireAuth', () => {
    test('passes when session contains userId', async () => {
        const req = createReq({ session: { userId: 'user123' } });
        const res = createRes();

        await requireAuth(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
    });

    test('redirects when not authenticated', async () => {
        const req = createReq({ session: {} });
        const res = createRes();

        await requireAuth(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(req.session.returnTo).toBe('/private');
        expect(res.redirect).toHaveBeenCalledWith('/login');
    });
});

describe('requireAdmin', () => {
    test('redirects to login when no session', async () => {
        const req = createReq({ session: {} });
        const res = createRes();

        await requireAdmin(req, res, next);

        expect(res.redirect).toHaveBeenCalledWith('/login');
        expect(next).not.toHaveBeenCalled();
    });

    test('returns 403 when user not found', async () => {
        User.findById.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });
        const req = createReq({ session: { userId: 'missing' } });
        const res = createRes();

        await requireAdmin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith('Forbidden');
        expect(next).not.toHaveBeenCalled();
    });

    test('returns 403 when user is not admin', async () => {
        User.findById.mockReturnValue({ lean: jest.fn().mockResolvedValue({ role: 'user' }) });
        const req = createReq({ session: { userId: 'user123' } });
        const res = createRes();

        await requireAdmin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith('Forbidden');
        expect(next).not.toHaveBeenCalled();
    });

    test('calls next when admin user found', async () => {
        User.findById.mockReturnValue({ lean: jest.fn().mockResolvedValue({ role: 'admin' }) });
        const req = createReq({ session: { userId: 'admin123' } });
        const res = createRes();

        await requireAdmin(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.redirect).not.toHaveBeenCalled();
    });
});
