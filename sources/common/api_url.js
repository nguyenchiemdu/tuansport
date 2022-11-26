class ApiUrl {
    static accessToken = 'https://id.kiotviet.vn/connect/token';
    static getProducts = 'https://public.kiotapi.com/products';
    static getCategoryById(id) {
        return `https://public.kiotapi.com/categories/${id}?hierachicalData=true`;
    }
}
module.exports = ApiUrl