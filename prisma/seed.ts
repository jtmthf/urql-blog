import { PrismaClient, Prisma } from "@prisma/client";
import faker from "faker";
import { random } from "../lib/random";
import { sample, sampleSize } from "../lib/sample";

const prisma = new PrismaClient();

async function main() {
  // Create users
  console.time("create users");
  const users = Array.from(
    { length: 100 },
    (): Prisma.UserCreateInput => ({
      name: `${faker.name.firstName()}  ${faker.name.lastName()}`,
      email: faker.internet.email(),
      username: faker.internet.userName(),
      image: `https://picsum.photos/${random(200, 1000)}`,
      bio: faker.lorem.paragraph(),
    })
  );

  for (const user of users) {
    await prisma.user.create({ data: user });
  }
  console.timeEnd("create users");

  // follow
  console.time("follow users");
  const follows = new Set<string>();

  while (follows.size < 1000) {
    const follower = sample(users);
    const following = sample(users);

    if (
      follower === following ||
      follows.has(`${follower.username}:${following.username}`)
    ) {
      continue;
    }

    await prisma.user.update({
      where: { username: follower.username },
      data: {
        following: {
          connect: {
            username: following.username,
          },
        },
      },
    });

    follows.add(`${follower.username}:${following.username}`);
  }
  console.timeEnd("follow users");

  // create tags
  console.time("create tags");
  const tags = Array.from({ length: 12 }, () =>
    faker.unique(() => faker.music.genre())
  );

  for (const tag of tags) {
    await prisma.tag.create({ data: { name: tag } });
  }

  console.timeEnd("create tags");

  // create articles
  console.time("create articles");
  const articles = Array.from(
    { length: 500 },
    (): Prisma.ArticleCreateInput => ({
      slug: faker.unique(() => faker.lorem.slug()),
      title: faker.lorem.words(),
      description: faker.lorem.sentences(),
      body: faker.lorem.paragraphs(),
      author: {
        connect: {
          username: sample(users).username,
        },
      },
      tags: {
        connect: sampleSize(tags, random(0, 3)).map((tag) => ({ name: tag })),
      },
      favoritedBy: {
        connect: sampleSize(users, random(0, 10)).map((user) => ({
          username: user.username,
        })),
      },
      comments: {
        create: Array.from({ length: random(0, 20) }, () => ({
          body: faker.lorem.sentences(random(1, 3)),
          author: {
            connect: {
              username: sample(users).username,
            },
          },
        })),
      },
    })
  );

  for (const article of articles) {
    await prisma.article.create({ data: article });
  }

  console.timeEnd("create articles");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
