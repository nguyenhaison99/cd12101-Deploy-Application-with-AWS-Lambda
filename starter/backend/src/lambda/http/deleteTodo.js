import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { deleteTodo } from '../../businessLogic/todos.mjs';
import { getUserId } from '../utils.mjs';

// Lambda function handler for deleting a Todo by ID
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
      
      // Call the deleteTodo function to delete the Todo item
      await deleteTodo(userId, todoId);

      // Log successful Todo deletion
      console.log('Todo deleted successfully', { userId, todoId });

      // Return a successful response with status code 204 (No Content)
      return {
        statusCode: 204,
        body: '',
      };
    } catch (error) {
      // Log any errors encountered during Todo deletion
      console.error('Error deleting Todo', { error: error.message });

      // Return an error response
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Unable to delete Todo',
        }),
      };
    }
  });
