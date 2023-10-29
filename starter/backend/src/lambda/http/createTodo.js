import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { createTodo } from '../../businessLogic/todos.mjs';
import { getUserId } from '../utils.mjs';

// Lambda function handler for creating a new Todo
export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true,
    })
  )
  .handler(async (event) => {
    try {
      // Parse the request body to get the new Todo data
      const newTodo = JSON.parse(event.body);
      
      // Retrieve the userId of the requester
      const userId = getUserId(event);
      
      // Create the new Todo item using the business logic
      const newItem = await createTodo(newTodo, userId);

      // Log successful Todo creation
      console.log('Todo created successfully', { userId, todoId: newItem.todoId });

      // Return a successful response with the new Todo item
      return {
        statusCode: 201,
        body: JSON.stringify({
          item: newItem,
        }),
      };
    } catch (error) {
      // Log any errors encountered during Todo creation
      console.error('Error creating Todo', { error: error.message });

      // Return an error response
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Unable to create Todo',
        }),
      };
    }
  });
