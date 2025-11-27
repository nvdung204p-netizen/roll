// Lấy các element
const nameInput = document.getElementById("name-input");
const birthInput = document.getElementById("birth-input");
const startBtn = document.getElementById("start-btn");
const progressBar = document.getElementById("progress-bar");
const logArea = document.getElementById("log-area");
const resultArea = document.getElementById("result-area");
const resultTitle = document.getElementById("result-title");
const resultText = document.getElementById("result-text");
const showVideoBtn = document.getElementById("show-video-btn");
const videoSection = document.getElementById("video-section");
const resultVideo = document.getElementById("result-video");

// State
let isScanning = false;

// Danh sách log giả
const scanLogs = [
    "Đang kết nối tới trung tâm vũ trụ...",
    "Đang đọc dữ liệu sao chiếu mệnh ngày sinh của bạn...",
    "Đang đo độ đặc biệt ngoài hành tinh...",
    "Đang kiểm tra chỉ số nhọ/nhân phẩm...",
    "Đang phân tích năng lượng vũ trụ...",
    "Đang so sánh với các sinh vật đặc biệt khác...",
    "Chuẩn bị trả kết quả, hít thở sâu vào..."
];

// Danh sách template kết quả troll
const resultTemplates = [
    "Theo dữ liệu vũ trụ, {name} sinh ngày {birth} có chỉ số đặc biệt: 999/100. Quá giới hạn hệ mặt trời! 🌟",
    "Máy quét báo: {name} (sinh ngày {birth}) là sinh vật hiếm cấp SSR trong dải Ngân Hà. 🚀",
    "Hệ thống không hiểu nổi độ đặc biệt của {name}. Gợi ý: xem video bí mật để tự cảm nhận. 😎",
    "Kết quả: {name} sinh ngày {birth} có mức độ đặc biệt vượt xa mọi thuật toán. Máy tính đang tự hỏi: 'Đây là gì vậy?' 🤔",
    "Phân tích hoàn tất: {name} (sinh {birth}) được xếp vào danh mục 'Quá đặc biệt để phân loại'. Chúc mừng! 🎉",
    "Vũ trụ báo cáo: {name} sinh ngày {birth} có chỉ số đặc biệt = ∞ (vô cực). Máy tính đã crash 3 lần khi tính toán. 💥",
    "Kết luận: {name} (sinh {birth}) không phải người thường. Có thể là siêu anh hùng hoặc... troll? Xem video để biết thêm! 🦸"
];

/**
 * Format ngày từ yyyy-mm-dd sang dd/mm/yyyy
 */
function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString + "T00:00:00");
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

/**
 * Hàm bắt đầu phân tích
 */
function startScan() {
    // Không cho spam
    if (isScanning) {
        return;
    }

    // Lấy dữ liệu
    const name = nameInput.value.trim();
    const birth = birthInput.value;

    // Validate
    if (!name) {
        alert("Bạn chưa nhập tên!");
        return;
    }

    if (!birth) {
        alert("Bạn chưa chọn ngày sinh!");
        return;
    }

    // Đặt state
    isScanning = true;
    startBtn.disabled = true;

    // Reset UI
    progressBar.style.width = "0%";
    logArea.innerHTML = "";
    resultArea.classList.add("hidden");
    resultTitle.innerText = "";
    resultText.innerText = "";
    showVideoBtn.classList.add("hidden");
    videoSection.classList.add("hidden");
    resultVideo.pause();
    resultVideo.currentTime = 0;

    // Bắt đầu fake scan
    runFakeScan(name, birth);
}

/**
 * Hàm giả lập quá trình scan
 */
function runFakeScan(name, birth) {
    let step = 0;
    const totalSteps = scanLogs.length;
    const intervalTime = 600; // ms

    const interval = setInterval(() => {
        // Thêm log
        const logLine = document.createElement("p");
        logLine.textContent = scanLogs[step];
        logArea.appendChild(logLine);
        
        // Scroll log xuống cuối
        logArea.scrollTop = logArea.scrollHeight;

        // Cập nhật progress
        const progress = ((step + 1) / totalSteps) * 100;
        progressBar.style.width = progress + "%";

        step++;

        // Khi hoàn thành
        if (step >= totalSteps) {
            clearInterval(interval);
            progressBar.style.width = "100%";
            
            // Hiển thị kết quả sau một chút
            setTimeout(() => {
                showResult(name, birth);
                isScanning = false;
                startBtn.disabled = false;
            }, 300);
        }
    }, intervalTime);
}

/**
 * Hàm hiển thị kết quả text
 */
function showResult(name, birth) {
    // Chọn random template
    const randomTemplate = resultTemplates[Math.floor(Math.random() * resultTemplates.length)];
    
    // Format ngày sinh
    const formattedBirth = formatDate(birth);
    
    // Replace placeholder
    const resultMessage = randomTemplate
        .replace(/{name}/g, name)
        .replace(/{birth}/g, formattedBirth);

    // Set kết quả
    resultTitle.innerText = `Kết quả cho: ${name}`;
    resultText.innerText = resultMessage;

    // Hiển thị result area
    resultArea.classList.remove("hidden");
    
    // Hiển thị nút xem video
    showVideoBtn.classList.remove("hidden");
}

/**
 * Hàm bật fullscreen cho video (cross-browser)
 */
function requestFullscreen(element) {
    if (element.requestFullscreen) {
        return element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        // Safari
        return element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
        // Firefox
        return element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
        // IE/Edge
        return element.msRequestFullscreen();
    }
    return Promise.reject("Fullscreen không được hỗ trợ");
}

/**
 * Hàm xử lý khi click nút "Xem kết quả bí mật"
 */
function showVideo() {
    // Hiển thị video section
    videoSection.classList.remove("hidden");

    // Reset video về đầu
    resultVideo.currentTime = 0;
    
    // Xử lý lỗi khi video không load được
    const handleVideoError = () => {
        console.error("Lỗi khi tải video. Kiểm tra:");
        console.error("1. Đường dẫn video có đúng không?");
        console.error("2. File video có tồn tại trong thư mục assets/media/ không?");
        console.error("3. File video có quá lớn không? (GitHub giới hạn 100MB)");
        
        // Hiển thị thông báo lỗi cho người dùng
        const errorMsg = document.createElement("p");
        errorMsg.style.color = "#ef4444";
        errorMsg.style.marginTop = "8px";
        errorMsg.style.fontSize = "12px";
        errorMsg.innerHTML = "⚠️ Không thể tải video. Vui lòng kiểm tra:<br>" +
                            "• File video có tồn tại tại <code>assets/media/troll.mp4</code><br>" +
                            "• Kích thước file < 100MB<br>" +
                            "• Đã commit và push file video lên GitHub";
        videoSection.appendChild(errorMsg);
    };

    // Gắn event listener cho lỗi video
    resultVideo.addEventListener("error", handleVideoError);
    resultVideo.addEventListener("loadeddata", () => {
        console.log("Video đã tải thành công");
    });

    // Load video để đảm bảo sẵn sàng
    resultVideo.load();

    // Scroll đến video
    videoSection.scrollIntoView({ behavior: "smooth", block: "center" });

    // Hàm bật fullscreen
    const enterFullscreen = () => {
        setTimeout(() => {
            requestFullscreen(resultVideo).catch((error) => {
                console.log("Không thể bật fullscreen:", error);
            });
        }, 200);
    };

    // Thử play video ngay sau khi hiển thị (user đã click nên browser cho phép)
    // Thử nhiều lần để đảm bảo video play được
    const tryPlay = () => {
        const playPromise = resultVideo.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    // Video đã play thành công
                    console.log("Video đang phát tự động");
                    // Bật fullscreen sau khi video đã play
                    enterFullscreen();
                })
                .catch((error) => {
                    // Nếu bị chặn, thử play với muted (một số browser yêu cầu)
                    console.log("Thử play với muted...");
                    resultVideo.muted = true;
                    resultVideo.play()
                        .then(() => {
                            // Sau khi play được, bật lại sound
                            resultVideo.muted = false;
                            // Bật fullscreen
                            enterFullscreen();
                        })
                        .catch(() => {
                            console.log("Video cần người dùng click play thủ công");
                            // Vẫn thử bật fullscreen dù chưa play được
                            enterFullscreen();
                        });
                });
        } else {
            // Nếu không có playPromise, vẫn thử bật fullscreen
            enterFullscreen();
        }
    };

    // Thử play ngay lập tức
    tryPlay();
    
    // Thử lại sau khi scroll xong (đảm bảo video đã visible)
    setTimeout(tryPlay, 300);
}

// Gắn sự kiện khi DOM đã load
document.addEventListener("DOMContentLoaded", () => {
    // Nút bắt đầu
    startBtn.addEventListener("click", startScan);

    // Enter key trên input
    nameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            startScan();
        }
    });

    birthInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            startScan();
        }
    });

    // Nút xem video
    showVideoBtn.addEventListener("click", showVideo);
});

