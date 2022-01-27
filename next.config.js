const { execSync } = require("child_process");

/**
 * @param {string} command
 */
function exec(command) {
  return execSync(command).toString().trim();
}

/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["picsum.photos", "avatars.githubusercontent.com"],
  },
  env: {
    COMMIT_HASH: exec("git rev-parse HEAD"),
    COMMIT_AUTHOR: exec("git log -1 --pretty=format:'%an'"),
  },
};
