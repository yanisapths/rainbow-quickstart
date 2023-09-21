import type { NextApiRequest, NextApiResponse } from "next";
import { discordServerId, roleId } from "../../constants";

export default async function grantRole(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user_id } = req.body;

  if (user_id) {
    // user has arise soul
    const response = await fetch(
      `https://discordapp.com/api/guilds/${discordServerId}/members/${user_id}/roles/${roleId}`,
      {
        headers: {
          // Use the bot token to grant the role
          Authorization: `Bot ${process.env.BOT_TOKEN}`,
        },
        method: "PUT",
      }
    );

    // If the role was granted, return the content
    if (response.ok) {
      res.status(200).json({ message: "Role granted" });
    }

    // Something went wrong granting the role, but they do have an NFT
    else {
      const resp = await response.json();
      console.error(resp);
      res
        .status(500)
        .json({ error: "Error granting role, are you in the server?" });
      throw new Error();
    } 
  }
  else {
    res.status(401).json({ error: "Error granting role, are you in the server?" });
  }
}
