
---

### **项目开发文档：我的情绪日记 (My Mood Journal)**

#### **1. 项目概览 (Project Overview)**

*   **项目名称:** My Mood Journal
*   **核心理念:** 一个以隐私为先、零门槛的网页应用，旨在帮助用户通过每日情绪签到，记录、观察并理解自己的情绪波动。项目集成了基于规则的智能反馈系统，为用户提供适时的关怀建议与资源引导。
*   **目标用户:** 面临学业或生活压力的学生、不善于表达情感的青少年，以及任何希望提升自我情绪察觉能力的人。
*   **关键特性:** 隐私优先（所有数据纯本地存储）、极简操作、数据可视化、智能化的主动关怀。

#### **2. 核心功能清单 (Feature Checklist)**

**MVP (Minimum Viable Product - 核心功能):**
1.  **每日情绪记录:** 用户可以选择一个表情符号代表当天心情。
2.  **可选文字笔记:** 用户可以为每次记录添加简短的文字说明。
3.  **本地数据存储:** 所有记录都安全地存储在用户的浏览器 `localStorage` 中。
4.  **历史记录视图:** 以列表形式清晰展示过去所有的情绪记录。
5.  **情绪可视化图表:** 使用 Chart.js 将情绪数据渲染成直观的折线图，展示情绪波动趋势。

**"智能"增强功能 (Smart Features):**
6.  **情绪模式识别:** 自动检测连续的负面情绪（例如，连续3天情绪低落）。
7.  **个性化建议:** 当识别到特定情绪模式时，主动提供科学、友好的心理调适建议。
8.  **笔记关键词分析:** 扫描用户笔记中的特定关键词（如“压力”、“孤独”）。
9.  **资源引导:** 当检测到敏感关键词时，提供指向专业心理健康网站或文章的链接。
10. **免责声明:** 在提供建议或资源时，明确告知用户本应用不能替代专业医疗建议。

#### **3. 技术规格 (Technical Specifications)**

| 类别 | 技术 | 用途 |
| :--- | :--- | :--- |
| **基础** | HTML5, CSS3, JavaScript (ES6+) | 构建应用的结构、样式和核心交互逻辑。 |
| **数据存储** | `window.localStorage` | 纯客户端存储，实现完全的数据隐私和离线功能。 |
| **数据可视化**| Chart.js | 轻量且强大的图表库，用于将情绪数据转化为可视化图表。 |
| **UI/UX** | Google Fonts / Font Awesome | （可选）用于改善字体和图标，提升视觉体验。 |

#### **4. 项目文件结构 (Project File Structure)**

```
mood-journal/
│
├── index.html         # 应用主页面，包含所有HTML结构
├── style.css          # 主要的CSS样式文件
└── script.js          # 核心的JavaScript逻辑文件
```

#### **5. 数据结构设计 (Data Structure Design)**

所有的数据将作为一个**对象数组**存储在 `localStorage` 中，键为 `moodJournalData`。

**单条记录 (Entry Object) 的结构:**
```json
{
  "id": 1697981812345,   // 使用时间戳作为唯一ID
  "date": "2025-10-22",   // YYYY-MM-DD 格式的日期
  "mood": 4,              // 情绪评级 (例如: 5:开心, 4:平静, 3:一般, 2:难过, 1:愤怒)
  "note": "今天完成了项目的核心功能，很有成就感！" // 用户输入的文本笔记
}
```

---

### **6. 分步实现指南 (Step-by-Step Implementation Guide)**

#### **步骤 1: HTML 骨架 (`index.html`)**

构建两个主要部分：`entry-section` 用于输入，`display-section` 用于展示。

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>我的情绪日记</title>
    <link rel="stylesheet" href="style.css">
    <!-- 引入 Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <main class="container">
        <!-- ==== 输入区域 ==== -->
        <section id="entry-section">
            <h1>你今天感觉怎么样？</h1>
            <div id="mood-selector" class="mood-selector">
                <button class="mood-btn" data-mood="5">😄</button>
                <button class="mood-btn" data-mood="4">🙂</button>
                <button class="mood-btn" data-mood="3">😐</button>
                <button class="mood-btn" data-mood="2">😟</button>
                <button class="mood-btn" data-mood="1">😠</button>
            </div>
            <textarea id="note-input" placeholder="有什么想记录的吗？（可选）"></textarea>
            <button id="save-btn">保存今日心情</button>
        </section>

        <!-- ==== 展示区域 ==== -->
        <section id="display-section">
            <h2>我的情绪曲线</h2>
            <canvas id="mood-chart"></canvas> <!-- 图表容器 -->
            
            <h2>历史记录</h2>
            <div id="history-list"></div> <!-- 历史记录列表 -->
        </section>
    </main>

    <!-- 引入 JavaScript -->
    <script src="script.js"></script>
</body>
</html>
```

#### **步骤 2: CSS 样式 (`style.css`)**

为应用添加简洁、友好的样式。

```css
/* 示例样式，你可以自由发挥 */
body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; color: #333; }
.container { max-width: 800px; margin: 2rem auto; padding: 1rem; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
#entry-section, #display-section { margin-bottom: 2rem; }
.mood-selector { display: flex; justify-content: space-around; margin: 1rem 0; }
.mood-btn { font-size: 2rem; background: none; border: 2px solid transparent; border-radius: 50%; padding: 0.5rem; cursor: pointer; transition: transform 0.2s, border-color 0.2s; }
.mood-btn:hover { transform: scale(1.1); }
.mood-btn.selected { border-color: #007bff; transform: scale(1.2); }
textarea { width: 100%; min-height: 80px; margin: 1rem 0; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
#save-btn { display: block; width: 100%; padding: 0.8rem; background-color: #007bff; color: white; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer; }
#save-btn:hover { background-color: #0056b3; }
.history-item { border-bottom: 1px solid #eee; padding: 1rem 0; }
```

#### **步骤 3: JavaScript 核心逻辑 (`script.js`)**

这是项目的核心，按照功能模块逐步实现。

```javascript
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
        // 为了更好的体验，我们倒序显示
        [...data].reverse().forEach(entry => {
            const item = document.createElement('div');
            item.className = 'history-item';
            item.innerHTML = `<strong>${entry.date}</strong> (心情: ${entry.mood})<p>${entry.note || '没有笔记'}</p>`;
            historyList.appendChild(item);
        });
    }

    function renderChart(data) {
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
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 5 // 心情最高分
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

    // **V. "智能"分析函数**
    const SUGGESTIONS = {
        sadness: "看起来你最近情绪有些低落。试着做一些能让自己放松的小事，比如散步、听音乐或与朋友聊聊。请记住，你不是一个人。",
        anger: "感到愤怒是正常的。尝试一些深呼吸练习来帮助自己平静下来。如果可以，暂时离开让你生气的环境。",
    };

    const KEYWORD_RESOURCES = {
        '压力': "https://www.who.int/zh/news-room/questions-and-answers/item/stress",
        '孤独': "https://www.mind.org.uk/information-support/types-of-mental-health-problems/loneliness/about-loneliness/",
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
        for (const keyword in KEYWORD_RESOURCES) {
            if (note.includes(keyword)) {
                setTimeout(() => {
                    if (confirm(`你的笔记中提到了“${keyword}”。需要为你打开一个相关的健康资源页面吗？\n\n(免责声明：本资源非专业医疗意见)`)) {
                        window.open(KEYWORD_RESOURCES[keyword], '_blank');
                    }
                }, 500);
            }
        }
    }

    // **VI. 初始加载**
    render();
});
```

---

### **7. 如何使用此文档与Cursor**

1.  **项目初始化:** 让Cursor根据 **Section 4** 创建文件结构。
2.  **构建HTML:** 复制 **Section 6, 步骤 1** 的全部HTML代码，粘贴到 `index.html`。
3.  **构建CSS:** 复制 **Section 6, 步骤 2** 的全部CSS代码，粘贴到 `style.css`。
4.  **构建JavaScript:** 这是关键。将 **Section 6, 步骤 3** 的JavaScript代码**分块**喂给Cursor。例如：
    *   “首先，为我实现 `script.js` 的 **I. 初始化 & DOM 元素获取** 和 **II. 事件监听** 部分。”
    *   “接下来，实现 **III. 数据处理函数**，确保能正确地从`localStorage`读取和保存数据。”
    *   “然后，实现 **IV. 渲染函数**，包括 `renderHistory` 和 `renderChart`。”
    *   “最后，为我添加 **V. "智能"分析函数**，并确保在保存数据时调用它们。”
5.  **测试与迭代:** 在本地浏览器中打开 `index.html`，测试所有功能。如果遇到问题，可以将错误信息和相关代码块一起粘贴给Cursor，让它帮助你调试。
