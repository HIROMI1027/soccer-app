import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, Award, User, Target, Flame, Lightbulb, Upload, Edit3, Trophy, Plus, Zap, Star, ShieldCheck, Sparkles, Goal } from 'lucide-react';

export default function SoccerPracticeApp() {
  const [userName, setUserName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  // 1か月の全体目標データ
  const [monthlyGoal, setMonthlyGoal] = useState('今月は「左右どちらからでも精度の高いシュートを打てるようになる」のがターゲットだ！⚽️🔥');
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState('');

  // 初期の練習動画データ
  const initialVideos = [
    {
      id: '1',
      title: '01. ダブルタッチで相手を瞬時に置き去りにする技 ⚽️',
      target: '左右どちらでも3回スムーズに成功させる！',
      tips: 'ボールを触る瞬間に、逆足の膝を深く曲げて相手の重心を完全に揺さぶるのが極意！',
      url: 'https://vjs.zencdn.net/v/oceans.mp4',
      stampCount: 9,
      reward: '新しいサッカーボール or スパイク購入！ 👟⚽️'
    },
    {
      id: '2',
      title: '02. 軸足お通し（インサイドカット） ⚽️',
      target: 'トップスピードに乗ったまま軸足の後ろを通す！',
      tips: 'キックの振りかぶりを大きく見せることで、DFを完全に騙すことができるぞ！',
      url: 'https://vjs.zencdn.net/v/oceans.mp4',
      stampCount: 29,
      reward: '好きなアイス＆ジュースセット！ 🍨ジュース'
    },
    {
      id: '3',
      title: '03. 高速シザース（またぎフェイント） ⚽️',
      target: '相手の目の前で速く2回またいで突破する！',
      tips: 'ボールをまたぐ足の太ももを大きく引き上げてダイナミックに魅せよう！',
      url: '',
      stampCount: 0,
      reward: 'ゲームプレイ時間 30分延長権！ 🎮'
    }
  ];

  const [videos, setVideos] = useState(initialVideos);
  const [videoErrors, setVideoErrors] = useState({});

  // モーダル管理
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [editingRewardVideoId, setEditingRewardVideoId] = useState(null);
  const [rewardModalData, setRewardModalData] = useState(null);

  // 新規動画入力フォーム
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newTips, setNewTips] = useState('');
  const [newUrl, setNewUrl] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('soccer_app_user_name');
    if (savedName) setUserName(savedName);
    const savedGoal = localStorage.getItem('soccer_app_monthly_goal');
    if (savedGoal) setMonthlyGoal(savedGoal);
  }, []);

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUserName(tempName);
      localStorage.setItem('soccer_app_user_name', tempName);
      setIsEditingName(false);
    }
  };

  const handleSaveGoal = () => {
    if (tempGoal.trim()) {
      setMonthlyGoal(tempGoal);
      localStorage.setItem('soccer_app_monthly_goal', tempGoal);
      setIsEditingGoal(false);
    }
  };

  const handleAddStamp = (videoId) => {
    setVideos(prev => prev.map(v => {
      if (v.id === videoId) {
        if (v.stampCount >= 30) return v;
        const newCount = v.stampCount + 1;
        if (newCount === 30) {
          setRewardModalData({
            title: v.title,
            rewardText: v.reward || '特別ご褒美達成！'
          });
        }
        return { ...v, stampCount: newCount };
      }
      return v;
    }));
  };

  const handleReduceStamp = (videoId) => {
    setVideos(prev => prev.map(v => {
      if (v.id === videoId && v.stampCount > 0) {
        return { ...v, stampCount: v.stampCount - 1 };
      }
      return v;
    }));
  };

  const handleUpdateReward = (videoId, text) => {
    setVideos(prev => prev.map(v => {
      if (v.id === videoId) {
        return { ...v, reward: text };
      }
      return v;
    }));
  };

  const handleFileUpload = (e, videoId) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setVideos(prev => prev.map(v => v.id === videoId ? { ...v, url: fileUrl } : v));
      setVideoErrors(prev => ({ ...prev, [videoId]: false }));
    }
  };

  const handleVideoError = (videoId) => {
    setVideoErrors(prev => ({ ...prev, [videoId]: true }));
  };

  const handleAddNewVideo = () => {
    if (!newTitle.trim()) return;
    const num = videos.length + 1;
    const formattedNum = num < 10 ? `0${num}` : `${num}`;
    const newVid = {
      id: Date.now().toString(),
      title: `${formattedNum}. ${newTitle} ⚽️`,
      target: newTarget || '毎日意識して練習しよう！',
      tips: newTips || 'フォームと軸足をしっかり意識！',
      url: newUrl,
      stampCount: 0,
      reward: '30回達成のご褒美（編集可能）'
    };
    setVideos([...videos, newVid]);
    setNewTitle(''); setNewTarget(''); setNewTips(''); setNewUrl('');
    setShowAddVideo(false);
  };

  // 全動画の合計達成度計算
  const totalStamps = videos.reduce((acc, v) => acc + v.stampCount, 0);
  const maxStamps = videos.length * 30;
  const progressPercent = maxStamps > 0 ? Math.round((totalStamps / maxStamps) * 100) : 0;
  const playerLevel = Math.floor(totalStamps / 5) + 1;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 max-w-md mx-auto border-x border-slate-800 relative pb-24 rounded-3xl">
      
      {/* 1. スポーティ＆サイバーヘッダー */}
      <header className="flex justify-between items-center mb-5 pt-2 pb-3 border-b-2 border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-lime-400 via-emerald-400 to-pink-500 p-2.5 rounded-2xl shadow-lg shadow-lime-400/20 text-slate-950 font-black text-2xl">
            ⚽️
          </div>
          <div>
            <span className="text-[10px] font-black text-lime-400 tracking-widest uppercase block -mb-0.5">SOCCER LAB PRO</span>
            <h1 className="text-xl font-black italic tracking-wider text-white uppercase drop-shadow">自主練マスター</h1>
          </div>
        </div>
        
        {/* プレイヤー情報 ＆ プレイヤーLV */}
        <div className="flex items-center gap-2 bg-slate-900 border-2 border-slate-700 px-3 py-1.5 rounded-2xl shadow-md">
          <div className="bg-gradient-to-r from-lime-400 to-emerald-400 text-slate-950 font-black text-xs px-2 py-0.5 rounded-xl flex items-center gap-1 shadow-sm">
            <span className="text-sm">👟</span> LV.{playerLevel}
          </div>
          {isEditingName ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="bg-slate-800 text-white text-xs px-2 py-0.5 rounded-lg w-16 outline-none border-2 border-lime-400"
              />
              <button onClick={handleSaveName} className="bg-lime-400 text-slate-950 font-black text-xs px-2 py-0.5 rounded-lg">OK</button>
            </div>
          ) : (
            <span 
              onClick={() => { setTempName(userName); setIsEditingName(true); }}
              className="text-xs font-extrabold text-slate-100 cursor-pointer hover:text-lime-400 flex items-center gap-1"
            >
              {userName || '選手名を入力'} <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            </span>
          )}
        </div>
      </header>

      {/* 2. 今月のBIGゴール目標（高学年モチベーション仕様） */}
      <section className="bg-gradient-to-br from-emerald-950/80 via-slate-900 to-lime-950/80 border-2 border-lime-400/80 rounded-3xl p-4 mb-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute -right-3 -bottom-3 text-7xl opacity-15 pointer-events-none select-none">
          🥅
        </div>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2 text-lime-400 font-black text-xs tracking-wider uppercase">
            <Goal className="w-4 h-4 text-lime-400" /> 今月のBIGゴール（目標設定）⚽️
          </div>
          {!isEditingGoal && (
            <button 
              onClick={() => { setTempGoal(monthlyGoal); setIsEditingGoal(true); }}
              className="text-slate-300 hover:text-lime-300 text-[11px] font-bold flex items-center gap-1 bg-slate-950/80 px-2.5 py-1 rounded-full border border-slate-700"
            >
              <Edit3 className="w-3 h-3" /> 編集
            </button>
          )}
        </div>

        {isEditingGoal ? (
          <div className="space-y-2 mt-2">
            <textarea
              value={tempGoal}
              onChange={(e) => setTempGoal(e.target.value)}
              className="w-full bg-slate-950 text-white text-xs p-2.5 rounded-2xl border-2 border-lime-400 outline-none h-16 font-bold"
              placeholder="今月のメイン目標を入力！"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsEditingGoal(false)} className="bg-slate-800 text-slate-300 text-xs font-bold px-3 py-1 rounded-xl">キャンセル</button>
              <button onClick={handleSaveGoal} className="bg-lime-400 text-slate-950 font-black text-xs px-3 py-1 rounded-xl">決定！</button>
            </div>
          </div>
        ) : (
          <p className="text-sm font-black text-white leading-relaxed mt-1 tracking-wide bg-slate-950/50 p-3 rounded-2xl border border-lime-400/20">
            {monthlyGoal}
          </p>
        )}
      </section>

      {/* 3. 総合アナリティクス ＆ 達成率プログレスバー */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-2 border-slate-800 rounded-3xl p-4 mb-6 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-400/15 border-2 border-amber-400/40 p-2.5 rounded-2xl text-3xl shadow-inner">
              🏆
            </div>
            <div>
              <span className="text-[10px] font-black text-amber-400 tracking-wider uppercase block">累計トレーニング実績</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">{totalStamps}</span>
                <span className="text-xs font-extrabold text-slate-400">/ {maxStamps} 回クリア</span>
              </div>
            </div>
          </div>

          {/* ％表示 */}
          <div className="text-right">
            <span className="text-[10px] font-black text-slate-400 uppercase block">全クエスト達成率</span>
            <span className="text-3xl font-black text-lime-400 italic tracking-wider drop-shadow">
              {progressPercent}<span className="text-base font-black">%</span>
            </span>
          </div>
        </div>

        {/* プログレスバー */}
        <div className="space-y-1">
          <div className="w-full bg-slate-950 h-3.5 rounded-full overflow-hidden border-2 border-slate-800 p-0.5">
            <div 
              className="bg-gradient-to-r from-lime-400 via-emerald-400 to-pink-500 h-full rounded-full transition-all duration-500 shadow-md shadow-lime-400/40"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-extrabold text-slate-400 px-1 pt-0.5">
            <span>START (0%)</span>
            <span>COMPLETE (100%) 🏆</span>
          </div>
        </div>
      </section>

      {/* 4. 練習ミッション（全動画）一覧ヘッダー */}
      <div className="flex justify-between items-center mb-4 px-1">
        <h2 className="text-base font-black text-white tracking-wide uppercase flex items-center gap-2">
          <Flame className="w-5 h-5 text-lime-400 fill-lime-400" /> 練習メニュー（全{videos.length}本）
        </h2>
        <button 
          onClick={() => setShowAddVideo(true)}
          className="bg-pink-500/20 border-2 border-pink-500/50 hover:bg-pink-500/30 text-pink-300 text-xs font-black px-3.5 py-1.5 rounded-2xl flex items-center gap-1 transition shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" /> 動画を追加
        </button>
      </div>

      {/* 5. 動画カードリスト（奇数: ネオンライム / 偶数: サイバーピンク） */}
      <div className="space-y-9">
        {videos.map((video, index) => {
          const count = video.stampCount;
          const isMaster = count >= 30;
          const isEven = index % 2 === 1;

          const borderClass = isMaster 
            ? 'border-amber-400 shadow-amber-400/20' 
            : isEven 
            ? 'border-pink-500 shadow-pink-500/20' 
            : 'border-lime-400 shadow-lime-400/20';

          const badgeBgClass = isEven 
            ? 'bg-pink-500/20 text-pink-300 border-pink-500/40' 
            : 'bg-lime-400/20 text-lime-300 border-lime-400/40';

          const buttonBgClass = count >= 30
            ? 'bg-slate-800 text-slate-500 border-2 border-slate-700'
            : isEven
            ? 'bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 text-slate-950 shadow-pink-500/30 hover:brightness-110'
            : 'bg-gradient-to-r from-lime-400 via-emerald-400 to-lime-400 text-slate-950 shadow-lime-400/30 hover:brightness-110';

          const hasError = videoErrors[video.id] || !video.url;

          return (
            <div 
              key={video.id} 
              className={`bg-slate-900/95 border-3 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 relative ${borderClass}`}
            >
              {/* コンプリートバッジ */}
              {isMaster && (
                <div className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs py-1.5 px-4 text-center tracking-widest uppercase flex items-center justify-center gap-1 shadow-lg">
                  <Star className="w-4 h-4 fill-slate-950" /> 30回達成 MASTER COMPLETE! <Star className="w-4 h-4 fill-slate-950" />
                </div>
              )}

              {/* ミッションヘッダー */}
              <div className="p-4 bg-slate-950 border-b-2 border-slate-800 flex justify-between items-center">
                <span className={`text-xs font-black px-3 py-1 rounded-full border-2 uppercase tracking-wider ${badgeBgClass}`}>
                  DRILL #{index + 1}
                </span>
                <span className="text-xs font-black text-slate-200 flex items-center gap-1">
                  スタンプ: <span className={isEven ? 'text-pink-400 text-base font-black' : 'text-lime-400 text-base font-black'}>{count}</span> / 30 回 ⚽️
                </span>
              </div>

              {/* 動画プレイヤー */}
              <div className="relative aspect-video bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
                {hasError ? (
                  <div className="text-center p-4 space-y-2">
                    <div className="text-5xl animate-bounce">⚽️👟🥅</div>
                    <p className="text-xs font-black text-slate-200">自主練ビデオサンプル</p>
                    <p className="text-[10px] font-bold text-slate-500">（右上のボタンから動画を選択・変更できます）</p>
                  </div>
                ) : (
                  <video 
                    src={video.url} 
                    controls 
                    onError={() => handleVideoError(video.id)}
                    className="w-full h-full object-cover" 
                  />
                )}
                
                <label className="absolute top-2.5 right-2.5 bg-slate-950/90 hover:bg-slate-900 border-2 border-slate-700 text-slate-200 hover:text-white text-[11px] font-black px-3 py-1.5 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-lg backdrop-blur-md z-10">
                  <Upload className={`w-3.5 h-3.5 ${isEven ? 'text-pink-400' : 'text-lime-400'}`} /> 動画を変更
                  <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileUpload(e, video.id)} />
                </label>
              </div>

              {/* 詳細情報 */}
              <div className="p-4.5 space-y-4">
                <h3 className="font-black text-lg text-white leading-snug tracking-wide">{video.title}</h3>
                
                <div className="grid gap-2.5">
                  <div className="bg-slate-950 p-3 rounded-2xl border-2 border-slate-800 flex items-start gap-2.5">
                    <Target className={`w-5 h-5 shrink-0 mt-0.5 ${isEven ? 'text-pink-400' : 'text-lime-400'}`} />
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">クリア目標</span>
                      <p className="text-xs text-slate-100 font-bold leading-relaxed">{video.target}</p>
                    </div>
                  </div>

                  <div className="bg-amber-500/10 border-2 border-amber-500/30 p-3 rounded-2xl flex items-start gap-2.5">
                    <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider block">★ 練習のコツ（極意）</span>
                      <p className="text-xs text-amber-100 font-bold leading-relaxed">{video.tips}</p>
                    </div>
                  </div>
                </div>

                {/* 6. スタンプカード（30マス） */}
                <div className="bg-slate-950 p-4 rounded-3xl border-2 border-slate-800 space-y-3.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-white flex items-center gap-1.5">
                      <ShieldCheck className={`w-4 h-4 ${isEven ? 'text-pink-400' : 'text-lime-400'}`} /> 30回スタンプカード ⚽️
                    </span>
                    <button 
                      onClick={() => handleReduceStamp(video.id)} 
                      className="text-[10px] font-bold text-slate-500 hover:text-rose-400 underline"
                    >
                      スタンプを1つ消す
                    </button>
                  </div>

                  <div className="grid grid-cols-10 gap-1.5">
                    {[...Array(30)].map((_, idx) => {
                      const number = idx + 1;
                      const isStamped = number <= count;
                      const isSpecialStamp = number === 10 || number === 20;
                      const isGoal = number === 30;

                      return (
                        <div 
                          key={idx}
                          className={`aspect-square rounded-xl border-2 flex items-center justify-center relative text-xs font-black transition-all duration-300 ${
                            isStamped
                              ? isGoal
                                ? 'bg-gradient-to-br from-amber-300 to-amber-500 border-amber-200 text-slate-950 shadow-lg shadow-amber-500/40 scale-110 text-base'
                                : isSpecialStamp
                                ? 'bg-gradient-to-br from-purple-500 to-pink-500 border-pink-300 text-white shadow-lg shadow-pink-500/40 scale-105 text-base'
                                : isEven
                                ? 'bg-gradient-to-br from-pink-500 to-rose-600 border-pink-300 text-white shadow-md shadow-pink-500/30 scale-105 text-sm'
                                : 'bg-gradient-to-br from-lime-400 to-emerald-500 border-lime-300 text-slate-950 shadow-md shadow-lime-500/30 scale-105 text-sm'
                              : isGoal
                              ? 'bg-amber-400/20 border-amber-400/60 text-amber-300 text-sm'
                              : isSpecialStamp
                              ? 'bg-purple-500/20 border-purple-500/50 text-pink-300 text-sm'
                              : 'bg-slate-900 border-slate-800 text-slate-600'
                          }`}
                        >
                          {isStamped ? (
                            isGoal ? '🏆' : isSpecialStamp ? (number === 10 ? '🔥' : '⚡️') : '⚽️'
                          ) : isGoal ? (
                            '🏆'
                          ) : isSpecialStamp ? (
                            '✨'
                          ) : (
                            number
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t-2 border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1">
                      <span className="flex items-center gap-1 text-pink-300">
                        <Sparkles className="w-3.5 h-3.5" /> 10回&20回：特大スタンプ！
                      </span>
                      <span className="text-amber-300">30回クリアでご褒美GET! 🎁</span>
                    </div>

                    <div className={`p-3 rounded-2xl border-2 flex items-center justify-between gap-2 ${
                      count >= 30 ? 'bg-amber-400/20 border-amber-400/80 text-amber-200 shadow-md' : 'bg-slate-900 border-slate-800'
                    }`}>
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className={`text-[11px] font-black px-2.5 py-1 rounded-xl shrink-0 ${count >= 30 ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                          🎁 30回のご褒美
                        </span>
                        {editingRewardVideoId === video.id ? (
                          <input 
                            type="text"
                            value={video.reward}
                            onChange={(e) => handleUpdateReward(video.id, e.target.value)}
                            className="bg-slate-800 text-white text-xs px-2 py-1 rounded-lg outline-none border-2 border-lime-400 w-40 font-bold"
                          />
                        ) : (
                          <span className="truncate text-xs font-black text-white">{video.reward}</span>
                        )}
                      </div>
                      <button 
                        onClick={() => setEditingRewardVideoId(editingRewardVideoId === video.id ? null : video.id)}
                        className="text-slate-400 hover:text-white shrink-0 p-1"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 今日やったよ！巨大ボタン */}
                <button
                  onClick={() => handleAddStamp(video.id)}
                  disabled={count >= 30}
                  className={`w-full py-4 rounded-2xl font-black text-base tracking-wide flex items-center justify-center gap-2 transition-all shadow-2xl active:scale-95 ${buttonBgClass}`}
                >
                  <Flame className="w-5 h-5 fill-slate-950" />
                  {count >= 30 ? '30回コンプリート！ 🏆' : '今日やったよ！スタンプを押す ⚽️'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 動画追加モーダル */}
      {showAddVideo && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-3 border-pink-500/80 rounded-3xl p-5 w-full max-w-sm space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-pink-400" /> 新しい練習動画を追加
            </h3>
            <div className="space-y-3 text-xs font-bold">
              <div>
                <label className="block text-slate-300 mb-1">タイトル</label>
                <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="例：インステップキックの基本" className="w-full bg-slate-950 border-2 border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-pink-400" />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">目標</label>
                <input type="text" value={newTarget} onChange={e => setNewTarget(e.target.value)} placeholder="例：狙った場所に確実に蹴り込める" className="w-full bg-slate-950 border-2 border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-pink-400" />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">コツ（極意）</label>
                <textarea value={newTips} onChange={e => setNewTips(e.target.value)} placeholder="例：軸足をボールの真横に踏み込み、爪先を下に向ける！" className="w-full bg-slate-950 border-2 border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-pink-400 h-16" />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowAddVideo(false)} className="w-1/2 bg-slate-800 text-slate-300 font-bold py-2.5 rounded-xl text-xs">キャンセル</button>
              <button onClick={handleAddNewVideo} className="w-1/2 bg-pink-500 text-slate-950 font-black py-2.5 rounded-xl text-xs shadow-lg shadow-pink-500/30">追加する</button>
            </div>
          </div>
        </div>
      )}

      {/* ご褒美達成ポップアップ */}
      {rewardModalData && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-3 border-amber-400 rounded-3xl p-6 w-full max-w-sm text-center space-y-4 shadow-2xl shadow-amber-500/30">
            <div className="text-6xl animate-bounce">🏆⚽️🎁</div>
            <h2 className="text-2xl font-black text-amber-300 tracking-wide">30回完全コンプリート！</h2>
            <p className="text-xs text-slate-200 font-black">{rewardModalData.title}</p>
            <div className="bg-amber-400/20 border-2 border-amber-400/60 p-4 rounded-2xl shadow-inner">
              <span className="text-xs font-black text-amber-300 uppercase tracking-widest block mb-1">獲得したご褒美</span>
              <p className="text-lg font-black text-white">{rewardModalData.rewardText}</p>
            </div>
            <button 
              onClick={() => setRewardModalData(null)}
              className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black py-3.5 rounded-2xl text-base shadow-xl shadow-amber-400/40 active:scale-95"
            >
              最高だ！ご褒美をゲット！
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
