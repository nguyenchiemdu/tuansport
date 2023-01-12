const mongoose = require('mongoose');
const Category = require('../models/mongo/mongo.category')
let {importCategories,importAttributes,importProduct,backupSyncedProduct} = require('../common/sync_data');
const mongoProduct = require('../models/mongo/mongo.product');
const webhookController = require('../controllers/webhook_controller');
const mongoCategory = require('../models/mongo/mongo.category');
const { addcomebackDate } = require('../common/model_function');
async function connect() {

    try {        
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true
        });
        // importCategories();
        // importAttributes();
        // importProduct();
        // backupSyncedProduct()
    //    await addcomebackDate()
        // mongoProduct.updateMany({}, {
        //     tags: [
        //         '#tuansport',
        //         '#tuansportdanang',
        //         '#tuấnsportđànẵng',
        //         '#tuanthethao',
        //         '#tuangiay',
        //         '#tuấn',
        //         '#tuấnsport', '#tuansport',
        //         '#tuansportdn',
        //         '#tuấnsportdn',
        //         '#giàydabong',
        //         '#giàybóngđá',
        //         '#giaydabong',
        //         '#giaybongda',
        //         '#giầyđábóng',
        //         '#giaythethao',
        //         '#phukienthethao',
        //         '#phukiendabong',
        //         '#phukienbongda',
        //         '#bong'
        //     ]
        // }).then(res=> console.log('ok'))
        if ((process.env.WEBHOOK ?? 'false') == 'true') webhookController.reRegistWebhook()
        console.log('Connect to Mongo DB successfully!');
        // Category.create({
        //     _id: 5,
        //     categoryName: 'Phụ kiện thể thao',
        // })

        
        // await mongoProduct.updateMany({}, {
        //     isMarked: false
        // }).then(res => console.log(res))
//         let count = await mongoProduct.countDocuments({})
//         let docs = []
//         await mongoProduct.find({})
//             .then(products => products.forEach(product => docs.push(product)))
//         console.log(count)
//         for (let i = 0; i < count; i++) {
//             mongoProduct.updateMany({_id: docs[i]._id}, {
//                 description: '',
//                 long_description: `Mua giày tặng ngay tất ngắn & hộp đựng giày
// Nếu sản phẩm hết hàng tại Website bạn có thể inbox trực tiếp cho shop để chuẩn bị số lượng hàng bạn cần.

// CHỌN SIZE: (Đã ẩn size hết hàng)

// Chúng tôi cam kết hình ảnh sản phẩm mang tính thực tế và được cửa hàng tự quay, chụp tại shop.
// Nếu sản phẩm không giống hình chúng tôi đền gấp 10 lần giá trị sản phẩm.
// —————————

// ⚽️: Chính sách đổi hàng tẹt ga, và tới khi nào ưng ý thì thôi.
// ⚽️: Có chính sách bảo hành trọn đời và rõ ràng, uy tín đã được cộng đồng ghi nhận.
// ⚽️: Phí ship COD toàn quốc được shop san sẻ và hỗ trợ và chỉ tốn 25k / 1 đôi ( Ở đâu rẻ chúng tôi rẻ hơn )

// ⚽️: 100% sản phẩm đăng bán đều là hàng có sẵn, được chụp ảnh và quay video.

// ⚽️: Và rất nhiều ưu điểm vượt trội khác đang chờ các bạn trải nghiệm

// —————————-

// Facebook Page: https://www.facebook.com/Tuấn Sports Đà Nẵng

// – Cơ sở 2: 55 Ngô Gia Tự – TP Đà nẵng
// – Cơ sở 3: 150 kNgũ Hành Sơn – TP Đà Nẵng
// – Cơ sở 4: 51 Pastuer – TP Đà Nẵng ( showroom máy tập)

// Zalo: 0905 595 614

// TRUNG TÂM TDTT TUẤN SPORT – ĐÀ NẴNG
// + CUNG CẤP SỈ & LẺ DỤNG CỤ THIẾT BỊ THỂ DỤC THỂ THAO.
// + NHẬN MAY VÀ THIẾT KẾ ÁO ĐỒNG PHỤC, ÁO LỚP, ÁO NHÓM.
// + NHẬN MAY ÁO THI ĐẤU GIÁ XƯỞNG CHO CLB BÓNG ĐÁ.
// -TUẤN SPORTS XIN CHÂN THÀNH CẢM ƠN QUÝ KHÁCH ĐÃ QUAN TÂM VÀ ỦNG HỘ ĐẾN SẢN PHẨM CỦA TUẤN SPORT.
// – Cơ sở 1: 42 Ngô Gia Tự -TP Đà Nẵng TDTT )
// – Cơ sở 5 324 Trần Đại Nghĩa – TP Đà Nẵng
// Lh: 0905 595 614 – 0986 955 869`
//             }).then(res => console.log(res))
//         }
//         console.log('successfully')
    }
        catch (error) {
        console.log('Connect Mongo DB failure!');
        console.log('Error: ',error)
    }

}

module.exports = { connect };
