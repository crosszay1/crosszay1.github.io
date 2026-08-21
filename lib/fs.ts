export type FileNode = {
  type: "file";
  content: string;
};

export type DirNode = {
  type: "dir";
  children: Record<string, FsNode>;
};

export type FsNode = FileNode | DirNode;

const root: DirNode = {
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
          content: "File 2",
        },
      },
    },
  },
};

function getType(node: FsNode): string {
  return node.type;
}

function fileKind(name: string): string {
  const i = name.lastIndexOf(".");
  return i === -1 ? "file" : name.slice(i + 1);
}

export class fileSystem {
  public currentDir: DirNode;
  constructor() {
    this.currentDir = root;
  }

  private getNode(path: string): FsNode | null {
    let node: FsNode = path.startsWith("/") ? root : this.currentDir;
    const parts = path.split("/").filter((part) => part && part !== ".");
    for (const part of parts) {
      if (getType(node) !== "dir") return null;
      const next: FsNode | undefined = (node as DirNode).children[part];
      if (!next) return null;
      node = next;
    }
    return node;
  }

  public isDirValid(path: string): boolean {
    // public so in impl we can check if a directory is valid via cd cmd
    const node = this.getNode(path);
    return node !== null && getType(node) === "dir";
  }

  public cd(path: string): boolean {
    if (!this.isDirValid(path)) return false;
    this.currentDir = this.getNode(path) as DirNode;
    return true;
  }

  public readFile(path: string): string | null {
    const node = this.getNode(path);

    if (!node || getType(node) !== "file") {
      // This is super lazy | we need to have multiple file types, not just "file"
      // More concerned with finsihing this so I can get impl running
      // then I'll deal with it
      return null;
    }

    const name = path.split("/").filter(Boolean).pop() ?? "";
    if (fileKind(name) !== "txt") return null;
    return (node as FileNode).content;
  }

  public listDirectory(path: string): Record<string, { type: string }> | null {
    if (!this.isDirValid(path)) {
      // if not a directory just return null.
      return null;
    }

    const dir = this.getNode(path) as DirNode;

    const listing: Record<string, { type: string }> = {}; // Create the object we'll stick the stuff into

    for (const [name, child] of Object.entries(dir.children)) {
      listing[name] = {
        type: getType(child) === "dir" ? "dir" : fileKind(name),
      };
    }
    return listing;
  }

  public openFile(path: string): string | null {
    // We'll just use this as a universal function to open files because having so maZX ny is tedious. We'll still have a `cat` command tho for reading
    // Some ideas just to write them down for things to open: music files, images, maybe even videos?
    return "placeholder";
  }
}

export const fs = new fileSystem();
