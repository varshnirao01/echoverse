const apiBase = "http://localhost:5000/api";

// 🎛 Disk feature: change speed
function changeSpeed(speed) {
  const audio = document.getElementById("audioPlayer");
  if (audio) audio.playbackRate = speed;
}

// 🎤 Upload song
document.getElementById("uploadForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = document.getElementById("file").files[0];
  const title = document.getElementById("title").value;
  const bgmUsed = document.getElementById("bgmUsed").value;

  if (!file || !title || !bgmUsed) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);
  formData.append("bgm", bgmUsed);

  const messageElem = document.getElementById("uploadMessage");
  if (!messageElem) return;

  try {
    const res = await fetch(`${apiBase}/uploads`, {
      method: "POST",
      body: formData
      // headers: { "Authorization": `Bearer ${token}` } // add if JWT auth enabled
    });

    if (res.ok) {
      messageElem.innerText = "✅ Uploaded successfully!";
      document.getElementById("uploadForm").reset(); // clear form
      loadUploads(); // refresh the list
      // ⚡ Removed setTimeout so message stays visible
    } else {
      // handle non-JSON responses safely
      let errMsg = "";
      try {
        const data = await res.json();
        errMsg = data.message || "Upload failed";
      } catch {
        errMsg = res.statusText || "Upload failed";
      }
      messageElem.innerText = `❌ Error: ${errMsg}`;
    }
  } catch (err) {
    messageElem.innerText = `❌ Error: ${err.message}`;
  }
});

// Load uploaded songs
async function loadUploads() {
  try {
    const res = await fetch(`${apiBase}/uploads`);
    const uploads = await res.json();
    const container = document.getElementById("uploadsContainer");
    if (!container) return;

    container.innerHTML = "";
    uploads.forEach(u => {
      const div = document.createElement("div");
      div.innerHTML = `
        <p><b>${u.title}</b> by ${u.userId?.username || "Unknown"} - Likes: ${u.likes}</p>
        <audio controls src="http://localhost:5000${u.fileUrl}"></audio><br>
        <button onclick="likeUpload('${u._id}')">❤️ Like</button>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error("Error loading uploads:", err);
  }
}

// ❤️ Like uploaded song
async function likeUpload(id) {
  try {
    await fetch(`${apiBase}/uploads/${id}/like`, { method: "PUT" });
    loadUploads();
  } catch (err) {
    console.error("Error liking upload:", err);
  }
}

window.onload = loadUploads;
