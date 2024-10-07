// Sample user data
let users = [];
let currentUser = null;

// Sample existing users with posts
const existingUsers = [
  {
    username: "Harini",
    followers: [],
    following: [],
    posts: [
      {
        content: "Hello!",
        timestamp: "2024-10-01 10:00 AM",
        likes: 3,
        comments: [],
      },
      {
        content: "Nice Weather!",
        timestamp: "2024-10-02 11:30 AM",
        likes: 2,
        comments: [],
      },
    ],
  },
  {
    username: "Abi",
    followers: [],
    following: [],
    posts: [
      {
        content: "Hey there, I'm Abi!",
        timestamp: "2024-10-03 12:15 PM",
        likes: 1,
        comments: [],
      },
      {
        content: "I'm learning Full-Stack!",
        timestamp: "2024-10-04 02:20 PM",
        likes: 2,
        comments: [],
      },
    ],
  },
];

// Register new user
document.getElementById("registerBtn").addEventListener("click", function () {
  const username = document.getElementById("username").value.trim();
  if (username) {
    currentUser = {
      username: username,
      followers: [],
      following: [],
      posts: [], // Initially no posts
    };

    users.push(currentUser);
    assignFollowers(); // Assign existing followers to the current user
    showAppSection();
  } else {
    alert("Please enter a username.");
  }
});

// Assign existing users as followers
function assignFollowers() {
  existingUsers.forEach((user) => {
    if (currentUser.username !== user.username) {
      user.followers.push(currentUser); // Add current user to each existing user's followers
    }
  });
}

// Show the main app after registration
function showAppSection() {
  document.getElementById("registrationPage").style.display = "none";
  document.getElementById("appSection").style.display = "block";
  document.getElementById("welcomeMessage").innerText = `Welcome, ${currentUser.username}!`;
  updateProfileInfo();
  displayFeed();
  showUsersToFollow(); // Show existing users to follow
}

// Update profile info like followers and following
function updateProfileInfo() {
  document.getElementById("followersCount").innerText = `Followers: ${currentUser.followers.length}`;
  document.getElementById("followingCount").innerText = `Following: ${currentUser.following.length}`;
}

// Create a new post
document.getElementById("postBtn").addEventListener("click", function () {
  const postContent = document.getElementById("postContent").value;
  const fileInput = document.getElementById("fileUpload");
  const file = fileInput.files[0];

  if (!postContent && !file) {
    alert("Please enter text or upload a file.");
    return;
  }

  const post = {
    content: postContent,
    imageUrl: file ? URL.createObjectURL(file) : null,
    timestamp: new Date().toLocaleString(),
    likes: 0,
    comments: [],
  };

  currentUser.posts.push(post);
  displayFeed();
  resetPostForm();
});

// Reset post form after submission
function resetPostForm() {
  document.getElementById("postContent").value = "";
  document.getElementById("fileUpload").value = "";
}

// Display the current user's posts in the feed
function displayFeed() {
  const feed = document.getElementById("feed");
  const followersPosts = document.getElementById("followersPosts");

  // Clear the feed and followers' posts sections
  feed.innerHTML = "";
  followersPosts.innerHTML = "";

  // Display current user's posts
  currentUser.posts.forEach((post) => {
    const postElement = createPostElement(post, true, currentUser.username); // Pass the current user's username
    feed.appendChild(postElement);
  });

  // Display followed users' posts
  currentUser.following.forEach((follower) => {
    follower.posts.forEach((post) => {
      const postElement = createPostElement(post, false, follower.username); // Pass the follower's username
      followersPosts.appendChild(postElement);
    });
  });
}

// Create post element for feed
function createPostElement(post, isUserPost, username) {
  const postElement = document.createElement("div");
  postElement.classList.add("post");

  const usernameElement = document.createElement("p");
  usernameElement.innerText = `Posted by: ${username}`; // Display username
  usernameElement.style.fontWeight = "bold"; // Make the username bold
  postElement.appendChild(usernameElement); // Append the username to the post element

  const postContent = document.createElement("p");
  postContent.innerText = post.content;
  postElement.appendChild(postContent);

  if (post.imageUrl) {
    const postImage = document.createElement("img");
    postImage.src = post.imageUrl;
    postImage.classList.add("zoomable");
    postElement.appendChild(postImage);
  }

  const postTimestamp = document.createElement("p");
  postTimestamp.innerText = `Posted on: ${post.timestamp}`;
  postElement.appendChild(postTimestamp);

  // Like button
  const likeBtn = document.createElement("button");
  likeBtn.innerText = `Like (${post.likes})`;
  likeBtn.classList.add("like-btn");
  likeBtn.addEventListener("click", () => {
    post.likes++;
    displayFeed(); // Update feed to show new like count
  });
  postElement.appendChild(likeBtn);

  // Comment button
  const commentBtn = document.createElement("button");
  commentBtn.innerText = "Comment";
  commentBtn.classList.add("comment-btn");
  commentBtn.addEventListener("click", () => {
    const commentContent = prompt("Enter your comment:");
    if (commentContent) {
      post.comments.push({ username, content: commentContent }); // Store comment with username
      displayFeed(); // Update feed to show new comments
    }
  });
  postElement.appendChild(commentBtn);

  // Show comments
  const commentsElement = document.createElement("div");
  commentsElement.classList.add("comments");
  post.comments.forEach((comment) => {
    const commentElement = document.createElement("p");
    commentElement.innerText = `${comment.username}: ${comment.content}`; // Display comment with username
    commentsElement.appendChild(commentElement);
  });
  postElement.appendChild(commentsElement);

  // Add delete button only for user's posts
  if (isUserPost) {
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", () => {
      deletePost(post);
    });
    postElement.appendChild(deleteBtn);
  }

  return postElement;
}

// Delete a post
function deletePost(postToDelete) {
  currentUser.posts = currentUser.posts.filter((post) => post !== postToDelete);
  displayFeed();
}

// Show existing users to follow
function showUsersToFollow() {
  const usersToFollow = document.getElementById("usersToFollow");
  usersToFollow.innerHTML = "";

  existingUsers.forEach((user) => {
    if (user.username !== currentUser.username) {
      // Exclude the current user
      const userElement = document.createElement("div");
      userElement.classList.add("user");

      const userName = document.createElement("p");
      userName.innerText = user.username;

      const followBtn = document.createElement("button");
      followBtn.innerText = "Follow";
      followBtn.addEventListener("click", () => {
        currentUser.following.push(user);
        updateProfileInfo();
        displayFeed(); // Update feed with followed users' posts
      });

      userElement.appendChild(userName);
      userElement.appendChild(followBtn);
      usersToFollow.appendChild(userElement);
    }
  });
}
