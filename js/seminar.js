// セミナーカード（コンポーネント）
Vue.component('seminar-card', {
    props: {
        event: Object,
    },

    template: `
    <div class="card h-100 p-3 border-0 shadow-sm d-flex flex-column">
        <div class="text-center mb-3">
            <img :src="'images/' + event.img" class="card-img-top rounded border img-fluid w-100" :alt="event.title"
                style="aspect-ratio: 400 / 285; object-fit: cover; max-height: 180px;">
        </div>
        <div class="card-body p-0 d-flex flex-column flex-grow-1">
            <span class="badge align-self-start mb-2 text-white" :class="getCategoryClass(event.category)">
                {{ event.category }}
            </span>
            
            <h2 class="card-title fw-bold h5 mb-2">{{ event.title }}</h2>
            <p class="card-text text-muted small mb-1">📅 {{ event.date }}</p>
            <p class="card-text text-muted small mb-2">📍 {{ event.location }}</p>
            
            <p class="card-text text-secondary small mb-3" 
            style="display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; overflow: hidden; line-height: 1.5; height: 4.5em;">
            {{ event.description }}
            </p>
            
            <button type="button" class="btn btn-info btn-sm text-white mt-auto w-100"
            @click="showDetail">詳しく見る</button>
        </div>
    </div>
    `,


    methods: {
        // 親にクリックイベントを通知する
        showDetail() {
            this.$emit('show-detail', this.event);
        },

        // カテゴリー名に応じてBootstrapの背景クラスを返す
        getCategoryClass(category) {
            switch (category) {
                case 'AI・生成AI':
                    return 'bg-dark'; // 黒・ダーク
                case 'DX・業務改善':
                    return 'bg-primary'; // 青
                case 'データ活用・開発':
                    return 'bg-success'; // 緑
                case 'クラウド・インフラ':
                    return 'bg-warning text-dark'; // 黄色（文字は暗く）
                case 'セキュリティ':
                    return 'bg-danger'; // 赤
                default:
                    return 'bg-secondary'; // その他・グレー
            }
        }
    }
});


// セミナー詳細モーダル（コンポーネント）
Vue.component('seminar-modal', {
    props: {
        event: Object,
        isOpen: Boolean,
    },

    template: `
    <dialog class="rounded-3 shadow border-0 p-0" ref="seminarModal" 
            style="width: 90%; max-width: 500px; background: white;">
        <div class="modal-content border-0" v-if="event">
            <div class="modal-header border-bottom-0 p-3 pb-0">
                <button type="button" class="btn-close ms-auto" aria-label="Close" @click="$emit('close')"></button>
            </div>
            <div class="modal-body p-4 pt-2">
                <div class="text-center mb-3">
                    <img class="rounded border img-fluid w-100" 
                        style="aspect-ratio: 400 / 285; object-fit: cover; max-height: 285px;" 
                        :src="'images/' + event.img" 
                        :alt="event.title">
                </div>
                
                <h2 class="h4 fw-bold mb-3" style="line-height: 1.4; color: #333;">{{event.title}}</h2>
                
                <div class="mb-3 d-flex flex-wrap gap-2">
                    <span class="badge text-white" :class="getCategoryClass(event.category)">
                        {{event.category}}
                    </span>
                    <span class="badge bg-secondary">📅 {{formattedDate}}</span>
                </div>
                
                <p class="text-muted small mb-3">📍 <strong>開催地:</strong> {{event.location1}}</p>
                
                <div class="border-top pt-3">
                <p class="text-secondary mb-0" style="font-size: 0.95rem; line-height: 1.6; white-space: pre-wrap;"> {{event.description}} </p>
                </div>

                <br><button onclick="location.href='seminar.html'" type="button" class="btn btn-info btn-sm text-white mt-auto w-100">お申込みはこちら</button>
            </div>
        </div>
    </dialog>
    `,
    
    computed: {
        formattedDate() {
            // eventがない場合は空を返す
            if (!this.event) return '';
            
            // date1が存在する場合、「年月日時分」に分割。さらに曜日を取得。リテラルを使って「2027年1月28日(木) 10:00〜」の形式で返す。
            if (this.event.date1) {
                const parts = this.event.date1.split('-');
                if (parts.length >= 5) {
                    const year = parts[0];
                    const month = parseInt(parts[1], 10);
                    const day = parseInt(parts[2], 10);
                    const hour = parts[3];
                    const min = parts[4];
                    
                    const dateObj = new Date(`${year}-${parts[1]}-${parts[2]}`);
                    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
                    const dayOfWeek = weekdays[dateObj.getDay()];
                    
                    return `${year}年${month}月${day}日(${dayOfWeek}) ${hour}:${min}〜`;
                }
            }

            // date1がない場合は従来のフォールバック処理（年月日と曜日のみを返す）
            if (!this.event.date1);
            const date = new Date(this.event.date);
            const options = {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                weekday: 'short'
            }
            return date.toLocaleDateString('ja-JP', options);
        },
    },

    watch: {
        // $refsで対象のdialog要素を取得。dialogを開閉する。
        isOpen(val) {
            const dialog = this.$refs.seminarModal;
            if (!dialog) return;
            if (val) {
                dialog.showModal();
            } else {
                dialog.close();
            }
        }
    },

    methods: {
        // モーダル側にも同じ色分けメソッドを適用
        getCategoryClass(category) {
            switch (category) {
                case 'AI・生成AI':
                    return 'bg-dark'; // 黒・ダーク
                case 'DX・業務改善':
                    return 'bg-primary'; // 青
                case 'データ活用・開発':
                    return 'bg-success'; // 緑
                case 'クラウド・インフラ':
                    return 'bg-warning text-dark'; // 黄色（文字は暗く）
                case 'セキュリティ':
                    return 'bg-danger'; // 赤
                default:
                    return 'bg-secondary'; // その他・グレー
            }
        }
    }
});


new Vue({
    el: '#app',
    data: {
        keyword: '',         // 入力中のキーワード
        searchWord: '',      // 実際に検索されたキーワード
        selectedMonth: '',   // 選択された月 ("02"など)
        selectedEvent: null, // クリックされたseminar-card
        isModalOpen: false,  // 🚀 親のdataにも定義を追加！
        seminarList: [],     // 全セミナーデータ
        visibleCount: 18,    // 現在の表示件数（初期値18）
    },


    computed: {
        // フィルタリングおよびソート済みの全リスト
        filteredEventList() {
            let list = [...this.seminarList];

            // 1. 日付の早い順にソート
            list.sort((a, b) => {
                const dateA = a.date || '';
                const dateB = b.date || '';
                return dateA.localeCompare(dateB);
            });

            // 2. 月ボタン別フィルタリング
            if (this.selectedMonth) {
                list = list.filter(event => {
                    return event.date.includes(`-${this.selectedMonth}-`);
                });
            }

            // 3. キーワード検索
            if (this.searchWord.trim() !== '') {
                const query = this.searchWord.toLowerCase().trim();
                list = list.filter(event => {
                    return event.title.toLowerCase().includes(query) || 
                        event.description.toLowerCase().includes(query) ||
                        event.location.toLowerCase().includes(query) ||
                        event.category.toLowerCase().includes(query);
                });
            }
            return list;
        },

        // 実際に画面に表示する分切り出したリスト
        displayedSeminars() {
            return this.filteredEventList.slice(0, this.visibleCount);
        },

        // 「もっと見る」ボタンを表示するかどうか
        hasMore() {
            return this.filteredEventList.length > this.visibleCount;
        },

        // 残りの件数
        remainingCount() {
            return this.filteredEventList.length - this.visibleCount;
        }
    },


    watch: {
        // 選択月の変更時に現在の表示件数をリセットする
        selectedMonth() {
            this.visibleCount = 18;
        },

        // キーワード検索時に現在の表示件数をリセットする
        searchWord() {
            this.visibleCount = 18;
        }
    },


    // seminar.jsonからセミナー情報を取得
    async created() {
        try {
            let response = await fetch('./data/seminar.json');
            if (!response.ok) throw new Error('データの取得に失敗しました');
            const data = await response.json();
            this.seminarList = data.event || [];
        } catch(e) {
            console.error(e);
        }
    },
    

    methods: {
        // 検索の実行
        searchSeminars() {
            this.searchWord = this.keyword;
        },

        // クリアボタン(×)の処理
        clearKeyword() {
            this.keyword = '';
            this.searchWord = '';
        },

        // 「もっと見る」ボタンの処理
        loadMore() {
            this.visibleCount += 12;
        },

        // eventを受け取ってモーダルを開く。その際、ブラウザのsessionStorageに一時的にeventを保存する。
        openModal(event) {
            this.selectedEvent = event;
            this.isModalOpen = true;
            sessionStorage.setItem('selectedSeminar', JSON.stringify(event));
        },

        // モーダルを閉じる。
        closeModal() {
            this.isModalOpen = false;
            this.selectedEvent = null;
        }
    }
});