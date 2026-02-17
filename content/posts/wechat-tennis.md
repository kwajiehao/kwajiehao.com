---
title: "Vibe coding bottlenecks"
date: 2026-02-17
tags: [vibe-coding, engineering]
description: "In a Post-Opus 4.5 world, the bottlenecks for building have shifted to 1) having a clear understanding of what you want to build, and 2) creating the environment and tools for your agent to build it"
slug: wechat-tennis
hidden: true
---

WIP

## Vibe Coding a WeChat community tennis app

At the start of the month, Nika and I were hanging out with her sister and sister's boyfriend Dave in Dali, Yunnan where they had a house. Dali is a beautiful scenic town where lots of people go to chill and 躺平 to take a break from the Chinese rat race so they generally have lots of time to hang out. 

Dave was big on tennis and a huge extrovert so he had quickly formed a tennis group where he regularly organized community events, tennis games, and kept a leaderboard for their competitions. He did this through manual entry into an Excel spreadsheet and vibe generating matchups and rules . But doing so took him up to an hour or two every other day. 

"Pffft", I said. "It's 2026. We live in a Post-Opus 4.5 world. Let me vibe code this for you in 15 minutes". 

*Spoiler alert: it took way more than 15 minutes*.

## Step 1: Gathering specifications

I got Dave to send me high-level specifications of his current workflow. This was centered around regular events which roughly needed:
- Collating signups via WeChat
- Arranging a series of matches between players that he needed to arrange based on player skill
- Calculating event-based scoring (for e.g. first place for the day gets bonus points) and aggregating them over time

Given that the community was already on WeChat, we agreed that it would make the most sense for this app to take the form of a WeChat mini-app.

## The problems I faced

I quickly ran into two major classes of problems:
1. What Dave wanted as different from what he said
2. Breaks in the LLM loop which required human input - couldn't do things (tools) and couldn't verify its work


Starting with only mixed doubles games, we expanded to include mens doubles, womens doubles, and mixed singles, with a UTR. I won't talk too much about this, because as anyone who has built product knows, this exchange between product team and stakeholder is extremely commonplace. You can try to anticipate edge cases (for e.g. I included manual score editing, manual matchup generation, etc.) but you expect this to happen. This has nothing to do with the capabilities of AI and everything to do with the fundamental fact that it's too difficult to know everytning in advance and that a design thinking, iterative approach works best (see the design of design by Fred brooks)

The two bottlenecks
- Understanding everything you want or need
- Getting the relevant data to your LLM


References
- https://simonwillison.net/2026/Feb/15/deep-blue/ 
- https://openai.com/index/harness-engineering/ 
- https://www.georgefairbanks.com/ieee-software-v36-n1-jan-2019-intellectual-control

A lot of complexity lies in inconsistent, unspoken assumptions in manual workflows

It's difficult to keep exactly what you want to build entirely in your head! it's hard to organize that information because there are different hierarchies.

having 9 players
having up to 20 players

This is not new - when you do things manually, you can make things up as you go along - you don't need to be consistent. But when things get programmatic, inconsistencies in rules become more apparent and require manual introduction. 

For mainstream use, how can we build models or agents that help people to

Build with 

In an earlier era (aka 2024), 

Tuning between what you want and 

Enabling models to fix things themselves, providing them all the things they need


Out-of-band - getting a Cloudbase account to provision database, approvals for Wechat apps