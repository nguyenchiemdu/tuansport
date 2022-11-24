const { Double } = require("mongodb");

const getTableDataWithPagination = async (
    req,
    Table,
    {populateString = '',
    sortCondition = '',
    findCondition = {}}= {}
) => {
    let currentPage = req.query.page || 1
    let pageSize = req.query.pageSize || 20
    return await Table.find(findCondition)
        .sort(`${sortCondition}`)
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize)
        .populate(populateString)
        .exec()
        .then(async (docs) => {
            var countResult;
            let pages = await Table.countDocuments(findCondition).then((count) => {
                //count number of Pages
                countResult = count;
                let pages = Math.ceil(count / pageSize);
                return pages;
            });
            currentPage = parseInt(currentPage)
            return { docs, currentPage, pages, countResult };
        });
};
module.exports.getTableDataWithPagination = getTableDataWithPagination
