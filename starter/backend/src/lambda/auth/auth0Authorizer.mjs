import Axios from 'axios';
import jsonwebtoken from 'jsonwebtoken';
import { createLogger } from '../../utils/logger.mjs';

// Create a logger with a relevant module name
const logger = createLogger('auth');

// URL to retrieve JSON Web Key Set (JWKS) from Auth0
const jwksUrl = 'https://dev-1wof2df0.us.auth0.com/.well-known/jwks.json';

// Lambda function handler for authentication
export async function handler(event) {
  try {
    // Verify the JWT token from the authorization header
    const jwtToken = await verifyToken(event.authorizationToken);

    // Return a policy document allowing access for authorized users
    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
    };
  } catch (e) {
    // Handle unauthorized access and log the error
    logger.error('User not authorized', { error: e.message });

    // Return a policy document denying access for unauthorized users
    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*',
          },
        ],
      },
    };
  }
}

// Function to verify a JWT token
async function verifyToken(authHeader) {
  try {
    // Extract the token from the authorization header
    const token = getToken(authHeader);

    // Decode the token to retrieve its header
    const jwt = jsonwebtoken.decode(token, { complete: true });

    // Retrieve the JSON Web Key Set (JWKS) from Auth0
    const res = await Axios.get(jwksUrl);
    const keys = res.data.keys;
    const signingKey = keys.find(key => key.kid === jwt.header.kid);

    // Check if the signing key exists
    if (!signingKey) throw new Error('Incorrect Keys');

    // Extract the public key from the signing key
    const keyPem = signingKey.x5c[0];
    const publicKey = `-----BEGIN CERTIFICATE-----\n${keyPem}\n-----END CERTIFICATE-----\n`;

    // Verify the token using the public key and RS256 algorithm
    const verifiedToken = jsonwebtoken.verify(token, publicKey, { algorithms: ['RS256'] });

    // Log the successful token verification
    logger.info('Verify token', verifiedToken);

    return verifiedToken;
  } catch (error) {
    // Log any errors encountered during token verification
    logger.error('Error verifying token', { error: error.message });
    throw error;
  }
}

// Function to extract the token from the authorization header
function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header');

  if (!authHeader.toLowerCase().startsWith('bearer ')) throw new Error('Invalid authentication header');

  const split = authHeader.split(' ');
  const token = split[1];

  return token;
}
