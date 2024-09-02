// Store users and their posts
const users = {};

// Store the current user
let currentUser = 'User1'; // Default user

// Function to post content
function postContent() {
    const content = document.getElementById('postContent').value;
    if (content.trim() === '') {
        alert('Content cannot be empty!');
        return;
    }
    
    // Initialize user data if not already present
    if (!users[currentUser]) {
        users[currentUser] = { posts: [], following: [], followers: [] };
    }
    
    // Add the new post
    users[currentUser].posts.push(content);
    displayFeed();
    document.getElementById('postContent').value = ''; // Clear the textarea
}

// Function to follow a user
function followUser() {
    const userToFollow = document.getElementById('followUser').value;
    if (userToFollow.trim() === '' || userToFollow === currentUser) {
        alert('Invalid user to follow!');
        return;
    }
    
    // Initialize user data if not already present
    if (!users[currentUser]) {
        users[currentUser] = { posts: [], following: [], followers: [] };
    }
    
    if (!users[userToFollow]) {
        users[userToFollow] = { posts: [], following: [], followers: [] };
    }
    
    // Add the user to the current user's following list if not already following
    if (!users[currentUser].following.includes(userToFollow)) {
        users[currentUser].following.push(userToFollow);
    }
    
    // Add the current user to the followed user's followers list
    if (!users[userToFollow].followers.includes(currentUser)) {
        users[userToFollow].followers.push(currentUser);
    }
    
    displayFeed();
    displayFollowers(); // Update followers list
    document.getElementById('followUser').value = ''; // Clear the input field
}

// Function to display the feed
function displayFeed() {
    const feedElement = document.getElementById('feed');
    feedElement.innerHTML = ''; // Clear previous feed
    
    // Get posts from the current user and their followers
    const usersToDisplay = [currentUser].concat(users[currentUser].following);
    
    usersToDisplay.forEach(user => {
        if (users[user]) {
            users[user].posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.className = 'feed-post';
                postElement.textContent = `${user}: ${post}`;
                feedElement.appendChild(postElement);
            });
        }
    });
}

// Function to display followers
function displayFollowers() {
    const followersElement = document.getElementById('followers');
    followersElement.innerHTML = ''; // Clear previous followers list
    
    if (users[currentUser] && users[currentUser].followers.length > 0) {
        users[currentUser].followers.forEach(follower => {
            const followerElement = document.createElement('div');
            followerElement.className = 'follower';
            followerElement.textContent = follower;
            followersElement.appendChild(followerElement);
        });
    } else {
        const noFollowersElement = document.createElement('div');
        noFollowersElement.textContent = 'No followers';
        followersElement.appendChild(noFollowersElement);
    }
}

// Initial display of feed and followers
window.onload = function() {
    displayFeed();
    displayFollowers();
};
