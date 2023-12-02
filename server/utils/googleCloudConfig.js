const { Storage } = require('@google-cloud/storage');

let serviceAccount = null;

const fs = require('fs');


if (process.env.GCS_SERVICE_ACCOUNT) {
  console.log('Service Account File Path:', process.env.GCS_SERVICE_ACCOUNT);
  
  try {
    const serviceAccountFile = fs.readFileSync(process.env.GCS_SERVICE_ACCOUNT, 'utf8');
    serviceAccount = JSON.parse(serviceAccountFile);
  } catch (error) {
    console.error('Error reading or parsing service account file:', error);
  }
}

const storage = new Storage({
  credentials: serviceAccount,
});

const bucketName = process.env.GCS_BUCKET_NAME;

module.exports = { storage, bucketName };


