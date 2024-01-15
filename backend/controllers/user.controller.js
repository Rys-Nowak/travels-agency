export function getCurrentUser(req, res) {
    res.send({ username: req.currentUser, roles: req.userRoles });
}
