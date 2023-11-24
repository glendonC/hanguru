const { Storage } = require('@google-cloud/storage');

const storage = new Storage({ keyFilename: process.env.GCS_SERVICE_ACCOUNT });
const bucketName = process.env.GCS_BUCKET_NAME;

/**
 * Asynchronously uploads a file to Google Cloud Storage and makes it publicly accessible
 *
 * This function takes a file object (typically from a multer upload) and uploads it to the specified 
 * Google Cloud Storage bucket. The uploaded file is stored in a directory named 'uploads' within the bucket
 * After uploading, the file is made publicly accessible, and its public URL is returned
 *
 * @param {Object} file - The file object to upload
 * @returns {string} The public URL of the uploaded file
 */
async function uploadToGoogleCloud(file) {
  const destination = `uploads/${file.filename}`;

  await storage.bucket(bucketName).upload(file.path, { destination });

  await storage.bucket(bucketName).file(destination).makePublic();

  const publicUrl = `https://storage.googleapis.com/${bucketName}/${destination}`;

  return publicUrl;
}

module.exports = { uploadToGoogleCloud };
