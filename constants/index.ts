// Make a request to the Discord API to get the servers this user is a part of
export const discordServerId = "1151358849807298663";

// The role ID to grant to the user
export const roleId = "1151723298716123257"; // Arise Soul

// contract address
export const ariseSoulAddress = "0x53Dae3475db220900f606bd5FC03F98cf37cc752";

export const client_id = process.env.DISCORD_CLIENT_ID;
export const client_secret = process.env.DISCORD_CLIENT_ID;
export const redirect_uri = "https://poc-verify.vercel.app/api/callback/discord";
export const botToken =  process.env.BOT_TOKEN;
export const scope = "identify"; // Request 'identify' scope to access user ID
export const discordOAuthUrl = `https://discord.com/oauth2/authorize?client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=code&scope=${scope}`;
