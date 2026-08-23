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
    "README.md": {
      type: "file",
      content: "Welcome to the FileSystem!",
    },
    skills: {
      type: "dir",
      children: {
        "languages.txt": {
          type: "file",
          content: "I am proficient in Typescript, Python, and ASM in the context of static reverse engineering. I also have experience with LuaU.",
        },
      },
    },
    about: {
      type: "dir",
      children: {
        "experience.txt": {
          type: "file",
          content: `I've done professional browser automation and AI systems development work.
          This is my internet persona, so I won't elaborate further :)
          I've also shut down a few malware campaigns`,
        },
        "education.txt": {
          type: "file",
          content: `I've never taken a formal CS course. Everything I know and have learned has been as a product of my own relentless curiosity.`,
        },
      },
    },
    projects: {
      type: "dir",
      children: {
        "Terrific-Image-Format" : {
          type: "dir",
          children: {
            "README.md": {
              type: "file",
              content: "A custom image format I designed and led with a few friends. It supports 256 colors, GZIP text compression, and file sizes comparable to PNG.",
            }
          }
        }
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
  private currentPath: string[] = [];

  constructor() {
    this.currentDir = root;
  }

  private resolve(path: string): { node: FsNode; path: string[] } | null {
    const stack = path.startsWith("/") ? [] : [...this.currentPath];
    const parts = path.split("/").filter((part) => part && part !== ".");

    for (const part of parts) {
      if (part === "..") {
        stack.pop();
        continue;
      }
      stack.push(part);
    }

    let node: FsNode = root;
    for (const part of stack) {
      if (getType(node) !== "dir") return null;
      const next: FsNode | undefined = (node as DirNode).children[part];
      if (!next) return null;
      node = next;
    }
    return { node, path: stack };
  }

  private getNode(path: string): FsNode | null {
    return this.resolve(path)?.node ?? null;
  }

  public isDirValid(path: string): boolean {
    // public so in impl we can check if a directory is valid via cd cmd
    const node = this.getNode(path);
    return node !== null && getType(node) === "dir";
  }

  public cd(path: string): boolean {
    const resolved = this.resolve(path);
    if (!resolved || getType(resolved.node) !== "dir") return false;
    this.currentDir = resolved.node as DirNode;
    this.currentPath = resolved.path;
    return true;
  }

  public fileExists(path: string): boolean {
    const node = this.getNode(path);
    return node !== null && getType(node) === "file";
  }

  public readFile(path: string): string | null {
    const node = this.getNode(path);

    if (!node || getType(node) !== "file") {
      return null;
    }

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
    return this.readFile(path);
  }
}

export const fs = new fileSystem();
