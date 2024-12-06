// data.js
let data = {
    users: [
        { id: 1, name: "Joe", subscribedSubreddits: [],  upVote: 0, upVotePostIds: [] }
    ],
    subreddits: [
        {
            id: 1, name: "Javascript", posts: [
                { id:1, title: "Post 1 about js", content: "Content 1 about JS", comments: ["I love JS!", "JS is everywhere"] },
                { id: 2, title: "Post 2 about js", content: "Content 2 about JS", comments: ["Great language!", "JS is nice"] }
            ]
        },
        {
            id: 2, name: "Node.js", posts: [
                { id:3, title: "Post 1 about Nodejs", content: "Content Node.js JS", comments: ["Node is awesome!", "Node is life"] },
                { id: 4, title: "Post 2 about Node", content: "Content 2 about Node.js", comments: ["I use Node for my backend.", "I use Node for my site"] }
            ]
        }
    ]
};

// Load data from localStorage if it exists
if (localStorage.getItem('data')) {
    data = JSON.parse(localStorage.getItem('data'));
} else {
    localStorage.setItem('data', JSON.stringify(data));
}