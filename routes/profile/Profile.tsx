import * as Tabs from "@radix-ui/react-tabs";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { ReactElement } from "react";
import { ArticleFeed } from "../../components/ArticleFeed/ArticleFeed";
import Layout from "../../components/Layout";
import { Main } from "../../components/Main/Main";
import styles from "./profile.module.css";
import smiley from "../../public/smiley-cyrus.jpeg";

export function Profile() {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center min-w-full bg-gray-200 mb-8 py-8">
        <div className="h-[100px] mb-4">
          <Image
            src={session.user.image ?? smiley}
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>
        <span className="text-2xl font-bold">{session.user.username}</span>
      </div>
      <Main className="max-w-4xl">
        <Tabs.Root defaultValue="mine">
          <Tabs.List>
            <Tabs.Trigger value="mine" className={styles.tab}>
              My Articles
            </Tabs.Trigger>
            <Tabs.Trigger value="favorited" className={styles.tab}>
              Favorited Articles
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="mine">
            <ArticleFeed author={session.user.username} />
          </Tabs.Content>
          <Tabs.Content value="favorited">
            <ArticleFeed favoritedBy={session.user.username} />
          </Tabs.Content>
        </Tabs.Root>
      </Main>
    </>
  );
}

Profile.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};
