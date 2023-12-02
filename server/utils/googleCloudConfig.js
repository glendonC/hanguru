const { Storage } = require('@google-cloud/storage');

let serviceAccount = null;

if (process.env.GCS_SERVICE_ACCOUNT) {
  console.log('Encoded Service Account:', process.env.GCS_SERVICE_ACCOUNT);
  const serviceAccountDecoded = Buffer.from(process.env.GCS_SERVICE_ACCOUNT, 'base64').toString('utf-8');
  console.log('Decoded Service Account:', serviceAccountDecoded);

  try {
    serviceAccount = JSON.parse(serviceAccountDecoded);
  } catch (error) {
    console.error('Error parsing service account JSON:', error);
  }
}

const storage = new Storage({
  credentials: serviceAccount,
});

const bucketName = process.env.GCS_BUCKET_NAME;

module.exports = { storage, bucketName };
