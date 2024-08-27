document.addEventListener("DOMContentLoaded", function() {
    const postForm = document.getElementById('postForm');

    if (postForm) {
        postForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const title = document.getElementById('title').value;
            const author = document.getElementById('author').value;
            const password = document.getElementById('password').value;
            const content = document.getElementById('content').value;

            if (!title || !author || !password || !content) {
                alert("모든 필드를 입력하세요.");
                return;
            }

            const posts = JSON.parse(localStorage.getItem('posts')) || [];
            const newPost = {
                id: posts.length ? posts[posts.length - 1].id + 1 : 1,
                title,
                author,
                password,
                content,
                date: new Date().toISOString().split('T')[0],
                views: 0
            };

            posts.push(newPost);
            localStorage.setItem('posts', JSON.stringify(posts));
            alert("게시글이 등록되었습니다.");
            window.location.href = 'list.html';
        });
    }
});


document.addEventListener("DOMContentLoaded", function() {
    const editForm = document.getElementById('editForm');
    const urlParams = new URLSearchParams(window.location.search);
    const postId = parseInt(urlParams.get('id'), 10);
    
    if (editForm) {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        const post = posts.find(p => p.id === postId);

        if (post) {
            document.getElementById('title').value = post.title;
            document.getElementById('author').value = post.author;
            document.getElementById('password').value = post.password;
            document.getElementById('content').value = post.content;
        }

        editForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const title = document.getElementById('title').value;
            const author = document.getElementById('author').value;
            const password = document.getElementById('password').value;
            const content = document.getElementById('content').value;

            if (!title || !author || !password || !content) {
                alert("모든 필드를 입력하세요.");
                return;
            }

            const index = posts.findIndex(p => p.id === postId);
            if (index > -1) {
                posts[index] = { ...posts[index], title, author, password, content };
                localStorage.setItem('posts', JSON.stringify(posts));
                alert("게시글이 수정되었습니다.");
                window.location.href = 'list.html';
            } else {
                alert("게시글을 찾을 수 없습니다.");
            }
        });
    }
});

