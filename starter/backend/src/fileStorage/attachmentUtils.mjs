// Import necessary dependencies
const s3_bucket_name = process.env.ATTACHMENT_S3_BUCKET;

// Class for handling S3 attachments
export class AttachmentUtils {
    constructor(bucket_name = s3_bucket_name) {
        this.bucket_name = bucket_name;
    }

    // Get a pre-signed URL for the specified todoId
    async getAttachmentUrl(todoId) {
        try {
            // Construct the S3 URL using the bucket name and todoId
            const s3Url = `https://${this.bucket_name}.s3.amazonaws.com/${todoId}`;
            
            // Log the successful generation of the URL
            console.log(`Generated attachment URL for todoId: ${todoId}`);
            
            return s3Url;
        } catch (error) {
            // Log any errors encountered during URL generation
            console.error(`Error generating attachment URL for todoId: ${todoId}`, error);
            throw error; // Re-throw the error for handling at a higher level
        }
    }
}
