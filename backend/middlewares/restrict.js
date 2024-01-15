export function restrict(req, res, next) {
    const roles = req.userRoles;
    if (roles.includes("admin")) next();
    else res.sendStatus(403);
}