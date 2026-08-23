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
        "professional.txt": {
          type: "file",
          content: "RathHacks, a non-profit I did technical volunteer work for (see the RedC-Linux project for what that looked like in practice).\n\nBOLD: https://www.bold.com",
        },
      },
    },
    projects: {
      type: "dir",
      children: {
        "README.md": {
          type: "file",
          content: `This is a list of a few of my projects, but you should check my github for the most up to date information: https://github.com/crosszay1`
        },
        "Terrific-Image-Format" : {
          type: "dir",
          children: {
            "README.md": {
              type: "file",
              content: "A custom image format I designed and led with a few friends. It supports 4096 colors, GZIP text compression, and file sizes comparable to PNG.",
            },
            "Architecture.md": {
              type: "file",
              content: `The architecture of this project can be summarized as follows:
              1. First we get the dimensions of the image, and append this to beginning of the output file.
              2. We take each pixel, and convert it to an RGB value, we append each to the file.
              3. Finally, we gzip the text. Since it repeats itself many times, the compression is very effective.
              
              We also have a frontend api:
              1. Decompresses the file
              2. Reads the dimensions of the image
              3. Reads each each pixel, and displays it on the screen. When it finishes one horizontal line (It knows the length from the dimensions it previously fetched), it goes to the next line.`,
            }
          }
        },
        "Evolution-Simulation": {
          type: "dir",
          children: {
            "README.md": {
              type: "file",
              content: "My first machine learning project, and the one I hold closest to my heart. Marbles live on a 64x64 grid, each piloted by its own tiny neural network, hunting for food before their hunger runs out. There's no training data and no backprop: when a marble eats, it spawns a mutated copy of itself, so the population's intelligence comes entirely from generations of selection. The good ones pass on their weights, the bad ones starve. See Architecture.md for how the brain and the evolution loop actually work.",
            },
            "Architecture.md": {
              type: "file",
              content: "The core simulation loop, roughly:\n\n1. The world is a 64x64 grid seeded with a fixed pool of food pellets and a small starting population of marbles, or, if marble_weights/ already has saved brains on disk, it resumes from those instead of starting fresh.\n2. Each marble carries its own tiny neural net \"brain\": 10 inputs, a 32-unit hidden layer (ReLU), and 4 outputs (PyTorch). The inputs are the marble's own normalized position, the nearest food's position, the normalized direction to that food, and its distance to each of the four walls. The outputs are move scores for up/down/left/right.\n3. Every tick, a marble feeds its local state through its brain to pick a move. Moves that would walk it off the grid get masked out entirely, and a small hard-coded bonus nudges the raw output toward the food's direction, a heuristic patch layered on top of the learned policy, not something the network itself learned.\n4. Hunger counts down from 250 every tick. Hitting 0 kills the marble, and its lifespan in ticks gets logged to the population's history.\n5. Eating a food pellet refills hunger and, if the population is under its cap of 100, spawns a mutated clone of that marble right next to it: the same brain, with a small amount of Gaussian noise added to every weight. There's no backpropagation anywhere in the loop; all of the \"learning\" comes from this reproduce-on-success, die-on-starvation cycle repeating across generations.\n6. A tunable random-move chance can be dialed up to make marbles occasionally ignore their brain entirely, which helps keep the population from converging too early.\n\nBrains checkpoint to marble_weights/ as individual PyTorch state dicts, so a run can pick up where a previous one left off. It renders live with pygame, and a separate curses-based console (running in its own thread, and happy to exec raw Python if you ask it to) lets you start and stop the sim, tune parameters like mutation strength on the fly, and dump a Plotly graph of lifespan per marble with a running average.\n\nNotes: the roadmap sketches a four-phase training curriculum: an almost-cheating bootstrap phase where the first marble to reach food gets cloned to replace the whole population, then a hunger budget that gets introduced and gradually tightened, building toward a planned final phase where marbles compete head-to-head and only the last one standing gets to reproduce. What's actually running today is the hunger-plus-reproduce-on-eat phase, not that last one.",
            },
          },
        },
        "private-work.txt": {
          type: "file",
          content: "A couple of things I've built that I'll describe but won't be publishing the code for.\n\nSober Reverse Engineering: a toolset and some documentation for injecting shared libraries into Sober (https://sober.vinegarhq.org/), the Linux-native Roblox compatibility layer. No public repo for this one.",
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