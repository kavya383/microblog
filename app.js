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
    const storedPosts = existingUsers.find((user) => user.username === username)?.posts || [];

    currentUser = {
      username: username,
      followers: [],
      following: [],
      posts: storedPosts,
    };

    users.push(currentUser);
    assignFollowers();
    showAppSection();
  } else {
    alert("Please enter a username.");
  }
});

// Assign existing users as followers
function assignFollowers() {
  existingUsers.forEach((user) => {
    if (currentUser.username !== user.username) {
      user.followers.push(currentUser);
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
  showUsersToFollow();
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
    const postElement = createPostElement(post, true);
    feed.appendChild(postElement);
  });

  // Display followed users' posts
  currentUser.following.forEach((follower) => {
    follower.posts.forEach((post) => {
      const postElement = createPostElement(post, false);
      followersPosts.appendChild(postElement);
    });
  });
}

// Create post element for feed
function createPostElement(post, isUserPost) {
  const postElement = document.createElement("div");
  postElement.classList.add("post");

  const postContent = document.createElement("p");
  postContent.innerText = post.content;

  const postImage = document.createElement("img");
  if (post.imageUrl) {
    postImage.src = post.imageUrl;
    postImage.classList.add("zoomable");
  }

  const postTimestamp = document.createElement("p");
  postTimestamp.innerText = `Posted on: ${post.timestamp}`;

  postElement.appendChild(postContent);
  if (post.imageUrl) postElement.appendChild(postImage);
  postElement.appendChild(postTimestamp);

  // Display comments
  const commentsList = document.createElement("div");
  commentsList.classList.add("comments-list");
  post.comments.forEach((comment) => {
    const commentElement = document.createElement("p");
    commentElement.innerText = comment; // Display comment text
    commentsList.appendChild(commentElement);
  });
  postElement.appendChild(commentsList);

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
      post.comments.push(`${currentUser.username}: ${commentContent}`); // Include username with comment
      displayFeed(); // Update feed to show new comments
    }
  });
  postElement.appendChild(commentBtn);

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
      const userElement = document.createElement("div");
      userElement.classList.add("user");

      const userName = document.createElement("p");
      userName.innerText = user.username;

      const followBtn = document.createElement("button");
      followBtn.innerText = "Follow";
      followBtn.addEventListener("click", () => {
        currentUser.following.push(user);
        updateProfileInfo();
        displayFeed();
      });

      userElement.appendChild(userName);
      userElement.appendChild(followBtn);
      usersToFollow.appendChild(userElement);
    }
  });
}
