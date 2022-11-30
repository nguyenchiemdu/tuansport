class ApiUrl {
    static accessToken = 'https://id.kiotviet.vn/connect/token';
    static getProducts = 'https://public.kiotapi.com/products';
    static getCategoryById(id) {
        return `https://public.kiotapi.com/categories/${id}?hierachicalData=true`;
    }
    static getAttributes = 'https://public.kiotapi.com/attributes/allwithdistinctvalue';
}
module.exports = ApiUrl