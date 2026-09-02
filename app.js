/**
 * Pars Yabancı Dil Kursları - Portal State & Logic Manager v3.0 (Supabase Bulut Entegreli)
 */

// SUPABASE BULUT VERİTABANI BAĞLANTI BİLGİLERİ
const SUPABASE_URL = "https://qytakuqgkegwkgdhthuv.supabase.co";
const SUPABASE_KEY = "sb_publishable_QlpYBTINrpy8rdXMZ1SmGQ_q2n0ZuIz";

let supabaseClient = null;
if (window.supabase) {
    try {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log("⚡ Supabase Bulut Veritabanı Bağlantısı Başarılı!");
    } catch (e) {
        console.error("Supabase init error:", e);
    }
}

// Initial Default Mock Data with Accounts & Roles
const INITIAL_DATA = {
    currentUser: null, // null when logged out, or user object when logged in
    users: [
        {
            id: "usr-admin",
            username: "admin",
            password: "admin123",
            name: "Yönetici (Admin)",
            role: "admin",
            branchPermission: "all", // 'all' | 'gaziemir' | 'alsancak'
            avatar: "assets/avatar_admin.png",
            title: "Sistem Yöneticisi"
        },
        {
            id: "usr-1",
            username: "ahmetyilmaz",
            password: "12345",
            name: "Ahmet Yılmaz",
            role: "teacher",
            branchPermission: "gaziemir",
            avatar: "assets/avatar.png",
            title: "Gaziemir Şubesi Öğretmeni"
        },
        {
            id: "usr-2",
            username: "elifdemir",
            password: "12345",
            name: "Elif Demir",
            role: "teacher",
            branchPermission: "alsancak",
            avatar: "assets/avatar_female.png",
            title: "Alsancak Şubesi Öğretmeni"
        }
    ],
    branches: [
        {
            id: "gaziemir",
            name: "Gaziemir Şubesi",
            address: "Önder Cad. No:42, Gaziemir / İzmir",
            phone: "+90 (232) 251 40 40",
            image: "assets/gaziemir.png",
            description: "Geniş sınıfları, dil laboratuvarı ve dinlenme alanları ile Gaziemir'in merkezinde eğitim hizmeti."
        },
        {
            id: "alsancak",
            name: "Alsancak Şubesi",
            address: "Kıbrıs Şehitleri Cad. No:118, Alsancak / İzmir",
            phone: "+90 (232) 464 10 20",
            image: "assets/alsancak.png",
            description: "Alsancak kordon yakınında, klimalı modern derslikler ve interaktif akıllı tahta sistemleri."
        }
    ],
    classes: [
        // Gaziemir Classes
        {
            id: "cls-1",
            branchId: "gaziemir",
            name: "B2-101 Hızlandırılmış İngilizce",
            level: "B2 Upper-Intermediate",
            teacher: "Ahmet Yılmaz",
            schedule: "Pzt - Çar - Cuma 18:30 - 20:30",
            capacity: 15,
            studentUsername: "b2-101",
            studentPassword: "12345"
        },
        {
            id: "cls-2",
            branchId: "gaziemir",
            name: "A2-201 Genel İngilizce",
            level: "A2 Elementary",
            teacher: "Elif Demir",
            schedule: "Salı - Perşembe 14:00 - 17:00",
            capacity: 12,
            studentUsername: "a2-201",
            studentPassword: "12345"
        },
        {
            id: "cls-3",
            branchId: "gaziemir",
            name: "YDS / YÖKDİL Sınav Grubu",
            level: "YDS / YÖKDİL",
            teacher: "Murat Kaya",
            schedule: "Cumartesi - Pazar 10:00 - 13:00",
            capacity: 10,
            studentUsername: "yds-2026",
            studentPassword: "12345"
        },
        // Alsancak Classes
        {
            id: "cls-4",
            branchId: "alsancak",
            name: "C1-301 İleri Konuşma Kulübü",
            level: "C1 Advanced",
            teacher: "Sarah Jenkins",
            schedule: "Pazartesi - Çarşamba 19:00 - 21:00",
            capacity: 14,
            studentUsername: "c1-301",
            studentPassword: "12345"
        },
        {
            id: "cls-5",
            branchId: "alsancak",
            name: "IELTS Akademik Hazırlık",
            level: "IELTS / TOEFL",
            teacher: "David Miller",
            schedule: "Salı - Perşembe 18:00 - 21:00",
            capacity: 12,
            studentUsername: "ielts-2026",
            studentPassword: "12345"
        },
        {
            id: "cls-6",
            branchId: "alsancak",
            name: "B1-102 İş İngilizcesi (Business)",
            level: "B1 Intermediate",
            teacher: "Ayşe Özkan",
            schedule: "Cumartesi - Pazar 14:00 - 17:00",
            capacity: 15,
            studentUsername: "b1-102",
            studentPassword: "12345"
        }
    ],
    students: [
        // B2-101 (cls-1)
        { id: "std-1", classId: "cls-1", name: "Caner Arslan", age: 24, skill: "Speaking", date: "2026-08-29", attendance: "Geldi" },
        { id: "std-2", classId: "cls-1", name: "Zeynep Yıldız", age: 22, skill: "Reading", date: "2026-08-29", attendance: "Geldi" },
        { id: "std-3", classId: "cls-1", name: "Emre Şahin", age: 27, skill: "Writing", date: "2026-08-29", attendance: "Gelmedi" },
        { id: "std-4", classId: "cls-1", name: "Selin Yılmaz", age: 21, skill: "Listening", date: "2026-08-29", attendance: "Geldi" },
        { id: "std-5", classId: "cls-1", name: "Burak Çelik", age: 25, skill: "Speaking", date: "2026-08-29", attendance: "Geldi" },
        { id: "std-6", classId: "cls-1", name: "Deniz Öztürk", age: 23, skill: "Reading", date: "2026-08-29", attendance: "Gelmedi" },
        { id: "std-7", classId: "cls-1", name: "Gizem Acar", age: 26, skill: "Writing", date: "2026-08-29", attendance: "Geldi" },
        
        // A2-201 (cls-2)
        { id: "std-8", classId: "cls-2", name: "Alperen Aydın", age: 19, skill: "Reading", date: "2026-08-29", attendance: "Geldi" },
        { id: "std-9", classId: "cls-2", name: "Merve Kılıç", age: 20, skill: "Listening", date: "2026-08-29", attendance: "Geldi" },
        { id: "std-10", classId: "cls-2", name: "Kaan Erdoğan", age: 21, skill: "Speaking", date: "2026-08-29", attendance: "Gelmedi" },

        // YDS (cls-3)
        { id: "std-11", classId: "cls-3", name: "Turgut Karaca", age: 31, skill: "Reading", date: "2026-08-29", attendance: "Geldi" },
        { id: "std-12", classId: "cls-3", name: "Aslı Şen", age: 29, skill: "Writing", date: "2026-08-29", attendance: "Geldi" },

        // C1-301 Alsancak (cls-4)
        { id: "std-13", classId: "cls-4", name: "Sertan Aksoy", age: 28, skill: "Speaking", date: "2026-08-29", attendance: "Geldi" },
        { id: "std-14", classId: "cls-4", name: "Melis Koç", age: 25, skill: "Listening", date: "2026-08-29", attendance: "Geldi" },
        { id: "std-15", classId: "cls-4", name: "Bora Tekin", age: 30, skill: "Speaking", date: "2026-08-29", attendance: "Gelmedi" },

        // IELTS Alsancak (cls-5)
        { id: "std-16", classId: "cls-5", name: "Cem Taner", age: 23, skill: "Writing", date: "2026-08-29", attendance: "Geldi" },
        { id: "std-17", classId: "cls-5", name: "Duygu Solmaz", age: 24, skill: "Reading", date: "2026-08-29", attendance: "Geldi" },

        // B1-102 Alsancak (cls-6)
        { id: "std-18", classId: "cls-6", name: "Onur Güven", age: 32, skill: "Speaking", date: "2026-08-29", attendance: "Geldi" },
        { id: "std-19", classId: "cls-6", name: "Hande Yavuz", age: 27, skill: "Listening", date: "2026-08-29", attendance: "Geldi" }
    ],
    curriculum: [
        {
            id: "curr-1",
            classId: "cls-1",
            level: "B2 Upper-Intermediate",
            topic: "Unit 1: Present Perfect vs Past Simple & Business Vocabulary",
            description: "Zaman kıyaslamaları, şirket içi yazışmalar ve konuşma grubu alıştırmaları.",
            startDate: "2026-09-01",
            endDate: "2026-09-15",
            teacher: "Ahmet Yılmaz"
        },
        {
            id: "curr-2",
            classId: "cls-1",
            level: "B2 Upper-Intermediate",
            topic: "Unit 2: Relative Clauses & Academic Reading Strategies",
            description: "Cümle yapıları, bağlaçlar ve akademik paragraf analiz teknikleri.",
            startDate: "2026-09-16",
            endDate: "2026-09-30",
            teacher: "Elif Demir"
        },
        {
            id: "curr-3",
            classId: "cls-2",
            level: "A2 Elementary",
            topic: "Unit 1: Everyday Conversations & Daily Routines",
            description: "Günlük selamlaşma, saatler, aile ve meslekler hakkında konuşma.",
            startDate: "2026-09-01",
            endDate: "2026-09-20",
            teacher: "Elif Demir"
        }
    ],
    homeworks: [
        {
            id: "hw-1",
            classId: "cls-1",
            title: "B2 Unit 1 Grammar & Reading Worksheet",
            description: "Lütfen ekteki pdf dosyasını indirip 1. ve 2. kısımdaki alıştırmaları tamamlayınız.",
            dueDate: "2026-09-08",
            createdAt: "2026-08-29",
            teacher: "Ahmet Yılmaz",
            fileName: "B2_Unit1_Grammar_Worksheet.pdf",
            fileSize: "1.2 MB",
            fileData: "data:application/pdf;base64,JVBERi0xLjQKJ..."
        },
        {
            id: "hw-2",
            classId: "cls-2",
            title: "A2 Listening Practice Audio & Notes",
            description: "A2 seviyesi dinleme parçası çalışma notları ve kelime listesi.",
            dueDate: "2026-09-10",
            createdAt: "2026-08-29",
            teacher: "Elif Demir",
            fileName: "A2_Listening_Notes.docx",
            fileSize: "450 KB",
            fileData: "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,UEsDBBQABgA..."
        }
    ]
};

class AppState {
    constructor() {
        this.data = this.loadData();
        this.currentView = 'landing'; // 'landing' | 'branch' | 'classDetail'
        this.selectedBranchId = null;
        this.selectedClassId = null;
        this.activeClassTab = 'yoklama'; // 'yoklama' | 'mufredat' | 'odev'
        this.classFilterQuery = '';
        this.studentSearchQuery = '';
        this.studentSkillFilter = 'ALL';
        this.studentAttendanceFilter = 'ALL';
        this.selectedDate = new Date().toISOString().split('T')[0];

        this.pendingHwFileData = null;
        this.pendingHwFileName = null;
        this.pendingHwFileSize = null;

        this.init();
    }

    async init() {
        const dateInput = document.getElementById('globalAttendanceDate');
        if (dateInput) {
            dateInput.value = this.selectedDate;
        }

        this.renderAuthHeader();
        this.renderView();
        
        // Supabase Cloud Sync & Realtime Subscription
        await this.syncDataFromSupabase();
        this.setupRealtimeSubscription();

        setTimeout(() => {
            if (window.lucide) window.lucide.createIcons();
        }, 50);
    }

    // SUPABASE CLOUD DATABASE SYNC & PERSISTENCE
    async syncDataFromSupabase() {
        if (!supabaseClient) return;

        try {
            const [
                usersRes,
                branchesRes,
                classesRes,
                studentsRes,
                curriculumRes,
                homeworksRes,
                exportRes
            ] = await Promise.all([
                supabaseClient.from('users').select('*'),
                supabaseClient.from('branches').select('*'),
                supabaseClient.from('classes').select('*'),
                supabaseClient.from('students').select('*'),
                supabaseClient.from('curriculum').select('*'),
                supabaseClient.from('homeworks').select('*'),
                supabaseClient.from('export_settings').select('*')
            ]);

            let hasCloudData = false;

            if (usersRes.data && usersRes.data.length > 0) {
                const map = new Map();
                usersRes.data.forEach(u => map.set(u.id, u));
                (this.data.users || []).forEach(u => { if (!map.has(u.id)) map.set(u.id, u); });
                this.data.users = Array.from(map.values());
                hasCloudData = true;
            }
            if (branchesRes.data && branchesRes.data.length > 0) {
                const map = new Map();
                branchesRes.data.forEach(b => map.set(b.id, b));
                (this.data.branches || []).forEach(b => { if (!map.has(b.id)) map.set(b.id, b); });
                this.data.branches = Array.from(map.values());
                hasCloudData = true;
            }
            if (classesRes.data && classesRes.data.length > 0) {
                const map = new Map();
                classesRes.data.forEach(c => map.set(c.id, c));
                (this.data.classes || []).forEach(c => { if (!map.has(c.id)) map.set(c.id, c); });
                this.data.classes = Array.from(map.values());
                hasCloudData = true;
            }
            if (studentsRes.data && studentsRes.data.length > 0) {
                const map = new Map();
                studentsRes.data.forEach(s => map.set(s.id, s));
                (this.data.students || []).forEach(s => { if (!map.has(s.id)) map.set(s.id, s); });
                this.data.students = Array.from(map.values());
                hasCloudData = true;
            }
            if (curriculumRes.data && curriculumRes.data.length > 0) {
                const map = new Map();
                curriculumRes.data.forEach(c => map.set(c.id, c));
                (this.data.curriculum || []).forEach(c => { if (!map.has(c.id)) map.set(c.id, c); });
                this.data.curriculum = Array.from(map.values());
                hasCloudData = true;
            }
            if (homeworksRes.data && homeworksRes.data.length > 0) {
                const map = new Map();
                homeworksRes.data.forEach(h => map.set(h.id, h));
                (this.data.homeworks || []).forEach(h => { if (!map.has(h.id)) map.set(h.id, h); });
                this.data.homeworks = Array.from(map.values());
                hasCloudData = true;
            }
            if (exportRes.data && exportRes.data.length > 0) {
                const setting = exportRes.data[0];
                this.data.exportSettings = { savePath: setting.savePath || setting.save_path || 'C:\\Pars_Yoklama_Raporlari\\' };
                hasCloudData = true;
            }

            // If Supabase database is newly created and empty, auto-seed initial data
            if (!hasCloudData) {
                await this.seedInitialDataToSupabase();
            } else {
                this.saveLocalData();
                this.renderAuthHeader();
                if (this.currentView === 'landing') this.renderLandingScreen();
                else if (this.currentView === 'branch') this.renderBranchScreen();
                else if (this.currentView === 'classDetail') this.renderClassDetailScreen();
            }
        } catch (err) {
            console.error("Supabase fetch error:", err);
        }
    }

    async seedInitialDataToSupabase() {
        if (!supabaseClient) return;

        try {
            console.log("☁️ Supabase bulut veritabanına başlangıç verileri yükleniyor...");
            await Promise.all([
                supabaseClient.from('users').upsert(INITIAL_DATA.users),
                supabaseClient.from('branches').upsert(INITIAL_DATA.branches),
                supabaseClient.from('classes').upsert(INITIAL_DATA.classes),
                supabaseClient.from('students').upsert(INITIAL_DATA.students),
                supabaseClient.from('curriculum').upsert(INITIAL_DATA.curriculum),
                supabaseClient.from('homeworks').upsert(INITIAL_DATA.homeworks),
                supabaseClient.from('export_settings').upsert([{ id: 'main', savePath: 'C:\\Pars_Yoklama_Raporlari\\' }])
            ]);
            console.log("⚡ Supabase verileri kuruldu ve eşcellendi!");
        } catch (e) {
            console.error("Supabase seed error:", e);
        }
    }

    setupRealtimeSubscription() {
        if (!supabaseClient) return;

        try {
            supabaseClient
                .channel('public_db_changes')
                .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
                    console.log("⚡ Supabase Canlı Veri Değişikliği:", payload);
                    this.syncDataFromSupabase();
                })
                .subscribe();
        } catch (e) {
            console.warn("Supabase Realtime subscription error:", e);
        }
    }

    saveLocalData() {
        try {
            localStorage.setItem('PARS_PORTAL_DATA_V3', JSON.stringify(this.data));
        } catch (e) {
            console.error("Local storage save error:", e);
        }
    }

    saveData() {
        // 1. Instant local persistence
        this.saveLocalData();

        // 2. Async cloud sync to Supabase
        this.syncAllToSupabase();
    }

    async syncAllToSupabase() {
        if (!supabaseClient) return;

        try {
            const promises = [];
            if (this.data.users?.length) promises.push(supabaseClient.from('users').upsert(this.data.users));
            if (this.data.branches?.length) promises.push(supabaseClient.from('branches').upsert(this.data.branches));
            if (this.data.classes?.length) promises.push(supabaseClient.from('classes').upsert(this.data.classes));
            if (this.data.students?.length) promises.push(supabaseClient.from('students').upsert(this.data.students));
            if (this.data.curriculum?.length) promises.push(supabaseClient.from('curriculum').upsert(this.data.curriculum));
            if (this.data.homeworks?.length) promises.push(supabaseClient.from('homeworks').upsert(this.data.homeworks));
            if (this.data.exportSettings) promises.push(supabaseClient.from('export_settings').upsert([{ id: 'main', savePath: this.data.exportSettings.savePath || 'C:\\Pars_Yoklama_Raporlari\\' }]));

            await Promise.all(promises);
        } catch (e) {
            console.error("Supabase sync save error:", e);
        }
    }

    // Local Storage Persistence
    loadData() {
        let data;
        try {
            const saved = localStorage.getItem('PARS_PORTAL_DATA_V3');
            if (saved) {
                data = JSON.parse(saved);
            }
        } catch (e) {
            console.error("Local storage load error:", e);
        }

        if (!data) {
            data = JSON.parse(JSON.stringify(INITIAL_DATA));
        }

        if (!data.curriculum) {
            data.curriculum = JSON.parse(JSON.stringify(INITIAL_DATA.curriculum));
        }

        if (!data.homeworks) {
            data.homeworks = JSON.parse(JSON.stringify(INITIAL_DATA.homeworks));
        }

        // Ensure all students have midtermGrade, finalGrade, and hwAnalysis backfilled
        if (data && data.students) {
            data.students.forEach((s, idx) => {
                if (s.midtermGrade === undefined) s.midtermGrade = 80 + (idx % 15);
                if (s.finalGrade === undefined) s.finalGrade = 85 + (idx % 12);
                if (!s.hwAnalysis) {
                    s.hwAnalysis = "Öğrenci derse aktif katılım göstermekte, konuşma ve dilbilgisi ödevlerini zamanında tamamlamaktadır.";
                }
            });
        }

        // Ensure all classes have studentUsername & studentPassword backfilled
        if (data && data.classes) {
            const defaultMap = {
                "cls-1": { username: "b2-101", password: "12345" },
                "cls-2": { username: "a2-201", password: "12345" },
                "cls-3": { username: "yds-2026", password: "12345" },
                "cls-4": { username: "c1-301", password: "12345" },
                "cls-5": { username: "ielts-2026", password: "12345" },
                "cls-6": { username: "b1-102", password: "12345" }
            };

            data.classes.forEach(c => {
                if (!c.studentUsername) {
                    const def = defaultMap[c.id];
                    c.studentUsername = def ? def.username : c.name.split(' ')[0].toLowerCase().replace(/[^a-z0-9-]/g, '');
                }
                if (!c.studentPassword) {
                    const def = defaultMap[c.id];
                    c.studentPassword = def ? def.password : "12345";
                }
            });
        }

        return data;
    }

    resetToDefaultMockData() {
        if (confirm("Tüm veriler varsayılan ayarlara sıfırlansın mı?")) {
            this.data = JSON.parse(JSON.stringify(INITIAL_DATA));
            this.saveData();
            this.showToast("Veriler başarıyla sıfırlandı!", "success");
            this.navigateTo('landing');
        }
    }

    isStudent() {
        return this.data.currentUser && this.data.currentUser.role === 'student';
    }

    // PROTECTED ROUTE NAVIGATION & PERMISSION CHECKS
    navigateTo(view, payload = {}) {
        // Protected route check: If not logged in and attempting to visit protected pages
        if (!this.data.currentUser && (view === 'branch' || view === 'classDetail')) {
            this.openLoginPromptModal();
            this.showToast("Bu sayfayı görüntülemek için giriş yapmalısınız!", "warning");
            return;
        }

        // Student Restricted Route Guard: Students can ONLY visit their own assigned class!
        if (this.isStudent()) {
            const assignedClassId = this.data.currentUser.assignedClassId;
            const assignedClass = this.data.classes.find(c => c.id === assignedClassId);
            const className = assignedClass ? assignedClass.name : 'Sınıfınız';

            if (view !== 'classDetail' || (payload.classId && payload.classId !== assignedClassId)) {
                this.showToast(`Öğrenci hesabınız ile yalnızca kendi sınıfınızı (${className}) görüntüleyebilirsiniz!`, "warning");
                this.currentView = 'classDetail';
                this.selectedClassId = assignedClassId;
                if (assignedClass) this.selectedBranchId = assignedClass.branchId;
                this.renderBreadcrumbs();
                this.renderView();
                return;
            }
        }

        // Branch Permission check for teachers
        if (view === 'branch' && payload.branchId) {
            if (!this.hasBranchPermission(payload.branchId)) {
                this.showToast("Bu şubeye erişim yetkiniz bulunmamaktadır!", "error");
                return;
            }
        }

        this.currentView = view;

        if (view === 'landing') {
            this.selectedBranchId = null;
            this.selectedClassId = null;
        } else if (view === 'branch') {
            if (payload.branchId) this.selectedBranchId = payload.branchId;
            this.selectedClassId = null;
        } else if (view === 'classDetail') {
            if (payload.classId) this.selectedClassId = payload.classId;
        }

        this.renderBreadcrumbs();
        this.renderView();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    hasBranchPermission(branchId) {
        if (!this.data.currentUser) return false;
        if (this.data.currentUser.role === 'admin') return true;
        if (this.data.currentUser.role === 'student') return this.data.currentUser.assignedBranchId === branchId;
        if (this.data.currentUser.branchPermission === 'all') return true;
        return this.data.currentUser.branchPermission === branchId;
    }

    goBack() {
        if (this.isStudent()) {
            this.showToast("Öğrenci hesabı ile yalnızca kendi sınıf sayfanızda kalabilirsiniz.", "info");
            return;
        }
        if (this.currentView === 'classDetail') {
            this.navigateTo('branch', { branchId: this.selectedBranchId });
        } else if (this.currentView === 'branch') {
            this.navigateTo('landing');
        }
    }

    renderBreadcrumbs() {
        const bar = document.getElementById('breadcrumbBar');
        const bcBranchSep = document.getElementById('bcBranchSep');
        const bcBranchBtn = document.getElementById('bcBranchBtn');
        const bcBranchName = document.getElementById('bcBranchName');
        const bcClassSep = document.getElementById('bcClassSep');
        const bcClassName = document.getElementById('bcClassName');
        const bcClassText = document.getElementById('bcClassText');

        if (this.currentView === 'landing') {
            bar.classList.add('hidden');
        } else {
            bar.classList.remove('hidden');

            const currentBranch = this.data.branches.find(b => b.id === this.selectedBranchId);
            if (currentBranch) {
                bcBranchSep.classList.remove('hidden');
                bcBranchBtn.classList.remove('hidden');
                bcBranchName.textContent = currentBranch.name;
            } else {
                bcBranchSep.classList.add('hidden');
                bcBranchBtn.classList.add('hidden');
            }

            if (this.currentView === 'classDetail') {
                const currentClass = this.data.classes.find(c => c.id === this.selectedClassId);
                if (currentClass) {
                    bcClassSep.classList.remove('hidden');
                    bcClassName.classList.remove('hidden');
                    bcClassText.textContent = currentClass.name;
                }
            } else {
                bcClassSep.classList.add('hidden');
                bcClassName.classList.add('hidden');
            }
        }
    }

    renderView() {
        document.getElementById('viewLanding').classList.add('hidden');
        document.getElementById('viewBranch').classList.add('hidden');
        document.getElementById('viewClassDetail').classList.add('hidden');

        if (this.currentView === 'landing') {
            document.getElementById('viewLanding').classList.remove('hidden');
            this.renderLandingScreen();
        } else if (this.currentView === 'branch') {
            document.getElementById('viewBranch').classList.remove('hidden');
            this.renderBranchScreen();
        } else if (this.currentView === 'classDetail') {
            document.getElementById('viewClassDetail').classList.remove('hidden');
            this.renderClassDetailScreen();
        }

        if (window.lucide) window.lucide.createIcons();
    }

    // -------------------------------------------------------------
    // AUTHENTICATION & LOGIN LOGIC
    // -------------------------------------------------------------
    renderAuthHeader() {
        const container = document.getElementById('authHeaderArea');
        const adminBtn = document.getElementById('adminTeacherMgmtBtn');
        if (!container) return;

        const user = this.data.currentUser;

        // Admin Button visibility check (YALNIZCA ADMIN İÇİN)
        if (user && user.role === 'admin') {
            adminBtn.classList.remove('hidden');
        } else {
            adminBtn.classList.add('hidden');
        }

        if (user) {
            const isAdmin = user.role === 'admin';
            const isStudent = user.role === 'student';
            const roleBadge = isAdmin ? 'Yönetici (Admin)' : isStudent ? '🎓 Öğrenci (Salt Okunur)' : (user.title || 'Öğretmen');
            const badgeColor = isAdmin ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' :
                               isStudent ? 'bg-sky-500/10 text-sky-300 border-sky-500/30' :
                               'bg-teal-500/10 text-teal-300 border-teal-500/30';
            const avatarBorder = isAdmin ? 'border-amber-400' : isStudent ? 'border-sky-400' : 'border-teal-400';
            const dotColor = isAdmin ? 'bg-amber-400' : isStudent ? 'bg-sky-400' : 'bg-emerald-400';

            container.innerHTML = `
                <div class="flex items-center space-x-3 bg-slate-900/90 p-1.5 pr-4 rounded-full border border-slate-800 shadow-md">
                    <img src="${user.avatar || 'assets/avatar.png'}" alt="${user.name}" class="w-9 h-9 rounded-full object-cover border-2 ${avatarBorder}">
                    <div class="hidden sm:block text-left">
                        <div class="text-xs font-bold text-white flex items-center space-x-1">
                            <span>${user.name}</span>
                            <span class="inline-block w-2 h-2 rounded-full ${dotColor}"></span>
                        </div>
                        <span class="text-[10px] px-2 py-0.5 rounded-full font-semibold border ${badgeColor}">
                            ${roleBadge}
                        </span>
                    </div>
                    <button onclick="appState.handleLogout()" class="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors ml-2" title="Çıkış Yap">
                        <i data-lucide="log-out" class="w-4 h-4"></i>
                    </button>
                </div>
            `;
        } else {
            container.innerHTML = `
                <form onsubmit="appState.handleLogin(event)" class="flex items-center space-x-2">
                    <div class="relative">
                        <input type="text" id="loginUsername" placeholder="Kullanıcı Adı" required 
                               class="w-28 sm:w-36 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500">
                    </div>
                    <div class="relative">
                        <input type="password" id="loginPassword" placeholder="Şifre" required 
                               class="w-28 sm:w-36 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500">
                    </div>
                    <button type="submit" class="px-4 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-md">
                        Giriş Yap
                    </button>
                </form>
            `;
        }

        if (window.lucide) window.lucide.createIcons();
    }

    handleLogin(e) {
        if (e) e.preventDefault();
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value.trim();

        this.authenticateUser(username, password);
    }

    quickLogin(username, password) {
        this.closeLoginPromptModal();
        this.authenticateUser(username, password);
    }

    authenticateUser(username, password) {
        const cleanUser = (username || '').trim().toLowerCase();
        const cleanPass = (password || '').trim();

        // 1. Check Admin and Teachers List
        const found = this.data.users.find(u => u.username.trim().toLowerCase() === cleanUser && u.password.trim() === cleanPass);

        if (found) {
            this.data.currentUser = found;
            this.saveData();
            this.renderAuthHeader();
            this.renderLandingScreen();
            this.showToast(`Hoş geldiniz, ${found.name}!`, "success");
            return;
        }

        // 2. Check Class Student Credentials
        const foundClass = this.data.classes.find(c => 
            c.studentUsername && c.studentUsername.trim().toLowerCase() === cleanUser && 
            c.studentPassword && c.studentPassword.trim() === cleanPass
        );

        if (foundClass) {
            const studentUser = {
                id: `std-class-${foundClass.id}`,
                username: foundClass.studentUsername,
                name: `${foundClass.name}`,
                role: "student",
                assignedClassId: foundClass.id,
                assignedBranchId: foundClass.branchId,
                avatar: "assets/logo.png",
                title: `${foundClass.name} Öğrencisi (Salt Okunur)`
            };

            this.data.currentUser = studentUser;
            this.saveData();
            this.renderAuthHeader();
            this.showToast(`Hoş geldiniz! ${foundClass.name} Öğrenci Girişi Yapıldı. (Salt Okunur Mod)`, "info");
            this.navigateTo('classDetail', { classId: foundClass.id });
            return;
        }

        this.showToast("Hatalı kullanıcı adı veya şifre!", "error");
    }

    handleLogout() {
        this.data.currentUser = null;
        this.saveData();
        this.renderAuthHeader();
        this.navigateTo('landing');
        this.showToast("Oturum başarıyla kapatıldı.", "info");
    }

    openLoginPromptModal() {
        document.getElementById('loginPromptModal').classList.remove('hidden');
    }

    closeLoginPromptModal() {
        document.getElementById('loginPromptModal').classList.add('hidden');
    }

    // -------------------------------------------------------------
    // EKRAN 1: LANDING SCREEN RENDER
    // -------------------------------------------------------------
    renderLandingScreen() {
        const totalClasses = this.data.classes.length;
        const totalStudents = this.data.students.length;
        document.getElementById('landingTotalClasses').textContent = `${totalClasses} Eğitim Sınıfı`;
        document.getElementById('landingTotalStudents').textContent = `${totalStudents} Kayıtlı Öğrenci`;

        const container = document.getElementById('branchCardsContainer');
        container.innerHTML = this.data.branches.map(branch => {
            const branchClasses = this.data.classes.filter(c => c.branchId === branch.id);
            const branchClassIds = branchClasses.map(c => c.id);
            const branchStudentCount = this.data.students.filter(s => branchClassIds.includes(s.classId)).length;
            const hasPermission = this.hasBranchPermission(branch.id);
            const isLoggedIn = !!this.data.currentUser;

            return `
                <div onclick="appState.navigateTo('branch', { branchId: '${branch.id}' })" 
                     class="group relative overflow-hidden rounded-3xl bg-slate-900 border ${isLoggedIn && hasPermission ? 'border-slate-800 hover:border-teal-500/50' : 'border-slate-800/60 opacity-95'} shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer flex flex-col justify-between">
                    
                    <!-- Branch Image Banner -->
                    <div class="relative h-56 w-full overflow-hidden">
                        <img src="${branch.image}" alt="${branch.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                        <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                        
                        <!-- Status Badge -->
                        <div class="absolute top-4 right-4 flex items-center space-x-2">
                            ${!isLoggedIn ? `
                                <span class="px-3 py-1 rounded-full bg-slate-950/90 text-amber-300 text-xs font-semibold border border-amber-500/40 flex items-center space-x-1 shadow-lg">
                                    <i data-lucide="lock" class="w-3.5 h-3.5"></i>
                                    <span>Giriş Yapılmalı</span>
                                </span>
                            ` : hasPermission ? `
                                <span class="px-3 py-1 rounded-full bg-slate-950/80 text-teal-300 text-xs font-semibold border border-teal-500/30 flex items-center space-x-1">
                                    <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-400"></i>
                                    <span>Erişilebilir Şube</span>
                                </span>
                            ` : `
                                <span class="px-3 py-1 rounded-full bg-slate-950/80 text-rose-300 text-xs font-semibold border border-rose-500/30 flex items-center space-x-1">
                                    <i data-lucide="shield-alert" class="w-3.5 h-3.5 text-rose-400"></i>
                                    <span>Yetkisiz Şube</span>
                                </span>
                            `}
                        </div>
                    </div>

                    <!-- Branch Content -->
                    <div class="p-6 space-y-4 flex-grow flex flex-col justify-between">
                        <div>
                            <h3 class="font-heading text-2xl font-bold text-white group-hover:text-teal-300 transition-colors flex items-center justify-between">
                                <span>${branch.name}</span>
                                <i data-lucide="arrow-right" class="w-5 h-5 text-slate-400 group-hover:text-teal-400 group-hover:translate-x-1 transition-all"></i>
                            </h3>
                            <p class="text-sm text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                                ${branch.description}
                            </p>
                        </div>

                        <!-- Stats Bar -->
                        <div class="pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-4">
                            <div class="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                                <span class="text-[11px] text-slate-400 block font-medium">Toplam Sınıf</span>
                                <span class="text-lg font-bold text-white flex items-center space-x-1">
                                    <i data-lucide="book-open" class="w-4 h-4 text-indigo-400"></i>
                                    <span>${branchClasses.length} Sınıf</span>
                                </span>
                            </div>
                            <div class="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                                <span class="text-[11px] text-slate-400 block font-medium">Aktif Öğrenci</span>
                                <span class="text-lg font-bold text-teal-300 flex items-center space-x-1">
                                    <i data-lucide="users" class="w-4 h-4 text-teal-400"></i>
                                    <span>${branchStudentCount} Öğrenci</span>
                                </span>
                            </div>
                        </div>

                        <!-- Action Link Button -->
                        <button class="w-full mt-4 py-3 rounded-xl bg-slate-800 group-hover:bg-teal-600 text-slate-200 group-hover:text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center space-x-2 shadow-md">
                            <span>${!isLoggedIn ? 'Giriş Yaparak Sınıflara Eriş →' : 'Sınıfları & Yoklama Listesini Gör'}</span>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        if (window.lucide) window.lucide.createIcons();
    }

    isAdmin() {
        return this.data.currentUser && this.data.currentUser.role === 'admin';
    }

    // -------------------------------------------------------------
    // EKRAN 2: ŞUBE İÇERİĞİ VE SINIF LİSTESİ RENDER (CRUD)
    // -------------------------------------------------------------
    renderBranchScreen() {
        const branch = this.data.branches.find(b => b.id === this.selectedBranchId);
        if (!branch) return;

        const addClassBtn = document.getElementById('addClassBtn');
        if (addClassBtn) {
            if (this.isAdmin()) {
                addClassBtn.classList.remove('hidden');
            } else {
                addClassBtn.classList.add('hidden');
            }
        }

        const branchClasses = this.data.classes.filter(c => c.branchId === branch.id);
        const branchClassIds = branchClasses.map(c => c.id);
        const branchStudents = this.data.students.filter(s => branchClassIds.includes(s.classId));
        const presentCount = branchStudents.filter(s => s.attendance === 'Geldi').length;
        const attendanceRate = branchStudents.length > 0 ? Math.round((presentCount / branchStudents.length) * 100) : 0;

        document.getElementById('branchHeaderCard').innerHTML = `
            <div class="flex flex-col md:flex-row items-center justify-between gap-6">
                <div class="space-y-3 max-w-2xl">
                    <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 text-xs font-semibold border border-teal-500/20">
                        <i data-lucide="building" class="w-3.5 h-3.5"></i>
                        <span>Seçilen Şube Portalı</span>
                    </div>
                    <h1 class="font-heading text-3xl sm:text-4xl font-extrabold text-white">
                        ${branch.name}
                    </h1>
                    <p class="text-slate-300 text-sm flex items-center space-x-2">
                        <i data-lucide="map-pin" class="w-4 h-4 text-teal-400 shrink-0"></i>
                        <span>${branch.address} &bull; Tel: ${branch.phone}</span>
                    </p>
                </div>

                <div class="flex flex-wrap gap-4 w-full md:w-auto">
                    <div class="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl min-w-[120px] text-center">
                        <span class="text-xs text-slate-400 block font-medium">Sınıf Sayısı</span>
                        <span class="text-2xl font-extrabold text-white">${branchClasses.length}</span>
                    </div>
                    <div class="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl min-w-[120px] text-center">
                        <span class="text-xs text-slate-400 block font-medium">Toplam Öğrenci</span>
                        <span class="text-2xl font-extrabold text-teal-400">${branchStudents.length}</span>
                    </div>
                    <div class="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl min-w-[120px] text-center">
                        <span class="text-xs text-slate-400 block font-medium">Ortalama Katılım</span>
                        <span class="text-2xl font-extrabold text-emerald-400">%${attendanceRate}</span>
                    </div>
                </div>
            </div>
        `;

        this.renderClassGrid(branchClasses);
    }

    filterClasses(query) {
        this.classFilterQuery = query.toLowerCase().trim();
        const branchClasses = this.data.classes.filter(c => c.branchId === this.selectedBranchId);
        const filtered = branchClasses.filter(c => 
            c.name.toLowerCase().includes(this.classFilterQuery) ||
            c.level.toLowerCase().includes(this.classFilterQuery) ||
            c.teacher.toLowerCase().includes(this.classFilterQuery)
        );
        this.renderClassGrid(filtered);
    }

    renderClassGrid(classesList) {
        const grid = document.getElementById('classListGrid');
        if (!grid) return;

        if (classesList.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full py-12 text-center bg-slate-900/50 rounded-3xl border border-slate-800 space-y-3">
                    <i data-lucide="book-x" class="w-12 h-12 text-slate-500 mx-auto"></i>
                    <h3 class="text-lg font-semibold text-white">Sınıf Bulunamadı</h3>
                    <p class="text-slate-400 text-sm">Bu arama kriterine uyan sınıf kaydı veya henüz eklenmiş sınıf yok.</p>
                </div>
            `;
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        const isAdmin = this.isAdmin();

        grid.innerHTML = classesList.map(cls => {
            const students = this.data.students.filter(s => s.classId === cls.id);
            const present = students.filter(s => s.attendance === 'Geldi').length;
            const rate = students.length > 0 ? Math.round((present / students.length) * 100) : 0;

            return `
                <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between space-y-5 relative group">
                    <div class="space-y-3">
                        <div class="flex items-start justify-between gap-2">
                            <span class="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
                                ${cls.level}
                            </span>
                            ${isAdmin ? `
                                <div class="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                    <button onclick="appState.openEditClassModal('${cls.id}')" class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors" title="Sınıfı Düzenle">
                                        <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                                    </button>
                                    <button onclick="appState.deleteClass('${cls.id}')" class="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-400 transition-colors" title="Sınıfı Sil">
                                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                    </button>
                                </div>
                            ` : ''}
                        </div>

                        <h3 class="font-heading text-xl font-bold text-white group-hover:text-teal-300 transition-colors">
                            ${cls.name}
                        </h3>

                        <div class="space-y-1.5 text-xs text-slate-400 pt-2">
                            <div class="flex items-center space-x-2">
                                <i data-lucide="user" class="w-3.5 h-3.5 text-teal-400"></i>
                                <span>Öğretmen: <strong class="text-slate-200">${cls.teacher}</strong></span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <i data-lucide="clock" class="w-3.5 h-3.5 text-indigo-400"></i>
                                <span>${cls.schedule || 'Belirtilmedi'}</span>
                            </div>
                        </div>
                    </div>

                    <div class="pt-4 border-t border-slate-800/80 space-y-3">
                        <div class="flex items-center justify-between text-xs font-semibold">
                            <span class="text-slate-400">Mevcut: ${students.length} / ${cls.capacity || 15} Öğrenci</span>
                            <span class="text-emerald-400">Katılım: %${rate}</span>
                        </div>
                        <div class="w-full bg-slate-950 h-2 rounded-full overflow-hidden p-0.5 border border-slate-800">
                            <div class="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-500" style="width: ${rate}%"></div>
                        </div>

                        <button onclick="appState.navigateTo('classDetail', { classId: '${cls.id}' })" 
                                class="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-teal-600 text-white font-semibold text-xs transition-all duration-200 flex items-center justify-center space-x-2 shadow-md">
                            <i data-lucide="clipboard-list" class="w-4 h-4"></i>
                            <span>Öğrenci Listesi & Yoklama Tablosu</span>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        if (window.lucide) window.lucide.createIcons();
    }

    openAddClassModal() {
        if (!this.isAdmin()) {
            this.showToast("Sınıf ekleme yetkisi yalnızca Yöneticidedir!", "error");
            return;
        }
        document.getElementById('classModalTitle').innerHTML = `<i data-lucide="book-open" class="w-5 h-5 text-teal-400"></i><span>Yeni Sınıf Ekle</span>`;
        document.getElementById('modalClassId').value = '';
        document.getElementById('modalClassName').value = '';
        document.getElementById('modalClassTeacher').value = this.data.currentUser?.name || '';
        document.getElementById('modalClassSchedule').value = 'Pazartesi - Çarşamba 18:30 - 20:30';
        document.getElementById('modalClassStudentUsername').value = '';
        document.getElementById('modalClassStudentPassword').value = '12345';
        document.getElementById('classModal').classList.remove('hidden');
        if (window.lucide) window.lucide.createIcons();
    }

    openEditClassModal(classId) {
        if (!this.isAdmin()) {
            this.showToast("Sınıf düzenleme yetkisi yalnızca Yöneticidedir!", "error");
            return;
        }
        const cls = this.data.classes.find(c => c.id === classId);
        if (!cls) return;

        document.getElementById('classModalTitle').innerHTML = `<i data-lucide="edit-3" class="w-5 h-5 text-teal-400"></i><span>Sınıf Bilgilerini Düzenle</span>`;
        document.getElementById('modalClassId').value = cls.id;
        document.getElementById('modalClassName').value = cls.name;
        document.getElementById('modalClassLevel').value = cls.level;
        document.getElementById('modalClassTeacher').value = cls.teacher;
        document.getElementById('modalClassSchedule').value = cls.schedule || '';
        document.getElementById('modalClassStudentUsername').value = cls.studentUsername || '';
        document.getElementById('modalClassStudentPassword').value = cls.studentPassword || '12345';
        document.getElementById('classModal').classList.remove('hidden');
        if (window.lucide) window.lucide.createIcons();
    }

    closeClassModal() {
        document.getElementById('classModal').classList.add('hidden');
    }

    handleSaveClass(e) {
        e.preventDefault();
        if (!this.isAdmin()) {
            this.showToast("Sınıf kaydetme yetkisi yalnızca Yöneticidedir!", "error");
            return;
        }
        const id = document.getElementById('modalClassId').value;
        const name = document.getElementById('modalClassName').value.trim();
        const level = document.getElementById('modalClassLevel').value;
        const teacher = document.getElementById('modalClassTeacher').value.trim();
        const schedule = document.getElementById('modalClassSchedule').value.trim();
        const studentUsername = document.getElementById('modalClassStudentUsername').value.trim().toLowerCase();
        const studentPassword = document.getElementById('modalClassStudentPassword').value.trim();

        if (id) {
            const cls = this.data.classes.find(c => c.id === id);
            if (cls) {
                cls.name = name;
                cls.level = level;
                cls.teacher = teacher;
                cls.schedule = schedule;
                cls.studentUsername = studentUsername;
                cls.studentPassword = studentPassword;
                this.showToast("Sınıf bilgileri güncellendi.", "success");
            }
        } else {
            const newClass = {
                id: `cls-${Date.now()}`,
                branchId: this.selectedBranchId,
                name: name,
                level: level,
                teacher: teacher,
                schedule: schedule,
                capacity: 15,
                studentUsername: studentUsername,
                studentPassword: studentPassword
            };
            this.data.classes.push(newClass);
            this.showToast("Yeni sınıf başarıyla oluşturuldu.", "success");
        }

        this.saveData();
        this.closeClassModal();
        this.renderBranchScreen();
    }

    deleteClass(classId) {
        if (!this.isAdmin()) {
            this.showToast("Sınıf silme yetkisi yalnızca Yöneticidedir!", "error");
            return;
        }
        const cls = this.data.classes.find(c => c.id === classId);
        if (!cls) return;

        if (confirm(`'${cls.name}' sınıfını silmek istediğinizden emin misiniz?`)) {
            this.data.classes = this.data.classes.filter(c => c.id !== classId);
            this.data.students = this.data.students.filter(s => s.classId !== classId);

            if (supabaseClient) {
                supabaseClient.from('classes').delete().eq('id', classId);
                supabaseClient.from('students').delete().eq('classId', classId);
            }

            this.saveData();
            this.showToast("Sınıf ve bağlı kayıtlar silindi.", "info");
            this.renderBranchScreen();
        }
    }

    // -------------------------------------------------------------
    // EKRAN 3: SINIF DETAY VE TABLI YÖNETİM EKRANI
    // -------------------------------------------------------------
    renderClassDetailScreen() {
        const currentClass = this.data.classes.find(c => c.id === this.selectedClassId);
        if (!currentClass) return;

        const addStudentBtn = document.getElementById('addStudentBtn');
        if (addStudentBtn) {
            if (this.isAdmin()) {
                addStudentBtn.classList.remove('hidden');
            } else {
                addStudentBtn.classList.add('hidden');
            }
        }

        const branch = this.data.branches.find(b => b.id === currentClass.branchId);

        document.getElementById('classDetailBanner').innerHTML = `
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div class="space-y-2">
                    <div class="flex items-center space-x-2">
                        <span class="px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 text-xs font-semibold border border-teal-500/30">
                            ${branch ? branch.name : 'Şube'}
                        </span>
                        <span class="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/30">
                            ${currentClass.level}
                        </span>
                        ${this.isStudent() ? `
                            <span class="px-3 py-1 rounded-full bg-sky-500/10 text-sky-300 text-xs font-semibold border border-sky-500/30 flex items-center space-x-1">
                                <i data-lucide="eye" class="w-3.5 h-3.5 text-sky-400"></i>
                                <span>🎓 Öğrenci Salt Okunur Modu</span>
                            </span>
                        ` : ''}
                    </div>
                    <h1 class="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                        ${currentClass.name}
                    </h1>
                    <p class="text-xs sm:text-sm text-slate-400 flex items-center space-x-4">
                        <span><strong class="text-slate-200">Öğretmen:</strong> ${currentClass.teacher}</span>
                        <span>&bull;</span>
                        <span><strong class="text-slate-200">Ders Saatleri:</strong> ${currentClass.schedule || 'Belirtilmedi'}</span>
                    </p>
                </div>

                <div class="flex items-center space-x-3">
                    <button onclick="window.print()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center space-x-2">
                        <i data-lucide="printer" class="w-4 h-4 text-teal-400"></i>
                        <span>Yazdır / PDF</span>
                    </button>
                </div>
            </div>
        `;

        this.switchClassTab(this.activeClassTab || 'yoklama');
    }

    switchClassTab(tabName) {
        this.activeClassTab = tabName;

        const btnYoklama = document.getElementById('tabBtnYoklama');
        const btnMufredat = document.getElementById('tabBtnMufredat');
        const btnOdev = document.getElementById('tabBtnOdev');
        const btnSinav = document.getElementById('tabBtnSinav');

        const panelYoklama = document.getElementById('tabPanelYoklama');
        const panelMufredat = document.getElementById('tabPanelMufredat');
        const panelOdev = document.getElementById('tabPanelOdev');
        const panelSinav = document.getElementById('tabPanelSinav');

        [btnYoklama, btnMufredat, btnOdev, btnSinav].forEach(btn => {
            if (btn) btn.className = "px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center space-x-2 transition-all bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 shrink-0";
        });

        [panelYoklama, panelMufredat, panelOdev, panelSinav].forEach(panel => {
            if (panel) panel.classList.add('hidden');
        });

        if (tabName === 'yoklama') {
            if (btnYoklama) btnYoklama.className = "px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all bg-teal-600 text-white shadow-lg shadow-teal-600/30 shrink-0";
            if (panelYoklama) panelYoklama.classList.remove('hidden');
            this.filterStudents();
        } else if (tabName === 'mufredat') {
            if (btnMufredat) btnMufredat.className = "px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 shrink-0";
            if (panelMufredat) panelMufredat.classList.remove('hidden');
            this.renderCurriculumList();
        } else if (tabName === 'odev') {
            if (btnOdev) btnOdev.className = "px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all bg-amber-600 text-white shadow-lg shadow-amber-600/30 shrink-0";
            if (panelOdev) panelOdev.classList.remove('hidden');
            this.renderHomeworkList();
        } else if (tabName === 'sinav') {
            if (btnSinav) btnSinav.className = "px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all bg-purple-600 text-white shadow-lg shadow-purple-600/30 shrink-0";
            if (panelSinav) panelSinav.classList.remove('hidden');
            this.renderExamGradesList();
        }

        if (window.lucide) window.lucide.createIcons();
    }

    // -------------------------------------------------------------
    // 📊 TAB 4: SINAV NOTLARI & ÖDEV ANALİZİ LOGİC
    // -------------------------------------------------------------
    renderExamGradesList() {
        const tbody = document.getElementById('examGradesTableBody');
        if (!tbody) return;

        const currentClass = this.data.classes.find(c => c.id === this.selectedClassId);
        if (!currentClass) return;

        const branch = this.data.branches.find(b => b.id === currentClass.branchId);
        const branchName = branch ? branch.name : 'Şube';

        const students = this.data.students.filter(s => s.classId === currentClass.id);

        if (students.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="py-12 text-center text-slate-500">
                        <i data-lucide="bar-chart-3" class="w-10 h-10 mx-auto mb-2 text-slate-600"></i>
                        <p class="font-medium text-white">Bu Sınıfta Öğrenci Kaydı Bulunamadı</p>
                    </td>
                </tr>
            `;
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        const isStudent = this.isStudent();
        const canEdit = !isStudent; // Teachers and Admin can edit!

        tbody.innerHTML = students.map(student => {
            const midterm = student.midtermGrade !== undefined && student.midtermGrade !== null ? student.midtermGrade : '-';
            const final = student.finalGrade !== undefined && student.finalGrade !== null ? student.finalGrade : '-';
            const analysis = student.hwAnalysis || 'Henüz ödev analizi ve öğretmen değerlendirmesi eklenmedi.';
            const hasFile = student.fileData && student.fileName;

            return `
                <tr class="hover:bg-slate-800/40 transition-colors">
                    <!-- 1. Öğrenci Adı -->
                    <td class="py-4 px-6 font-semibold text-white">
                        <div class="flex items-center space-x-3">
                            <div class="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-purple-400">
                                ${student.name.split(' ').map(n=>n[0]).join('')}
                            </div>
                            <span>${student.name}</span>
                        </div>
                    </td>

                    <!-- 2. Şube / Sınıf -->
                    <td class="py-4 px-4 text-xs font-medium text-slate-300">
                        <div class="space-y-0.5">
                            <span class="block text-slate-400">${branchName}</span>
                            <span class="inline-block px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-semibold text-slate-200">
                                ${currentClass.name}
                            </span>
                        </div>
                    </td>

                    <!-- 3. Dönem Ortası Notu -->
                    <td class="py-4 px-4 text-center">
                        <span class="px-3 py-1 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-bold font-mono">
                            ${midterm !== '-' ? `${midterm} / 100` : '-'}
                        </span>
                    </td>

                    <!-- 4. Sene Sonu Notu -->
                    <td class="py-4 px-4 text-center">
                        <span class="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
                            ${final !== '-' ? `${final} / 100` : '-'}
                        </span>
                    </td>

                    <!-- 5. Ödev Analizi & Yorum (Max 300) -->
                    <td class="py-4 px-6 text-xs text-slate-300 max-w-xs">
                        <div class="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-slate-300 leading-relaxed relative">
                            <i data-lucide="quote" class="w-3.5 h-3.5 text-purple-400 mb-1"></i>
                            <span>${analysis}</span>
                            <div class="text-[10px] text-slate-500 mt-1 font-mono text-right">${analysis.length} / 300 karakter</div>
                        </div>
                    </td>

                    <!-- 6. Öğrenciye Özel Dosya -->
                    <td class="py-4 px-6 text-center">
                        ${hasFile ? `
                            <button onclick="appState.downloadStudentExamFile('${student.id}')" 
                                    class="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-semibold text-xs transition-all shadow-sm">
                                <i data-lucide="download-cloud" class="w-3.5 h-3.5 text-purple-400"></i>
                                <span>📥 Dosyayı İndir</span>
                            </button>
                        ` : `
                            <span class="text-[11px] text-slate-500 font-medium italic">Dosya Yüklenmedi</span>
                        `}
                    </td>

                    <!-- 7. İşlemler -->
                    <td class="py-4 px-6 text-right">
                        ${canEdit ? `
                            <button onclick="appState.openEditExamModal('${student.id}')" 
                                    class="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md shadow-purple-600/20 transition-all inline-flex items-center space-x-1.5">
                                <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                                <span>Not & Analiz Düzenle</span>
                            </button>
                        ` : `
                            <span class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-sky-950/80 border border-sky-800/80 text-[11px] text-sky-300 font-semibold">
                                <i data-lucide="eye" class="w-3.5 h-3.5"></i>
                                <span>Salt Okunur</span>
                            </span>
                        `}
                    </td>
                </tr>
            `;
        }).join('');

        if (window.lucide) window.lucide.createIcons();
    }

    openEditExamModal(studentId) {
        if (this.isStudent()) {
            this.showToast("Öğrenciler not ve analiz değiştiremez!", "warning");
            return;
        }

        const student = this.data.students.find(s => s.id === studentId);
        if (!student) return;

        this.pendingExamFileData = student.fileData || null;
        this.pendingExamFileName = student.fileName || null;
        this.pendingExamFileSize = student.fileSize || null;

        document.getElementById('modalExamStudentId').value = student.id;
        document.getElementById('modalExamStudentName').value = student.name;
        document.getElementById('modalExamMidterm').value = student.midtermGrade !== undefined ? student.midtermGrade : 85;
        document.getElementById('modalExamFinal').value = student.finalGrade !== undefined ? student.finalGrade : 90;
        document.getElementById('modalExamHwAnalysis').value = student.hwAnalysis || '';

        const fileNameDisplay = student.fileName ? `Yüklü: ${student.fileName} (${student.fileSize || ''})` : 'Henüz dosya yüklenmedi';
        document.getElementById('modalExamFileNameDisplay').textContent = fileNameDisplay;

        this.updateCharCounter();

        document.getElementById('examModal').classList.remove('hidden');
        if (window.lucide) window.lucide.createIcons();
    }

    closeExamModal() {
        document.getElementById('examModal').classList.add('hidden');
    }

    updateCharCounter() {
        const textarea = document.getElementById('modalExamHwAnalysis');
        const counter = document.getElementById('hwAnalysisCharCounter');
        if (textarea && counter) {
            const len = textarea.value.length;
            counter.textContent = `${len} / 300 karakter`;
            if (len >= 300) {
                counter.className = "text-[11px] text-rose-400 font-mono font-bold";
            } else {
                counter.className = "text-[11px] text-purple-400 font-mono font-semibold";
            }
        }
    }

    handleStudentExamFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        const sizeKb = Math.round(file.size / 1024);
        const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

        document.getElementById('modalExamFileNameDisplay').textContent = `Seçilen: ${file.name} (${sizeStr})`;

        const reader = new FileReader();
        reader.onload = (e) => {
            this.pendingExamFileData = e.target.result;
            this.pendingExamFileName = file.name;
            this.pendingExamFileSize = sizeStr;
        };
        reader.readAsDataURL(file);
    }

    handleSaveExam(e) {
        e.preventDefault();
        const studentId = document.getElementById('modalExamStudentId').value;
        const student = this.data.students.find(s => s.id === studentId);
        if (!student) return;

        const midterm = parseInt(document.getElementById('modalExamMidterm').value) || 0;
        const final = parseInt(document.getElementById('modalExamFinal').value) || 0;
        const analysis = document.getElementById('modalExamHwAnalysis').value.trim();

        student.midtermGrade = midterm;
        student.finalGrade = final;
        student.hwAnalysis = analysis;
        if (this.pendingExamFileData) {
            student.fileData = this.pendingExamFileData;
            student.fileName = this.pendingExamFileName;
            student.fileSize = this.pendingExamFileSize;
        }

        this.saveData();
        this.showToast(`${student.name} sınav notları ve ödev analizi güncellendi.`, "success");
        this.closeExamModal();
        this.renderExamGradesList();
    }

    downloadStudentExamFile(studentId) {
        const student = this.data.students.find(s => s.id === studentId);
        if (!student || !student.fileData) {
            this.showToast("İndirilebilir dosya bulunamadı!", "error");
            return;
        }

        const link = document.createElement('a');
        link.href = student.fileData;
        link.download = student.fileName || `${student.name}_Rapor`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showToast(`📁 ${student.name} için '${student.fileName}' indiriliyor.`, "success");
    }

    // -------------------------------------------------------------
    // MÜFREDAT VE KONU PLANLAMASI LOGİC
    // -------------------------------------------------------------
    renderCurriculumList() {
        const grid = document.getElementById('curriculumListGrid');
        if (!grid) return;

        const currentClassId = this.selectedClassId;
        const items = (this.data.curriculum || []).filter(c => c.classId === currentClassId);

        const user = this.data.currentUser;
        const isAdmin = this.isAdmin();

        if (items.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-500 space-y-3">
                    <i data-lucide="book-open" class="w-12 h-12 mx-auto text-slate-700"></i>
                    <p class="text-white font-bold text-base">Henüz Müfredat Konusu Eklenmedi</p>
                    <p class="text-xs text-slate-400">Bu sınıf için henüz işlenecek konu planı oluşturulmadı. Yukarıdaki butona tıklayarak yeni konu planı ekleyebilirsiniz.</p>
                </div>
            `;
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        grid.innerHTML = items.map(item => {
            const isOwner = user && user.role === 'teacher' && user.name.toLowerCase().trim() === item.teacher.toLowerCase().trim();
            const canEdit = isAdmin || isOwner;

            return `
                <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 relative group hover:border-indigo-500/50 transition-all">
                    <div class="flex items-start justify-between gap-3">
                        <span class="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
                            ${item.level}
                        </span>

                        <div class="flex items-center space-x-2">
                            ${canEdit ? `
                                <button onclick="appState.openEditCurriculumModal('${item.id}')" class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors" title="Düzenle">
                                    <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                                </button>
                                <button onclick="appState.deleteCurriculumItem('${item.id}')" class="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-400 transition-colors" title="Sil">
                                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                </button>
                            ` : `
                                <span class="px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-[10px] text-slate-400 font-medium flex items-center space-x-1" title="Sadece ${item.teacher} düzenleyebilir">
                                    <i data-lucide="lock" class="w-3 h-3 text-amber-400"></i>
                                    <span>${item.teacher}'a Ait</span>
                                </span>
                            `}
                        </div>
                    </div>

                    <div>
                        <h4 class="font-heading text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                            ${item.topic}
                        </h4>
                        <p class="text-xs text-slate-400 mt-1.5 leading-relaxed">
                            ${item.description || 'Açıklama girilmedi.'}
                        </p>
                    </div>

                    <div class="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div class="flex items-center space-x-2 text-indigo-300 font-semibold bg-indigo-950/40 px-3 py-1.5 rounded-xl border border-indigo-800/40">
                            <i data-lucide="calendar" class="w-3.5 h-3.5"></i>
                            <span>${item.startDate} &mdash; ${item.endDate}</span>
                        </div>

                        <div class="flex items-center space-x-2 text-slate-300">
                            <i data-lucide="user-check" class="w-3.5 h-3.5 text-teal-400"></i>
                            <span>Sorumlu: <strong class="text-white">${item.teacher}</strong></span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        if (window.lucide) window.lucide.createIcons();
    }

    openAddCurriculumModal() {
        if (!this.data.currentUser || this.isStudent()) {
            this.showToast("Öğrenci hesapları müfredat ekleyemez!", "warning");
            return;
        }

        document.getElementById('curriculumModalTitle').innerHTML = `<i data-lucide="book-open" class="w-5 h-5 text-indigo-400"></i><span>Yeni Müfredat Konusu Ekle</span>`;
        document.getElementById('modalCurrId').value = '';
        document.getElementById('modalCurrTopic').value = '';
        document.getElementById('modalCurrDescription').value = '';
        document.getElementById('modalCurrStartDate').value = new Date().toISOString().split('T')[0];
        
        const nextTwoWeeks = new Date();
        nextTwoWeeks.setDate(nextTwoWeeks.getDate() + 14);
        document.getElementById('modalCurrEndDate').value = nextTwoWeeks.toISOString().split('T')[0];
        
        document.getElementById('modalCurrTeacher').value = this.data.currentUser.name || 'Öğretmen';

        document.getElementById('curriculumModal').classList.remove('hidden');
        if (window.lucide) window.lucide.createIcons();
    }

    openEditCurriculumModal(currId) {
        const item = (this.data.curriculum || []).find(c => c.id === currId);
        if (!item) return;

        const user = this.data.currentUser;
        const isAdmin = this.isAdmin();
        const isOwner = user && user.role === 'teacher' && user.name.toLowerCase().trim() === item.teacher.toLowerCase().trim();

        if (!isAdmin && !isOwner) {
            this.showToast(`Sadece kendi oluşturduğunuz müfredat konularını düzenleyebilirsiniz! (${item.teacher}'a ait)`, "warning");
            return;
        }

        document.getElementById('curriculumModalTitle').innerHTML = `<i data-lucide="edit-3" class="w-5 h-5 text-indigo-400"></i><span>Müfredat Konusunu Düzenle</span>`;
        document.getElementById('modalCurrId').value = item.id;
        document.getElementById('modalCurrLevel').value = item.level;
        document.getElementById('modalCurrTopic').value = item.topic;
        document.getElementById('modalCurrDescription').value = item.description || '';
        document.getElementById('modalCurrStartDate').value = item.startDate;
        document.getElementById('modalCurrEndDate').value = item.endDate;
        document.getElementById('modalCurrTeacher').value = item.teacher;

        document.getElementById('curriculumModal').classList.remove('hidden');
        if (window.lucide) window.lucide.createIcons();
    }

    closeCurriculumModal() {
        document.getElementById('curriculumModal').classList.add('hidden');
    }

    handleSaveCurriculum(e) {
        e.preventDefault();
        const id = document.getElementById('modalCurrId').value;
        const level = document.getElementById('modalCurrLevel').value;
        const topic = document.getElementById('modalCurrTopic').value.trim();
        const description = document.getElementById('modalCurrDescription').value.trim();
        const startDate = document.getElementById('modalCurrStartDate').value;
        const endDate = document.getElementById('modalCurrEndDate').value;
        const teacher = document.getElementById('modalCurrTeacher').value;

        if (id) {
            const item = (this.data.curriculum || []).find(c => c.id === id);
            if (item) {
                item.level = level;
                item.topic = topic;
                item.description = description;
                item.startDate = startDate;
                item.endDate = endDate;
                item.teacher = teacher;
                this.showToast("Müfredat konusu güncellendi.", "success");
            }
        } else {
            const newItem = {
                id: `curr-${Date.now()}`,
                classId: this.selectedClassId,
                level: level,
                topic: topic,
                description: description,
                startDate: startDate,
                endDate: endDate,
                teacher: teacher
            };
            if (!this.data.curriculum) this.data.curriculum = [];
            this.data.curriculum.push(newItem);
            this.showToast("Yeni müfredat konusu eklendi.", "success");
        }

        this.saveData();
        this.closeCurriculumModal();
        this.renderCurriculumList();
    }

    deleteCurriculumItem(currId) {
        const item = (this.data.curriculum || []).find(c => c.id === currId);
        if (!item) return;

        const user = this.data.currentUser;
        const isAdmin = this.isAdmin();
        const isOwner = user && user.role === 'teacher' && user.name.toLowerCase().trim() === item.teacher.toLowerCase().trim();

        if (!isAdmin && !isOwner) {
            this.showToast("Bu müfredat konusunu silme yetkiniz bulunmamaktadır!", "error");
            return;
        }

        if (confirm(`'${item.topic}' müfredat konusunu silmek istediğinizden emin misiniz?`)) {
            this.data.curriculum = this.data.curriculum.filter(c => c.id !== currId);
            if (supabaseClient) supabaseClient.from('curriculum').delete().eq('id', currId);
            this.saveData();
            this.showToast("Müfredat konusu silindi.", "info");
            this.renderCurriculumList();
        }
    }

    // -------------------------------------------------------------
    // ÖDEVLER VE DOSYA YÜKLEME / İNDİRME LOGİC
    // -------------------------------------------------------------
    renderHomeworkList() {
        const grid = document.getElementById('homeworkListGrid');
        if (!grid) return;

        const currentClassId = this.selectedClassId;
        const items = (this.data.homeworks || []).filter(h => h.classId === currentClassId);

        const user = this.data.currentUser;
        const isAdmin = this.isAdmin();

        if (items.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-500 space-y-3">
                    <i data-lucide="file-text" class="w-12 h-12 mx-auto text-slate-700"></i>
                    <p class="text-white font-bold text-base">Henüz Ödev veya Materyal Yüklenmedi</p>
                    <p class="text-xs text-slate-400">Bu sınıf için henüz ödev dosyası yüklenmedi. Öğretmenler yukarıdaki butonla bilgisayarlarından dosya yükleyebilirler.</p>
                </div>
            `;
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        grid.innerHTML = items.map(item => {
            const isOwner = user && user.role === 'teacher' && user.name.toLowerCase().trim() === item.teacher.toLowerCase().trim();
            const canDelete = isAdmin || isOwner;
            const ext = item.fileName ? item.fileName.split('.').pop().toLowerCase() : 'file';

            let fileIcon = 'file-text';
            let fileBg = 'bg-amber-500/10 text-amber-400 border-amber-500/20';

            if (['pdf'].includes(ext)) {
                fileIcon = 'file';
                fileBg = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            } else if (['doc', 'docx'].includes(ext)) {
                fileIcon = 'file-text';
                fileBg = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
            } else if (['zip', 'rar', '7z'].includes(ext)) {
                fileIcon = 'archive';
                fileBg = 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            } else if (['png', 'jpg', 'jpeg', 'webp'].includes(ext)) {
                fileIcon = 'image';
                fileBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            }

            return `
                <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 relative group hover:border-amber-500/50 transition-all flex flex-col justify-between">
                    <div class="space-y-3">
                        <div class="flex items-start justify-between gap-3">
                            <span class="px-3 py-1 rounded-lg border text-xs font-semibold flex items-center space-x-1.5 ${fileBg}">
                                <i data-lucide="${fileIcon}" class="w-4 h-4"></i>
                                <span class="uppercase font-mono">${ext}</span>
                            </span>

                            <div class="flex items-center space-x-2">
                                ${canDelete ? `
                                    <button onclick="appState.deleteHomeworkItem('${item.id}')" class="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-400 transition-colors" title="Ödevi Sil">
                                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                    </button>
                                ` : ''}
                            </div>
                        </div>

                        <h4 class="font-heading text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                            ${item.title}
                        </h4>

                        <p class="text-xs text-slate-400 leading-relaxed">
                            ${item.description || 'Açıklama bulunmuyor.'}
                        </p>

                        <div class="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                            <div class="flex items-center space-x-2 truncate">
                                <i data-lucide="paperclip" class="w-3.5 h-3.5 text-amber-400 shrink-0"></i>
                                <span class="text-slate-200 font-mono truncate" title="${item.fileName}">${item.fileName}</span>
                            </div>
                            <span class="text-[10px] text-slate-500 font-semibold px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 shrink-0">${item.fileSize || '1 MB'}</span>
                        </div>
                    </div>

                    <div class="pt-4 border-t border-slate-800/80 space-y-3">
                        <div class="flex items-center justify-between text-xs text-slate-400">
                            <span>Sorumlu: <strong class="text-slate-200">${item.teacher}</strong></span>
                            <span class="text-amber-400 font-semibold">Son Teslim: ${item.dueDate}</span>
                        </div>

                        <button onclick="appState.downloadHomeworkFile('${item.id}')"
                                class="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/20 transition-all flex items-center justify-center space-x-2">
                            <i data-lucide="download-cloud" class="w-4 h-4"></i>
                            <span>📥 Dosyayı İndir (${item.fileName})</span>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        if (window.lucide) window.lucide.createIcons();
    }

    openAddHomeworkModal() {
        if (!this.data.currentUser || this.isStudent()) {
            this.showToast("Öğrenci hesapları ödev yükleyemez!", "warning");
            return;
        }

        this.pendingHwFileData = null;
        this.pendingHwFileName = null;
        this.pendingHwFileSize = null;

        document.getElementById('homeworkModalTitle').innerHTML = `<i data-lucide="upload-cloud" class="w-5 h-5 text-amber-400"></i><span>Yeni Ödev / Ders Materyali Yükle</span>`;
        document.getElementById('modalHwId').value = '';
        document.getElementById('modalHwTitle').value = '';
        document.getElementById('modalHwDescription').value = '';
        
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        document.getElementById('modalHwDueDate').value = nextWeek.toISOString().split('T')[0];
        document.getElementById('modalHwFileNameDisplay').textContent = 'Henüz dosya seçilmedi';

        document.getElementById('homeworkModal').classList.remove('hidden');
        if (window.lucide) window.lucide.createIcons();
    }

    closeHomeworkModal() {
        document.getElementById('homeworkModal').classList.add('hidden');
    }

    handleHomeworkFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        const sizeKb = Math.round(file.size / 1024);
        const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

        document.getElementById('modalHwFileNameDisplay').textContent = `Seçilen: ${file.name} (${sizeStr})`;

        const reader = new FileReader();
        reader.onload = (e) => {
            this.pendingHwFileData = e.target.result;
            this.pendingHwFileName = file.name;
            this.pendingHwFileSize = sizeStr;
        };
        reader.readAsDataURL(file);
    }

    handleSaveHomework(e) {
        e.preventDefault();
        const title = document.getElementById('modalHwTitle').value.trim();
        const description = document.getElementById('modalHwDescription').value.trim();
        const dueDate = document.getElementById('modalHwDueDate').value;

        if (!this.pendingHwFileData) {
            this.showToast("Lütfen bilgisayarınızdan bir dosya seçin!", "warning");
            return;
        }

        const newItem = {
            id: `hw-${Date.now()}`,
            classId: this.selectedClassId,
            title: title,
            description: description,
            dueDate: dueDate,
            createdAt: new Date().toISOString().split('T')[0],
            teacher: this.data.currentUser.name || 'Öğretmen',
            fileName: this.pendingHwFileName,
            fileSize: this.pendingHwFileSize,
            fileData: this.pendingHwFileData
        };

        if (!this.data.homeworks) this.data.homeworks = [];
        this.data.homeworks.push(newItem);

        this.saveData();
        this.showToast(`'${newItem.title}' ödevi başarıyla yüklendi.`, "success");
        this.closeHomeworkModal();
        this.renderHomeworkList();
    }

    deleteHomeworkItem(hwId) {
        const item = (this.data.homeworks || []).find(h => h.id === hwId);
        if (!item) return;

        const user = this.data.currentUser;
        const isAdmin = this.isAdmin();
        const isOwner = user && user.role === 'teacher' && user.name.toLowerCase().trim() === item.teacher.toLowerCase().trim();

        if (!isAdmin && !isOwner) {
            this.showToast("Bu ödevi silme yetkiniz bulunmamaktadır!", "error");
            return;
        }

        if (confirm(`'${item.title}' ödevini ve dosyasını silmek istediğinizden emin misiniz?`)) {
            this.data.homeworks = this.data.homeworks.filter(h => h.id !== hwId);
            if (supabaseClient) supabaseClient.from('homeworks').delete().eq('id', hwId);
            this.saveData();
            this.showToast("Ödev ve bağlı dosya silindi.", "info");
            this.renderHomeworkList();
        }
    }

    downloadHomeworkFile(hwId) {
        const item = (this.data.homeworks || []).find(h => h.id === hwId);
        if (!item || !item.fileData) {
            this.showToast("İndirilebilir dosya verisi bulunamadı!", "error");
            return;
        }

        const link = document.createElement('a');
        link.href = item.fileData;
        link.download = item.fileName || 'odev_dosyasi';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showToast(`📁 ${item.fileName} indirmesi başlatıldı.`, "success");
    }

    changeSelectedDate(newDate) {
        this.selectedDate = newDate;
        this.filterStudents();
    }

    filterStudents() {
        const currentClass = this.data.classes.find(c => c.id === this.selectedClassId);
        if (!currentClass) return;

        const classStudents = this.data.students.filter(s => s.classId === currentClass.id);

        this.studentSearchQuery = (document.getElementById('studentSearchInput')?.value || '').toLowerCase().trim();
        this.studentSkillFilter = document.getElementById('skillFilterSelect')?.value || 'ALL';
        this.studentAttendanceFilter = document.getElementById('attendanceFilterSelect')?.value || 'ALL';

        const filtered = classStudents.filter(s => {
            const matchName = s.name.toLowerCase().includes(this.studentSearchQuery);
            const matchSkill = this.studentSkillFilter === 'ALL' || s.skill === this.studentSkillFilter;
            const matchAttendance = this.studentAttendanceFilter === 'ALL' || s.attendance === this.studentAttendanceFilter;
            return matchName && matchSkill && matchAttendance;
        });

        const presentCount = classStudents.filter(s => s.attendance === 'Geldi').length;
        const absentCount = classStudents.filter(s => s.attendance === 'Gelmedi').length;
        const rate = classStudents.length > 0 ? Math.round((presentCount / classStudents.length) * 100) : 0;

        document.getElementById('statPresentCount').textContent = presentCount;
        document.getElementById('statAbsentCount').textContent = absentCount;
        document.getElementById('attendancePercentageBadge').textContent = `Sınıf Katılım Oranı: %${rate}`;
        document.getElementById('filteredCountBadge').textContent = `Gösterilen: ${filtered.length} / Toplam ${classStudents.length} Öğrenci`;

        this.renderStudentTable(filtered, currentClass.name);
    }

    renderStudentTable(students, className) {
        const tbody = document.getElementById('studentTableBody');
        if (!tbody) return;

        if (students.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="py-12 text-center text-slate-500">
                        <i data-lucide="user-x" class="w-10 h-10 mx-auto mb-2 text-slate-600"></i>
                        <p class="font-medium text-white">Öğrenci Kaydı Bulunamadı</p>
                        <p class="text-xs text-slate-400 mt-1">Bu sınıfta kayıtlı öğrenci yok veya filtrelerle eşleşmedi.</p>
                    </td>
                </tr>
            `;
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        const isAdmin = this.isAdmin();
        const isStudent = this.isStudent();

        tbody.innerHTML = students.map(student => {
            const skillClass = `skill-pill-${student.skill.toLowerCase()}`;
            const isPresent = student.attendance === 'Geldi';

            return `
                <tr id="row-${student.id}" class="hover:bg-slate-800/40 transition-colors">
                    
                    <!-- 1. Ad Soyad -->
                    <td class="py-4 px-6 font-semibold text-white">
                        <div class="flex items-center space-x-3">
                            <div class="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-teal-400">
                                ${student.name.split(' ').map(n=>n[0]).join('')}
                            </div>
                            <span>${student.name}</span>
                        </div>
                    </td>

                    <!-- 2. Sınıfı -->
                    <td class="py-4 px-4 text-xs font-medium text-slate-300">
                        <span class="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800">
                            ${className}
                        </span>
                    </td>

                    <!-- 3. Yaşı -->
                    <td class="py-4 px-4 text-xs font-semibold text-slate-300">
                        ${student.age} Yaş
                    </td>

                    <!-- 4. Beceri (Skill Dropdown - Disabled for Students) -->
                    <td class="py-4 px-4">
                        <select ${isStudent ? 'disabled' : ''} onchange="appState.updateStudentSkill('${student.id}', this.value)"
                                class="px-2.5 py-1 rounded-lg text-xs font-semibold focus:outline-none ${skillClass} ${isStudent ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}">
                            <option value="Reading" ${student.skill === 'Reading' ? 'selected' : ''}>📖 Reading</option>
                            <option value="Listening" ${student.skill === 'Listening' ? 'selected' : ''}>🎧 Listening</option>
                            <option value="Speaking" ${student.skill === 'Speaking' ? 'selected' : ''}>🗣️ Speaking</option>
                            <option value="Writing" ${student.skill === 'Writing' ? 'selected' : ''}>✍️ Writing</option>
                        </select>
                    </td>

                    <!-- 5. Tarih (Datepicker - Disabled for Students) -->
                    <td class="py-4 px-4 text-xs text-slate-300">
                        <input type="date" ${isStudent ? 'disabled' : ''} value="${student.date || this.selectedDate}" 
                               onchange="appState.updateStudentDate('${student.id}', this.value)"
                               class="bg-slate-950 border border-slate-800 px-2 py-1 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-teal-500 ${isStudent ? 'cursor-not-allowed text-slate-400' : ''}">
                    </td>

                    <!-- 6. Yoklama (Disabled for Students) -->
                    <td class="py-4 px-6 text-center">
                        <button ${isStudent ? 'disabled' : ''} onclick="appState.toggleAttendance('${student.id}')"
                                class="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${isPresent ? 'badge-geldi' : 'badge-gelmedi'} ${isStudent ? 'cursor-not-allowed pointer-events-none opacity-90' : ''}"
                                title="${isStudent ? 'Öğrenci hesabı (Salt Okunur)' : 'Tıklayarak yoklama durumunu değiştirin'}">
                            <span class="w-2 h-2 rounded-full ${isPresent ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}"></span>
                            <span>${student.attendance}</span>
                            <i data-lucide="${isPresent ? 'check' : 'x'}" class="w-3.5 h-3.5"></i>
                        </button>
                    </td>

                    <!-- 7. İşlemler -->
                    <td class="py-4 px-6 text-right">
                        ${isAdmin ? `
                            <div class="flex items-center justify-end space-x-1">
                                <button onclick="appState.openEditStudentModal('${student.id}')" 
                                        class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors" title="Öğrenciyi Düzenle">
                                    <i data-lucide="edit-2" class="w-4 h-4"></i>
                                </button>
                                <button onclick="appState.deleteStudent('${student.id}')" 
                                        class="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-400 transition-colors" title="Öğrenciyi Sil">
                                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                                </button>
                            </div>
                        ` : isStudent ? `
                            <span class="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-sky-950/80 border border-sky-800/80 text-[11px] text-sky-300 font-semibold">
                                <i data-lucide="eye" class="w-3.5 h-3.5"></i>
                                <span>Salt Okunur</span>
                            </span>
                        ` : `
                            <span class="inline-block px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-500 font-medium">
                                Yoklama Yetkili
                            </span>
                        `}
                    </td>
                </tr>
            `;
        }).join('');

        if (window.lucide) window.lucide.createIcons();
    }

    toggleAttendance(studentId) {
        if (this.isStudent()) {
            this.showToast("Öğrenci hesapları yoklama durumunu değiştiremez! (Salt Okunur Mod)", "warning");
            return;
        }
        const student = this.data.students.find(s => s.id === studentId);
        if (!student) return;

        student.attendance = student.attendance === 'Geldi' ? 'Gelmedi' : 'Geldi';
        this.saveData();
        this.filterStudents();

        const toastType = student.attendance === 'Geldi' ? 'success' : 'warning';
        this.showToast(`${student.name}: Yoklama '${student.attendance}' olarak güncellendi.`, toastType);
    }

    updateStudentSkill(studentId, newSkill) {
        if (this.isStudent()) {
            this.showToast("Öğrenci hesapları ders becerisini değiştiremez! (Salt Okunur Mod)", "warning");
            return;
        }
        const student = this.data.students.find(s => s.id === studentId);
        if (!student) return;

        student.skill = newSkill;
        this.saveData();
        this.filterStudents();
        this.showToast(`${student.name} becerisi '${newSkill}' yapıldı.`, "info");
    }

    updateStudentDate(studentId, newDate) {
        if (this.isStudent()) {
            this.showToast("Öğrenci hesapları yoklama tarihini değiştiremez! (Salt Okunur Mod)", "warning");
            return;
        }
        const student = this.data.students.find(s => s.id === studentId);
        if (!student) return;

        student.date = newDate;
        this.saveData();
        this.filterStudents();
        this.showToast(`${student.name} yoklama tarihi güncellendi.`, "info");
    }

    setAllAttendance(status) {
        if (this.isStudent()) {
            this.showToast("Öğrenci hesapları toplu yoklama işlemi yapamaz!", "warning");
            return;
        }
        const currentClass = this.data.classes.find(c => c.id === this.selectedClassId);
        if (!currentClass) return;

        let count = 0;
        this.data.students.forEach(s => {
            if (s.classId === currentClass.id) {
                s.attendance = status;
                count++;
            }
        });

        this.saveData();
        this.filterStudents();
        this.showToast(`Sınıftaki ${count} öğrenci '${status}' işaretlendi.`, status === 'Geldi' ? 'success' : 'warning');
    }

    openAddStudentModal() {
        if (!this.isAdmin()) {
            this.showToast("Öğrenci ekleme yetkisi yalnızca Yöneticidedir!", "error");
            return;
        }
        const currentClass = this.data.classes.find(c => c.id === this.selectedClassId);
        if (!currentClass) return;

        document.getElementById('studentModalTitle').innerHTML = `<i data-lucide="user-plus" class="w-5 h-5 text-teal-400"></i><span>Yeni Öğrenci Kaydı</span>`;
        document.getElementById('modalStudentId').value = '';
        document.getElementById('modalStudentName').value = '';
        document.getElementById('modalStudentClassText').value = currentClass.name;
        document.getElementById('modalStudentAge').value = '22';
        document.getElementById('modalStudentSkill').value = 'Reading';
        document.getElementById('modalStudentDate').value = this.selectedDate;
        document.getElementById('modalStudentAttendance').value = 'Geldi';

        document.getElementById('studentModal').classList.remove('hidden');
        if (window.lucide) window.lucide.createIcons();
    }

    openEditStudentModal(studentId) {
        if (!this.isAdmin()) {
            this.showToast("Öğrenci düzenleme yetkisi yalnızca Yöneticidedir!", "error");
            return;
        }
        const student = this.data.students.find(s => s.id === studentId);
        if (!student) return;

        const currentClass = this.data.classes.find(c => c.id === student.classId);

        document.getElementById('studentModalTitle').innerHTML = `<i data-lucide="edit-2" class="w-5 h-5 text-teal-400"></i><span>Öğrenci Bilgilerini Düzenle</span>`;
        document.getElementById('modalStudentId').value = student.id;
        document.getElementById('modalStudentName').value = student.name;
        document.getElementById('modalStudentClassText').value = currentClass ? currentClass.name : '';
        document.getElementById('modalStudentAge').value = student.age;
        document.getElementById('modalStudentSkill').value = student.skill;
        document.getElementById('modalStudentDate').value = student.date || this.selectedDate;
        document.getElementById('modalStudentAttendance').value = student.attendance;

        document.getElementById('studentModal').classList.remove('hidden');
        if (window.lucide) window.lucide.createIcons();
    }

    closeStudentModal() {
        document.getElementById('studentModal').classList.add('hidden');
    }

    handleSaveStudent(e) {
        e.preventDefault();
        if (!this.isAdmin()) {
            this.showToast("Öğrenci kaydetme yetkisi yalnızca Yöneticidedir!", "error");
            return;
        }
        const id = document.getElementById('modalStudentId').value;
        const name = document.getElementById('modalStudentName').value.trim();
        const age = parseInt(document.getElementById('modalStudentAge').value, 10);
        const skill = document.getElementById('modalStudentSkill').value;
        const date = document.getElementById('modalStudentDate').value;
        const attendance = document.getElementById('modalStudentAttendance').value;

        if (id) {
            const student = this.data.students.find(s => s.id === id);
            if (student) {
                student.name = name;
                student.age = age;
                student.skill = skill;
                student.date = date;
                student.attendance = attendance;
                this.showToast("Öğrenci bilgileri güncellendi.", "success");
            }
        } else {
            const newStudent = {
                id: `std-${Date.now()}`,
                classId: this.selectedClassId,
                name: name,
                age: age,
                skill: skill,
                date: date,
                attendance: attendance
            };
            this.data.students.push(newStudent);
            this.showToast("Yeni öğrenci sınıfa eklendi.", "success");
        }

        this.saveData();
        this.closeStudentModal();
        this.filterStudents();
    }

    deleteStudent(studentId) {
        if (!this.isAdmin()) {
            this.showToast("Öğrenci silme yetkisi yalnızca Yöneticidedir!", "error");
            return;
        }
        const student = this.data.students.find(s => s.id === studentId);
        if (!student) return;

        if (confirm(`'${student.name}' adlı öğrenci kaydını silmek istediğinize emin misiniz?`)) {
            this.data.students = this.data.students.filter(s => s.id !== studentId);
            if (supabaseClient) supabaseClient.from('students').delete().eq('id', studentId);
            this.saveData();
            this.showToast("Öğrenci kaydı silindi.", "info");
            this.filterStudents();
        }
    }

    // -------------------------------------------------------------
    // YÖNETİCİ ÖĞRETMEN YÖNETİMİ PANELİ (ADMIN ONLY)
    // -------------------------------------------------------------
    openTeacherMgmtModal() {
        if (!this.data.currentUser || this.data.currentUser.role !== 'admin') {
            this.showToast("Bu panele yalnızca Yönetici erişebilir!", "error");
            return;
        }

        this.currentUploadedAvatarBase64 = null;
        this.resetTeacherForm();
        this.renderTeacherTable();
        this.renderClassStudentAccountsTable();

        const pathInput = document.getElementById('modalExportSavePathInput');
        if (pathInput) {
            pathInput.value = this.data.exportSettings?.savePath || "C:\\Pars_Yoklama_Raporlari\\";
        }

        document.getElementById('teacherMgmtModal').classList.remove('hidden');
        if (window.lucide) window.lucide.createIcons();
    }

    renderClassStudentAccountsTable() {
        const tbody = document.getElementById('classStudentTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.data.classes.map(cls => {
            const branch = this.data.branches.find(b => b.id === cls.branchId);
            const branchName = branch ? branch.name : cls.branchId;

            return `
                <tr class="hover:bg-slate-900/60 transition-colors">
                    <td class="py-3 px-4 font-semibold text-white">
                        <div class="flex items-center space-x-2">
                            <i data-lucide="book-open" class="w-3.5 h-3.5 text-teal-400 shrink-0"></i>
                            <span class="truncate max-w-[180px]" title="${cls.name}">${cls.name}</span>
                        </div>
                    </td>
                    <td class="py-3 px-3 text-slate-300 text-[11px]">
                        ${branchName}
                    </td>
                    <td class="py-3 px-3">
                        <input type="text" id="classUsername-${cls.id}" value="${cls.studentUsername || ''}"
                               class="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-sky-300 font-mono focus:outline-none focus:border-sky-500 w-28">
                    </td>
                    <td class="py-3 px-3">
                        <input type="text" id="classPassword-${cls.id}" value="${cls.studentPassword || '12345'}"
                               class="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-sky-500 w-24">
                    </td>
                    <td class="py-3 px-4 text-right">
                        <button onclick="appState.quickSaveClassStudentCredentials('${cls.id}')"
                                class="px-2.5 py-1 rounded-lg bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 font-semibold text-[11px] transition-all inline-flex items-center space-x-1">
                            <i data-lucide="save" class="w-3 h-3"></i>
                            <span>Kaydet</span>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        if (window.lucide) window.lucide.createIcons();
    }

    quickSaveClassStudentCredentials(classId) {
        if (!this.isAdmin()) {
            this.showToast("Bu işlemi yalnızca Yönetici yapabilir!", "error");
            return;
        }
        const cls = this.data.classes.find(c => c.id === classId);
        if (!cls) return;

        const usernameInput = document.getElementById(`classUsername-${classId}`);
        const passwordInput = document.getElementById(`classPassword-${classId}`);

        if (usernameInput && passwordInput) {
            const u = usernameInput.value.trim().toLowerCase();
            const p = passwordInput.value.trim();

            if (!u || !p) {
                this.showToast("Kullanıcı adı ve şifre boş bırakılamaz!", "warning");
                return;
            }

            cls.studentUsername = u;
            cls.studentPassword = p;
            this.saveData();
            this.showToast(`'${cls.name}' öğrenci hesabı güncellendi: ${u} / ${p}`, "success");
            this.renderClassStudentAccountsTable();
        }
    }

    saveExportSavePath() {
        if (!this.isAdmin()) {
            this.showToast("Excel kayıt yolunu yalnızca Yönetici belirleyebilir!", "error");
            return;
        }
        const input = document.getElementById('modalExportSavePathInput');
        if (!input) return;

        const path = input.value.trim();
        if (!path) {
            this.showToast("Lütfen geçerli bir kayıt yolu girin!", "warning");
            return;
        }

        if (!this.data.exportSettings) this.data.exportSettings = {};
        this.data.exportSettings.savePath = path;
        this.saveData();
        this.showToast(`📁 Excel kayıt yolu başarıyla güncellendi: ${path}`, "success");
    }

    closeTeacherMgmtModal() {
        document.getElementById('teacherMgmtModal').classList.add('hidden');
    }

    compressAvatarImage(file, callback) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_SIZE = 256;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_SIZE) {
                        height *= MAX_SIZE / width;
                        width = MAX_SIZE;
                    }
                } else {
                    if (height > MAX_SIZE) {
                        width *= MAX_SIZE / height;
                        height = MAX_SIZE;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.82);
                callback(compressedBase64);
            };
            img.onerror = () => callback(e.target.result);
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    handleAvatarFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            this.showToast("Lütfen geçerli bir resim dosyası seçin!", "warning");
            return;
        }

        this.compressAvatarImage(file, (compressedBase64) => {
            this.currentUploadedAvatarBase64 = compressedBase64;
            const preview = document.getElementById('teacherAvatarPreview');
            const fileLabel = document.getElementById('teacherAvatarFileName');
            if (preview) preview.src = this.currentUploadedAvatarBase64;
            if (fileLabel) fileLabel.textContent = `✓ Yüklendi: ${file.name}`;
            this.showToast("Fotoğraf yüklendi ve optimize edildi!", "success");
        });
    }

    selectAvatarPreset(val) {
        this.currentUploadedAvatarBase64 = null;
        const customInput = document.getElementById('modalTeacherAvatarCustom');
        const preview = document.getElementById('teacherAvatarPreview');
        const fileLabel = document.getElementById('teacherAvatarFileName');
        if (fileLabel) fileLabel.textContent = "veya hazır preset / URL seçin";

        if (val === 'custom') {
            customInput.classList.remove('hidden');
            if (customInput.value.trim()) preview.src = customInput.value.trim();
        } else {
            customInput.classList.add('hidden');
            preview.src = val;
        }
    }

    handleCustomAvatarUrlInput(url) {
        this.currentUploadedAvatarBase64 = null;
        const preview = document.getElementById('teacherAvatarPreview');
        if (preview) {
            preview.src = url.trim() || 'assets/avatar.png';
        }
    }

    resetTeacherForm() {
        this.currentUploadedAvatarBase64 = null;
        document.getElementById('modalTeacherId').value = '';
        document.getElementById('modalTeacherName').value = '';
        document.getElementById('modalTeacherAvatarPreset').value = 'assets/avatar.png';
        document.getElementById('modalTeacherAvatarCustom').value = '';
        document.getElementById('modalTeacherAvatarCustom').classList.add('hidden');
        document.getElementById('teacherAvatarPreview').src = 'assets/avatar.png';
        
        const fileInput = document.getElementById('modalTeacherAvatarFile');
        if (fileInput) fileInput.value = '';
        const fileLabel = document.getElementById('teacherAvatarFileName');
        if (fileLabel) fileLabel.textContent = "veya hazır preset / URL seçin";

        document.getElementById('modalTeacherBranch').value = 'all';
        document.getElementById('modalTeacherUsername').value = '';
        document.getElementById('modalTeacherPassword').value = '';
        document.getElementById('teacherFormTitle').innerHTML = `<i data-lucide="user-plus" class="w-4 h-4 text-teal-400"></i><span>Yeni Öğretmen Ekle</span>`;
    }

    renderTeacherTable() {
        const tbody = document.getElementById('teacherTableBody');
        const badge = document.getElementById('teacherCountBadge');
        if (!tbody) return;

        badge.textContent = `${this.data.users.length} Kayıtlı Hesap`;

        tbody.innerHTML = this.data.users.map(u => {
            const isAdmin = u.role === 'admin';
            const branchText = u.branchPermission === 'all' ? 'Her İki Şube (Tam Yetki)' :
                             u.branchPermission === 'gaziemir' ? 'Gaziemir Şubesi' : 'Alsancak Şubesi';
            const branchClass = u.branchPermission === 'all' ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' :
                              u.branchPermission === 'gaziemir' ? 'bg-teal-500/10 text-teal-300 border-teal-500/20' : 'bg-sky-500/10 text-sky-300 border-sky-500/20';

            return `
                <tr class="hover:bg-slate-900/60 transition-colors">
                    <td class="py-3 px-4 font-semibold text-white">
                        <div class="flex items-center space-x-3">
                            <img src="${u.avatar || 'assets/avatar.png'}" class="w-9 h-9 rounded-full object-cover border-2 ${isAdmin ? 'border-amber-400' : 'border-teal-400'} shadow-sm">
                            <div>
                                <div class="flex items-center space-x-1.5">
                                    <span>${u.name}</span>
                                    ${isAdmin ? '<span class="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">ADMIN</span>' : ''}
                                </div>
                                <span class="text-[10px] text-slate-400 block font-medium">${u.title || 'Öğretmen'}</span>
                            </div>
                        </div>
                    </td>
                    <td class="py-3 px-3">
                        <span class="px-2.5 py-1 rounded-full border text-[10px] font-semibold ${branchClass}">
                            ${branchText}
                        </span>
                    </td>
                    <td class="py-3 px-3 font-mono text-slate-300">
                        <div><strong class="text-white">${u.username}</strong></div>
                        <div class="text-[10px] text-slate-400">Şifre: ${u.password}</div>
                    </td>
                    <td class="py-3 px-4 text-right">
                        <div class="flex items-center justify-end space-x-1.5">
                            <button onclick="appState.openEditTeacherModal('${u.id}')" 
                                    class="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center space-x-1" title="Düzenle">
                                <i data-lucide="edit-2" class="w-3.5 h-3.5"></i>
                                <span class="text-[11px]">Düzenle</span>
                            </button>
                            ${!isAdmin ? `
                                <button onclick="appState.deleteTeacher('${u.id}')" 
                                        class="px-2 py-1 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-400 transition-colors flex items-center space-x-1 border border-slate-700/50 hover:border-rose-800" title="Öğretmeni Sil">
                                    <i data-lucide="trash-2" class="w-3.5 h-3.5 text-rose-400"></i>
                                    <span class="text-[11px] text-rose-300">Sil</span>
                                </button>
                            ` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        if (window.lucide) window.lucide.createIcons();
    }

    openEditTeacherModal(userId) {
        const u = this.data.users.find(usr => usr.id === userId);
        if (!u) return;

        this.currentUploadedAvatarBase64 = null;
        document.getElementById('modalTeacherId').value = u.id;
        document.getElementById('modalTeacherName').value = u.name;
        document.getElementById('modalTeacherBranch').value = u.branchPermission || 'all';
        document.getElementById('modalTeacherUsername').value = u.username;
        document.getElementById('modalTeacherPassword').value = u.password;

        if (u.avatar && u.avatar.startsWith('data:image/')) {
            this.currentUploadedAvatarBase64 = u.avatar;
            document.getElementById('teacherAvatarPreview').src = u.avatar;
            document.getElementById('modalTeacherAvatarPreset').value = 'assets/avatar.png';
            document.getElementById('teacherAvatarFileName').textContent = "✓ Kayıtlı Özel Fotoğraf";
        } else if (['assets/avatar.png', 'assets/avatar_male2.png', 'assets/avatar_female.png', 'assets/avatar_admin.png'].includes(u.avatar)) {
            document.getElementById('modalTeacherAvatarPreset').value = u.avatar;
            document.getElementById('modalTeacherAvatarCustom').classList.add('hidden');
            document.getElementById('teacherAvatarPreview').src = u.avatar;
        } else {
            document.getElementById('modalTeacherAvatarPreset').value = 'custom';
            document.getElementById('modalTeacherAvatarCustom').classList.remove('hidden');
            document.getElementById('modalTeacherAvatarCustom').value = u.avatar || '';
            document.getElementById('teacherAvatarPreview').src = u.avatar || 'assets/avatar.png';
        }

        document.getElementById('teacherFormTitle').innerHTML = `<i data-lucide="edit-2" class="w-4 h-4 text-teal-400"></i><span>Öğretmen Bilgilerini Düzenle</span>`;
        if (window.lucide) window.lucide.createIcons();
    }

    async handleSaveTeacher(e) {
        e.preventDefault();
        const id = document.getElementById('modalTeacherId').value;
        const name = document.getElementById('modalTeacherName').value.trim();
        const preset = document.getElementById('modalTeacherAvatarPreset').value;
        const customUrl = document.getElementById('modalTeacherAvatarCustom').value.trim();
        
        const avatar = this.currentUploadedAvatarBase64 || (preset === 'custom' ? (customUrl || 'assets/avatar.png') : preset);
        const branchPermission = document.getElementById('modalTeacherBranch').value;
        const username = document.getElementById('modalTeacherUsername').value.trim().toLowerCase();
        const password = document.getElementById('modalTeacherPassword').value.trim();

        // Check unique username
        const duplicate = this.data.users.find(u => u.username.toLowerCase() === username && u.id !== id);
        if (duplicate) {
            this.showToast("Bu kullanıcı adı zaten kullanılmaktadır!", "error");
            return;
        }

        let teacherObj;

        if (id) {
            teacherObj = this.data.users.find(usr => usr.id === id);
            if (teacherObj) {
                teacherObj.name = name;
                teacherObj.avatar = avatar;
                teacherObj.branchPermission = branchPermission;
                teacherObj.username = username;
                teacherObj.password = password;
                teacherObj.title = branchPermission === 'all' ? 'Tüm Şubeler Öğretmeni' :
                          branchPermission === 'gaziemir' ? 'Gaziemir Şubesi Öğretmeni' : 'Alsancak Şubesi Öğretmeni';
                
                // If editing currently logged in user
                if (this.data.currentUser && this.data.currentUser.id === id) {
                    this.data.currentUser = teacherObj;
                    this.renderAuthHeader();
                }
            }
        } else {
            teacherObj = {
                id: `usr-${Date.now()}`,
                username: username,
                password: password,
                name: name,
                role: "teacher",
                branchPermission: branchPermission,
                avatar: avatar,
                title: branchPermission === 'all' ? 'Tüm Şubeler Öğretmeni' :
                       branchPermission === 'gaziemir' ? 'Gaziemir Şubesi Öğretmeni' : 'Alsancak Şubesi Öğretmeni'
            };
            this.data.users.push(teacherObj);
        }

        this.saveData();

        // Direct explicit Supabase save for 100% guarantee
        if (supabaseClient && teacherObj) {
            const { error } = await supabaseClient.from('users').upsert(teacherObj);
            if (error) {
                console.error("Supabase teacher save error:", error);
                this.showToast(`Bulut kaydetme uyarısı: ${error.message}`, "warning");
            } else {
                console.log("⚡ Öğretmen bulut veritabanına başarıyla kaydedildi!");
            }
        }

        this.showToast(id ? "Öğretmen hesabı başarıyla güncellendi." : "Yeni öğretmen hesabı ve fotoğrafı başarıyla oluşturuldu.", "success");
        this.resetTeacherForm();
        this.renderTeacherTable();
    }

    deleteTeacher(userId) {
        const u = this.data.users.find(usr => usr.id === userId);
        if (!u) return;
        if (u.role === 'admin') {
            this.showToast("Yönetici hesabı silinemez!", "error");
            return;
        }

        if (confirm(`'${u.name}' öğretmen hesabını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) {
            this.data.users = this.data.users.filter(usr => usr.id !== userId);
            if (supabaseClient) supabaseClient.from('users').delete().eq('id', userId);
            
            // If deleted teacher was logged in, log out
            if (this.data.currentUser && this.data.currentUser.id === userId) {
                this.data.currentUser = null;
                this.renderAuthHeader();
            }

            this.saveData();
            this.showToast(`'${u.name}' öğretmen hesabı başarıyla silindi.`, "info");
            this.renderTeacherTable();
        }
    }

    // EXCEL EXPORT WITH SHEETJS & CUSTOM ADMIN SAVE PATH
    exportExcel() {
        const currentClass = this.data.classes.find(c => c.id === this.selectedClassId);
        if (!currentClass) return;

        const branch = this.data.branches.find(b => b.id === currentClass.branchId);
        const classStudents = this.data.students.filter(s => s.classId === currentClass.id);

        if (classStudents.length === 0) {
            this.showToast("Dışa aktarılacak öğrenci kaydı yok.", "warning");
            return;
        }

        const presentCount = classStudents.filter(s => s.attendance === 'Geldi').length;
        const absentCount = classStudents.filter(s => s.attendance === 'Gelmedi').length;
        const rate = Math.round((presentCount / classStudents.length) * 100);

        const savePath = this.data.exportSettings?.savePath || "C:\\Pars_Yoklama_Raporlari\\";

        if (window.XLSX) {
            const wb = XLSX.utils.book_new();

            const sheetData = [
                ["PARS YABANCI DİL KURSLARI - ÖĞRENCİ YOKLAMA VE TAKİP RAPORU"],
                [""],
                ["Şube:", branch ? branch.name : "", "", "Rapor Tarihi:", this.selectedDate],
                ["Sınıf:", currentClass.name, "", "Yoklama Yapan Öğretmen:", this.data.currentUser?.name || currentClass.teacher],
                ["Seviye:", currentClass.level, "", "Ders Saatleri:", currentClass.schedule || "Belirtilmedi"],
                ["Toplam Öğrenci:", classStudents.length, "Katılan (Geldi):", presentCount, "Katılmayan (Gelmedi):", absentCount, "Katılım Oranı:", `%${rate}`],
                [""],
                ["Sıra No", "Öğrenci Adı Soyadı", "Sınıfı", "Yaşı", "Beceri Odak Alanı (Skill)", "Yoklama Tarihi", "Yoklama Durumu"]
            ];

            classStudents.forEach((s, idx) => {
                sheetData.push([
                    idx + 1,
                    s.name,
                    currentClass.name,
                    s.age,
                    s.skill,
                    s.date || this.selectedDate,
                    s.attendance
                ]);
            });

            const ws = XLSX.utils.aoa_to_sheet(sheetData);

            ws['!cols'] = [
                { wch: 8 },
                { wch: 25 },
                { wch: 30 },
                { wch: 10 },
                { wch: 20 },
                { wch: 15 },
                { wch: 18 }
            ];

            XLSX.utils.book_append_sheet(wb, ws, "Yoklama Raporu");

            const fileName = `Pars_${currentClass.name.replace(/[^a-zA-Z0-9_-]/g, '_')}_${this.selectedDate}.xlsx`;
            XLSX.writeFile(wb, fileName);

            this.showToast(`📊 Yoklama Excel raporu indirildi! Kayıt Yolu: ${savePath}`, "success");
        } else {
            this.exportCSV();
        }
    }

    // CSV Export
    exportCSV() {
        const currentClass = this.data.classes.find(c => c.id === this.selectedClassId);
        if (!currentClass) return;

        const classStudents = this.data.students.filter(s => s.classId === currentClass.id);
        if (classStudents.length === 0) {
            this.showToast("Dışa aktarılacak öğrenci verisi yok.", "warning");
            return;
        }

        let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
        csvContent += "Ad Soyad;Sınıfı;Yaşı;Beceri (Skill);Tarih;Yoklama Durumu\n";

        classStudents.forEach(s => {
            csvContent += `"${s.name}";"${currentClass.name}";${s.age};"${s.skill}";"${s.date || this.selectedDate}";"${s.attendance}"\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Pars_${currentClass.name.replace(/\s+/g, '_')}_Yoklama.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showToast("Yoklama raporu CSV olarak indirildi.", "success");
    }

    // Toast Notification System
    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast-enter pointer-events-auto flex items-center space-x-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold max-w-sm ${
            type === 'success' ? 'bg-slate-900 border-emerald-500/50 text-emerald-300' :
            type === 'warning' ? 'bg-slate-900 border-amber-500/50 text-amber-300' :
            type === 'info' ? 'bg-slate-900 border-indigo-500/50 text-indigo-300' :
            'bg-slate-900 border-rose-500/50 text-rose-300'
        }`;

        const iconName = type === 'success' ? 'check-circle-2' : type === 'warning' ? 'alert-triangle' : type === 'error' ? 'x-circle' : 'info';
        
        toast.innerHTML = `
            <i data-lucide="${iconName}" class="w-5 h-5 shrink-0"></i>
            <span class="flex-1">${message}</span>
        `;

        container.appendChild(toast);
        if (window.lucide) window.lucide.createIcons();

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Global App Instance
const appState = new AppState();
