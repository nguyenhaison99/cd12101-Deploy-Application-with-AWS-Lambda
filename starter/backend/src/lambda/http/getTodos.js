import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { getTodosForUser } from '../../businessLogic/todos.mjs';
import { getUserId } from '../utils.mjs';

// Lambda function handler for fetching Todos for a user
export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true,
    })
  )
  .handler(async (event) => {
    try {
      // Retrieve the userId of the requester
      const userId = getUserId(event);
      
      // Call the getTodosForUser function to fetch the user's Todos
      const todos = await getTodosForUser(userId);

      // Log successful Todo retrieval
      console.log('Todos fetched successfully for userId:', userId);

      // Return a successful response with the fetched Todos
      return {
        statusCode: 200,
        body: JSON.stringify({ items: todos }),
      };
    } catch (error) {
      // Log any errors encountered during Todo retrieval
      console.error('Error fetching Todos', { error: error.message });

      // Return an error response
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Unable to fetch Todos',
        }),
      };
    }
  });
