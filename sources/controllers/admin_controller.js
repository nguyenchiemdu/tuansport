class AdminController {
    // GET  /admin
    async dashboard (req,res) {
        res.render("admin/dashboard_admin")
    }
}

module.exports = new AdminController();