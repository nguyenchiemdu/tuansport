class Product {
    createdDate;
    id;
    retailerId;
    code;
    barCode;
    name;
    fullName;
    categoryId;
    categoryName;
    allowsSale;
    type;
    hasVariants;
    basePrice;
    weight;
    conversionValue;
    modifiedDate;
    isActive
    isLotSerialControl
    isBatchExpireControl
    attributes
    images
    constructor(json) {
        this.createdDate = json.createdDate
        this.id = json.id
        this.retailerId = json.retailerId
        this.code = json.code
        this.barCode = json.barCode
        this.name = json.name
        this.fullName = json.fullName
        this.categoryId = json.categoryId
        this.categoryId = json.categoryId
        this.categoryName = json.categoryName
        this.fullName = json.fullName
        this.allowsSale = json.allowsSale
        this.type = json.type
        this.hasVariants = json.hasVariants
        this.basePrice = json.basePrice
        this.weight = json.weight
        this.conversionValue = json.conversionValue
        this.modifiedDate = json.modifiedDate
        this.isActive = json.isActive
        this.isLotSerialControl = json.isLotSerialControl
        this.isBatchExpireControl = json.isBatchExpireControl
        this.attributes = json.attributes.map(attribute => new Attribute(attribute))
        this.images = json.images
    }
}
class Attribute {
    productId
    attributeName
    attributeValue
    constructor(json) {
        this.productId = json.productId
        this.attributeName = json.attributeName
        this.attributeValue = json.attributeValue
    }
}
module.exports = Product;