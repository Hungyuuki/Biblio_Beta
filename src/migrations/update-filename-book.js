module.exports = {
    up: function (queryInterface, Sequelize) {//tạo được thì add cột vào
        // logic for transforming into the new state
        return queryInterface.addColumn(
            'Books',
            'filename', //thêm trường filename vào bảng books để dùng trường này làm id của mỗi tấm ảnh trên cloudinary
            Sequelize.STRING
        );

    },

    down: function (queryInterface, Sequelize) {//tạo fail thì quay lại remove cột đó đi
        // logic for reverting the changes
        return queryInterface.removeColumn(
            'Books',
            'filename'
        );
    }
}