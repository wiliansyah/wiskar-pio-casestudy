/* eslint-disable */
// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, Ship, Package, 
  Activity, Award, AlertTriangle, RefreshCcw, 
  ArrowRight, Target, CheckCircle2, Link, Play, ChevronRight, Zap
} from 'lucide-react';

// --- AUTO INJECT TAILWIND CSS (Hanya untuk berjaga-jaga di lingkungan Sandbox) ---
if (typeof document !== 'undefined' && !document.getElementById('tailwind-cdn')) {
  const script = document.createElement('script');
  script.id = 'tailwind-cdn';
  script.src = 'https://cdn.tailwindcss.com';
  document.head.appendChild(script);
}

// --- DYNAMIC BRANCHING SCENARIO: LIGHT TONE + DATA & NUMBERS ---
const STORY_NODES = {
  intro: {
    type: 'intro',
    title: "Nusantara Logistics: Menyelamatkan Kapal Oleng",
    image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=1000&q=80",
    icon: Ship,
    context: "Simulasi Role-Play L&D",
    situation: "Perusahaan ekspedisi tempat Anda bekerja sedang tumbuh pesat. Volume pengiriman naik tajam hingga 40% (sekitar 15.000 paket/hari)! Sayangnya, di balik kesuksesan ini, tingkat turnover (karyawan resign) menyentuh angka kritis 25%. Karyawan kelelahan, dan denda keterlambatan paket dari klien menembus Rp 50 Juta bulan lalu. Sebagai HR Learning & Culture yang baru, Anda punya waktu 5 bulan untuk memperbaiki keadaan.",
    nextNode: 'm1'
  },
  m1: {
    month: 1,
    type: 'single',
    title: "Bulan 1: Masalah Shift Gudang",
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1000&q=80",
    icon: Package,
    context: "Kelelahan Kerja vs Target",
    situation: "Bulan ini tingkat salah sortir (defect rate) naik jadi 12% (sekitar 1.800 paket nyasar). Manajer Gudang sangat marah dan menyuruh Anda mengadakan 'Training Ketelitian' wajib di hari Minggu. Tapi setelah Anda observasi, ternyata 60% karyawan shift malam kurang tidur karena sistem rotasi jadwal 72-jam/minggu yang sangat berantakan.",
    options: [
      {
        text: "Turuti Manajer: Adakan training di hari Minggu agar tingkat kehadiran (compliance) 100% di atas kertas dan manajer senang.",
        impact: { cult: -15, ops: 15, trust: -20 },
        feedback: "Evaluasi: Training berjalan, tapi karyawan yang sudah kurang tidur makin kesal karena hari liburnya hangus. Kesalahan sortir turun 3% sesaat, tapi diam-diam mereka mulai membenci tim HR.",
        nextNode: 'm2_hostile'
      },
      {
        text: "Advokasi Karyawan: Tolak training. Presentasikan data 60% kelelahan tersebut ke bos untuk perbaikan jadwal shift.",
        impact: { cult: 15, ops: -5, trust: 20 },
        feedback: "Evaluasi: Manajer sempat marah, tapi jadwal shift akhirnya dipangkas jadi 48-jam/minggu. Produktivitas sempat melambat 5% di awal penyesuaian, tapi karyawan sangat berterima kasih pada HR.",
        nextNode: 'm2_collab'
      }
    ]
  },
  m2_hostile: {
    month: 2,
    type: 'multi_select',
    title: "Bulan 2: Penolakan Aplikasi (Pilih 2)",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1000&q=80",
    icon: AlertTriangle,
    context: "Krisis Kepercayaan",
    limit: 2,
    situation: "Karena dipaksa ikut training bulan lalu, karyawan masih kesal. Ketika perusahaan merilis aplikasi absen baru senilai Rp 500 Juta, tingkat penggunaan (adoption rate) mandek di angka 35%. 65% sisanya sengaja tidak mau pakai dengan alasan 'ribet'. Pilih 2 tindakan:",
    options: [
      { id: 'a', text: "Kasih Surat Peringatan (SP) masal bagi 65% staf yang menolak pakai aplikasi.", cult: -20, ops: 25, trust: -25 },
      { id: 'b', text: "Tunda aplikasi 1 minggu, kumpulkan keluhan mereka agar aplikasinya dibuat lebih mudah.", cult: 10, ops: -15, trust: 15 },
      { id: 'c', text: "Minta Manajer Area untuk sidak lapangan tiap pagi selama 14 hari berturut-turut.", cult: -15, ops: 15, trust: -15 },
      { id: 'd', text: "Buka kotak saran anonim untuk memetakan spesifik 3 masalah utama aplikasinya.", cult: 15, ops: -5, trust: 10 }
    ],
    evaluateNext: () => 'm3_silo'
  },
  m2_collab: {
    month: 2,
    type: 'multi_select',
    title: "Bulan 2: Belajar Aplikasi Baru (Pilih 2)",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80",
    icon: Activity,
    context: "Perubahan Teknologi",
    limit: 2,
    situation: "Karyawan sudah cukup percaya pada Anda. Saat aplikasi kerja baru dirilis, tidak ada penolakan. Masalahnya, 40% staf senior (usia 45+ tahun) kebingungan cara pakainya, membuat proses input data melambat 20 menit tiap harinya. Pilih 2 inisiatif:",
    options: [
      { id: 'a', text: "Program 1-on-1: Anak muda (Gen Z) ditunjuk jadi 'Buddy' harian untuk staf senior.", cult: 15, ops: 5, trust: 15 },
      { id: 'b', text: "Beri insentif top-up saldo e-wallet Rp 50.000/minggu untuk 10 pengguna tercepat.", cult: 10, ops: 15, trust: 10 },
      { id: 'c', text: "Paksa mereka ikut ujian baca buku panduan 100 halaman dengan batas nilai 80.", cult: -10, ops: -5, trust: -10 },
      { id: 'd', text: "Terapkan aturan potong gaji Rp 10.000 per 1 data yang salah masuk.", cult: -20, ops: 20, trust: -20 }
    ],
    evaluateNext: () => 'm3_silo'
  },
  m3_silo: {
    month: 3,
    type: 'allocation',
    title: "Bulan 3: Konflik Tim Sales vs Gudang",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1000&q=80",
    icon: Target,
    context: "Meredam Ego Sektoral",
    situation: "Demi kejar target penjualan Rp 5 Miliar, tim Sales menjanjikan 'Barang sampai besok!'. Padahal kapasitas Gudang sudah over-load 120%. Akibatnya, penalti klien tembus Rp 60 Juta bulan ini karena telat. Mereka saling menyalahkan. Anda punya Anggaran L&D Rp 100 Juta (100%). Atur persentasenya:",
    sliders: [
      { id: 's1', label: "Tukar Nasib (Sales wajib kerja 2 hari di gudang biar tahu nyatanya)", key: 'cult', color: 'bg-emerald-500' },
      { id: 's2', label: "Bikin aturan denda ketat Rp 1 Juta/kejadian jika janji meleset", key: 'ops', color: 'bg-orange-500' },
      { id: 's3', label: "Sewa Vila untuk Liburan (Outing) 3 hari 2 malam agar mereka akrab", key: 'trust', color: 'bg-blue-500' }
    ],
    evaluateNext: (allocations) => {
      if (allocations.s2 > 50) return 'm4_burnout'; 
      if (allocations.s3 > 50) return 'm4_complacent'; 
      return 'm4_balanced'; 
    }
  },
  m4_burnout: {
    month: 4,
    type: 'matching',
    title: "Bulan 4: Pemimpin yang Kelelahan",
    image: "https://images.unsplash.com/photo-1498551172505-8ee7ad69f235?auto=format&fit=crop&w=1000&q=80",
    icon: Link,
    context: "Dampak Aturan Terlalu Ketat",
    situation: "Aturan denda ketat bulan lalu berhasil menurunkan kerugian penalti hingga 80%, tapi tingkat stres manajer naik drastis dan bertindak toxic. Pasangkan masalah 3 manajer ini dengan program L&D yang pas:",
    items: [
      { id: 'p1', label: "Manajer Truk: Memaki sopir yang telat 15 menit kena macet." },
      { id: 'p2', label: "Manajer Sales: Memanipulasi 5% data klien agar lolos dari denda." },
      { id: 'p3', label: "Supervisor Gudang: Kena serangan panik dan izin sakit 3 hari." }
    ],
    answers: [
      { id: 'a1', label: "Training Etika Kejujuran & Nilai Anti-Fraud Perusahaan" },
      { id: 'a2', label: "Wajib Ambil Cuti 5 Hari & Difasilitasi Konseling Psikolog" },
      { id: 'a3', label: "Sesi Coaching Cara Mengelola Emosi (Anger Management)" }
    ],
    correctMatch: { p1: 'a3', p2: 'a1', p3: 'a2' },
    evaluateNext: () => 'm5_final'
  },
  m4_complacent: {
    month: 4,
    type: 'matching',
    title: "Bulan 4: Kerja Terlalu Santai",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80",
    icon: Link,
    context: "Dampak Terlalu Banyak Main",
    situation: "Karena bulan lalu Anda kasih 50%+ dana untuk Outing, kepuasan karyawan (survey) naik ke angka 85%. TAPI produktivitas anjlok 15% karena mereka merasa 'kekeluargaan' dan segan menegur teman yang salah. Pasangkan solusinya:",
    items: [
      { id: 'p1', label: "Manajer Gudang: Mentolerir 20% stafnya yang telat masuk 30 menit." },
      { id: 'p2', label: "Manajer Sales: Bersantai, 40% target jualan bulan ini gagal dicapai." },
      { id: 'p3', label: "Supervisor: Takut negur bawahan yang main HP saat jam kerja." }
    ],
    answers: [
      { id: 'a1', label: "Latihan Cara Negur Tim dengan Tegas tapi Sopan (Komunikasi Asertif)" },
      { id: 'a2', label: "Kalibrasi Ulang Target Harian & Coaching Performa Ketat" },
      { id: 'a3', label: "Review Ulang SOP Jam Kerja & Terapkan Sanksi SP Bertahap" }
    ],
    correctMatch: { p1: 'a3', p2: 'a2', p3: 'a1' },
    evaluateNext: () => 'm5_final'
  },
  m4_balanced: {
    month: 4,
    type: 'matching',
    title: "Bulan 4: Mengembangkan Potensi",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=80",
    icon: Link,
    context: "Promosi Jabatan",
    situation: "Karena pembagian dana Anda seimbang, perusahaan stabil dengan target penjualan tercapai 95%. Ini saatnya Anda membantu 3 manajer menengah agar makin jago dan siap promosi. Pasangkan kelemahannya:",
    items: [
      { id: 'p1', label: "Manajer Armada: Jago teknis mesin 100%, tapi 0% paham arah bisnis perusahaan." },
      { id: 'p2', label: "Manajer Sales: Bisa jualan Rp 2 Miliar/bulan sendirian, tapi kerjanya ditanggung sendiri." },
      { id: 'p3', label: "Supervisor Senior: Kerjanya selalu rapi, tapi produktivitasnya mandek karena bosan 3 tahun jabatannya sama." }
    ],
    answers: [
      { id: 'a1', label: "Rotasi Kerja: Kasih tantangan proyek 2 bulan di divisi sebelah" },
      { id: 'a2', label: "Kelas Khusus Eksekutif: Belajar Strategi & Gambaran Besar Keuangan" },
      { id: 'a3', label: "Training Kepemimpinan: Seni Memberi Kepercayaan & Mendelegasikan Tugas" }
    ],
    correctMatch: { p1: 'a2', p2: 'a3', p3: 'a1' },
    evaluateNext: () => 'm5_final'
  },
  m5_final: {
    month: 5,
    type: 'single',
    title: "Bulan 5: Rapat Akhir Tahun",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&w=1000&q=80",
    icon: Award,
    context: "Memilih Budaya Utama",
    situation: "Rapat terakhir Anda tahun ini dengan Direktur Utama. Dengan ancaman krisis ekonomi global yang diprediksi menurunkan profit industri sebesar 10% tahun depan, Beliau bertanya: 'Apa fokus nilai (core value) yang harus kita jalankan?'",
    options: [
      {
        text: "Pilihan A: 'Kecepatan & Eksekusi' - Fokus utama tembus target 100% apapun yang terjadi. Yang gagal akan langsung diganti (sistem cut-throat).",
        impact: { cult: -15, ops: 25, trust: -15 },
        feedback: "Hasil Akhir: Profit jangka pendek naik 12%. Namun, budaya kerja berubah menjadi sangat robotik dan tegang. Karyawan merasa hanya dihargai dari angkanya saja.",
        nextNode: 'ending'
      },
      {
        text: "Pilihan B: 'Kolaborasi & Peduli' - Fokus utama pada kekompakan lintas divisi dan menjaga kesehatan mental karyawan di masa sulit.",
        impact: { cult: 25, ops: -10, trust: 25 },
        feedback: "Hasil Akhir: Profit tertahan di angka 5%. Tapi ternyata dengan tim yang akrab, biaya rekrutmen turun tajam karena tingkat turnover turun dari 25% menjadi hanya 8%!",
        nextNode: 'ending'
      }
    ]
  }
};

export default function CaseStudyApp() {
  const [currentNodeId, setCurrentNodeId] = useState('intro');
  const [scores, setScores] = useState({ cult: 50, ops: 50, trust: 50 });
  
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [impactDelta, setImpactDelta] = useState({ cult: 0, ops: 0, trust: 0 });
  const [nextPendingNode, setNextPendingNode] = useState(null);
  
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionMsg, setTransitionMsg] = useState("");

  const [multiSelect, setMultiSelect] = useState([]);
  const [allocations, setAllocations] = useState({ s1: 34, s2: 33, s3: 33 });
  const [matches, setMatches] = useState({ p1: '', p2: '', p3: '' });
  
  const [imgError, setImgError] = useState(false);
  const gameBoardRef = useRef(null);

  const currentStepData = STORY_NODES[currentNodeId] || {};
  const currentMonthNum = currentStepData.month || 0;

  useEffect(() => {
    setImgError(false);
  }, [currentNodeId]);

  const scrollToBoard = () => {
    if (gameBoardRef.current) {
      gameBoardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const applyImpact = (delta, customMsg, nextNode) => {
    const newScores = {
      cult: Math.max(0, Math.min(100, scores.cult + delta.cult)),
      ops: Math.max(0, Math.min(100, scores.ops + delta.ops)),
      trust: Math.max(0, Math.min(100, scores.trust + delta.trust)),
    };
    setScores(newScores);
    setImpactDelta(delta);
    setFeedbackMsg(customMsg);
    setNextPendingNode(nextNode);
    setShowFeedback(true);
    setTimeout(scrollToBoard, 50);
  };

  const handleNextStep = () => {
    setShowFeedback(false);
    setIsTransitioning(true);
    scrollToBoard();
    
    const nextNodeData = STORY_NODES[nextPendingNode];
    if (nextPendingNode === 'ending') {
      setTransitionMsg("Mengevaluasi Hasil Kinerja 5 Bulan...");
    } else {
      setTransitionMsg(`Waktu Berjalan... Memasuki Bulan Ke-${nextNodeData.month}`);
    }

    setTimeout(() => {
      setCurrentNodeId(nextPendingNode);
      setMultiSelect([]);
      setAllocations({ s1: 34, s2: 33, s3: 33 });
      setMatches({ p1: '', p2: '', p3: '' });
      setIsTransitioning(false);
      setTimeout(scrollToBoard, 50);
    }, 2500); 
  };

  const handleSingleChoice = (option) => {
    applyImpact(option.impact, option.feedback, option.nextNode);
  };

  const toggleMultiSelect = (id) => {
    if (multiSelect.includes(id)) {
      setMultiSelect(multiSelect.filter(i => i !== id));
    } else if (multiSelect.length < currentStepData.limit) {
      setMultiSelect([...multiSelect, id]);
    }
  };

  const submitMultiSelect = () => {
    let dCult = 0, dOps = 0, dTrust = 0;
    currentStepData.options.forEach(opt => {
      if (multiSelect.includes(opt.id)) {
        dCult += opt.cult; dOps += opt.ops; dTrust += opt.trust;
      }
    });
    const isPositive = dTrust >= 0;
    const msg = isPositive 
      ? "Luar biasa! Pilihan Anda sangat manusiawi. Tingkat adopsi aplikasi perlahan naik menembus 80% karena karyawan merasa didampingi."
      : "Tindakan Anda cukup agresif! Penggunaan aplikasi melonjak 95% secara instan, tapi kerugian rekrutmen diprediksi naik karena banyak staf mogok diam-diam.";
    applyImpact({ cult: dCult, ops: dOps, trust: dTrust }, msg, currentStepData.evaluateNext());
  };

  const submitAllocation = () => {
    const dCult = Math.floor((allocations.s1 - 33) * 0.5) + Math.floor((allocations.s3 - 33) * 0.2);
    const dOps = Math.floor((allocations.s2 - 33) * 0.6) + Math.floor((allocations.s1 - 33) * 0.2);
    const dTrust = Math.floor((allocations.s3 - 33) * 0.5) + Math.floor((allocations.s1 - 33) * 0.3) - Math.floor((allocations.s2 - 33) * 0.4);
    
    let msg = "";
    if (allocations.s2 > 50) msg = "Dampak: Denda ditekan hingga 0%, tapi orang jadi sibuk cari alasan biar nggak disalahkan. Kerjasama tim malah makin hancur.";
    else if (allocations.s3 > 50) msg = "Dampak: Kepuasan kerja menyentuh 90%. Tapi awas, mereka mulai santai, ngobrol terus, dan mengabaikan target pengiriman harian.";
    else msg = "Dampak: Pengaturan anggaran yang mantap! Program tukar nasib 2 hari sukses bikin tim Sales sadar bahwa gudang sudah kepanasan.";
    applyImpact({ cult: dCult, ops: dOps, trust: dTrust }, msg, currentStepData.evaluateNext(allocations));
  };

  const handleMatchSelect = (problemId, answerId) => {
    const newMatches = { ...matches };
    for (const key in newMatches) {
      if (newMatches[key] === answerId) newMatches[key] = '';
    }
    newMatches[problemId] = answerId;
    setMatches(newMatches);
  };

  const submitMatching = () => {
    let correctCount = 0;
    if (matches.p1 === currentStepData.correctMatch.p1) correctCount++;
    if (matches.p2 === currentStepData.correctMatch.p2) correctCount++;
    if (matches.p3 === currentStepData.correctMatch.p3) correctCount++;

    const delta = { cult: correctCount * 10 - 10, ops: correctCount * 5 - 5, trust: correctCount * 10 - 10 };
    let msg = "";
    if (correctCount === 3) msg = "Akurasi 100%! Anda sangat jeli menggunakan data perilaku. Anda memberikan intervensi pengembangan yang tepat sasaran.";
    else if (correctCount > 0) msg = "Akurasi 33-66%. Ada beberapa yang benar. Tapi hati-hati, manajer yang dapat penugasan salah malah membuat performanya turun.";
    else msg = "Akurasi 0%! Memberikan intervensi yang tidak nyambung membuat perusahaan rugi biaya training tanpa ada perubahan nyata.";
    applyImpact(delta, msg, currentStepData.evaluateNext());
  };

  const RadarChart = ({ data }) => {
    const radius = 60;
    const center = 100;
    const getPos = (val, angleDeg) => {
      const angleRad = (angleDeg - 90) * (Math.PI / 180);
      const r = (val / 100) * radius;
      return `${center + r * Math.cos(angleRad)},${center + r * Math.sin(angleRad)}`;
    };

    const points = `${getPos(data.trust, 0)} ${getPos(data.cult, 120)} ${getPos(data.ops, 240)}`;
    const fullPoints = `${getPos(100, 0)} ${getPos(100, 120)} ${getPos(100, 240)}`;
    const midPoints = `${getPos(50, 0)} ${getPos(50, 120)} ${getPos(50, 240)}`;

    return (
      <div className="relative w-[180px] h-[180px] md:w-[200px] md:h-[200px] flex-shrink-0 animate-pulse-soft mx-auto">
        <svg width="100%" height="100%" viewBox="0 0 200 200" className="overflow-visible">
          <polygon points={fullPoints} fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
          <polygon points={midPoints} fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
          <line x1={center} y1={center} x2={center} y2={center - radius} stroke="#cbd5e1" />
          <line x1={center} y1={center} x2={center + radius * Math.cos(30 * Math.PI / 180)} y2={center + radius * Math.sin(30 * Math.PI / 180)} stroke="#cbd5e1" />
          <line x1={center} y1={center} x2={center - radius * Math.cos(30 * Math.PI / 180)} y2={center + radius * Math.sin(30 * Math.PI / 180)} stroke="#cbd5e1" />
          <polygon points={points} fill="rgba(30, 58, 138, 0.25)" stroke="#1e3a8a" strokeWidth="2.5" className="transition-all duration-700" />
        </svg>
        <div className="absolute -top-2 left-[50%] -translate-x-1/2 text-[9px] md:text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 rounded shadow-sm">KEPERCAYAAN</div>
        <div className="absolute bottom-2 -right-4 text-[9px] md:text-[10px] font-bold text-blue-700 bg-blue-50 px-1 rounded shadow-sm">BUDAYA</div>
        <div className="absolute bottom-2 -left-4 text-[9px] md:text-[10px] font-bold text-orange-700 bg-orange-50 px-1 rounded shadow-sm">OPERASIONAL</div>
      </div>
    );
  };

  const getEnding = () => {
    const { cult, ops, trust } = scores;
    const avg = (cult + ops + trust) / 3;
    if (cult > 70 && trust > 70 && ops > 60) return { title: "Hero HR: Panutan Semua Orang", grade: "A+", desc: "Efisiensi gudang tembus 90% dan turnover turun ke 5%. Anda merubah perusahaan jadi tempat yang sangat produktif sekaligus nyaman.", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" };
    if (ops > 75 && trust < 45) return { title: "Bos Galak: Target Hit, Team Quit", grade: "C+", desc: "Profit naik 15%, tapi turnover meroket ke angka 40%. Karyawan tersiksa kerja dengan gaya polisi Anda. Perusahaan rugi besar untuk biaya rekrutmen ulang.", color: "text-orange-700", bg: "bg-orange-50 border-orange-200" };
    if (cult > 75 && ops < 45) return { title: "Terlalu Baik: Gak Berani Tegas", grade: "C", desc: "Karyawan bahagia (Score 95%), tapi efisiensi gudang hancur lebur. Perusahaan rugi ratusan juta karena Anda terlalu gak enakan pasang target ketat.", color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" };
    if (avg < 45) return { title: "Gagal Total: Minus di Semua Lini", grade: "F", desc: "Produktivitas turun 20% dan budaya kerja penuh adu domba. Anda dipanggil Bos Besar dan diminta buat menyerahkan jabatan L&D Anda ke orang lain.", color: "text-red-700", bg: "bg-red-50 border-red-200" };
    return { title: "HR Taktis: Penyelamat Standar", grade: "B", desc: "Angka operasional cukup stabil di kisaran 75% dan turnover ditahan di 15%. Belum memuaskan 100%, tapi kerja keras Anda meredam krisis patut diapresiasi!", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" };
  };

  const ProgressTimeline = () => {
    return (
      <div className="bg-slate-50 border-b border-slate-200 p-4 md:p-6 relative z-10 flex flex-col justify-center">
        <div className="flex justify-between items-center relative w-full max-w-xl mx-auto mt-2">
          {/* Garis Abu-abu (Background) */}
          <div className="absolute top-1/2 left-[5%] right-[5%] h-1 bg-slate-200 -translate-y-1/2 z-0 rounded-full"></div>
          {/* Garis Biru (Progress) */}
          <div 
            className="absolute top-1/2 left-[5%] h-1 bg-blue-600 -translate-y-1/2 z-0 rounded-full transition-all duration-1000 ease-in-out"
            style={{ width: `${(currentMonthNum > 0 ? currentMonthNum - 1 : 0) * 22.5}%` }}
          ></div>

          {/* Titik Bulan */}
          {[1, 2, 3, 4, 5].map((month) => {
            const isActive = currentMonthNum === month;
            const isPast = currentMonthNum > month;
            return (
              <div key={month} className="relative z-10 flex flex-col items-center px-1">
                <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full border-2 transition-all duration-500 ${isActive ? 'bg-blue-600 border-white scale-125 shadow-md' : isPast ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`}></div>
                <span className={`text-[9px] md:text-[10px] uppercase font-bold mt-2 md:mt-3 absolute top-3 md:top-4 whitespace-nowrap ${isActive ? 'text-blue-800' : 'text-slate-400'}`}>Bln {month}</span>
              </div>
            );
          })}

          {/* Ikon Kapal Bergerak */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 -mt-3 z-20 text-blue-900 transition-all duration-1000 ease-in-out drop-shadow-md animate-float-small"
            style={{ 
              left: `calc(5% + ${(currentMonthNum > 0 ? currentMonthNum - 1 : 0) * 22.5}% - 14px)`,
              opacity: currentMonthNum > 0 ? 1 : 0 
            }}
          >
            <Ship size={28} className="md:w-8 md:h-8" fill="white" strokeWidth={1.5} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans p-3 md:p-6 lg:p-8 flex flex-col items-center overflow-x-hidden relative">
      
      {/* Ornamen Background Tembus Pandang */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-50 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[80vw] md:w-[50vw] h-[80vw] md:h-[50vw] rounded-full bg-blue-200 blur-[100px] animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[80vw] md:w-[50vw] h-[80vw] md:h-[50vw] rounded-full bg-emerald-100 blur-[100px] animate-blob animation-delay-2000" />
      </div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row gap-5 md:gap-6">
        
        {/* --- HEADER MOBILE KHUSUS --- */}
        <div className="md:hidden bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
             <div className="bg-blue-50 p-2 rounded-lg border border-blue-100">
                <ShieldAlert className="text-blue-600" size={20} />
             </div>
             <div>
                <h1 className="text-sm font-extrabold text-slate-800 leading-tight">L&C Command Center</h1>
                <p className="text-[10px] text-slate-500 font-medium">Uji Keputusan HR Anda</p>
             </div>
          </div>
          {currentNodeId !== 'intro' && currentNodeId !== 'ending' && (
             <div className="bg-blue-600 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-sm">
               Bln {currentMonthNum}/5
             </div>
          )}
        </div>

        {/* --- KOLOM KIRI: GRAFIK & SKOR --- */}
        <div className="w-full md:w-1/3 flex flex-col gap-4 md:gap-6 order-last md:order-first">
          
          {/* Header Desktop */}
          <div className="hidden md:block bg-blue-950 p-6 rounded-3xl shadow-xl border border-blue-900 text-white relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
              <ShieldAlert size={120} />
            </div>
            <h1 className="text-xl font-extrabold flex items-center gap-3 mb-2 relative z-10">
              <ShieldAlert className="text-blue-300" size={24} />
              L&C Command Center
            </h1>
            <p className="text-xs text-blue-200 relative z-10 font-medium">Mini Game: Uji Keputusan HR Anda</p>
          </div>

          {/* Panel Radar Chart */}
          {currentNodeId !== 'intro' && currentNodeId !== 'ending' && (
            <div className="bg-white p-5 md:p-6 rounded-3xl shadow-md border border-slate-200 flex flex-col relative overflow-hidden">
              <h3 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">Grafik Kinerja</h3>
              <RadarChart data={scores} />
              
              <div className="w-full space-y-2 mt-6">
                <MetricBar label="Trust (Kepercayaan)" value={scores.trust} color="bg-emerald-500" text="text-emerald-800" bg="bg-emerald-50" border="border-emerald-100" />
                <MetricBar label="Culture (Budaya)" value={scores.cult} color="bg-blue-500" text="text-blue-800" bg="bg-blue-50" border="border-blue-100" />
                <MetricBar label="Ops (Target Gudang)" value={scores.ops} color="bg-orange-500" text="text-orange-800" bg="bg-orange-50" border="border-orange-100" />
              </div>
            </div>
          )}
        </div>

        {/* --- KOLOM KANAN: AREA PERMAINAN --- */}
        <div className="w-full md:w-2/3 order-first md:order-last">
          <div 
            ref={gameBoardRef}
            className="bg-slate-100 shadow-xl border border-slate-200 rounded-3xl overflow-hidden min-h-[500px] flex flex-col relative transition-all duration-500"
          >
            {/* Garis Aksen Biru di atas */}
            <div className="h-2 bg-blue-600 flex-shrink-0" />

            {/* Timeline Perjalanan */}
            {currentMonthNum > 0 && currentNodeId !== 'ending' && <ProgressTimeline />}

            {/* Layar Transisi Animasi */}
            {isTransitioning && (
              <div className="absolute inset-0 z-50 bg-blue-950 flex flex-col items-center justify-center overflow-hidden animate-fade-in rounded-b-3xl">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-1/2 left-0 w-[200%] h-40 border-t-4 border-blue-400 rounded-[50%] animate-wave"></div>
                </div>
                <div className="animate-sail absolute top-1/2 -translate-y-1/2">
                   <Ship size={60} className="md:w-20 md:h-20 text-white drop-shadow-xl" strokeWidth={1} fill="rgba(255,255,255,0.2)" />
                </div>
                <h2 className="text-white text-xl md:text-2xl font-bold mt-32 md:mt-40 z-10 animate-pulse tracking-wide text-center px-6">
                  {transitionMsg}
                </h2>
              </div>
            )}

            {/* --- DESAIN KARTU APP BARU (PERBAIKAN VISUAL) --- */}
            {currentStepData.image && currentNodeId !== 'ending' && !showFeedback && !isTransitioning && (
               <div className="relative w-full h-[220px] md:h-[280px] bg-slate-800 flex-shrink-0">
                 {!imgError ? (
                   <img 
                      src={currentStepData.image} 
                      alt="Scene Visualization" 
                      className="w-full h-full object-cover opacity-80"
                      onError={() => setImgError(true)}
                   />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center bg-blue-900">
                      <div className="text-white/30 animate-pulse"><Activity size={60} /></div>
                   </div>
                 )}
                 {/* Overlay gelap agar gambar lebih dramatis */}
                 <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply" />
               </div>
            )}

            <div className="flex-1 flex flex-col relative z-10">
              
              {/* INTRO */}
              {currentNodeId === 'intro' && !isTransitioning && (
                <div className="bg-white flex-1 rounded-t-[2.5rem] -mt-10 px-5 md:px-10 pt-14 pb-10 flex flex-col items-center text-center shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative">
                  
                  {/* Floating Icon Overlap */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-full border-4 border-slate-100 shadow-xl flex items-center justify-center animate-float">
                    <Ship size={36} className="text-blue-600" strokeWidth={2} />
                  </div>

                  <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 mb-4 leading-tight animate-slide-up">
                    {currentStepData.title}
                  </h2>
                  <p className="text-slate-600 text-sm md:text-lg leading-relaxed mb-8 max-w-2xl animate-slide-up">
                    {currentStepData.situation}
                  </p>
                  <button 
                    onClick={() => setCurrentNodeId(currentStepData.nextNode)}
                    className="px-8 py-4 md:py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg flex items-center gap-3 w-full md:w-auto text-base md:text-lg animate-slide-up active:scale-95"
                  >
                    <Play fill="currentColor" size={20} /> Mulai Simulasi L&D
                  </button>
                </div>
              )}

              {/* PERTANYAAN / SCENARIO */}
              {currentNodeId !== 'intro' && currentNodeId !== 'ending' && !showFeedback && !isTransitioning && (
                <div className="bg-white flex-1 rounded-t-[2.5rem] -mt-8 md:-mt-10 px-5 md:px-10 pt-12 md:pt-14 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] relative">
                  
                  {/* Floating Icon Overlap */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-full border-4 border-slate-100 shadow-xl flex items-center justify-center animate-float">
                    {currentStepData.icon && <currentStepData.icon size={36} className="text-blue-600" strokeWidth={2} />}
                  </div>

                  <div className="text-center mb-6 md:mb-8 animate-slide-up">
                    <span className="text-blue-600 text-[10px] md:text-xs font-extrabold uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">{currentStepData.context}</span>
                    <h2 className="text-xl md:text-3xl font-extrabold text-slate-900 mt-3 leading-snug">{currentStepData.title}</h2>
                  </div>

                  <p className="text-slate-600 text-sm md:text-lg leading-relaxed mb-8 md:mb-10 text-center animate-slide-up">
                    {currentStepData.situation}
                  </p>

                  <div className="animate-slide-up">
                    
                    {/* SINGLE CHOICE */}
                    {currentStepData.type === 'single' && (
                      <div className="space-y-3 md:space-y-4">
                        {currentStepData.options.map((opt, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSingleChoice(opt)}
                            className="w-full text-left p-4 md:p-5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-400 rounded-2xl transition-all group flex items-start gap-4 shadow-sm active:scale-[0.98]"
                          >
                            <div className="mt-0.5 p-1.5 rounded-full bg-white border border-slate-200 text-slate-400 group-hover:text-blue-600 group-hover:border-blue-300 transition-colors">
                              <ChevronRight size={18} strokeWidth={3} />
                            </div>
                            <span className="text-slate-700 group-hover:text-blue-900 flex-1 font-semibold text-sm md:text-base leading-relaxed">{opt.text}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* MULTI SELECT */}
                    {currentStepData.type === 'multi_select' && (
                      <div>
                        <div className="flex justify-between items-center mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-xs md:text-sm font-bold text-slate-600 uppercase tracking-wide">Pilih {currentStepData.limit} Tindakan:</span>
                          <span className={`text-xs md:text-sm font-bold px-3 py-1 rounded-full transition-colors ${multiSelect.length === currentStepData.limit ? 'bg-emerald-100 text-emerald-800' : 'bg-white border border-slate-300 text-slate-500'}`}>
                            {multiSelect.length}/{currentStepData.limit} Terpilih
                          </span>
                        </div>
                        <div className="flex flex-col gap-3 mb-6">
                          {currentStepData.options.map((opt) => {
                            const isSelected = multiSelect.includes(opt.id);
                            const isDisabled = !isSelected && multiSelect.length >= currentStepData.limit;
                            return (
                              <button
                                key={opt.id}
                                onClick={() => toggleMultiSelect(opt.id)}
                                disabled={isDisabled}
                                className={`w-full p-4 rounded-2xl border text-left flex items-start gap-4 transition-all ${
                                  isSelected ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-sm' : 
                                  isDisabled ? 'bg-slate-50 border-slate-200 text-slate-400 opacity-60' : 
                                  'bg-white border-slate-200 text-slate-600 hover:border-blue-300 active:scale-[0.98]'
                                }`}
                              >
                                <div className={`mt-0.5 rounded-full p-1 border-2 flex-shrink-0 transition-all ${isSelected ? 'border-blue-500 text-blue-500 bg-white' : 'border-slate-300 text-transparent'}`}>
                                  <CheckCircle2 size={16} strokeWidth={3} />
                                </div>
                                <span className="text-sm md:text-base font-medium leading-relaxed">{opt.text}</span>
                              </button>
                            );
                          })}
                        </div>
                        <button 
                          onClick={submitMultiSelect}
                          disabled={multiSelect.length !== currentStepData.limit}
                          className="w-full py-4 bg-blue-600 disabled:bg-slate-300 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 text-sm md:text-base"
                        >
                          Terapkan Keputusan
                        </button>
                      </div>
                    )}

                    {/* ALLOCATION */}
                    {currentStepData.type === 'allocation' && (
                      <div>
                        <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                          <h4 className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Grafik 100% Anggaran</h4>
                          <div className="h-6 md:h-8 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                            <div style={{width: `${allocations.s1}%`}} className="bg-emerald-500 h-full transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-white">{allocations.s1 > 10 ? `${allocations.s1}%` : ''}</div>
                            <div style={{width: `${allocations.s2}%`}} className="bg-orange-500 h-full transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-white">{allocations.s2 > 10 ? `${allocations.s2}%` : ''}</div>
                            <div style={{width: `${allocations.s3}%`}} className="bg-blue-500 h-full transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-white">{allocations.s3 > 10 ? `${allocations.s3}%` : ''}</div>
                          </div>
                        </div>

                        <div className="space-y-4 mb-6">
                          {currentStepData.sliders.map(slider => (
                            <div key={slider.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                              <div className="flex justify-between mb-3 items-center">
                                <span className="text-xs md:text-sm font-bold text-slate-700 flex items-center gap-2">
                                  <span className={`w-3 h-3 rounded-full flex-shrink-0 ${slider.color}`}></span>
                                  {slider.label}
                                </span>
                                <span className="text-blue-700 font-mono font-bold bg-blue-50 px-2 py-1 rounded-md border border-blue-100 text-sm">{allocations[slider.id]}%</span>
                              </div>
                              <input 
                                type="range" min="0" max="100" 
                                value={allocations[slider.id]}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  setAllocations({ ...allocations, [slider.id]: val });
                                }}
                                className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer border border-slate-300 accent-blue-600 touch-none"
                              />
                            </div>
                          ))}
                        </div>

                        <button 
                          onClick={submitAllocation}
                          disabled={(allocations.s1 + allocations.s2 + allocations.s3) !== 100}
                          className="w-full py-4 bg-blue-600 disabled:bg-slate-300 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 text-sm md:text-base"
                        >
                          {(allocations.s1 + allocations.s2 + allocations.s3) === 100 ? 'Konfirmasi Alokasi' : `Sisa ${100 - (allocations.s1 + allocations.s2 + allocations.s3)}% Belum Dialokasikan`}
                        </button>
                      </div>
                    )}

                    {/* MATCHING */}
                    {currentStepData.type === 'matching' && (
                      <div>
                        <div className="space-y-4 md:space-y-5 mb-6">
                          {currentStepData.items.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                              <div className="text-xs md:text-sm text-slate-800 bg-orange-50 p-3 rounded-lg border-l-4 border-orange-500 font-medium mb-3">
                                {item.label}
                              </div>
                              <div className="flex flex-col gap-2">
                                {currentStepData.answers.map(ans => {
                                  const isSelectedHere = matches[item.id] === ans.id;
                                  const isSelectedElsewhere = Object.values(matches).includes(ans.id) && !isSelectedHere;
                                  return (
                                    <button
                                      key={ans.id}
                                      onClick={() => handleMatchSelect(item.id, ans.id)}
                                      disabled={isSelectedElsewhere}
                                      className={`p-3 rounded-lg text-xs md:text-sm font-semibold border transition-all flex items-center gap-3 text-left ${
                                        isSelectedHere ? 'bg-blue-50 border-blue-500 text-blue-800' :
                                        isSelectedElsewhere ? 'bg-slate-50 border-slate-200 text-slate-400 opacity-50' :
                                        'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                                      }`}
                                    >
                                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${isSelectedHere ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-300'}`}>
                                        {isSelectedHere && <CheckCircle2 size={12} />}
                                      </div>
                                      <span>{ans.label}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                        <button 
                          onClick={submitMatching}
                          disabled={!matches.p1 || !matches.p2 || !matches.p3}
                          className="w-full py-4 bg-blue-600 disabled:bg-slate-300 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 text-sm md:text-base"
                        >
                          Cek Jawaban Anda
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* FEEDBACK OVERLAY */}
              {showFeedback && !isTransitioning && (
                <div className="bg-white flex-1 rounded-t-[2.5rem] -mt-10 px-5 md:px-10 pt-12 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative text-center">
                  
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-blue-50 rounded-full border-4 border-white shadow-xl flex items-center justify-center animate-float">
                    <Zap size={32} className="text-blue-600" strokeWidth={2} />
                  </div>

                  <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-4 mt-2">Evaluasi Kinerja</h3>
                  <p className="text-sm md:text-base text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed bg-slate-50 p-4 md:p-6 rounded-2xl border border-slate-200">
                    "{feedbackMsg}"
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-3 mb-8 w-full">
                    <StatPill label="Trust" delta={impactDelta.trust} color="text-emerald-600" bg="bg-emerald-50" />
                    <StatPill label="Culture" delta={impactDelta.cult} color="text-blue-600" bg="bg-blue-50" />
                    <StatPill label="Ops" delta={impactDelta.ops} color="text-orange-600" bg="bg-orange-50" />
                  </div>

                  <button 
                    onClick={handleNextStep}
                    className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-3 active:scale-95 mx-auto text-sm md:text-base"
                  >
                    Lanjut ke Bulan Berikutnya <ArrowRight size={18} />
                  </button>
                </div>
              )}

              {/* ENDING */}
              {currentNodeId === 'ending' && !isTransitioning && (
                <div className="bg-white flex-1 rounded-t-[2.5rem] -mt-10 px-5 md:px-10 pt-14 pb-10 text-center shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative">
                  
                  <div className={`absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-4 border-white shadow-xl flex items-center justify-center animate-float ${getEnding().bg}`}>
                    <Award size={40} className={getEnding().color} strokeWidth={1.5} />
                  </div>

                  <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-6">Laporan Akhir HR</h2>
                  
                  <div className={`${getEnding().bg} p-6 md:p-8 rounded-3xl text-center mb-8 border`}>
                    <div className={`text-5xl md:text-7xl font-black mb-2 ${getEnding().color}`}>
                      {getEnding().grade}
                    </div>
                    <h3 className={`text-lg md:text-xl font-bold mb-4 ${getEnding().color}`}>
                      {getEnding().title}
                    </h3>
                    <p className="text-slate-700 text-sm md:text-base leading-relaxed">
                      "{getEnding().desc}"
                    </p>
                  </div>

                  <button onClick={() => window.location.reload()} className="w-full md:w-auto mx-auto flex items-center justify-center gap-3 px-8 py-4 bg-slate-800 hover:bg-slate-900 rounded-xl shadow-md text-white font-bold text-sm md:text-base active:scale-95">
                    <RefreshCcw size={18} /> Main Ulang Skenario
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0% { transform: translateY(0px) translateX(-50%); } 50% { transform: translateY(-8px) translateX(-50%); } 100% { transform: translateY(0px) translateX(-50%); } }
        @keyframes floatSmall { 0% { transform: translateY(-50%) translateX(0px); } 50% { transform: translateY(-60%) translateX(0px); } 100% { transform: translateY(-50%) translateX(0px); } }
        @keyframes pulseSoft { 0% { transform: scale(1); } 50% { transform: scale(1.02); } 100% { transform: scale(1); } }
        @keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(15px, -25px) scale(1.05); } 66% { transform: translate(-10px, 15px) scale(0.95); } 100% { transform: translate(0px, 0px) scale(1); } }
        @keyframes imageZoom { 0% { transform: scale(1.05); } 100% { transform: scale(1); } }
        @keyframes sailAcross { 0% { transform: translateX(-100px) translateY(-50%) rotate(-5deg); opacity: 0; } 20% { opacity: 1; } 50% { transform: translateX(calc(50vw - 20px)) translateY(-60%) rotate(0deg); } 80% { opacity: 1; } 100% { transform: translateX(100vw) translateY(-50%) rotate(5deg); opacity: 0; } }
        
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.5s ease-out forwards; opacity: 0; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-float-small { animation: floatSmall 2s ease-in-out infinite; }
        .animate-pulse-soft { animation: pulseSoft 4s ease-in-out infinite; }
        .animate-blob { animation: blob 8s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animate-image-zoom { animation: imageZoom 1.5s ease-out forwards; }
        .animate-sail { animation: sailAcross 2.5s ease-in-out forwards; left: 0; pointer-events: none; }
        
        /* Mobile friendly slider thumb */
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; height: 20px; width: 20px; border-radius: 50%;
          background: #2563eb; cursor: pointer; margin-top: -6px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        @media (min-width: 768px) {
          input[type=range]::-webkit-slider-thumb { height: 24px; width: 24px; margin-top: -8px; }
        }
        input[type=range]::-webkit-slider-runnable-track { width: 100%; height: 8px; cursor: pointer; background: #e2e8f0; border-radius: 9999px; }
      `}} />
    </div>
  );
}

const MetricBar = ({ label, value, color, text, bg, border }) => (
  <div className={`flex flex-col gap-1 p-2 md:p-3 rounded-lg border ${bg} ${border}`}>
    <div className="flex justify-between items-center text-[10px] md:text-xs font-bold">
      <span className={text}>{label}</span>
      <span className={text}>{value}/100</span>
    </div>
    <div className="h-1.5 w-full bg-white/50 rounded-full overflow-hidden shadow-inner">
      <div className={`h-full ${color} transition-all duration-1000 ease-out`} style={{ width: `${value}%` }} />
    </div>
  </div>
);

const StatPill = ({ label, delta, color, bg }) => {
  if (delta === 0) return null;
  const isPos = delta > 0;
  return (
    <div className={`px-4 py-2 md:px-5 md:py-3 flex-1 min-w-[70px] rounded-xl font-bold border flex flex-col items-center shadow-sm ${isPos ? `${bg} border-slate-200 text-slate-800` : 'bg-red-50 border-red-200 text-red-800'}`}>
      <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-slate-500 mb-1">{label}</span>
      <span className={`text-lg md:text-2xl leading-none ${isPos ? color : 'text-red-600'}`}>{isPos ? '+' : ''}{delta}</span>
    </div>
  );
};