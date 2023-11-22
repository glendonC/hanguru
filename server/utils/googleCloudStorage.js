const { Storage } = require('@google-cloud/storage');

const storage = new Storage({ keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS });
const bucketName = process.env.GCS_BUCKET_NAME;

/**
 * Asynchronously uploads a file to Google Cloud Storage.
 *
 * The function takes a file object (typically from a multer upload) and uploads it
 * to the specified Google Cloud Storage bucket (hanguru audio bucket). The uploaded file is stored in a directory
 * named 'uploads' within the bucket
 *
 */
async function uploadToGoogleCloud(file) {
  await storage.bucket(bucketName).upload(file.path, {
    destination: `uploads/${file.filename}`,
  });
}

module.exports = { uploadToGoogleCloud };
