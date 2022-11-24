class RedirectMiddleWare{
    static redirect(path){
        return (_,res) => {
            res.redirect(path);

        }
    }
}
module.exports = RedirectMiddleWare