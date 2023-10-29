import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { updateAttachmentPresignedUrl } from '../../businessLogic/todos.mjs';
import { getUserId } from '../utils.mjs';

// Lambda function handler for generating an upload URL for Todo attachments
export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true,
    })
  )
  .handler(async (event) => {
    try {
      // Extract the todoId from the path parameters
      const todoId = event.pathParameters.todoId;
      
      // Retrieve the userId of the requester
      const userId = getUserId(event);
      
      // Call the updateAttachmentPresignedUrl function to generate the upload URL
      const url = await updateAttachmentPresignedUrl(userId, todoId);

      // Log successful URL generation
      console.log('Upload URL generated successfully', { userId, todoId });

      // Return a successful response with the generated upload URL
      return {
        statusCode: 201,
        body: JSON.stringify({
          uploadUrl: url,
        }),
      };
    } catch (error) {
      // Log any errors encountered during URL generation
      console.error('Error generating upload URL', { error: error.message });

      // Return an error response
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Unable to generate upload URL',
        }),
      };
    }
  });
