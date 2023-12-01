const { Storage } = require('@google-cloud/storage');

let serviceAccount = null;

if (process.env.GCS_SERVICE_ACCOUNT) {
  const serviceAccountEncoded = process.env.GCS_SERVICE_ACCOUNT;
  const serviceAccountDecoded = Buffer.from(serviceAccountEncoded, 'base64').toString('utf-8');
  serviceAccount = JSON.parse(serviceAccountDecoded);
}

const storage = new Storage({
  credentials: serviceAccount,
});

const bucketName = process.env.GCS_BUCKET_NAME;

module.exports = { storage, bucketName };
