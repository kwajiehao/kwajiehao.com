# kwajiehao.com

# Initial Ideas

I've wanted to create a personal blog for ages. But the Procrastination Monster has kept me at bay for a while, aided by the strategic landscape of Inertia.

If I am to get anywhere with this, I need to just do something. I've spent too much time thinking of imaginary principles for the blog. Here are some non-futureproof ideas for the blog that 

Random ideas for the blog that are not meant to be futureproof:
1. It should be low maintenance - updating it shouldn't be a pain. To that end, use AI and vibe code as much as possible
2. It should be designed to support displaying photos - performance is a priority
3. The visual design should be minimalist so as not to distract from the content
4. It should be compatible with all screen sizes, but designed for personal computers because photos look better on a larger screen
5. Content should be categorized (with tags for e.g.) and easily searchable

# License
[CC-BY-ND-NC](https://creativecommons.org/licenses/by-nc-nd/4.0/deed.en)

# Technical decisions

## 1. Just use React 

I am familiar with React and there is a huge community which helps when I'm trying to do something and not re-invent the wheel - example useful libraries include `react-image-gallery`, `react-spring` for animations, `react-intersection-observer` for lazy loading, and `next/image` for optimization. 

Alternatives considered:
- Static site generators (like Hugo) - more painful to do more dynamic UIs which I might need for displaying photos
- Alternative frameworks like Svelte or Vue.js - my priority is for it to be low maintenance, not to learn a new web framework. This is compounded by the fact that I don't think there really is any practical upside to learning these frameworks. It would just be for intellectual curiosity, which I'd rather apply somewhere else

One interesting option is to use Preact. [Preact](https://preactjs.com/) is essentially a lightweight version of React - it is designed to be a drop-in replacement for React, and has the same APIs for e.g. The key differences between Preact and React are:
- Size: Dramatically smaller bundle - great for performance
- Speed: Faster rendering due to lighter virtual DOM implementation
- Compatibility: Uses `className` and `htmlFor` like React, but also accepts `class` and `for`
- Events: Slightly different event handling (uses browser events directly vs React's SyntheticEvents) 

Given the performance advantages, my simple use case, and the almost identical developer experience, I am going to start with Preact and only migrate to React if I have to (unlikely). In any case, migration would be easy (can be completed in an hour or two). The changes that I would need to make:
- Package.json dependencies (`preact` → `react` + `react-dom`)
- Import statements (`preact/hooks` → `react`)
- Build configuration (remove `preact/compat` aliases)
- Any Preact-specific optimizations used

## 2. Hosting

I don't think this has to be too complicated. There are no viewers for my blog and thus no non-functional requirements in terms of scale. I'm just going to go with Github pages for now since my code is also hosted on Github.

# To-Dos 

1. Think of a color palette for the blog
2. Add automated linting and formatting
3. Decide on routing strategy for React
4. Add .nvmrc and .npmrc
5. Set up www subdomain for Github pages
6. Think about technical design for home library on my personal page