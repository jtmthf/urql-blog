import * as Tabs from "@radix-ui/react-tabs";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import { useQuery } from "urql";
import { ArticleFeed } from "../../components/ArticleFeed/ArticleFeed";
import { Banner } from "../../components/Banner/Banner";
import Layout from "../../components/Layout";
import { Main } from "../../components/Main/Main";
import { Tag } from "../../components/Tag/Tag";
import styles from "./home.module.css";
import { TagsDocument } from "./tags.query.generated";

export default function Home() {
  const { query } = useRouter();

  const [{ data: tagData }] = useQuery({
    query: TagsDocument,
    variables: { first: 10 },
  });

  const [tabValue, setTabValue] = useState(() =>
    query.tag ? `#${query.tag}` : "global"
  );

  useEffect(() => {
    if (query.tag) {
      setTabValue(`#${query.tag}`);
    }
  }, [query.tag]);

  return (
    <>
      <Banner />
      <Main className={styles.main}>
        <div className="col-span-3">
          <Tabs.Root
            value={tabValue}
            onValueChange={(value) => setTabValue(value)}
          >
            <Tabs.List>
              <Tabs.Trigger value="global" className={styles.tab}>
                Global Feed
              </Tabs.Trigger>
              {query.tag && (
                <Tabs.Trigger value={`#${query.tag}`} className={styles.tab}>
                  # {query.tag}
                </Tabs.Trigger>
              )}
            </Tabs.List>
            <Tabs.Content value="global">
              <ArticleFeed />
            </Tabs.Content>
            {typeof query.tag === "string" && (
              <Tabs.Content value={`#${query.tag}`}>
                <ArticleFeed tag={query.tag} />
              </Tabs.Content>
            )}
          </Tabs.Root>
        </div>
        <div>
          <aside className="bg-gray-100 p-2 rounded">
            <h3 className="font-semibold mb-2">Popular Tags</h3>
            <ul className="flex flex-wrap gap-1">
              {tagData?.tags.edges.map((tag) => (
                <li key={tag.node.id}>
                  <Tag {...tag.node} />
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Main>
    </>
  );
}

Home.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};
