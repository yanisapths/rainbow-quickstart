import type { NextApiRequest, NextApiResponse } from "next";
import { discordServerId, roleId } from "../../constants";

export default async function grantRole(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { ownerTokenId, user_id, token } = req.body;

  if(!token || !user_id){
    res.status(401).json({ error: "Invalid no token, user_id" });
  }

  if (ownerTokenId != null || ownerTokenId != 0 && token && user_id) {
    // user has arise soul
    const response = await fetch(
      // Discord Developer Docs for this API Request: https://discord.com/developers/docs/resources/guild#add-guild-member-role
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

  //  If the user doesn't have an arise soul, return an error
  else {
    res.status(401).json({ error: "Invalid no token, user_id or user does not have Arise Soul." });
  }
}
