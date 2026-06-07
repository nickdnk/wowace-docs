---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
title: "Ace3: World of Warcraft Addon Framework Documentation"
titleTemplate: false
description: "Ace3 is a modular World of Warcraft addon framework: embed only the libraries you need for addon structure, saved variables, configuration, events and UI"

hero:
  name: "Ace3"
  text: "World of Warcraft Addon Framework"
  tagline: A modular suite of libraries for building World of Warcraft addons. Pick the components you need.
  actions:
    - theme: brand
      text: Getting Started
      link: /getting-started

features:
  - title: Addon Structure
    details: "Give your addon a clean startup and shutdown flow, split it into modules, and add slash commands and chat output, so you can focus on features instead of boilerplate."
    link: /api/ace-addon
  - title: Events & Timers
    details: "React to what happens in the game, run code after a delay or on a repeat, and safely change existing game behavior without breaking other addons."
    link: /api/ace-event
  - title: Persisting Data
    details: "Remember settings and data between sessions, with per-character or account-wide profiles your users can switch, copy and reset."
    link: /api/ace-db
  - title: Configuration
    details: "Describe your settings once and get a full options panel and matching slash commands automatically, with no hand-built UI required."
    link: /api/ace-config
  - title: Communication & Data
    details: "Talk to other copies of your addon across the group or guild, pack data into strings to send or store, and translate your interface into other languages."
    link: /api/ace-comm
  - title: Design & Presentation
    details: "Build custom windows and controls (buttons, sliders, trees, tabs and more) that recycle frames behind the scenes to keep your UI light."
    link: /acegui/
---
