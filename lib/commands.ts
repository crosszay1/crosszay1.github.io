export const commands: Record<string, (args?: string[]) => string> = {
  help: () => "Commands: help, src",

  src: () => {
    window.open("https://github.com/crosszay1/crosszay1.github.io", "_blank");
    return "Opening GitHub...";
  },

  neofetch: () => {
    return [
      "",
      "                                               \x1b[90m┌──────────────────────Hardware──────────────────────┐",
      "                                                PC: 82QD (IdeaPad 1 15IAU7)",
      "                                               │ ├: 12th Gen Intel(R) Core(TM) i3-1215U (4+4) @ 4.40 GHz",
      "                                               │ ├󰍛: Intel UHD Graphics @ 1.10 GHz [Integrated]",
      "                        ./o.                   │ ├󰍛: 6.60 GiB / 15.34 GiB (43%)",
      "                      ./sssso-                 └ └: 215.60 GiB / 231.70 GiB (93%) - ext4",
      "                    `:osssssss+-               \x1b[90m└────────────────────────────────────────────────────┘",
      "                  `:+sssssssssso/.",
      "                `-/ossssssssssssso/.           \x1b[90m┌──────────────────────Software──────────────────────┐",
      "              `-/+sssssssssssssssso+:`          OS: EndeavourOS x86_64",
      "            `-:/+sssssssssssssssssso+/.        │ ├: Linux 7.1.4-1-cachyos",
      "          `.://osssssssssssssssssssso++-       │ ├: JKCN44WW (1.44)",
      "         .://+ssssssssssssssssssssssso++:      │ ├󰏖: 45 (brew), 17 (flatpak), 1869 (pacman)",
      "       .:///ossssssssssssssssssssssssso++:     └ └: fish 4.8.1",
      "     `:////ssssssssssssssssssssssssssso+++.",
      "   `-////+ssssssssssssssssssssssssssso++++-    │ ├: gdm-password 50.1 (Wayland)",
      "    `..-+oosssssssssssssssssssssssso+++++/`    │ ├: Hyprland 0.56.0 (Wayland)",
      "      ./++++++++++++++++++++++++++++++/:.      └ └: kitty 0.48.0",
      "     `:::::::::::::::::::::::::------``        \x1b[90m└────────────────────────────────────────────────────┘",
      "",
      "                                               \x1b[90m┌────────────────────Uptime / Age / DT────────────────────┐",
      "                                                 OS Age : 304 days",
      "                                                 Uptime : 1 hour, 13 mins",
      "                                                 DateTime : 2026-07-31 17:35:52",
      "                                               \x1b[90m└─────────────────────────────────────────────────────────┘",
      "                                                 ● ● ● ● ● ● ● ●",
      "",
    ].join("\n");
  },

  contact: () => "@crosszay on discord",

  whoami: () => "I'm crosszay, a self-taught programmer, fullstack developer, and FOSS enthusiast.",

  echo: (args = []) => args.join(" "),
};