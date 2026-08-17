export type FileNode = {
  type: "file";
  content: string;
};

export type DirNode = {
  type: "dir";
  children: Record<string, FsNode>;
};

export type FsNode = FileNode | DirNode;

export const root: DirNode = {
  type: "dir",
  children: {
    "test.txt": {
      type: "file",
      content: "Hello from file system.",
    },
    directory: {
      type: "dir",
      children: {
        "another_file.txt": {
          type: "file",
          content:
            "File 2",
        },
      },
    },
  },
};
