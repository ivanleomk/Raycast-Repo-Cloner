import { Clipboard, LocalStorage, showToast } from "@raycast/api";
import { exec } from "child_process";
import simpleGit from "simple-git";

export default async function Command() {
  const url = await Clipboard.readText();
  const git = simpleGit();

  if (!url || !url.match(/^https?:\/\/(www\.)?github\.com/)) {
    await showToast({
      title: "Invalid URL",
      message: `Invalid Url of ${url} supplied.  We only support github for now`,
    });
    return;
  }

  const parent_folder = await LocalStorage.getItem<string>("parent_folder");
  const editor = (await LocalStorage.getItem<string>("editor")) ?? "cursor";
  if (!parent_folder) {
    await showToast({
      title: "Invalid Parent Folder",
      message: `Invalid Parent Folder of ${parent_folder} was supplied`,
    });
    return;
  }

  const repository_name = url.split("/").pop();
  const repo_name = `${parent_folder}/${repository_name}`;
  await git
    .clone(url, repo_name)
    .then(() => console.log("Repository cloned!"))
    .catch((err) => console.error("Failed to clone repository:", err));

  exec(`${editor} ${repo_name}`);
}
