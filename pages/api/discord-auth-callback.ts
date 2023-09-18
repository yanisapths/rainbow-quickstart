import { client_id, client_secret, redirect_uri, scope } from '@/constants';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function discordAuthCallback (req: NextApiRequest, res: NextApiResponse) {
  const code = req.query.code as string;

  try {
    // Exchange the authorization code for an access token and user data.
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', {
      client_id,
      client_secret,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri,
      scope,
    });

    const accessToken = tokenResponse.data.access_token;

    // Use the access token to fetch user data, including the user ID.
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userId = userResponse.data.id;

    // Now you have the user's Discord user ID (userId) to use as needed.
    res.status(200).json({ userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching user data.' });
  }
};
