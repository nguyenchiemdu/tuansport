class ApiUrl {
    static accessToken = 'https://id.kiotviet.vn/connect/token';
    static getProducts = 'https://public.kiotapi.com/products';
    static getAllCategory() {
        return `https://public.kiotapi.com/categories?pageSize=100&hierachicalData=true`
    }
    static getCategoryById(id) {
        return `https://public.kiotapi.com/categories/${id}?hierachicalData=true`;
    }
    static getProductById(id) {
        return `https://public.kiotapi.com/products/${id}`;
    }
    static getProductBySkuCode(skuCode) {
        return `https://public.kiotapi.com/products/code/${skuCode}`;
    }
    static getAttributes = 'https://public.kiotapi.com/attributes/allwithdistinctvalue';
    static createOrder = 'https://public.kiotapi.com/orders';
}
module.exports = ApiUrl