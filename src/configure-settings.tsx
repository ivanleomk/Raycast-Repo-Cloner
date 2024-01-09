import { Form, ActionPanel, Action, showToast, Toast, LocalStorage } from "@raycast/api";
import { useEffect, useState } from "react";

type Values = {
  editor: "code" | "cursor";
  parent_folder: string[];
};

export default function Command() {
  const [editor, setEditor] = useState("cursor");
  const [parentFolder, setParentFolder] = useState<string[]>([]);
  function handleSubmit(values: Values) {
    console.log(editor, parentFolder);
    if (values.parent_folder.length == 0) {
      showToast({
        style: Toast.Style.Failure,
        title: "Please indicate a parent directory to save repositories inside",
      });
      return;
    }

    Promise.all([
      LocalStorage.setItem("editor", values.editor),
      LocalStorage.setItem("parent_folder", values.parent_folder[0]),
    ]).then(() => {
      showToast({
        style: Toast.Style.Success,
        title: "Values updated succesfully",
      });
    });
  }

  useEffect(() => {
    LocalStorage.getItem("editor").then((res) => setEditor(res as string));
    LocalStorage.getItem("parent_folder").then((res) => setParentFolder([res as string]));
  }, []);

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Description text="Configure some default settings" />

      <Form.Dropdown id="editor" title="Default Editor" value={editor} onChange={setEditor}>
        <Form.Dropdown.Item value="cursor" title="Cursor" />
        <Form.Dropdown.Item value="code" title="VSCode" />
      </Form.Dropdown>

      <Form.FilePicker
        id="parent_folder"
        title="Parent Directory"
        allowMultipleSelection={false}
        canChooseDirectories
        canChooseFiles={false}
        value={parentFolder}
        onChange={setParentFolder}
      />
    </Form>
  );
}
