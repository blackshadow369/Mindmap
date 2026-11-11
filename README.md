# Mindmap

A personal learning map. Topics appear as bubbles; click one to see what to learn and mark it done. Progress is saved in your browser.

## Structure

```
learning-map/
├── index.html      # page shell: sidebar + map canvas + detail panel
├── style.css       # bubble layout, colors, animations
├── app.js          # reads the data, draws bubbles, handles clicks and progress
├── data/
│   ├── index.js    # registers all topics, in display order
│   └── topics/
│       ├── ai.js
│       └── robotics.js
├── README.md
└── .gitignore
```

## Running it

Open `index.html` in a browser. No build step or server needed.

## Adding a topic

1. Create `data/topics/<name>.js` with a constant like this:

   ```js
   const TOPIC_NAME = {
     id: "unique-id",          // don't change once you've started tracking it
     title: "Topic name",
     summary: "One-line description",
     points: ["Thing to learn", "Another thing"],
     links: [{ label: "Docs", url: "https://example.com" }],
   };
   ```

2. Add a `<script src="data/topics/<name>.js"></script>` tag to `index.html`, before `data/index.js`.
3. Add `TOPIC_NAME` to the `TOPICS` list in `data/index.js`. The list order is the display order.

Progress is keyed by `id`, so keep ids stable.
