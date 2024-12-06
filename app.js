const { users, subreddits } = data;

const accountNameBtn = document.getElementById("accountName")
const infoData = JSON.parse(localStorage.getItem('data'))


const ProfileTitle = document.getElementById("ProfileTitle")

const totalSub = document.getElementById("totalSub")

const upVotesPostName = document.getElementById("upVotesPostName")

const totalUpVotes = document.getElementById("totalUpVotes")
const user = infoData.users[0].name
accountNameBtn.textContent = user


ProfileTitle.textContent = user + " Information";


addEventListener("load", () => {
    updateSubscribedSubredditsDisplay();
    createSubredditButtons();
    displayComments();
    DisplayTotalVotes()
    displayPostNames();
})





// totalSub.textContent = "Total Subscribed Subreddits: " + users[0].subscribedSubreddits.length;









const subBtnCont = document.getElementById("subBtnCont")


function createSubredditButtons() {
    data.subreddits.forEach(subreddit => {
        const subBtn = document.createElement("button");
        subBtn.textContent = subreddit.name;
        subBtn.classList.add("subBtn");

        subBtn.addEventListener("click", () => {
            const user = data.users[0]; // Access the first user

            // Check if the user is already subscribed
            if (!user.subscribedSubreddits.includes(subreddit.id)) {
                user.subscribedSubreddits.push(subreddit.id);
                console.log(`Subscribed to subreddit ID: ${subreddit.id}`);
                updateSubscribedSubredditsDisplay();
                saveDataToLocalStorage(); // Save updated data to localStorage
                alert(`Subscribe to ${subreddit.name}`)
            } else {
                alert(`Already subscribed to subreddit ID: ${subreddit.name}`);
            }

            console.log(user.subscribedSubreddits);
        });

        subBtnCont.appendChild(subBtn);
    });
}




const subredditTitle = document.getElementById("subredditTitle");
const subredditPosts = document.getElementById("subredditPosts");
const subredditComments = document.getElementById("subredditComments");


// console.log(subreddits[0].posts[0].title);



subreddits.forEach(subreddit => {

    subreddit.posts.forEach(post => {
        const postElement = document.createElement("div");
        const postTitle = document.createElement("h4");
        const postContent = document.createElement("p");


        postElement.classList.add("post")
        postElement.id = "postID"
        postElement.innerHTML += `<h4>${post.title} <span class="badge badge-secondary badge">${subreddit.name}</span></h4>`

        postContent.innerHTML += `<h4>${post.content} <span class="badge badge-secondary upVoteSpan"><button class="upVoteBtn" id="upVoteBtn" onClick="handleUpVote(${post.id})"> ^ </button></span></h4>`

        // postTitle.textContent = post.title ;
        // postContent.textContent = post.content;
        postElement.appendChild(postTitle);
        postElement.appendChild(postContent);
        subredditPosts.appendChild(postElement);




    })




})

function handleUpVote(postId) {
    // Get the current user (assuming the first user for simplicity)
    const currentUser = data.users[0]; // Replace with actual user retrieval logic if needed

    // Find the subreddit containing the post
    const subreddit = data.subreddits.find(sub => 
        sub.posts.some(post => post.id === postId)
    );

    if (!subreddit) {
        alert("Subreddit not found");
        return;
    }

    // Find the specific post
    const post = subreddit.posts.find(post => post.id === postId);

    // Check if the user has already upvoted this post
    if (currentUser.upVotePostIds && currentUser.upVotePostIds.includes(postId)) {
       alert("You have already upvoted this post.");
        return;
    }

    // Increment the user's upvote count
    currentUser.upVote += 1; // Increment the user's upvote count

    // Initialize upVotePostIds if it doesn't exist and add the postId
    if (!currentUser.upVotePostIds) {
        currentUser.upVotePostIds = [];
    }
    currentUser.upVotePostIds.push(postId); // Add the postId to the user's upvoted posts

    // Optionally, you can log the post title or other details
    alert(`You have successfully upvoted the post: "${post.title}". Total upvotes: ${currentUser.upVote}`);




    // Save updated data to localStorage
    saveDataToLocalStorage();

    DisplayTotalVotes();
    displayPostNames();
}








    // data.subreddits.forEach(subreddit => {
    //     subreddit.posts.forEach(post => {

    //         const commentPost = document.getElementById('commentInput');

    //         const commentBtn = document.getElementById('commentBTN')



    //         commentBtn.addEventListener("click", () => {
    //             const input = commentPost.value;
    
    //             post.comments.push(input);
               
    //             saveDataToLocalStorage();
    
    //             alert("Comment added")
    //         })



    //     });


    // });



    function displayComments() {
        data.subreddits.forEach(subreddit => {
            subreddit.posts.forEach(post => {
                // Create a container for the comments of the current post
                const commentsContainer = document.getElementById('postID');
                commentsContainer.classList.add('comments'); // Optional: Add a class for styling
    
                // Display existing comments
                post.comments.forEach(comment => {
                    const commentContent = document.createElement("p");
                    commentContent.classList.add('comment');
                    commentContent.textContent = comment; // Set the text content to the individual comment
    
                    commentsContainer.appendChild(commentContent); // Append the comment content to the comments container
                });

                subredditPosts.appendChild(commentsContainer)
    
                // Create input and button for new comments
                const commentPost = document.createElement("input");
                const commentBtn = document.createElement("button");
    
                commentBtn.textContent = "Submit";
                commentBtn.classList.add("commentBtn");
                commentBtn.id = "commentBTN";
    
                commentPost.type = "text";
                commentPost.classList.add("commentInput");
                commentPost.placeholder = "Add a comment...";
                commentPost.id = 'commentInput';
    
                // Append the input and button to the comments container
                commentsContainer.appendChild(commentPost);
                commentsContainer.appendChild(commentBtn);
    
                // Add event listener for the submit button
                commentBtn.addEventListener("click", () => {
                    const input = commentPost.value;
    
                    // Add the new comment to the post's comments array
                    post.comments.push(input);
                    
                    // Save data to local storage (if needed)
                    saveDataToLocalStorage();
    
                    // Create a new comment element and display it immediately
                    const newCommentContent = document.createElement("p");
                    newCommentContent.classList.add('comment');
                    newCommentContent.textContent = input; // Set the text content to the new comment
    
                    // Insert the new comment above the input field
                    commentsContainer.insertBefore(newCommentContent, commentPost);
    
                    // Clear the input field
                    commentPost.value = '';
    
                    alert("Comment added");
                });
            });
        });
    }

function updateSubscribedSubredditsDisplay() {
    const subscribedNames = data.users[0].subscribedSubreddits.map(id => {
        const subreddit = data.subreddits.find(sub => sub.id === id);
        return subreddit ? subreddit.name : null;
    }).filter(name => name !== null);

    totalSub.textContent = `Subscribed subreddits: ${subscribedNames.join(", ")}`;
}
function displayPostNames() {
    const currentUser = data.users[0]; // Assuming the first user for simplicity

    // Check if the user has upvoted any posts
    if (!currentUser.upVotePostIds || currentUser.upVotePostIds.length === 0) {
        upVotesPostName.textContent = "You have not upvoted any posts.";
        return;
    }

    // Retrieve the titles of the upvoted posts
    const upvotedPostTitles = currentUser.upVotePostIds.map(postId => {
        // Find the post in all subreddits
        const post = data.subreddits.flatMap(sub => sub.posts).find(post => post.id === postId);
        return post ? post.title : null;
    }).filter(title => title !== null); // Filter out any null values

    // Display the titles
    upVotesPostName.textContent = `Upvoted posts: ${upvotedPostTitles.join(", ")}`;
}

function DisplayTotalVotes(){
    const totalVotes = data.users[0].upVote

    totalUpVotes.textContent = `Total upvotes: ${totalVotes}`
}

// Function to save data to localStorage
function saveDataToLocalStorage() {
    localStorage.setItem('data', JSON.stringify(data));
}


//blacbox start trying the code from here



// Function to save data to localStorage
let selectedSubreddit = null;

// Function to select a subreddit from the dropdown
function selectSubreddit(subredditName) {
    selectedSubreddit = subredditName;
    const accountNameBtn = document.getElementById("subredditSelect");
    accountNameBtn.textContent = subredditName; // Update button text to show selected subreddit
}

// Event listener for the "Post" button
document.getElementById("addPostButton").addEventListener("click", () => {
    const title = document.getElementById("inputTitle").value.trim();
    const content = document.getElementById("inputContent").value.trim();

    // Validate input
    if (!title || !content || !selectedSubreddit) {
        alert("Please fill in all fields and select a subreddit.");
        return;
    }

    // Find the selected subreddit
    const subreddit = data.subreddits.find(sub => sub.name === selectedSubreddit);
    if (!subreddit) {
        alert("Subreddit not found.");
        return;
    }

    // Generate a new post ID across all subreddits
    const allPostIds = data.subreddits.flatMap(sub => sub.posts.map(post => post.id));
    const newPostId = allPostIds.length > 0 ? Math.max(...allPostIds) + 1 : 1;

    // Create the new post object
    const newPost = {
        id: newPostId,
        title: title,
        content: content,
        comments: []
    };

    // Add the new post to the subreddit
    subreddit.posts.unshift(newPost); // Add to the start of the array

    // Save the updated data to localStorage
    saveDataToLocalStorage();

    // Clear the input fields
    document.getElementById("inputTitle").value = '';
    document.getElementById("inputContent").value = '';
    selectedSubreddit = null; // Reset selected subreddit

    // Optionally, you can refresh the posts display or close the modal
    alert("Post added successfully!");
    $('#addPostModal').modal('hide'); // Close the modal

    // Refresh the posts display for the selected subreddit
    displayPostsForSelectedSubreddit();
});

// Function to display posts for the selected subreddit
function displayPostsForSelectedSubreddit() {
    const subreddit = data.subreddits.find(sub => sub.name === selectedSubreddit);
    const subredditPosts = document.getElementById("subredditPosts");
    subredditPosts.innerHTML = ''; // Clear previous posts

    if (subreddit) {
        // Display each post, with the newest ones first
        subreddit.posts.forEach(post => {
            displayPost(post);
        });
    }
}

// Function to display a single post
function displayPost(post) {
    const subredditPosts = document.getElementById("subredditPosts");
    const postElement = document.createElement("div");
    postElement.classList.add("post");
    postElement.innerHTML = `
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">${post.title}</h5>
                <p class="card-text">${post.content}</p>
            </div>
        </div>`;
    subredditPosts.prepend(postElement); // Add the post at the top of the list
}

// Function to save data to localStorage
function saveDataToLocalStorage() {
    localStorage.setItem('data', JSON.stringify(data));
}

// Initialize the app (load data from localStorage if available)
function initializeApp() {
    const storedData = localStorage.getItem('data');
    if (storedData) {
        data = JSON.parse(storedData);
    }

    // Optionally, refresh the UI (e.g., subreddit dropdown, posts)
    updateSubredditDropdown();
}

// Function to update the subreddit dropdown
function updateSubredditDropdown() {
    const subredditDropdown = document.getElementById("subredditDropdown");
    subredditDropdown.innerHTML = ''; // Clear previous options

    data.subreddits.forEach(sub => {
        const option = document.createElement("button");
        option.className = "dropdown-item";
        option.textContent = sub.name;
        option.addEventListener("click", () => selectSubreddit(sub.name));
        subredditDropdown.appendChild(option);
    });
}

// Initial setup
initializeApp();