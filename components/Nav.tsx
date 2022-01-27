import cx from "classnames";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaEdit, FaWrench } from "react-icons/fa";
import smiley from "../public/smiley-cyrus.jpeg";
import { Avatar } from "./Avatar/Avatar";

export function Nav() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex-1 flex">
            <Link href="/">
              <a className="text-green-400 text-2xl">conduit</a>
            </Link>
          </div>
          <ul className="flex space-x-4">
            <li>
              <Link href="/">
                <a
                  className={
                    router.pathname === "/"
                      ? "text-green-400 underline"
                      : "text-gray-200"
                  }
                >
                  Home
                </a>
              </Link>
            </li>
            {session ? (
              <>
                <li>
                  <Link href="/article/new">
                    <a
                      className={cx(
                        "inline-flex items-center gap-1",
                        router.pathname === "/article/new"
                          ? "text-green-400 underline"
                          : "text-gray-200"
                      )}
                    >
                      <FaEdit />
                      New Article
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/settings">
                    <a
                      className={cx(
                        "inline-flex items-center gap-1",
                        router.pathname === "/settings"
                          ? "text-green-400 underline"
                          : "text-gray-200"
                      )}
                    >
                      <FaWrench />
                      Settings
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href={`/profile/${session.user.username}`}>
                    <a
                      className={cx(
                        "inline-flex items-center gap-1",
                        router.pathname === "/settings"
                          ? "text-green-400 underline"
                          : "text-gray-200"
                      )}
                    >
                      <Avatar
                        username={session.user.username}
                        image={session.user.image}
                        size="medium"
                      />
                      {session.user.username}
                    </a>
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <button
                  className="text-gray-200"
                  onClick={() => signIn("github")}
                >
                  Sign In
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
