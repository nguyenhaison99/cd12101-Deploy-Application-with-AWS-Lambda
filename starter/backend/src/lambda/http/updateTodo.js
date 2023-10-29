import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { updateTodo } from '../../businessLogic/todos.mjs';
import { getUserId } from '../utils.mjs';

// Lambda function handler for updating a Todo
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
      
      // Parse the request body to get the updated Todo data
      const updatedTodo = JSON.parse(event.body);
      
      // Retrieve the userId of the requester
      const userId = getUserId(event);
      
      // Call the updateTodo function to update the Todo item
      const updateItem = await updateTodo(userId, todoId, updatedTodo);

      // Log successful Todo update
      console.log('Todo updated successfully', { userId, todoId });

      // Return a successful response with status code 204 (No Content)
      return {
        statusCode: 204,
        body: JSON.stringify({
          item: updateItem,
        }),
      };
    } catch (error) {
      // Log any errors encountered during Todo update
      console.error('Error updating Todo', { error: error.message });

      // Return an error response
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Unable to update Todo',
        }),
      };
    }
  });
