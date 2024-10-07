let currentUser = localStorage.getItem("username");
let users = JSON.parse(localStorage.getItem("users")) || [];

// Display welcome message with username
document.addEventListener("DOMContentLoaded", () => {
  if (!currentUser) {
    alert("No user found. Redirecting to registration...");
    window.location.href = "index.html";
  } else {
    document.getElementById(
      "welcomeMessage"
    ).innerText = `Hello, ${currentUser}!`;

    // Check if user already exists in the users array
    let user = users.find((user) => user.username === currentUser);
    if (!user) {
      users.push({
        username: currentUser,
        posts: [],
        followers: [],
        following: [],
      });
      localStorage.setItem("users", JSON.stringify(users));
    }

    displayUsers();
    displayFeed();
    updateProfileInfo();
    displayFollowersPosts();
  }

  // Logout button functionality
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("username");
    alert("You have been logged out.");
    window.location.href = "index.html"; // Redirect to the login page
  });

  // Add Another Account button functionality
  document.getElementById("addAccountBtn").addEventListener("click", () => {
    localStorage.removeItem("username"); // Clear the current session
    window.location.href = "index.html"; // Redirect to the login page for a new account
  });
});

// Create a new post
document.getElementById("postBtn").addEventListener("click", () => {
  const content = document.getElementById("postContent").value;
  const file = document.getElementById("fileUpload").files[0];

  if (!content && !file) {
    alert("Please add content or an image.");
    return;
  }

  const user = users.find((user) => user.username === currentUser);

  const post = {
    content: content,
    file: file ? URL.createObjectURL(file) : null,
    likes: 0,
    comments: [],
    timestamp: new Date().toLocaleString(), // Add timestamp here
  };

  user.posts.push(post);
  localStorage.setItem("users", JSON.stringify(users));

  document.getElementById("postContent").value = "";
  document.getElementById("fileUpload").value = "";

  displayFeed();
});

// Display posts in the feed
function displayFeed() {
  const user = users.find((user) => user.username === currentUser);
  let feedHtml = "";

  user.posts.forEach((post, index) => {
    feedHtml += `
            <div class="post">
                <p>${post.content}</p>
                <p class="timestamp">${
                  post.timestamp
                }</p> <!-- Show timestamp for own posts -->
                ${
                  post.file
                    ? `<img src="${post.file}" class="zoomable" onclick="zoomImage(this)">`
                    : ""
                }
                <div class="actions">
                    <button onclick="likePost('${
                      user.username
                    }', ${index})">Like (${post.likes})</button>
                    <button onclick="commentPost('${
                      user.username
                    }', ${index})">Comment</button>
                    <button onclick="deletePost('${
                      user.username
                    }', ${index})">Delete</button>
                </div>
                <div class="comments">
                    ${post.comments
                      .map((comment) => `<p class="comment">${comment}</p>`)
                      .join("")}
                </div>
            </div>
        `;
  });

  document.getElementById("feed").innerHTML = feedHtml;
}

// Delete a post
function deletePost(username, postIndex) {
  const user = users.find((user) => user.username === username);
  user.posts.splice(postIndex, 1);
  localStorage.setItem("users", JSON.stringify(users));
  displayFeed();
}

// Zoom image on click
function zoomImage(imgElement) {
  imgElement.classList.toggle("zoomed");
}

// Like a post
function likePost(username, postIndex) {
  const user = users.find((user) => user.username === username);
  user.posts[postIndex].likes++;
  localStorage.setItem("users", JSON.stringify(users));
  displayFeed();
}

// Comment on a post
function commentPost(username, postIndex) {
  const comment = prompt("Enter your comment:");
  if (comment) {
    const user = users.find((user) => user.username === username);
    user.posts[postIndex].comments.push(`${currentUser}: ${comment}`);
    localStorage.setItem("users", JSON.stringify(users));
    displayFeed();
  }
}

// Display users to follow
function displayUsers() {
  let usersHtml = "";
  const loggedInUser = users.find((user) => user.username === currentUser);

  users.forEach((user) => {
    if (user.username !== currentUser) {
      usersHtml += `
                <div class="user">
                    <p>${user.username}</p>
                    <button onclick="${
                      loggedInUser.following.includes(user.username)
                        ? `unfollowUser('${user.username}')`
                        : `followUser('${user.username}')`
                    }">${
        loggedInUser.following.includes(user.username) ? "Unfollow" : "Follow"
      }</button>
                </div>
            `;
    }
  });
  document.getElementById("usersToFollow").innerHTML = usersHtml;
}

// Follow a user
function followUser(username) {
  const userToFollow = users.find((user) => user.username === username);
  const loggedInUser = users.find((user) => user.username === currentUser);

  if (!loggedInUser.following.includes(username)) {
    loggedInUser.following.push(username);
    userToFollow.followers.push(currentUser);

    localStorage.setItem("users", JSON.stringify(users));

    alert(`You are now following ${username}`);
    updateProfileInfo();
    displayFollowersPosts();
  } else {
    alert("You are already following this user.");
  }
}

// Unfollow a user
function unfollowUser(username) {
  const loggedInUser = users.find((user) => user.username === currentUser);
  const userToUnfollow = users.find((user) => user.username === username);

  if (loggedInUser.following.includes(username)) {
    loggedInUser.following = loggedInUser.following.filter(
      (user) => user !== username
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (user) => user !== currentUser
    );

    localStorage.setItem("users", JSON.stringify(users));

    alert(`You have unfollowed ${username}`);
    updateProfileInfo();
    displayFollowersPosts();
  } else {
    alert("You are not following this user.");
  }
}

function displayFollowersPosts() {
  const loggedInUser = users.find((user) => user.username === currentUser);
  let followersPostsHtml = "";

  // Clear existing content before adding new posts
  document.getElementById("followersPosts").innerHTML = "";

  loggedInUser.following.forEach((followingUsername) => {
    const followingUser = users.find(
      (user) => user.username === followingUsername
    );

    if (followingUser) {
      followingUser.posts.forEach((post) => {
        followersPostsHtml += `
            <div class="post">
                <p><strong>${followingUsername}</strong>: ${post.content}</p>
                ${
                  post.file
                    ? `<img src="${post.file}" class="zoomable" onclick="zoomImage(this)">`
                    : ""
                }
                <div class="actions">
                    <button onclick="likePost('${followingUsername}', ${followingUser.posts.indexOf(
          post
        )})">Like (${post.likes})</button>
                    <button onclick="commentPost('${followingUsername}', ${followingUser.posts.indexOf(
          post
        )})">Comment</button>
                </div>
                <div class="comments">
                    ${post.comments
                      .map((comment) => `<p class="comment">${comment}</p>`)
                      .join("")}
                </div>
            </div>
        `;
      });
    }
  });

  document.getElementById("followersPosts").innerHTML = followersPostsHtml;
}

// Update profile info
function updateProfileInfo() {
  const loggedInUser = users.find((user) => user.username === currentUser);
  document.getElementById(
    "followersCount"
  ).innerText = `Followers: ${loggedInUser.followers.length}`;
  document.getElementById(
    "followingCount"
  ).innerText = `Following: ${loggedInUser.following.length}`;
}
