
const hotelController = {
  getHotelPage: (req, res) => {
    res.render('hotel', {
      title: 'Hotel Management'
    });
  },

  postHotelAction: async (req, res) => {
    try {
      const data = req.body;
      res.render('hotel', {
        title: 'Hotel Management',
        success: 'ดำเนินการสำเร็จ',
        data: data
      });
    } catch (error) {
      res.render('hotel', {
        title: 'Hotel Management',
        error: 'เกิดข้อผิดพลาด: ' + error.message
      });
    }
  }
};

module.exports = hotelController;

