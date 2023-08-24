import { signIn, signOut, useSession } from "next-auth/react";

export default function GoogleLogin() {
  const { data: session } = useSession();

  return (
    <>
      <div className="flex mt-12">
        <div className="w-60">
          {session && (
            <>
              <p>Signed in as {session?.user?.email} </p>

              <br />
              <button onClick={() => signOut()}>Sign out</button>
            </>
          )}
          {!session && (
            <>
              <p> Not signed in </p>
              <br />
              <button onClick={() => signIn()}>Sign in</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
