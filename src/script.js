const cursor = document.getElementById("cursor");

const tip = document.getElementById("tip");

document.addEventListener('mousemove', e => {
  cursor.style.top = e.pageY + "px";
  cursor.style.left = e.pageX + "px";
  
  tip.style.display = "none";
});