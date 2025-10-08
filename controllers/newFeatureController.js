exports.getNewFeaturePage = (req, res) => {
  res.render('new-feature', {
    title: 'New Feature'
  });
};

exports.postNewFeatureAction = async (req, res) => {
  try {
    const data = req.body;
    res.render('new-feature', {
      title: 'New Feature',
      success: 'ดำเนินการสำเร็จ',
      data: data
    });
  } catch (error) {
    res.render('new-feature', {
      title: 'New Feature',
      error: 'เกิดข้อผิดพลาด: ' + error.message
    });
  }
};

