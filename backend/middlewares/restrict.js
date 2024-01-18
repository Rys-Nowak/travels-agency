export function restrictForAdmin(req, res, next) {
    const roles = req.userRoles;
    if (roles.includes("admin")) next();
    else res.sendStatus(403);
}

export function restrictForClient(req, res, next) {
    const roles = req.userRoles;
    if (roles.includes("client")) next();
    else res.sendStatus(403);
}

export function restrictForAdminOrManager(req, res, next) {
    const roles = req.userRoles;
    if (roles.includes("admin") || roles.includes("manager")) next();
    else res.sendStatus(403);
}