let kycData = []; // temporary storage

exports.uploadKYC = (req, res) => {
  const { userId, documentType } = req.body;
  if (!userId || !documentType)
    return res.status(400).json({ message: 'Missing userId or documentType' });

  const newKYC = { id: kycData.length + 1, userId, documentType, status: 'Pending' };
  kycData.push(newKYC);

  res.status(201).json({ message: 'KYC uploaded', kyc: newKYC });
};

exports.getKYCStatus = (req, res) => {
  const { userId } = req.params;
  const userKYC = kycData.filter(k => k.userId === userId);
  if (!userKYC.length) return res.status(404).json({ message: 'No KYC found' });

  res.status(200).json({ kyc: userKYC });
};


