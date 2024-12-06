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















const subBtnCont = document.getElementById("subBtnCont")


function createSubredditButtons() {
    data.subreddits.forEach(subreddit => {
        const subBtn = document.createElement("button");
        subBtn.textContent = subreddit.name;
        subBtn.classList.add("subBtn");

        subBtn.addEventListener("click", () => {
            const user = data.users[0]; 

           
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






subreddits.forEach(subreddit => {

    subreddit.posts.forEach(post => {
        const postElement = document.createElement("div");
        const postTitle = document.createElement("h4");
        const postContent = document.createElement("p");


        postElement.classList.add("post")
        postElement.id = "postID"
        postElement.innerHTML += `<h4>${post.title} <span class="badge badge-secondary badge">${subreddit.name}</span></h4>`

        postContent.innerHTML += `<h4>${post.content} <span class="badge badge-secondary upVoteSpan"><button class="upVoteBtn" id="upVoteBtn" onClick="handleUpVote(${post.id})"> ^ </button></span></h4>`

        postElement.appendChild(postTitle);
        postElement.appendChild(postContent);
        subredditPosts.appendChild(postElement);




    })




})

function handleUpVote(postId) {

    const currentUser = data.users[0]; 


    const subreddit = data.subreddits.find(sub => 
        sub.posts.some(post => post.id === postId)
    );

    if (!subreddit) {
        alert("Subreddit not found");
        return;
    }


    const post = subreddit.posts.find(post => post.id === postId);


    if (currentUser.upVotePostIds && currentUser.upVotePostIds.includes(postId)) {
       alert("You have already upvoted this post.");
        return;
    }


    currentUser.upVote += 1; 


    if (!currentUser.upVotePostIds) {
        currentUser.upVotePostIds = [];
    }
    currentUser.upVotePostIds.push(postId); 


    alert(`You have successfully upvoted the post: "${post.title}". Total upvotes: ${currentUser.upVote}`);





    saveDataToLocalStorage();

    DisplayTotalVotes();
    displayPostNames();
}










    function displayComments() {
        data.subreddits.forEach(subreddit => {
            subreddit.posts.forEach(post => {

                const commentsContainer = document.getElementById('postID');
                commentsContainer.classList.add('comments'); 
    

                post.comments.forEach(comment => {
                    const commentContent = document.createElement("p");
                    commentContent.classList.add('comment');
                    commentContent.textContent = comment; 
    
                    commentsContainer.appendChild(commentContent); 
                });

                subredditPosts.appendChild(commentsContainer)
    
              
                const commentPost = document.createElement("input");
                const commentBtn = document.createElement("button");
    
                commentBtn.textContent = "Submit";
                commentBtn.classList.add("commentBtn");
                commentBtn.id = "commentBTN";
    
                commentPost.type = "text";
                commentPost.classList.add("commentInput");
                commentPost.placeholder = "Add a comment...";
                commentPost.id = 'commentInput';
    

                commentsContainer.appendChild(commentPost);
                commentsContainer.appendChild(commentBtn);
    

                commentBtn.addEventListener("click", () => {
                    const input = commentPost.value;
    

                    post.comments.push(input);
                    

                    saveDataToLocalStorage();
    

                    const newCommentContent = document.createElement("p");
                    newCommentContent.classList.add('comment');
                    newCommentContent.textContent = input; 
    

                    commentsContainer.insertBefore(newCommentContent, commentPost);
    

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
    const currentUser = data.users[0]; 


    if (!currentUser.upVotePostIds || currentUser.upVotePostIds.length === 0) {
        upVotesPostName.textContent = "You have not upvoted any posts.";
        return;
    }


    const upvotedPostTitles = currentUser.upVotePostIds.map(postId => {
        // Find the post in all subreddits
        const post = data.subreddits.flatMap(sub => sub.posts).find(post => post.id === postId);
        return post ? post.title : null;
    }).filter(title => title !== null); 


    upVotesPostName.textContent = `Upvoted posts: ${upvotedPostTitles.join(", ")}`;
}

function DisplayTotalVotes(){
    const totalVotes = data.users[0].upVote

    totalUpVotes.textContent = `Total upvotes: ${totalVotes}`
}


function saveDataToLocalStorage() {
    localStorage.setItem('data', JSON.stringify(data));
}







let selectedSubreddit = null;


function selectSubreddit(subredditName) {
    selectedSubreddit = subredditName;
    const accountNameBtn = document.getElementById("subredditSelect");
    accountNameBtn.textContent = subredditName; // Update button text to show selected subreddit
}


document.getElementById("addPostButton").addEventListener("click", () => {
    const title = document.getElementById("inputTitle").value.trim();
    const content = document.getElementById("inputContent").value.trim();


    if (!title || !content || !selectedSubreddit) {
        alert("Please fill in all fields and select a subreddit.");
        return;
    }


    const subreddit = data.subreddits.find(sub => sub.name === selectedSubreddit);
    if (!subreddit) {
        alert("Subreddit not found.");
        return;
    }


    const allPostIds = data.subreddits.flatMap(sub => sub.posts.map(post => post.id));
    const newPostId = allPostIds.length > 0 ? Math.max(...allPostIds) + 1 : 1;


    const newPost = {
        id: newPostId,
        title: title,
        content: content,
        comments: []
    };


    subreddit.posts.unshift(newPost); 


    saveDataToLocalStorage();


    document.getElementById("inputTitle").value = '';
    document.getElementById("inputContent").value = '';
    selectedSubreddit = null; 


    alert("Post added successfully!");
    $('#addPostModal').modal('hide'); 


    displayPostsForSelectedSubreddit();
});


function displayPostsForSelectedSubreddit() {
    const subreddit = data.subreddits.find(sub => sub.name === selectedSubreddit);
    const subredditPosts = document.getElementById("subredditPosts");
    subredditPosts.innerHTML = ''; 

    if (subreddit) {

        subreddit.posts.forEach(post => {
            displayPost(post);
        });
    }
}


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
    subredditPosts.prepend(postElement); 
}


function saveDataToLocalStorage() {
    localStorage.setItem('data', JSON.stringify(data));
}


function initializeApp() {
    const storedData = localStorage.getItem('data');
    if (storedData) {
        data = JSON.parse(storedData);
    }


    updateSubredditDropdown();
}


function updateSubredditDropdown() {
    const subredditDropdown = document.getElementById("subredditDropdown");
    subredditDropdown.innerHTML = ''; 

    data.subreddits.forEach(sub => {
        const option = document.createElement("button");
        option.className = "dropdown-item";
        option.textContent = sub.name;
        option.addEventListener("click", () => selectSubreddit(sub.name));
        subredditDropdown.appendChild(option);
    });
}


initializeApp();