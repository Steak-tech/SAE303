const pb = document.getElementById('nb');
const hard = document.getElementById('hard');
const pie = document.getElementById('pie');
const nav = document.getElementById('buttons');

const pbBtn = document.getElementById('pbBtn');
const pieBtn = document.getElementById('pieBtn');
const hardBtn = document.getElementById('hardBtn');

pie.style.display = 'none';
hard.style.display = 'none';
pb.style.display = 'none';

pbBtn.addEventListener('click', function() {
    pb.style.display = 'flex';
    hard.style.display = 'none';
    pie.style.display = 'none';
});

hardBtn.addEventListener('click', function() {
    pb.style.display = 'none';
    hard.style.display = 'flex';
    pie.style.display = 'none';
});

pieBtn.addEventListener('click', function() {
    pb.style.display = 'none';
    hard.style.display = 'none';
    pie.style.display = 'flex';
});
