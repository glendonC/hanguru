const { Storage } = require('@google-cloud/storage');

const storage = new Storage({ keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS });
const bucketName = process.env.GCS_BUCKET_NAME;

async function uploadToGoogleCloud(file) {
  await storage.bucket(bucketName).upload(file.path, {
    destination: `uploads/${file.filename}`,
  });
}

module.exports = { uploadToGoogleCloud };
