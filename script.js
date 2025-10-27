// **I. 初始化 & DOM 元素获取**
document.addEventListener('DOMContentLoaded', () => {
    // 获取所有需要的 DOM 元素
    const moodSelector = document.getElementById('mood-selector');
    const noteInput = document.getElementById('note-input');
    const saveBtn = document.getElementById('save-btn');
    const historyList = document.getElementById('history-list');
    const chartCanvas = document.getElementById('mood-chart');

    let selectedMood = null;
    let moodChart = null; // 用于存放图表实例

    // **II. 事件监听**
    // 1. 心情按钮点击事件 (使用事件委托)
    moodSelector.addEventListener('click', (e) => {
        if (e.target.classList.contains('mood-btn')) {
            // 移除其他按钮的选中状态
            document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
            // 添加选中状态
            e.target.classList.add('selected');
            selectedMood = parseInt(e.target.dataset.mood);
        }
    });

    // 2. 保存按钮点击事件
    saveBtn.addEventListener('click', () => {
        if (selectedMood === null) {
            alert('请选择一个心情！');
            return;
        }

        const newEntry = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
            mood: selectedMood,
            note: noteInput.value.trim()
        };

        saveData(newEntry);
        render(); // 重新渲染所有内容
        clearInputs();
    });

    // **III. 数据处理函数**
    function getData() {
        return JSON.parse(localStorage.getItem('moodJournalData')) || [];
    }

    function saveData(entry) {
        const data = getData();
        // 检查今天是否已经记录过，如果是，则更新
        const todayIndex = data.findIndex(item => item.date === entry.date);
        if (todayIndex > -1) {
            data[todayIndex] = entry;
        } else {
            data.push(entry);
        }
        localStorage.setItem('moodJournalData', JSON.stringify(data));
        
        // **调用智能分析函数**
        checkMoodPatterns(data);
        checkKeywords(entry.note);
    }

    // **IV. 渲染函数**
    function render() {
        const data = getData();
        renderHistory(data);
        renderChart(data);
    }

    function renderHistory(data) {
        historyList.innerHTML = '';
        if (data.length === 0) {
            historyList.innerHTML = '<p style="color: #999; text-align: center;">还没有记录，快来记录你的第一条心情吧！</p>';
            return;
        }
        // 为了更好的体验，我们倒序显示
        [...data].reverse().forEach(entry => {
            const item = document.createElement('div');
            item.className = 'history-item';
            const moodEmoji = getMoodEmoji(entry.mood);
            item.innerHTML = `<strong>${entry.date}</strong> ${moodEmoji} (情绪指数: ${entry.mood})<p>${entry.note || '没有笔记'}</p>`;
            historyList.appendChild(item);
        });
    }

    function renderChart(data) {
        if (data.length === 0) {
            // 如果没有数据，显示空图表
            if (moodChart) {
                moodChart.destroy();
                moodChart = null;
            }
            return;
        }

        // 只显示最近30天的数据
        const recentData = data.slice(-30);
        const labels = recentData.map(entry => entry.date);
        const moodData = recentData.map(entry => entry.mood);

        if (moodChart) {
            moodChart.destroy(); // 销毁旧图表以重新绘制
        }

        moodChart = new Chart(chartCanvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: '情绪波动',
                    data: moodData,
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    tension: 0.1,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 5, // 心情最高分
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
    }

    function clearInputs() {
        selectedMood = null;
        document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
        noteInput.value = '';
    }

    function getMoodEmoji(mood) {
        const emojiMap = {
            5: '😄',
            4: '🙂',
            3: '😐',
            2: '😟',
            1: '😠'
        };
        return emojiMap[mood] || '😐';
    }

    // **V. "智能"分析函数**
    const SUGGESTIONS = {
        sadness: "看起来你最近情绪有些低落。试着做一些能让自己放松的小事，比如散步、听音乐或与朋友聊聊。请记住，你不是一个人。",
        anger: "感到愤怒是正常的。尝试一些深呼吸练习来帮助自己平静下来。如果可以,暂时离开让你生气的环境。",
    };

    const KEYWORD_RESOURCES = {
        '压力': "https://www.who.int/zh/news-room/questions-and-answers/item/stress",
        '孤独': "https://www.mind.org.uk/information-support/types-of-mental-health-problems/loneliness/about-loneliness/",
        '焦虑': "https://www.who.int/zh/news-room/fact-sheets/detail/anxiety-disorders",
        '抑郁': "https://www.who.int/zh/news-room/fact-sheets/detail/depression",
        '失眠': "https://www.who.int/zh/news-room/fact-sheets/detail/mental-health-at-work"
    };

    function checkMoodPatterns(data) {
        if (data.length < 3) return;
        const lastThree = data.slice(-3);
        const isConsecutivelySad = lastThree.every(entry => entry.mood <= 2);
        if (isConsecutivelySad) {
            setTimeout(() => alert(SUGGESTIONS.sadness + "\n\n(免责声明：本建议非专业医疗意见)"), 500);
        }
    }

    function checkKeywords(note) {
        if (!note) return;
        
        for (const keyword in KEYWORD_RESOURCES) {
            if (note.includes(keyword)) {
                setTimeout(() => {
                    if (confirm(`你的笔记中提到了"${keyword}"。需要为你打开一个相关的健康资源页面吗？\n\n(免责声明：本资源非专业医疗意见)`)) {
                        window.open(KEYWORD_RESOURCES[keyword], '_blank');
                    }
                }, 500);
                break; // 只处理第一个匹配的关键词
            }
        }
    }

    // **VI. 初始加载**
    render();
});

