export const commands: Record<string, () => string> = {
  help: () => "Commands: help, src",

  src: () => {
    window.open("https://github.com/crosszay1/crosszay1.github.io", "_blank");
    return "Opening GitHub...";
  },
};