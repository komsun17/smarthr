exports.getHipFingerPage = (req, res) => {
  res.render('hip-finger', {
    title: 'HIP Finger Scan'
  });
};

exports.getHipCarparkPage = (req, res) => {
  res.render('hip-carpark', {
    title: 'HIP Carpark'
  });
};

exports.postHipCarparkAction = async (req, res) => {
  try {
    const data = req.body;
    res.render('hip-carpark', {
      title: 'HIP Carpark',
      success: 'ดำเนินการสำเร็จ',
      data: data
    });
  } catch (error) {
    res.render('hip-carpark', {
      title: 'HIP Carpark',
      error: 'เกิดข้อผิดพลาด: ' + error.message
    });
  }
};

