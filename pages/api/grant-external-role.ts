import type { NextApiRequest, NextApiResponse } from "next";
import { discordServerId, externalRoleId } from "../../constants";
import { toast } from "@/components/ui/CustomToast";

export default async function grantExternalRole(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token, user_id } = req.body;
  if (!token || !user_id) {
    res.status(401).json({ error: "Invalid no token, user_id" });
  }
  if (user_id && token) {
    const response = await fetch(
      `https://discordapp.com/api/guilds/${discordServerId}/members/${user_id}/roles/${externalRoleId}`,
      {
        headers: {
          Authorization: `Bot ${process.env.BOT_TOKEN}`,
        },
        method: "PUT",
      }
    );
    if (response.ok) {
      res.status(200).json({ message: "Role granted" });
    } else {
      const resp = await response.json();
      console.error(resp);
      res
        .status(500)
        .json({ error: "Error granting role, are you in the server?" });
      throw new Error();
    }
  } else {
    toast({
      title: "Error",
      message: "Error granting role, are you in the server?",
      type: "error",
    });
    res
      .status(401)
      .json({ error: "Error granting role, are you in the server?" });
  }
}
