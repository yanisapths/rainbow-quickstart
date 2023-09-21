import RegisterForm from "@/components/register-form";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { FC } from "react";

const Home = ({}) => {
  const router = useRouter();
  const user_id = router.query.user_id;

  return (
    <div>
      <Head>
        <title>Verify App</title>
        <meta
          content="Verify your NFT to access secret room on poc server"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className="h-screen text-white">
        <div className="py-3 flex flex-col justify-center text-center items-center pt-20">
          <h1 className="text-4xl pb-2">Get to know you</h1>
          <p className="text-lg w-full">
             Tell us about youerself to join POC Discord server
          </p>
        </div>
        <div className="flex justify-center text-center items-center">
         <RegisterForm userId={user_id?.toString()} />
        </div>
      </main>
    </div>
  );
};

export default Home;
