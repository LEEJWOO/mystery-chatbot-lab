// 몽환의 트로이메라이 · 탑다운 시험판 v2.0 (TRM1) — UUMMAI에 컴포넌트 1개로 등록: 이름 Troemerei
// import·fetch·브라우저 저장소 없음. 그림은 아래 TN_ASSETS의 외부 이미지 주소(<img>·CSS 배경)로만 불러온다. useState/useEffect/useRef/useMemo/sendMessage는 호스트 제공.
// AI 출력 형식: <Troemerei s='상태코드' d='이름(표정):대사|*서술' />  (자유 행동 t='초', 사건 e='…', 증언 k='기억K3R8@줄', 화면 밖 대화 f='1')
const TN_WORLD = {"version":3,"kind":"troemerei-npc-topdown-test","title":"라운지의 사라진 브로치","notes":"본편 1장 전 기관 시험용. 죽음 없음. 인물·사건은 본편 설정이 아니다.","chapter":0,"dataVersion":8,"startTime":"19:30","talkRange":2,"sightRange":30,"blockTalk":{"tries":1,"wait":40,"reason":"당신이 서 있는 자리에 볼일이 있어, 잠시 비켜 주었으면 하는 듯하다"},"searchSeconds":20,"map":{"id":"hotel_test","width":30,"height":18,"rows":["##############################","#..........##..#..########...#","#.###.........##.............#","#.###..........#..########...#","#......##......#.............#","#............................#","#.....###......#..#....##....#","#..............#.............#","##............##............##","#######.##############.#######","##.........................#.#","#............................#","#####.##############.#########","###.....###.#..............#.#","###.......#............##....#","###..##...#.....##.....##....#","#.........#.#.#.....#........#","##############################"],"tileSeconds":4,"areas":[{"name":"라운지","x0":1,"y0":1,"x1":14,"y1":8},{"name":"바","x0":16,"y0":1,"x1":28,"y1":8},{"name":"복도","x0":1,"y0":10,"x1":28,"y1":11},{"name":"객실","x0":1,"y0":13,"x1":9,"y1":16},{"name":"테라스","x0":11,"y0":13,"x1":28,"y1":16}],"landmarks":[{"id":"piano","name":"그랜드 피아노","x":3,"y":4,"icon":"♪","hit":[[2,2],[3,2],[4,2],[2,3],[3,3],[4,3]]},{"id":"case","name":"진열장","x":11,"y":2,"icon":"◆","hit":[[11,1],[12,1]]},{"id":"sofa","name":"라운지 소파","x":7,"y":7,"icon":"▭","hit":[[6,6],[7,6],[8,6]]},{"id":"lounge_table","name":"라운지 탁자","x":7,"y":5,"icon":"◇","hit":[[7,4],[8,4]]},{"id":"counter","name":"바 카운터","x":21,"y":4,"icon":"▤","hit":[[20,3],[21,3],[22,3]]},{"id":"bar_table","name":"바 테이블","x":23,"y":7,"icon":"○","hit":[[23,6],[24,6]]},{"id":"corridor","name":"복도 화분","x":26,"y":10,"icon":"✿","hit":[[27,10]]},{"id":"wardrobe","name":"옷장","x":8,"y":14,"icon":"▥","hit":[[8,13],[9,13]]},{"id":"room_desk","name":"객실 책상","x":5,"y":14,"icon":"◇","hit":[[5,15],[6,15]]},{"id":"bench","name":"테라스 벤치","x":16,"y":14,"icon":"▤","hit":[[16,15],[17,15]]},{"id":"fountain","name":"테라스 분수","x":22,"y":14,"icon":"◉","hit":[[23,14],[24,14],[23,15],[24,15]]}],"props":[{"t":"piano","x":2,"y":2,"w":3,"h":2,"low":true},{"t":"case","x":11,"y":1,"w":2,"h":1,"low":true},{"t":"sofa","x":6,"y":6,"w":3,"h":1,"low":true},{"t":"table","x":7,"y":4,"w":2,"h":1,"low":true},{"t":"pot","x":1,"y":8,"w":1,"h":1,"low":true},{"t":"pot","x":14,"y":8,"w":1,"h":1,"low":true},{"t":"flamp","x":14,"y":2,"w":1,"h":1,"low":true},{"t":"shelf","x":18,"y":1,"w":8,"h":1},{"t":"counter","x":18,"y":3,"w":8,"h":1,"low":true},{"t":"table","x":23,"y":6,"w":2,"h":1,"low":true},{"t":"table","x":18,"y":6,"w":1,"h":1,"low":true},{"t":"pot","x":28,"y":8,"w":1,"h":1,"low":true},{"t":"planter","x":27,"y":10,"w":1,"h":1,"low":true},{"t":"planter","x":1,"y":10,"w":1,"h":1,"low":true},{"t":"bed","x":1,"y":13,"w":2,"h":3,"low":true},{"t":"wardrobe","x":8,"y":13,"w":2,"h":1},{"t":"desk","x":5,"y":15,"w":2,"h":1,"low":true},{"t":"tree","x":12,"y":13,"w":1,"h":1},{"t":"tree","x":27,"y":13,"w":1,"h":1},{"t":"tree","x":12,"y":16,"w":1,"h":1},{"t":"bench","x":16,"y":15,"w":2,"h":1,"low":true},{"t":"fountain","x":23,"y":14,"w":2,"h":2,"low":true},{"t":"lamp","x":20,"y":16,"w":1,"h":1,"low":true},{"t":"planter","x":14,"y":16,"w":1,"h":1,"low":true}],"floors":["parquet","bar","carpet","room","terrace"],"decor":[{"t":"rug","x":5,"y":4,"w":6,"h":3},{"t":"mat","cells":[[15,5],[7,9],[22,9],[5,12],[20,12]]},{"t":"flowers","cells":[[13,14],[26,16],[11,15],[28,14]]},{"t":"path","cells":[[20,13],[20,14],[21,14],[22,14],[19,14],[18,14],[17,14]]}]},"player":{"x":5,"y":7,"moveSeconds":4,"sex":"m"},"npcs":[{"id":"suzune","name":"아자토 스즈네","call":["스즈네","아자토"],"symbol":"스","color":"#f2a7c3","hair":"#f4b6cf","cloth":"#f6eadf","x":9,"y":7,"stepSeconds":6,"sex":"f","profile":"일본 · 22 · 미대생 — 그림마다 시각을 적는다","rel":{"trust":50,"affection":50},"agenda":[{"id":"sketch_case","kind":"visit","landmark":"sofa","from":"19:30","until":"20:06","durationSeconds":2100,"priority":60,"weight":1,"interruptible":true,"once":true,"onCompleteFact":"suzune_sketch"},{"id":"sofa_rest","kind":"visit","landmark":"sofa","from":"19:30","until":"22:00","durationSeconds":120,"priority":10,"weight":3,"interruptible":true,"cooldownSeconds":120},{"id":"terrace_air","kind":"visit","landmark":"fountain","from":"20:06","until":"22:00","durationSeconds":90,"priority":10,"weight":2,"interruptible":true,"cooldownSeconds":150}],"notes":[{"text":"라운지 소파에서 진열장 쪽을 그리고 있었다","unlock":{"seen":true}},{"text":"그림 구석마다 그린 시각을 적는다","unlock":{"talked":true}}],"look":{"g":1,"hf":0,"hb":2,"hc":"#f4b6cf","eye":2,"ec":"#7a5ad0","sk":0,"of":4,"oc":"#f6eadf","ac":0},"block":[[{"text":"저기, 죄송한데…… 거기 잠깐만 비켜 주실 수 있을까요?","face":"곤란","alt":[{"if":{"rel":{"trust":[4,5]}},"text":"아, 거기 계셨네요. 잠깐 지나가도 될까요? 금방이에요.","face":"미소"}]}],[{"text":"저, 정말 죄송해요. 거기 꼭 가야 해서요…….","face":"곤란"}],[{"text":"……알겠어요. 제가 나중에 다시 올게요.","face":"슬픔"}]]},{"id":"mei","name":"띠리 메이","alias":{"name":"메이벨","until":"mei_real"},"call":["메이벨","메이벨 드 로슈벨","메이","띠리","로슈벨"],"symbol":"메","color":"#e8c35a","hair":"#f1d27a","cloth":"#3f7a52","x":10,"y":3,"stepSeconds":5,"sex":"f","profile":"「프랑스 귀족 영애」 · 26 — 가문의 브로치를 자랑한다","rel":{"trust":45,"affection":50},"knows":["odile_trick","mei_glass"],"agenda":[{"id":"admire_case","kind":"visit","landmark":"case","from":"19:38","until":"19:46","durationSeconds":60,"priority":70,"weight":1,"interruptible":true,"once":true,"onCompleteFact":"mei_case"},{"id":"find_gone","kind":"visit","landmark":"case","from":"20:30","until":"21:30","durationSeconds":120,"priority":90,"weight":1,"interruptible":false,"once":true},{"id":"lounge_walk","kind":"visit","landmark":"lounge_table","from":"19:30","until":"22:00","durationSeconds":80,"priority":10,"weight":2,"interruptible":true,"cooldownSeconds":120},{"id":"bar_visit","kind":"visit","landmark":"bar_table","from":"19:30","until":"22:00","durationSeconds":100,"priority":10,"weight":2,"interruptible":true,"cooldownSeconds":200}],"notes":[{"text":"진열장의 브로치를 「가문의 보물」이라 부른다","unlock":{"talked":true}},{"text":"7시 40분쯤 진열장을 들여다봤다","unlock":{"fact":"mei_case"}},{"text":"본명은 띠리 메이. 미얀마의 건설 현장에서 일한다","unlock":{"flag":"mei_real"}}],"look":{"g":1,"hf":1,"hb":4,"hc":"#f1d27a","eye":1,"ec":"#3f9a6a","sk":1,"of":4,"oc":"#3f7a52","ac":4},"block":[[{"text":"어머, 거기 서 계시면 곤란하답니다. 잠시 비켜 주시겠어요?","face":"미소","alt":[{"if":{"rel":{"trust":[4,5]}},"text":"당신, 거기 잠깐만 비켜 줄래요? 금방 끝나요. 오호호.","face":"웃음"},{"if":{"rel":{"trust":[1,2]}},"text":"……거기, 비켜 주시겠어요? 길을 막고 계시잖아요.","face":"불만","pose":"crossed"}]}],[{"text":"저기요, 두 번 말하게 하지 마시라고요!","face":"불만","pose":"crossed"}],[{"text":"야, 비키라니까! ……크흠, 비켜 주세요.","face":"격노","pose":"point","fx":"shake"}]]},{"id":"ruoxi","name":"션 루오시","call":["루오시","션"],"symbol":"션","color":"#a97852","hair":"#8a5a3a","cloth":"#2f8f8a","x":24,"y":5,"stepSeconds":6,"sex":"f","profile":"중국 · 31 · 의사 — 사실만 말한다","rel":{"trust":50,"affection":45},"agenda":[{"id":"bar_sit","kind":"visit","landmark":"bar_table","from":"19:30","until":"22:00","durationSeconds":150,"priority":10,"weight":3,"interruptible":true,"cooldownSeconds":150},{"id":"recital_listen","kind":"visit","landmark":"sofa","from":"20:00","until":"20:20","durationSeconds":600,"priority":30,"weight":1,"interruptible":true,"once":true},{"id":"terrace_walk","kind":"visit","landmark":"bench","from":"19:30","until":"22:00","durationSeconds":100,"priority":10,"weight":2,"interruptible":true,"cooldownSeconds":200}],"notes":[{"text":"2부는 라운지에서 들었다","unlock":{"talked":true}}],"look":{"g":1,"hf":2,"hb":3,"hc":"#8a5a3a","eye":3,"ec":"#6b4630","sk":0,"of":2,"oc":"#f2f2f2","ac":0},"block":[[{"text":"실례합니다. 그 자리에 볼일이 있어요.","face":"기본","alt":[{"if":{"rel":{"trust":[4,5]}},"text":"잠깐 그 자리 좀 빌릴게요. 30초면 됩니다.","face":"미소"}]}],[{"text":"같은 말을 두 번 하게 되네요. 비켜 주세요.","face":"불만"}],[{"text":"……그 자리에 계속 계실 이유가 있나요?","face":"의심","pose":"think"}]]},{"id":"seoha","name":"윤서하","call":["서하","윤"],"symbol":"윤","color":"#5a5a6a","hair":"#26242c","cloth":"#6b4a32","x":12,"y":6,"stepSeconds":5,"sex":"f","profile":"한국 · 28 · 직업 비밀 — 질문으로 대답한다","rel":{"trust":40,"affection":40},"agenda":[{"id":"watch_lounge","kind":"visit","landmark":"lounge_table","from":"19:30","until":"22:00","durationSeconds":120,"priority":10,"weight":3,"interruptible":true,"cooldownSeconds":100},{"id":"corridor_watch","kind":"visit","landmark":"corridor","from":"19:30","until":"22:00","durationSeconds":90,"priority":10,"weight":2,"interruptible":true,"cooldownSeconds":150},{"id":"bar_watch","kind":"visit","landmark":"counter","from":"19:30","until":"22:00","durationSeconds":80,"priority":10,"weight":1,"interruptible":true,"cooldownSeconds":200}],"notes":[{"text":"모두의 위치를 기억하고 있는 것 같다","unlock":{"talked":true}}],"look":{"g":1,"hf":0,"hb":1,"hc":"#26242c","eye":3,"ec":"#2a2230","sk":0,"of":2,"oc":"#6b4a32","ac":0},"block":[[{"text":"거기. 잠깐 비켜.","face":"기본","alt":[{"if":{"rel":{"trust":[4,5]}},"text":"그쪽, 잠깐만. 그 자리 좀 쓰자.","face":"기본"}]}],[{"text":"……일부러 막는 거야?","face":"의심","pose":"crossed"}],[{"text":"왜 거기서 안 움직이지? 이유를 듣고 싶은데.","face":"의심","pose":"think"}]]},{"id":"clara","name":"클라라 베버","call":["클라라","베버"],"symbol":"클","color":"#9b7fd1","hair":"#8f72c9","cloth":"#1d1a24","x":3,"y":4,"stepSeconds":7,"sex":"f","profile":"독일 · 34 · 피아니스트 — 소리에 예민하다","rel":{"trust":40,"affection":40},"agenda":[{"id":"recital_1","kind":"visit","landmark":"piano","from":"19:30","until":"19:50","durationSeconds":1180,"priority":80,"weight":1,"interruptible":false,"once":true},{"id":"move_brooch","kind":"visit","landmark":"case","from":"19:50","until":"20:25","durationSeconds":30,"priority":85,"weight":1,"interruptible":false,"once":true,"onCompleteFlag":"brooch_gone","onCompleteFact":"clara_moved","block":{"tries":3,"wait":45,"urgent":true,"reason":"진열장 앞에 꼭 볼일이 있어, 비켜 달라고 재촉하는 듯하다"}},{"id":"recital_2","kind":"visit","landmark":"piano","from":"19:51","until":"20:20","durationSeconds":1200,"priority":80,"weight":1,"interruptible":false,"once":true,"onCompleteFlag":"recital_done"},{"id":"terrace_rest","kind":"visit","landmark":"bench","from":"20:20","until":"22:00","durationSeconds":300,"priority":20,"weight":1,"interruptible":true,"cooldownSeconds":60}],"notes":[{"text":"리사이틀 내내 피아노 앞에 있었다","unlock":{"seen":true}},{"text":"휴식 시간에 진열장 앞에 섰다","unlock":{"fact":"clara_moved"}}],"look":{"g":1,"hf":2,"hb":2,"hc":"#8f72c9","eye":1,"ec":"#4a78c8","sk":0,"of":4,"oc":"#1d1a24","ac":5},"block":[[{"text":"실례합니다. 그 자리에 볼일이 있습니다. 비켜 주시겠습니까?","face":"기본","alt":[{"if":{"rel":{"trust":[4,5]}},"text":"죄송하지만, 잠시만 자리를 비켜 주시겠어요? 곧 끝납니다.","face":"미소"},{"if":{"rel":{"trust":[1,2]}},"text":"비켜 주십시오. 지금 바로요.","face":"불만","pose":"crossed"}]}],[{"text":"다시 말씀드립니다. 그 자리에서 비켜 주십시오. 다음 곡까지 시간이 없습니다.","face":"불만","pose":"crossed"}],[{"text":"……일부러 그러시는 겁니까? 지금 저를 방해하고 계십니다.","face":"격노","pose":"point","fx":"shake"}]]},{"id":"odile","name":"오딜 르나르","call":["오딜","르나르"],"symbol":"오","color":"#f08a3c","hair":"#f39a4a","cloth":"#2a2440","x":21,"y":4,"stepSeconds":5,"sex":"f","profile":"프랑스 · 24 · 마술사 — 끝에 「짜잔」을 붙인다","rel":{"trust":45,"affection":50},"knows":["odile_trick"],"agenda":[{"id":"bar_magic","kind":"visit","landmark":"counter","from":"19:44","until":"20:30","durationSeconds":2700,"priority":60,"weight":1,"interruptible":true,"once":true,"onCompleteFact":"odile_bar"},{"id":"bar_loiter","kind":"visit","landmark":"bar_table","from":"19:30","until":"22:00","durationSeconds":120,"priority":10,"weight":2,"interruptible":true,"cooldownSeconds":120},{"id":"corridor_trick","kind":"visit","landmark":"corridor","from":"20:30","until":"22:00","durationSeconds":90,"priority":10,"weight":1,"interruptible":true,"cooldownSeconds":200}],"notes":[{"text":"휴식 시간 내내 바에서 카드 마술을 했다","unlock":{"scene":"odile_bar"}},{"text":"7시 20분에 메이벨의 브로치로 마술을 보여 줬다","unlock":{"talked":true}}],"look":{"g":1,"hf":4,"hb":3,"hc":"#f39a4a","eye":0,"ec":"#d0a040","sk":0,"of":5,"oc":"#2a2440","ac":3},"block":[[{"text":"관객님, 무대 한가운데 서 계시네? 잠깐 비켜 줄래?","face":"웃음","alt":[{"if":{"rel":{"trust":[4,5]}},"text":"관객님~ 거기 잠깐만. 짜잔, 하고 비켜 주면 고맙고!","face":"웃음"}]}],[{"text":"어라, 안 비켜 주는 거야? 이건 마술로도 안 되는데.","face":"곤란"}],[{"text":"……관객님, 이건 장난 아냐. 비켜.","face":"불만","pose":"crossed"}]]}],"onComplete":[],"flagNames":["brooch_gone","recital_done","mei_real","mei_early","true_route","trial_only","trial_brooch_done"],"debugFlags":["brooch_gone","mei_real","mei_early","true_route"],"facts":[{"id":"clara_moved","code":"C4L7","self":{"clara":"휴식 시간에 피아노 소리에 떨리는 브로치를 장갑에 싸서 피아노 의자 수납칸에 넣었다"},"seen":"휴식 시간에 클라라가 진열장에서 무언가를 꺼내 피아노 쪽으로 가는 걸 봤다","player":"클라라가 진열장에서 무언가를 꺼내 피아노 쪽으로 갔다"},{"id":"mei_case","code":"M3Y8","self":{"mei":"7시 40분쯤 진열장 속 브로치가 제자리에 있는 걸 확인했다"},"seen":"메이벨이 진열장 속 브로치를 들여다보는 걸 봤다","player":"7시 40분쯤 메이벨이 진열장 속 브로치를 들여다봤다"},{"id":"odile_trick","code":"O5D2","self":{"odile":"7시 20분, 메이벨의 브로치로 마술을 보여 주고 진열장에 돌려놓으며 하트 퀸 카드를 꽂았다","mei":"7시 20분, 오딜이 내 브로치로 마술을 하고 진열장에 돌려놓았다"},"seen":"","player":""},{"id":"mei_glass","code":"G2L9","self":{"mei":"그 브로치는 시장에서 산 유리 장식이다"},"seen":"","player":""},{"id":"suzune_sketch","code":"S6H1","self":{"suzune":"휴식 시간 전후로 진열장을 그렸다. 7시 45분엔 브로치가 반짝였고, 8시 5분엔 비어 있었다"},"seen":"스즈네가 진열장 쪽을 보며 스케치북에 시각을 적는 걸 봤다","player":"스즈네가 진열장을 그리며 시각을 적었다"},{"id":"odile_bar","code":"O7B3","self":{"odile":"7시 44분부터 바 카운터에서 카드 마술을 보이며 음료를 주문했다"},"seen":"오딜이 바 카운터에서 카드 마술을 하는 걸 봤다","player":"오딜이 바 카운터에서 카드 마술을 했다"}],"events":{"TRUE":{"npcs":["suzune"],"flag":"true_route","log":"(시험) 진엔딩 루트 표식이 인정되었다.","kinds":["T","I"]},"MEI_REAL":{"npcs":["mei"],"flag":"mei_real","setFlags":["mei_early"],"kinds":["T","I"],"log":"메이벨이 본명과 내력을 털어놓았다."},"T1_R1":{"kinds":["R"],"npcs":["mei"],"trial":"T1","phase":9},"T1_R1H":{"kinds":["R"],"npcs":["mei"],"trial":"T1","phase":9,"hold":true}},"markers":[{"flag":"true_route","token":"#진루트"},{"flag":"mei_real","token":"#메이정체"}],"items":[{"id":"card","name":"하트 퀸 카드","at":"case","desc":"진열장 유리 틈에 꽂혀 있던 트럼프. 뒷면에 「짜잔 — O.R.」"},{"id":"program","name":"리사이틀 프로그램","at":"lounge_table","desc":"1부 19:30–19:50 · 휴식 19:50–20:00 · 2부 20:00–20:20. 여백에 각진 글씨: 「휴식 때 — 진열장 쪽 잡음」"},{"id":"score","name":"클라라의 악보","at":"piano","desc":"2부 첫 곡의 B♭ 음표마다 빨간 동그라미. 여백: 「B♭ — 어디선가 떨림」"},{"id":"sketch","name":"스즈네의 크로키","at":"sofa","from":"1일 20:06","desc":"구석마다 시각. 「19:45 진열장 — 반짝」 「20:05 진열장 — 비어 있음」"},{"id":"bar_log","name":"바 주문 장부","at":"counter","from":"1일 20:13","desc":"오딜 르나르: 19:46 레모네이드 · 19:58 레모네이드 · 20:12 체리(「마술 관람료」)"},{"id":"velvet","name":"진열장 벨벳 받침","at":"case","flag":"brooch_gone","desc":"브로치 모양으로 눌린 자국. 고리 쪽에 흰 면 실 한 올이 걸려 있다."},{"id":"glove","name":"흰 면장갑","at":"piano","flag":"brooch_gone","desc":"피아노 의자 수납칸 안. 손목에 「C.W.」 수. 무언가 둥근 것을 감싸 두었다."},{"id":"brooch","name":"브로치","at":"piano","flag":"brooch_gone","desc":"장갑 속에 싸여 있었다. 보석치고 ((가볍다)). 장식 고리가 헐거워 손끝으로 튕기면 낮게 떨린다."}],"notices":[{"time":"19:30","text":"리사이틀 1부","place":"라운지"},{"time":"20:00","text":"리사이틀 2부","place":"라운지"},{"time":"22:00","text":"소등","place":"객실"}],"slots":[{"name":"아침","from":"06:00"},{"name":"오후","from":"12:00"},{"name":"저녁","from":"18:00"},{"name":"밤","from":"22:00"}],"branches":[],"scenes":[{"id":"clara_case","title":"진열장 앞의 클라라","fact":"clara_moved","caption":"휴식 시간, 클라라가 진열장에서 무언가를 꺼내 피아노 쪽으로 돌아갔다."},{"id":"odile_bar","title":"바의 카드 마술","npc":"odile","from":"19:50","to":"20:00","near":"counter","radius":2,"caption":"휴식 시간 내내, 오딜은 바 카운터에서 카드 마술을 하고 있었다."},{"id":"mei_case","title":"브로치 자랑","fact":"mei_case","caption":"메이벨이 진열장 속 브로치를 들여다보며 흐뭇하게 웃었다."}],"trials":[{"id":"brooch","code":"T1","title":"라운지의 사라진 브로치","stage":"라운지","hp":5,"flag":"trial_brooch_done","evidence":["card","program","score","sketch","bar_log","velvet","glove","brooch"],"issues":[{"id":"i1","q":"브로치는 언제 사라졌나?","a":"휴식 시간 무렵(19:45~20:05)"},{"id":"i2","q":"오딜이 가져갔나?","a":"아니다, 바에 있었다"},{"id":"i3","q":"누가, 왜 옮겼나?","a":"클라라, 장식이 피아노 소리에 떨려서","confirmAt":16}],"phases":[{"type":"talk","lines":[{"who":"host","text":"모이셨군요. 오늘 밤 리사이틀이 끝난 뒤, 라운지 진열장에서 [[메이벨 님의 브로치]]가 사라졌습니다.","fx":"flash","alt":[{"if":{"flag":"mei_early"},"text":"모이셨군요. 오늘 밤 리사이틀이 끝난 뒤, 라운지 진열장에서 [[메이 님의 브로치]]가 사라졌습니다."}]},{"who":"mei","text":"범인은 뻔하답니다! 진열장에 카드를 꽂아 둔 [[마술사]], 당신이에요!","face":"격노","pose":"point","fx":"shake","alt":[{"if":{"flag":"mei_early"},"text":"정체는 들켰어도 브로치는 내 거야! 카드 꽂은 [[마술사]], 너지?","face":"격노","pose":"point"},{"if":{"rel":{"trust":[4,5]}},"text":"당신이라면 범인을 바로 찾아 주실 거예요. ……아마 저 마술사겠지만요!","face":"격노","pose":"point"}]},{"who":"odile","text":"짜잔~ 나한테 쏠린 시선, 기분 나쁘지 않은데?","face":"웃음"},{"who":"clara","text":"……소란스럽군요. 사실만 말씀하십시오.","face":"불만","pose":"crossed"},{"who":"","text":"죽은 사람은 없다. 그래도 이 자리 어딘가에 ((거짓말))이 섞여 있다."}]},{"type":"trans","issue":"i1","text":"쟁점 하나"},{"type":"nonstop","title":"엇갈린 증언","guide":"빛나는 말(약점)에 증거를 쏴서 모순을 찌른다","issue":"i1","lines":[{"who":"mei","text":"{제가 진열장을 본 건} {7시 40분}. 그 뒤로도 {쭉 반짝이고 있었답니다}.","face":"미소"},{"who":"odile","text":"{난 1부 끝나기 전부터} {바에 있었어}. 짜잔.","face":"웃음"},{"who":"seoha","text":"{사라진 건} {8시 반 직전}이겠지. {발견하기 바로 전에}.","face":"의심","pose":"think"}],"answers":[{"at":[2,1],"ev":["sketch"]},{"at":[0,2],"ev":["sketch"]}],"win":"스즈네의 크로키: 8시 5분에 이미 진열장은 비어 있었다. 사라진 건 7시 45분부터 8시 5분 사이다.","miss":{"mei":{"text":"오호호, 엉뚱한 곳을 찌르셨답니다!","face":"웃음","pose":"point","alt":[{"if":{"rel":{"affection":[4,5]}},"text":"어머, 거긴 아니에요. ……당신답지 않네요.","face":"곤란"},{"if":{"rel":{"trust":[1,2]}},"text":"야, 아무 데나 쏘지 마! ……가 아니라, 무례하답니다!","face":"격노"}]},"odile":{"text":"짜잔~ 빗나갔네, 관객님.","face":"웃음","alt":[{"if":{"rel":{"trust":[4,5]}},"text":"아까워! 관객님이라면 다음엔 맞힐 거야.","face":"미소"},{"if":{"rel":{"trust":[1,2]}},"text":"……일부러 날 노리는 거야?","face":"불만","pose":"crossed"}]},"seoha":{"text":"그쪽이 찌른 곳, 근거는?","face":"의심","pose":"crossed","alt":[{"if":{"rel":{"trust":[4,5]}},"text":"……서두르지 마. 그쪽은 원래 그렇게 대충 하지 않잖아.","face":"기본"}]},"ruoxi":{"text":"그 말은 사실관계와 무관해요.","face":"기본","pose":"think","alt":[{"if":{"rel":{"affection":[4,5]}},"text":"틀렸어요. 괜찮아요, 다시 보면 돼요.","face":"미소"}]},"clara":{"text":"……그건 제 말의 요지가 아닙니다.","face":"불만","pose":"crossed","alt":[{"if":{"rel":{"trust":[1,2]}},"text":"근거 없이 지목하지 마십시오.","face":"격노","pose":"point"}]},"suzune":{"text":"에, 저, 저요? 그건 아닌 것 같은데요…….","face":"곤란","alt":[{"if":{"rel":{"affection":[4,5]}},"text":"괜찮아요, 천천히 같이 봐요.","face":"미소"}]}},"mono":["……아니, 거기가 아니다. 증언을 다시 듣자.","빗나갔다. 말의 어디가 증거와 부딪치는지 다시 보자."]},{"type":"talk","lines":[{"who":"suzune","text":"아, 제 그림……! 그리는 김에 시각을 적어 두는 버릇이 있어서요.","face":"부끄러움"},{"who":"clara","text":"……그림 구석에 시각까지? 놀랍군요.","face":"놀람"},{"who":"ruoxi","text":"7시 45분엔 있었고 8시 5분엔 없었다. 리사이틀 휴식 시간과 겹쳐요.","face":"기본","pose":"think"},{"who":"seoha","text":"……그쪽, 그 그림 언제 손에 넣었지?","face":"의심","alt":[{"if":{"rel":{"trust":[4,5]}},"text":"……역시. 그쪽이라면 그 그림부터 찾을 줄 알았어.","face":"미소"}]},{"who":"host","text":"그럼 그 시각의 자료를 한데 놓고 맞대어 보시지요."}]},{"type":"combine","title":"구절 짝짓기","guide":"서로 다른 자료의 구절 두 개를 맞대어 새 사실을 얻는다","issue":"i1","docs":[{"title":"리사이틀 프로그램","parts":["1부 19:30–19:50","휴식 19:50–20:00","2부 20:00–20:20"]},{"title":"스즈네의 크로키","parts":["19:45 진열장 — 반짝","20:05 진열장 — 비어 있음","소파 자리에서 그림"]},{"title":"바 주문 장부","parts":["오딜 19:46 레모네이드","오딜 19:58 레모네이드","오딜 20:12 체리"]}],"combos":[{"a":[1,1],"b":[0,1],"fact":"브로치가 사라진 건 휴식 시간 무렵이다"},{"a":[2,1],"b":[0,1],"fact":"휴식 시간 한가운데에 오딜은 바에서 주문하고 있었다"},{"a":[2,0],"b":[1,0],"fact":"브로치가 아직 반짝이던 무렵, 오딜은 이미 바에 있었다"}]},{"type":"talk","lines":[{"who":"odile","text":"짜잔! 장부에 내 이름이 세 번. 관객님, 이게 알리바이라는 거야.","face":"미소","pose":"point"},{"who":"mei","text":"그, 그래도……! 마술사라면 장부쯤이야……!","face":"곤란","pose":"think"}]},{"type":"trans","issue":"i2","text":"쟁점 둘"},{"type":"nonstop","title":"엇갈린 증언","guide":"한 사람의 말을 회수해 무기로 삼고, 그 말과 부딪치는 다른 사람의 약점에 쏜다","issue":"i2","absorb":true,"lines":[{"who":"mei","text":"{카드를 꽂은 건} {마술사뿐}. {그러니 가져간 것도} {당신이랍니다}!","face":"격노","pose":"point"},{"who":"odile","text":"{카드는 7시 20분}, {마술 끝내고 꽂아 둔 거야}. {휴식 시간엔} {바에 있었고}.","face":"기본","pose":"crossed"},{"who":"ruoxi","text":"{바 카운터에서는} {라운지 진열장이 보이지 않아요}.","face":"기본"}],"answers":[{"at":[0,2],"word":[1,3]},{"at":[1,3],"word":[0,2]}],"miss":{"mei":{"text":"오호호, 엉뚱한 곳을 찌르셨답니다!","face":"웃음","pose":"point","alt":[{"if":{"rel":{"affection":[4,5]}},"text":"어머, 거긴 아니에요. ……당신답지 않네요.","face":"곤란"},{"if":{"rel":{"trust":[1,2]}},"text":"야, 아무 데나 쏘지 마! ……가 아니라, 무례하답니다!","face":"격노"}]},"odile":{"text":"짜잔~ 빗나갔네, 관객님.","face":"웃음","alt":[{"if":{"rel":{"trust":[4,5]}},"text":"아까워! 관객님이라면 다음엔 맞힐 거야.","face":"미소"},{"if":{"rel":{"trust":[1,2]}},"text":"……일부러 날 노리는 거야?","face":"불만","pose":"crossed"}]},"seoha":{"text":"그쪽이 찌른 곳, 근거는?","face":"의심","pose":"crossed","alt":[{"if":{"rel":{"trust":[4,5]}},"text":"……서두르지 마. 그쪽은 원래 그렇게 대충 하지 않잖아.","face":"기본"}]},"ruoxi":{"text":"그 말은 사실관계와 무관해요.","face":"기본","pose":"think","alt":[{"if":{"rel":{"affection":[4,5]}},"text":"틀렸어요. 괜찮아요, 다시 보면 돼요.","face":"미소"}]},"clara":{"text":"……그건 제 말의 요지가 아닙니다.","face":"불만","pose":"crossed","alt":[{"if":{"rel":{"trust":[1,2]}},"text":"근거 없이 지목하지 마십시오.","face":"격노","pose":"point"}]},"suzune":{"text":"에, 저, 저요? 그건 아닌 것 같은데요…….","face":"곤란","alt":[{"if":{"rel":{"affection":[4,5]}},"text":"괜찮아요, 천천히 같이 봐요.","face":"미소"}]}},"mono":["……아니, 거기가 아니다. 증언을 다시 듣자.","빗나갔다. 말의 어디가 증거와 부딪치는지 다시 보자."]},{"type":"talk","lines":[{"who":"mei","text":"……그렇다면, 이건 어떠신가요!","face":"격노","pose":"point","cut":"반론","fx":"crack"},{"who":"mei","text":"마술사라면 [[바에 있는 척]]하면서, 손재주로 진열장까지 다녀올 수 있답니다!","face":"하라구로"}]},{"type":"rebut","npc":"mei","claim":"마술사라면 바에 있는 척하면서 손재주로 진열장 브로치를 빼 올 수 있어요. 장부의 이름도 속임수일지 모른답니다!","event":"T1_R1","holdEvent":"T1_R1H","issue":"i2","rel":{"mei":{"trust":5}}},{"type":"talk","lines":[{"who":"mei","text":"으…… 거, 건너편 방까지 다녀올 틈은 없었다는 거군요.","face":"부끄러움","alt":[{"if":{"hold":"i2"},"text":"……좋아요, 일단 보류해 드리죠. 하지만 눈은 떼지 않겠답니다.","face":"불만","pose":"crossed"}]},{"who":"seoha","text":"그럼 남는 질문. 휴식 시간에 라운지에 남아 있던 건 누구지?","face":"의심","pose":"think"},{"who":"clara","text":"……저는 피아노 앞에 있었습니다. 다음 곡을 준비해야 했으니까요.","face":"기본","pose":"crossed"}]},{"type":"trans","issue":"i3","text":"쟁점 셋"},{"type":"route","title":"휴식 시간의 동선","guide":"휴식 시간, 클라라가 피아노 앞에서 진열장까지 간 길을 칸으로 그린다","who":"clara","start":[3,4],"end":[11,2],"via":[[7,3]],"slack":3,"issue":"i3"},{"type":"talk","lines":[{"who":"clara","text":"……네. 진열장 앞에 갔습니다. 2부를 앞두고 [[잡음]]이 들렸으니까요.","face":"곤란"},{"who":"ruoxi","text":"잡음? 악보의 빨간 동그라미와 관계가 있나요?","face":"의심","pose":"think"},{"who":"clara","text":"B♭을 칠 때마다, 어디선가 금속이 떨렸습니다. 견딜 수 없었어요.","face":"불만"}]},{"type":"dream","title":"꿈 조각 잇기","guide":"사선 왼쪽은 '전', 오른쪽은 '후'. 「?」 칸만 바꿔 휴식 시간의 흐름을 잇는다","issue":"i3","cast":["suzune","mei","ruoxi","seoha","clara","odile"],"objs":["brooch","glove","card"],"ats":["손","바닥","진열장","피아노 의자","바 카운터"],"atProp":{"진열장":"shelf","피아노 의자":"desk","바 카운터":"desk"},"rel":{"clara":{"trust":5}},"rounds":[{"cap":"휴식 시간 19:52 · 라운지","a":{"bg":"라운지","who":"clara","pose":"서 있음","obj":"brooch","at":"진열장"},"b":{"bg":"라운지","who":"clara","pose":"서 있음","obj":"brooch","at":"손"},"ask":[["a","who"],["b","at"]]},{"cap":"19:55 · 라운지","a":{"bg":"라운지","who":"clara","pose":"건넴","obj":"glove","at":"손"},"b":{"bg":"라운지","who":"","pose":"서 있음","obj":"glove","at":"피아노 의자"},"ask":[["a","obj"],["b","at"]]}]},{"type":"talk","lines":[{"who":"host","text":"조각이 모였습니다. 진상을 굳혀 보시지요.","fx":"flash","speed":0.7}]},{"type":"crystal","issue":"i3","title":"진상 결정","guide":"모서리를 눌러 펼쳐지는 다섯 단서 중 하나를 고른다. 다섯 모서리가 모두 맞으면 진상이 굳는다","slots":[{"label":"누가","answer":"클라라","options":["클라라","오딜","메이벨","스즈네","아무도 아님"]},{"label":"무엇을","answer":"브로치를 장갑에 싸서 옮겼다","options":["브로치를 장갑에 싸서 옮겼다","브로치를 훔쳐 팔았다","가짜와 바꿔치기했다","바닥에 떨어뜨렸다","카드를 꽂았다"]},{"label":"언제","answer":"휴식 시간","options":["1부 연주 중","휴식 시간","2부 연주 중","리사이틀 뒤","7시 20분"]},{"label":"어디로","answer":"피아노 의자 수납칸","options":["피아노 의자 수납칸","바 카운터","객실 옷장","테라스 분수","복도 화분"]},{"label":"왜","answer":"장식이 피아노 소리에 떨려서","options":["장식이 피아노 소리에 떨려서","탐이 나서","메이벨을 곯려 주려고","오딜에게 부탁받아서","실수로"]}]},{"type":"vote","question":"브로치를 옮긴 사람은?","answer":"clara","options":["suzune","mei","ruoxi","seoha","clara","odile"],"follow":4,"beliefs":{"suzune":"clara","mei":"odile","ruoxi":"clara","seoha":"clara","clara":"clara","odile":"clara"}},{"type":"talk","lines":[{"who":"host","text":"정답입니다. 브로치를 옮긴 분은 [[클라라 님]]이었습니다.","fx":"flash"},{"who":"clara","text":"……2부가 끝나면 돌려놓을 생각이었습니다. 연주를 마치고 그만 잊었어요. 죄송합니다.","face":"슬픔","alt":[{"if":{"rel":{"trust":[4,5]}},"text":"……당신이 찾아 주어 다행입니다. 돌려놓는 걸 잊다니, 연주자로서 부끄럽군요.","face":"슬픔"}]},{"who":"ruoxi","text":"그런데 이 브로치, 보석치고 가벼워요. 헐거운 [[유리]] 장식이 공명한 거겠죠.","face":"의심","pose":"think"},{"who":"mei","text":"유, 유유, 유리라니 무슨 소리니! 이건 로슈벨 가문의……!","face":"패닉","fx":"shake","alt":[{"if":{"flag":"mei_early"},"text":"……응, 유리야. 시장에서 샀어. 영애 흉내에 맞춰서.","face":"부끄러움"}]},{"who":"seoha","text":"진짜 영애라면 가짜 보석 한 마디에 이렇게까지 당황하진 않겠지.","face":"하라구로","pose":"crossed","alt":[{"if":{"flag":"mei_early"},"text":"위장과 이번 일은 별개야. 유리든 보석이든, 옮긴 사람은 따로 있었으니까.","face":"기본","pose":"crossed"}]}]},{"type":"talk","setFlags":["mei_real"],"lines":[{"who":"mei","text":"……아, 진짜. 알았어, 말할게.","face":"부끄러움","fx":"zoom","alt":[{"if":{"flag":"mei_early"},"text":"……아까 말한 대로야. 그래도 한 번 더 사과할게.","face":"곤란"}]},{"who":"mei","text":"띠리 메이. 미얀마 사람이고, 공사 현장에서 일해. 영애는…… 한 번 해 보고 싶었을 뿐이야.","face":"슬픔","alt":[{"if":{"flag":"mei_early"},"text":"내 허세 때문에 오딜이 의심받았잖아. 띠리 메이로서, 미안해.","face":"슬픔"},{"if":{"rel":{"affection":[4,5]}},"text":"띠리 메이. 미얀마 사람이고, 공사 현장에서 일해. ……당신한테는 진작 말하고 싶었어.","face":"부끄러움"}]},{"who":"suzune","text":"메이 씨, 그래도 오늘 진짜 멋졌어요.","face":"미소"},{"who":"odile","text":"짜잔~ 오늘의 최고 마술은 메이 쪽이었네!","face":"웃음"},{"who":"mei","text":"……시끄러워. 그래도, 고마워.","face":"웃음"},{"who":"","text":"소동은 웃음으로 끝났다."}]}]},{"id":"case_c1","code":"C1","kind":"case","title":"사라진 브로치","stage":"라운지","hp":5,"evidence":[],"issues":[],"then":[{"code":"T1"}],"phases":[{"type":"talk","lines":[{"who":"host","text":"모이셨군요. 라운지 진열장에서 [[메이벨 님의 브로치]]가 사라졌다는 신고가 있었습니다.","fx":"flash","alt":[{"if":{"not":{"allHere":true}},"text":"모이신 분들부터 말씀드리지요. 라운지 진열장에서 [[메이벨 님의 브로치]]가 사라졌습니다."}]},{"who":"mei","text":"제 가문의 보물이 없어졌답니다! 이건 대사건이에요!","face":"패닉","here":true},{"who":"odile","text":"어머나, 마술처럼 사라졌네?","face":"웃음","here":true},{"who":"seoha","text":"……다들, 휴식 시간에 어디 있었지?","face":"의심","pose":"think","here":true},{"who":"host","text":"조사 시간을 드리겠습니다. 마감이 되면, 혹은 준비가 끝났다고 말씀하시면 재판을 시작하지요.","speed":0.8}]},{"type":"investigate","grant":["velvet"],"declare":true,"afterFound":50},{"type":"talk","lines":[{"who":"host","text":"시간이 되었습니다. 재판을 시작하겠습니다.","fx":"flash","speed":0.8}]}]}],"host":{"name":"지배인"},"rel":{"aiStep":5,"firstTalk":{"trust":6},"scales":[{"id":"trust","key":"t","name":"신뢰","levels":["적대","경계","보통","신뢰","깊은 신뢰"]},{"id":"affection","key":"a","name":"애정","levels":["냉담","무심","보통","호감","애정"],"opposite":false}]},"cases":[{"id":"C1","flag":"brooch_gone","spot":"case","watchers":["mei"],"trial":"C1","from":"20:30","wait":600,"notice":"지배인 방송: 라운지 진열장의 브로치가 사라졌다는 신고가 있었습니다. 모두 라운지로 모여 주십시오.","task":{"id":"gather_C1","kind":"visit","landmark":"sofa","durationSeconds":3600,"priority":300,"weight":1,"interruptible":false,"once":true}}],"debugTalk":{"greet":{"text":"안녕하세요.","face":"","alt":[{"if":{"rel":{"affection":[4,5],"trust":[3,5]}},"text":"아, 왔구나. [[기다리고 있었어]].","face":"웃음","fx":"zoom"},{"if":{"rel":{"affection":[4,5],"trust":[1,2]}},"text":"……또 너야? 뭐, 싫진 않지만.","face":"부끄러움"},{"if":{"rel":{"trust":[4,5]}},"text":"마침 잘 왔어요. 당신이라면 믿을 수 있으니까.","face":"미소"},{"if":{"rel":{"trust":[1,1]}},"text":"<<가까이 오지 마>>.","face":"격노","pose":"point","fx":"shake"},{"if":{"rel":{"trust":[2,2]}},"text":"……무슨 용건이죠.","face":"의심","pose":"crossed"}]},"tests":[{"label":"웃음·다가섬","face":"웃음","fx":"zoom","text":"정말요? <<다행이다>>!"},{"label":"놀람·흔들림","face":"놀람","fx":"shake","text":"[[잠깐]], 그게 무슨……!"},{"label":"속삭임","face":"미소","text":"((여기서만 하는 얘기인데……))"},{"label":"격노·깨짐","face":"격노","pose":"point","fx":"crack","text":"<<그만해>>! 더는 못 참아."},{"label":"생각","face":"의심","pose":"think","text":"……이상하네. 순서가 맞지 않아."},{"label":"팔짱·불만","face":"불만","pose":"crossed","text":"흥, 그래서요?"},{"label":"하라구로","face":"하라구로","text":"후후…… 다 알고 있어요."},{"label":"패닉","face":"패닉","fx":"shake","text":"아, 아니, 그게 아니라……!"},{"label":"슬픔","face":"슬픔","text":"……미안해요."},{"label":"곤란","face":"곤란","pose":"think","text":"음…… 어떡하죠."},{"label":"부끄러움","face":"부끄러움","text":"그, 그렇게 보지 마세요……"}]}};
const TN_CSS = ".tr-out{width:100%;position:relative;font-family:system-ui,-apple-system,\"Malgun Gothic\",sans-serif;color:#e7edf5;-webkit-tap-highlight-color:transparent}\n.tr-card{position:absolute;left:0;top:0;width:360px;height:540px;overflow:hidden;background:#0c1421;border-radius:8px;transform-origin:0 0;user-select:none}\n.tr-card *{box-sizing:border-box}.tr-card button{font:inherit;color:inherit;cursor:pointer;background:#0b1522e0;border:1px solid #3d5368;border-radius:7px;padding:0 8px;line-height:1}\n.tr-card button:disabled{opacity:.38;cursor:default}\n.tr-map{position:absolute;inset:0;overflow:hidden;touch-action:manipulation;background:#120d0b}\n.tr-world{position:absolute;left:0;top:0;transition:transform .18s linear;will-change:transform}\n.tr-px{image-rendering:pixelated;image-rendering:crisp-edges}\n.tr-fog{position:absolute;background:#070b12;pointer-events:none}\n.tr-ch{position:absolute;left:0;top:0;width:36px;height:36px;transition:transform .18s linear;pointer-events:none}\n.tr-shadow{position:absolute;left:7px;right:7px;bottom:0;height:8px;border-radius:50%;background:#0000004d}\n.tr-shadow.sel{background:#f6d48a55;box-shadow:0 0 0 2px #f6d48a}\n.tr-tok{position:absolute;left:4px;top:4px;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;font-size:12px;font-weight:700;color:#14212c;border:2px solid #f4efdf}\n.tr-tag{position:absolute;left:50%;bottom:52px;transform:translateX(-50%);font-size:9px;line-height:12px;padding:0 4px;border-radius:6px;background:#0d1522d9;color:#f3ead6;border:1px solid;white-space:nowrap}\n.tr-hud{position:absolute;left:4px;right:4px;top:4px;display:flex;gap:4px;align-items:center;font-size:12px;pointer-events:none}\n.tr-hud>*{pointer-events:auto}\n.tr-pill{background:#0e1624e0;border:1px solid #e9c98c55;border-radius:999px;padding:3px 10px;line-height:16px;white-space:nowrap;box-shadow:0 1px 4px #0009}\n.tr-area{display:flex;align-items:center;gap:5px;font-weight:600;color:#f6ead2}.tr-area i{width:7px;height:7px;border-radius:50%;background:#f2c46d;box-shadow:0 0 6px #f2c46d}\n.tr-card .tr-hbtn{height:26px;min-width:30px;border-radius:999px;background:#0e1624e0;border-color:#e9c98c55;box-shadow:0 1px 4px #0009;font-size:12px}\n.tr-time{color:#e7c894;font-variant-numeric:tabular-nums}\n.tr-hud button{height:24px;font-size:12px}\n.tr-toast{position:absolute;left:6px;max-width:348px;top:34px;font-size:11px;line-height:15px;padding:2px 9px;background:#0b1522c8;border-radius:999px;color:#c9d5e0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;pointer-events:none}\n.tr-padbase{position:absolute;left:0;top:421px;width:110px;height:110px;border-radius:50%;background:radial-gradient(#0e162440,#0e1624a8);border:1px solid #e9c98c33;pointer-events:none}\n.tr-card .tr-pad{position:absolute;width:34px;height:34px;display:grid;place-items:center;padding:0;touch-action:none;border-radius:50%;background:#16233ae6;border-color:#e9c98c66;color:#f2d79e;box-shadow:0 2px 4px #0008}\n.tr-card .tr-pad:active{background:#2c4a63}\n.tr-menu{position:absolute;left:116px;right:6px;bottom:6px;padding:6px;background:#0a1220f2;border:1px solid #e9c98c66;border-radius:12px;box-shadow:0 4px 12px #000a}\n.tr-menu-g button:first-child{background:#6b4f26;border-color:#e2bb73}\n.tr-menu-h{display:flex;justify-content:space-between;align-items:baseline;font-size:12px;line-height:15px;margin:0 2px 4px}\n.tr-menu-h b{font-weight:600;color:#f2c48f}.tr-menu-h span{color:#93adc2;font-size:11px}\n.tr-menu-g{display:grid;grid-template-columns:1fr 1fr;gap:4px}.tr-menu-g button{height:34px;font-size:13px}\n.tr-menu-why{font-size:10px;color:#93adc2;margin:3px 2px 0;line-height:13px}\n.tr-preview{position:absolute;left:116px;right:6px;bottom:6px;box-shadow:0 3px 8px #0008;padding:4px 7px;font-size:12px;line-height:16px;background:#f3e6c8;color:#3d2c14;border-radius:8px}\n.tr-sheet{position:absolute;inset:0;background:#0c1421;display:flex;flex-direction:column}\n.tr-tabs{display:flex;gap:3px;padding:4px}.tr-tabs button{flex:1;height:28px;font-size:12px}.tr-tabs .on{background:#2c4a63;border-color:#7ea0bc}\n.tr-body{flex:1;overflow-y:auto;padding:2px 8px 8px;font-size:13px;line-height:18px}\n.tr-row{padding:4px 0;border-bottom:1px solid #22344a}.tr-row time{color:#c6a572;margin-right:6px;font-variant-numeric:tabular-nums}\n.tr-mut{color:#93adc2;font-size:11px;line-height:15px}\n.tr-mono{font:11px ui-monospace,monospace;word-break:break-all;color:#cfe0ee}\n.tr-ta{width:100%;resize:none;padding:5px 7px;background:#08121c;border:1px solid #3d5368;color:#e6eef7;border-radius:6px;font:inherit;font-size:16px;line-height:20px;user-select:text}\n.tr-talk{position:absolute;inset:0}\n.tr-box{position:absolute;left:5px;right:5px;padding:3px 8px 4px;background:#08111ef2;border:1px solid #8a7550;border-radius:8px}\n.tr-name{display:flex;justify-content:space-between;font-size:12px;line-height:16px}.tr-name b{color:#f2c48f;font-weight:600}.tr-name span{color:#93adc2;font-size:11px}\n.tr-line{font-size:14px;line-height:19px;height:57px;overflow:hidden;white-space:pre-wrap;overflow-wrap:anywhere}\n.tr-line.narr{color:#b9c9d6;font-style:italic}\n.tr-ctl{display:flex;gap:4px;margin-top:2px}.tr-ctl button{height:22px;font-size:11px;padding:0 7px}\n.tr-in{position:absolute;left:5px;right:5px;bottom:5px;padding:4px;background:#0e1a29f5;border:1px solid #3d5368;border-radius:8px}\n.tr-in-top{display:flex;gap:4px;margin-bottom:3px;align-items:center}.tr-in-top button{height:22px;font-size:11px}\n.tr-send{width:52px;flex:none;white-space:nowrap;padding:0 4px!important;background:#907040!important;border-color:#c1a06a!important;font-size:13px!important}\n.tr-drop{position:absolute;left:4px;bottom:100%;margin-bottom:3px;display:grid;gap:3px;padding:4px;background:#08111ef7;border:1px solid #6d7f92;border-radius:8px;width:150px}\n.tr-drop button{height:30px;font-size:12px;text-align:left}\n.tr-err{position:absolute;inset:0;padding:14px;display:flex;flex-direction:column;gap:8px;font-size:13px;line-height:19px}\n\n.tr-fade{position:absolute;inset:0;background:#000;pointer-events:none;animation:trfade .28s ease-out forwards}\n@keyframes trfade{from{opacity:1}to{opacity:0}}\n.tr-found{position:absolute;left:30px;right:30px;top:150px;padding:10px 12px;background:#f6ecd6;color:#3a2a14;border:2px solid #b98c4a;border-radius:10px;box-shadow:0 6px 18px #000b;display:grid;gap:6px;font-size:13px}\n.tr-found .tr-mut{color:#7a5a30}.tr-found-h{font-size:11px;letter-spacing:.1em;color:#9a6a2a;font-weight:700}\n.tr-card .tr-big{min-height:40px;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:2px;padding:4px 10px;font-size:13px;text-align:left;background:#1b2a3d;border-color:#e9c98c66}\n.tr-big small{font-size:11px;color:#c9a86c}\n.tr-grid{display:grid;gap:3px}.tr-grid.h{grid-template-columns:repeat(8,1fr)}.tr-grid.m{grid-template-columns:repeat(6,1fr)}\n.tr-card .tr-grid button{height:26px;font-size:12px;padding:0}.tr-card .tr-grid .on{background:#6b4f26;border-color:#e2bb73}\n.tr-prev{border:1px dashed #e9c98c66;border-radius:8px;padding:6px 8px;font-size:12px}\n.tr-lock{height:40px;display:grid;place-items:center;background:#000;color:#555;border-radius:7px;font-size:12px;letter-spacing:.05em}\n\n.tr-cards{display:grid;gap:6px;padding-top:4px}\n.tr-card .tr-card2{display:flex;gap:8px;align-items:center;padding:4px;text-align:left;background:#f3ead6;color:#3a2a14;border:1px solid #c9a86c;border-radius:9px;line-height:17px;font-size:13px;overflow:hidden}\n.tr-card2 b{color:#8a3b2b}.tr-mut2{font-size:11px;color:#7a5a30;line-height:15px}\n.tr-nb-detail{display:grid;gap:6px;padding-top:2px}\n.tr-card .tr-back{height:26px;justify-self:start;font-size:12px}\n.tr-slips{display:grid;grid-template-columns:1fr 1fr;gap:6px}\n.tr-slip{background:#f3ead6;color:#3a2a14;border-radius:4px;padding:7px 8px;font-size:12px;line-height:17px;box-shadow:0 2px 4px #0007;border-top:3px solid #d9a441}\n.tr-slip.lock{background:#2a3240;color:#8fa0b3;border-top-color:#4a5566;text-align:center}.tr-slip.lock b{display:block;letter-spacing:.2em}\n.tr-grid2{display:grid;grid-template-columns:1fr 1fr;gap:6px}\n.tr-card .tr-scene{padding:0;overflow:hidden;border-radius:8px;display:flex;flex-direction:column;background:#f3ead6;color:#3a2a14;border:1px solid #c9a86c}\n.tr-scene span{font-size:11px;padding:3px 5px;line-height:14px;text-align:left}\n.tr-scene.lock{height:118px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;border-radius:8px;background:repeating-linear-gradient(45deg,#2a3240 0 8px,#26303d 8px 16px);color:#8fa0b3;border:1px dashed #4a5566}\n.tr-scene.lock b{letter-spacing:.2em}\n\n.tr-call{position:absolute;left:116px;right:6px;bottom:6px;padding:7px 9px;background:#f6ecd6;color:#3a2a14;border:2px solid #b98c4a;border-radius:11px;box-shadow:0 4px 12px #000a;font-size:13px;line-height:18px}\n.tr-call b{color:#8a3b2b}.tr-card .tr-call button{flex:1;height:32px;background:#e9dcc0;color:#3a2a14;border-color:#b98c4a}.tr-card .tr-call .tr-callyes{background:#6b4f26;color:#f6ead2;border-color:#e2bb73}\n\n.tr-court{background:radial-gradient(ellipse at 50% 30%,#2b2340,#0d0b16 75%)}\n.tr-thead{position:absolute;left:6px;right:6px;top:6px;display:flex;align-items:center;gap:8px;padding:5px 8px;background:#120f1ee6;border:1px solid #e9c98c55;border-radius:10px;font-size:13px}\n.tr-thead>div:first-child{flex:1}.tr-thead b{color:#f2d79e}\n.tr-hp{display:flex;gap:3px}.tr-hp i{width:11px;height:11px;transform:rotate(45deg);border:1px solid #e9c98c88;background:#2a2230}.tr-hp i.on{background:linear-gradient(135deg,#ffe3a0,#d08a3a);box-shadow:0 0 6px #f2c46d}\n.tr-tbody{position:absolute;left:6px;right:6px;top:78px;bottom:6px;z-index:1;display:flex;flex-direction:column;justify-content:flex-end}\n.tr-tbox{display:flex;gap:8px;align-items:flex-end;padding:8px;background:#0a0813ee;border:1px solid #8a7550;border-radius:10px;min-height:140px;animation:trin .25s ease-out}\n.tr-tpor{flex:none;border-radius:8px;overflow:hidden;border:1px solid #e9c98c55}.tr-tpor.sm{align-self:flex-start}\n.tr-ttext{font-size:14px;line-height:20px;white-space:pre-wrap}.tr-ttext.narr{color:#b9c9d6;font-style:italic}\n.tr-debate{display:grid;gap:7px}\n.tr-stmt{display:flex;gap:8px;padding:9px;background:#f3ead6;color:#3a2a14;border-radius:10px;border-left:5px solid #d9a441;box-shadow:0 4px 10px #000a;animation:trin .3s ease-out}\n.tr-stmt.rebut{border-left-color:#c0504a}\n.tr-dots{display:flex;justify-content:center;gap:6px}.tr-dots i{width:7px;height:7px;border-radius:50%;background:#4a4458}.tr-dots i.on{background:#f2c46d}\n.tr-card .tr-tbtn{flex:1;height:36px;border-radius:9px;background:#1f1a2e;border-color:#e9c98c55;font-size:13px}\n.tr-card .tr-tbtn.gold{background:#6b4f26;border-color:#e2bb73;color:#f6ead2}\n.tr-card .tr-evi{display:flex;flex-direction:column;align-items:flex-start;gap:2px;padding:6px 9px;text-align:left;background:#f3ead6;color:#3a2a14;border-color:#c9a86c;font-size:13px;line-height:17px}\n.tr-evi span{font-size:11px;color:#7a5a30}\n.tr-chips{display:flex;flex-wrap:wrap;gap:4px}.tr-card .tr-chips button{height:28px;font-size:12px;border-radius:999px}.tr-card .tr-chips .on{background:#6b4f26;border-color:#e2bb73}\n.tr-line2{display:grid;gap:4px}\n.tr-slot{display:flex;gap:6px;align-items:center;min-height:28px;padding:3px 8px;border:1px dashed #4a4458;border-radius:8px;font-size:12px;color:#d9d0e8}\n.tr-slot i{font-style:normal;width:18px;height:18px;border-radius:50%;display:grid;place-items:center;background:#2a2230;font-size:11px;flex:none}\n.tr-slot.on{border-style:solid;border-color:#9a7ad8;background:#2a2140;animation:trin .3s ease-out}.tr-slot.on i{background:#9a7ad8;color:#120f1e}\n.tr-sky{position:relative;height:190px;border-radius:12px;background:radial-gradient(#3a2f5a55,#0000)}\n.tr-card .tr-bub{position:absolute;width:44%;min-height:60px;padding:6px 8px;border-radius:30px;font-size:12px;line-height:16px;background:radial-gradient(circle at 30% 30%,#f6f0ff,#c8b6f0);color:#2a1f40;border:1px solid #fff8;box-shadow:0 0 14px #b49cf088;animation:trfloat 3.2s ease-in-out infinite}\n.tr-votes{display:grid;grid-template-columns:1fr 1fr;gap:6px}\n.tr-card .tr-vote{display:flex;flex-direction:column;align-items:center;gap:3px;padding:5px;background:#1f1a2e;border-radius:10px;font-size:13px}\n.tr-card .tr-vote.on{border-color:#f2c46d;box-shadow:0 0 0 2px #f2c46d}\n.tr-bar{width:100%;height:6px;background:#2a2230;border-radius:3px;overflow:hidden}.tr-bar i{display:block;height:100%;background:#f2c46d;transition:width 1s ease-out}\n.tr-stamp{position:absolute;left:50%;top:44%;transform:translate(-50%,-50%) rotate(-8deg);padding:8px 22px;font-size:30px;font-weight:800;color:#ffe3a0;border:4px solid #ffe3a0;border-radius:10px;background:#120f1ecc;text-shadow:0 0 12px #f2c46d;animation:trstamp .35s ease-out;pointer-events:none;white-space:nowrap}\n.tr-stamp.bad{color:#ff9a8a;border-color:#ff9a8a;text-shadow:0 0 12px #c0504a}\n.tr-rewind{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:#0d0b16f0;text-align:center;padding:20px;font-size:15px;color:#e9dcff}\n.tr-rewind.fail{color:#ffb0a0}\n.tr-swirl{width:120px;height:120px;border-radius:50%;background:conic-gradient(#9a7ad8,#f2c46d,#9a7ad8);animation:trspin 1.2s linear infinite reverse;mask:radial-gradient(#0000 40%,#000 42%);-webkit-mask:radial-gradient(#0000 40%,#000 42%)}\n.shake{animation:trshake .35s}\n@keyframes trin{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}\n@keyframes trfloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}\n@keyframes trstamp{from{opacity:0;transform:translate(-50%,-50%) rotate(-8deg) scale(2)}to{opacity:1;transform:translate(-50%,-50%) rotate(-8deg) scale(1)}}\n@keyframes trspin{to{transform:rotate(360deg)}}\n@keyframes trshake{0%,100%{transform:none}25%{transform:translateX(-6px)}50%{transform:translateX(6px)}75%{transform:translateX(-3px)}}\n\n.tr-col{flex:1;display:grid;gap:4px;align-content:start;padding:6px;background:#f3ead6;color:#3a2a14;border-radius:9px}\n.tr-colh{display:flex;align-items:center;gap:6px;font-size:13px}.tr-colh>div{border-radius:6px;overflow:hidden}\n.tr-card .tr-part{min-height:30px;padding:4px 7px;text-align:left;font-size:12px;line-height:16px;background:#e9dcc0;color:#3a2a14;border-color:#c9a86c}\n.tr-card .tr-part.on{background:#6b4f26;color:#f6ead2;border-color:#e2bb73;box-shadow:0 0 0 2px #f2c46d}\n.tr-docs{display:grid;gap:5px;max-height:250px;overflow-y:auto}\n.tr-doc{display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;padding:6px;background:#f3ead6;color:#3a2a14;border-radius:8px;border-top:3px solid #9a7ad8}\n.tr-doc b{grid-column:1/-1;font-size:12px}\n.tr-facts{display:grid;gap:3px}.tr-fact{font-size:12px;padding:3px 8px;border-radius:6px;background:#2a2140;color:#e9dcff;border:1px solid #9a7ad8;animation:trin .3s}.tr-fact.lock{color:#6a6080;border-style:dashed}\n.tr-photo{position:relative;height:210px;border-radius:10px;overflow:hidden;border:6px solid #f3ead6;box-shadow:0 4px 12px #000a;background:#2a2230}\n.tr-photoin{position:absolute;inset:0;transition:filter .6s}\n.tr-card .tr-spot{position:absolute;width:30px;height:30px;margin:-15px 0 0 -15px;border-radius:50%;padding:0;background:#f2c46d55;border:2px dashed #ffe3a0;color:#fff;font-weight:700;animation:trpulse 1.4s infinite}\n.tr-card .tr-spot.on{background:#f2c46d;color:#3a2a14}\n.tr-mini{position:relative;margin:0 auto;border-radius:6px;overflow:hidden;border:1px solid #e9c98c55;touch-action:manipulation}\n.tr-card .tr-pin{position:absolute;transform:translate(-50%,-50%);height:28px;padding:0 9px;font-size:12px;background:#f6f0e4;color:#3a2a14;border-color:#8a6a40;box-shadow:0 2px 4px #0007}\n.tr-card .tr-pin.on{background:#c0303a;color:#fff;border-color:#fff}\n.tr-crys{position:relative;height:240px}\n.tr-card .tr-face{position:absolute;transform:translate(-50%,-50%);width:104px;min-height:44px;padding:3px 5px;display:flex;flex-direction:column;align-items:center;font-size:11px;line-height:14px;background:#1f1a2e;border-color:#9a7ad8;text-align:center}\n.tr-face small{color:#c9b6f0;font-size:10px}.tr-card .tr-face.on{box-shadow:0 0 0 2px #f2c46d}.tr-card .tr-face.set{background:#2a2140}\n@keyframes trpulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}\n\n.tr-stage{position:absolute;left:0;right:0;top:0;height:420px;overflow:hidden}\n.tr-stage.mini{height:110px}\n.tr-spot-light{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,#f2e6c033,transparent 60%),radial-gradient(ellipse at 50% 100%,#3a2f5a66,transparent 70%)}\n.tr-actor{position:absolute;left:0;bottom:-97px;width:360px;height:528px;transform-origin:50% 100%;animation:trfadeA .16s ease-out}\n@keyframes trfadeA{from{opacity:.25}to{opacity:1}}\n.tr-actor-in{position:absolute;inset:0;transform:scale(.82);transform-origin:50% 100%}\n.fx-shake .tr-actor{animation:trshake .4s 2}\n.fx-zoom .tr-actor{animation:trzoom .5s ease-out}\n.tr-flash{position:absolute;inset:0;background:#fff;animation:trflash .5s ease-out forwards;pointer-events:none}\n.tr-cutin{position:absolute;inset:0;pointer-events:none}\n.tr-cutband{position:absolute;left:-10%;right:-10%;top:90px;height:96px;display:flex;align-items:center;gap:14px;padding:0 22%;background:linear-gradient(90deg,#c0303a,#7a1020);transform:skewY(-8deg);animation:trcut 1.6s ease-out forwards;box-shadow:0 0 30px #000}\n.tr-cutband>div{border-radius:6px;overflow:hidden;border:2px solid #fff}\n.tr-cutband b{font-size:44px;color:#fff;font-weight:900;letter-spacing:.05em;text-shadow:3px 3px 0 #3a0008}\n.tr-shards{position:absolute;inset:0;pointer-events:none;z-index:5}\n.tr-shards i{position:absolute;inset:0;background:linear-gradient(135deg,#ffffff22,#ffffff05);animation:trshard 1.1s ease-in forwards}\n.tr-shards svg{position:absolute;inset:0;width:100%;height:100%;animation:trflash 1.1s ease-in forwards}\n.tr-thead{z-index:2}\n.tr-issues{position:absolute;left:6px;right:6px;top:52px;display:flex;gap:4px;z-index:2}\n.tr-issue{flex:1;min-width:0;display:flex;gap:4px;align-items:center;padding:3px 6px;font-size:10px;line-height:13px;border-radius:7px;background:#120f1ecc;border:1px solid #4a4458;color:#8a8098;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.tr-issue i{font-style:normal;flex:none;width:14px;height:14px;border-radius:50%;display:grid;place-items:center;background:#2a2230;font-size:9px}\n.tr-issue.now{border-color:#f2c46d;color:#f6ead2;box-shadow:0 0 8px #f2c46d55;flex:2}.tr-issue.now i{background:#f2c46d;color:#120f1e}\n.tr-issue.done{border-color:#9a7ad8;color:#d9ccf5}.tr-issue.done i{background:#9a7ad8;color:#120f1e}\n.tr-tbox2{padding:9px 11px;background:#0a0813f0;border:1px solid #8a7550;border-radius:10px;min-height:118px;animation:trin .2s ease-out;box-shadow:0 -6px 20px #0009}\n.trm-em{color:#ff8a7a;font-weight:800}.trm-big{font-size:18px;color:#ffe3a0;font-weight:800}.trm-wh{font-size:12px;color:#9a90b0;font-style:italic}\n.tr-trans{align-self:stretch;margin-bottom:120px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;min-height:200px;border-radius:14px;background:linear-gradient(135deg,#2a2140ee,#120f1eee);border:1px solid #9a7ad8;animation:trtrans .6s ease-out;text-align:center}\n.tr-trans-n{font-size:13px;letter-spacing:.4em;color:#c9b6f0}.tr-trans-q{font-size:22px;font-weight:800;color:#ffe3a0;padding:0 16px;text-shadow:0 0 14px #f2c46d66}\n.tr-wtabs{display:flex;gap:5px}.tr-card .tr-wtabs button{flex:1;display:flex;align-items:center;gap:5px;padding:3px;height:48px;border-radius:9px;background:#1f1a2e;font-size:12px}\n.tr-wtabs button>div{border-radius:5px;overflow:hidden;flex:none}.tr-card .tr-wtabs .on{border-color:#f2c46d;background:#2a2140}.tr-card .tr-wtabs .mark{box-shadow:inset 0 -3px 0 #c0303a}\n.tr-picked{display:grid;gap:3px;min-height:40px;padding:5px 8px;border:1px dashed #c0303a88;border-radius:8px;font-size:12px;color:#ffd0c8}\n.tr-fact.fresh{animation:trglow 1s ease-out}\n.tr-photo.clear{animation:trglow 1.2s ease-out}\n.tr-fan{position:absolute;inset:-6px;background:#0d0b16aa;border-radius:12px;z-index:3}\n.tr-card .tr-fancard{position:absolute;transform:translate(-50%,-50%);width:98px;min-height:46px;padding:4px 6px;font-size:12px;line-height:15px;background:#f3ead6;color:#3a2a14;border:1px solid #c9a86c;border-radius:7px;box-shadow:0 4px 10px #000a;animation:trfan .3s ease-out backwards}\n.tr-card .tr-fancard.on{background:#6b4f26;color:#fff}\n.tr-crys.win .tr-core{animation:trglow 1s ease-out infinite}.tr-crys.win{animation:trzoom .7s ease-out}\n.tr-stamp.big{font-size:40px;color:#fff;border-color:#fff;background:#c0303acc;text-shadow:0 0 14px #ff8a7a}\n.tr-ripple{position:relative;width:180px;height:180px}.tr-ripple i{position:absolute;inset:0;border-radius:50%;border:2px solid #c9b6f0;animation:trripple 2.4s ease-out infinite}.tr-ripple i:nth-child(2){animation-delay:.8s}.tr-ripple i:nth-child(3){animation-delay:1.6s}\n.tr-clock{position:absolute;top:calc(50% - 90px);width:70px;height:70px;border-radius:50%;border:2px solid #e9dcff88}.tr-clock b{position:absolute;left:34px;top:8px;width:2px;height:28px;background:#e9dcff;transform-origin:1px 27px;animation:trspin 1s linear infinite reverse}\n.tr-whisper{font-style:italic;color:#c9c0dc;font-size:14px;line-height:21px;max-width:280px;opacity:0;animation:trwhisper 1s ease-out 1s forwards}\n.tr-later{opacity:0;animation:trwhisper .6s ease-out 2.4s forwards}\n.tr-rewind{animation:trdream 2.4s ease-in-out}\n@keyframes tractor{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:none}}\n@keyframes trzoom{0%{transform:none}40%{transform:scale(1.1)}100%{transform:none}}\n@keyframes trflash{from{opacity:.9}to{opacity:0}}\n@keyframes trcut{0%{transform:skewY(-8deg) translateX(110%)}18%{transform:skewY(-8deg) translateX(0)}80%{transform:skewY(-8deg) translateX(0);opacity:1}100%{transform:skewY(-8deg) translateX(-110%);opacity:0}}\n@keyframes trshard{0%{transform:none;opacity:1}30%{transform:none;opacity:1}100%{transform:translate(var(--dx),calc(var(--dy) + 260px)) rotate(25deg);opacity:0}}\n@keyframes trtrans{from{opacity:0;transform:rotateX(70deg) scale(.8)}to{opacity:1;transform:none}}\n@keyframes trglow{0%{box-shadow:0 0 0 0 #f2c46d;filter:brightness(1.6)}100%{box-shadow:0 0 0 12px #f2c46d00;filter:none}}\n@keyframes trdraw{to{stroke-dashoffset:0}}\n@keyframes trfan{from{opacity:0;left:174px;top:118px}}\n@keyframes trripple{from{transform:scale(.2);opacity:1}to{transform:scale(1.6);opacity:0}}\n@keyframes trwhisper{to{opacity:1}}\n@keyframes trdream{0%{filter:hue-rotate(0) blur(0)}40%{filter:hue-rotate(120deg) blur(3px)}100%{filter:none}}\n\n.tr-rewind{z-index:10}.tr-stamp{z-index:9}.tr-shards{z-index:8}\n.tr-fan::before{content:attr(data-l);position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);color:#ffe3a0;font-size:12px}\n\n/* v1.3 진행자 등장: 위에서 조명이 내려오고 실루엣이 떠오른다 */\n.tr-actor.host{display:block;transform:none;bottom:0;height:300px;animation:none}\n.tr-hspot{position:absolute;left:50%;top:-20px;width:300px;height:330px;transform:translateX(-50%);transform-origin:50% 0;background:conic-gradient(from 160deg at 50% 0,transparent 0deg,#fff4d433 14deg,#fff4d455 20deg,#fff4d433 26deg,transparent 40deg);filter:blur(2px)}\n.tr-hspot-floor{position:absolute;left:50%;bottom:6px;width:210px;height:34px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(#fff4d466,transparent 70%)}\n.tr-host-sil{position:absolute;left:50%;bottom:0;width:160px;height:260px;transform:translateX(-50%);filter:drop-shadow(0 0 10px #e9c98c44)}\n@keyframes trspot{0%{transform:translateX(-50%) scaleY(0);opacity:0}60%{opacity:1}100%{transform:translateX(-50%) scaleY(1);opacity:1}}\n@keyframes trspotf{from{opacity:0;transform:translateX(-50%) scale(.3)}to{opacity:1;transform:translateX(-50%) scale(1)}}\n@keyframes trhost{from{opacity:0;transform:translateX(-50%) translateY(14px)}to{opacity:1;transform:translateX(-50%)}}\n/* 반론: 화면을 비스듬히 나눠 나와 상대가 맞선다 */\n.tr-split{position:absolute;inset:0;pointer-events:none}\n.tr-split-l{position:absolute;inset:0;clip-path:polygon(0 0,52% 0,38% 100%,0 100%);background:linear-gradient(120deg,#163252,#0a1220 70%);animation:trsplitl .45s cubic-bezier(.2,.9,.3,1) both}\n.tr-split-l .tr-me-sil{position:absolute;left:14px;bottom:-26px;width:150px;height:244px}\n.tr-split-l b{position:absolute;left:18px;top:86px;font-size:15px;color:#bfe0ff;text-shadow:0 0 8px #3a8ad8}\n.tr-split-seam{position:absolute;left:0;right:0;top:0;bottom:0;background:linear-gradient(to bottom right,transparent calc(50% - 2px),#fff 50%,transparent calc(50% + 2px));clip-path:polygon(50% 0,54% 0,40% 100%,36% 100%);background:#fff;box-shadow:0 0 18px #fff;animation:trseam .6s .25s both}\n.tr-split-tag{position:absolute;left:44%;top:46%;transform:translate(-50%,-50%) rotate(-12deg);padding:3px 16px;font-size:26px;font-weight:900;color:#fff;background:#c0303a;border:2px solid #fff;letter-spacing:4px;box-shadow:0 0 16px #c0303a;animation:trtag .5s .45s cubic-bezier(.2,1.6,.4,1) both}\n.tr-split-r{position:absolute;right:16px;top:86px;font-size:15px;color:#ffd3c6;text-shadow:0 0 8px #c0303a}\n@keyframes trsplitl{from{transform:translateX(-60%)}to{transform:none}}\n@keyframes trsplitr{from{transform:translateX(60%)}to{transform:none}}\n@keyframes trseam{0%{opacity:0;transform:scaleY(0)}40%{opacity:1}100%{opacity:.85;transform:none}}\n@keyframes trtag{from{opacity:0;transform:translate(-50%,-50%) rotate(-12deg) scale(2.4)}to{opacity:1;transform:translate(-50%,-50%) rotate(-12deg) scale(1)}}\n/* 체력이 깨진다 */\n.tr-hp i{position:relative}\n.tr-hp i.brk{background:none;border-color:transparent}\n.tr-hp i.brk u{position:absolute;left:0;top:0;width:6px;height:6px;background:linear-gradient(135deg,#ffe3a0,#d08a3a);animation:trhpb .7s ease-out forwards}\n.tr-hp i.brk u:nth-child(2){left:5px;--bx:14px;--by:-10px}.tr-hp i.brk u:nth-child(3){top:5px;--bx:-12px;--by:12px}.tr-hp i.brk u:nth-child(4){left:5px;top:5px;--bx:12px;--by:14px}\n.tr-hp i.brk u:nth-child(1){--bx:-14px;--by:-12px}\n@keyframes trhpb{0%{transform:none;opacity:1}100%{transform:translate(var(--bx),var(--by)) rotate(160deg);opacity:0}}\n.tr-hurt{position:absolute;inset:0;z-index:8;pointer-events:none;box-shadow:inset 0 0 70px 20px #c0303aaa;animation:trhurt .7s ease-out forwards}\n@keyframes trhurt{0%{opacity:1}100%{opacity:0}}\n/* 풀린 쟁점 카드가 표시줄로 날아가 붙는다 */\n.tr-fly{position:absolute;z-index:9;left:50%;top:46%;display:flex;gap:6px;align-items:center;padding:8px 14px;border-radius:10px;background:#1c1630;border:2px solid #9a7ad8;color:#efe6ff;font-size:15px;white-space:nowrap;box-shadow:0 0 18px #9a7ad8aa;transform:translate(-50%,-50%);animation:trfly 1.2s cubic-bezier(.55,0,.35,1) forwards;pointer-events:none}\n.tr-fly i{font-style:normal;width:18px;height:18px;border-radius:50%;display:grid;place-items:center;background:#9a7ad8;color:#120f1e;font-size:11px}\n@keyframes trfly{0%{opacity:0;transform:translate(-50%,-50%) scale(.5)}22%{opacity:1;transform:translate(-50%,-50%) scale(1.12)}45%{left:50%;top:46%;transform:translate(-50%,-50%) scale(1)}100%{left:var(--tx);top:60px;transform:translate(-50%,-50%) scale(.3);opacity:.3}}\n.tr-issue.pop{animation:trpop .5s 1s ease-out}\n@keyframes trpop{0%{box-shadow:0 0 0 0 #9a7ad8}50%{box-shadow:0 0 14px 4px #c9b0ff;background:#3a2c5a}100%{box-shadow:none}}\n/* 투표: 다른 참가자들도 차례로 표를 던지고, 슬롯이 돌아 결과가 멈춘다 */\n.tr-voters{display:flex;flex-wrap:wrap;gap:4px;justify-content:center}\n.tr-voter{font-size:11px;padding:2px 7px;border-radius:9px;background:#1f1a2e;color:#6d6580;border:1px solid #3a3448}\n.tr-voter.in{color:#f6ead2;border-color:#f2c46d88;animation:trvin .3s ease-out}.tr-voter b{margin-right:3px}\n@keyframes trvin{from{transform:scale(1.4);background:#4a3a20}to{transform:none}}\n.tr-reelwrap{position:absolute;inset:0;z-index:9;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;background:#07060ccc;animation:trfadein .3s}\n.tr-reel-t{font-size:16px;letter-spacing:6px;color:#f2d79e}\n.tr-reel{width:110px;height:120px;overflow:hidden;border:3px solid #f2c46d;border-radius:10px;background:#1a1526;box-shadow:0 0 24px #f2c46d66, inset 0 14px 14px -10px #000, inset 0 -14px 14px -10px #000}\n.tr-reel.split{display:grid;place-items:center;font-size:16px;color:#ff9a8a;border-color:#ff9a8a}\n.tr-reel-cell{height:120px;display:grid;place-items:center}\n.tr-reel-name{font-size:20px;font-weight:800;color:#f6ead2;opacity:0;transform:scale(.6)}\n.tr-reel-name.on{opacity:1;transform:none;transition:all .3s cubic-bezier(.2,1.6,.4,1)}\n@keyframes trfadein{from{opacity:0}to{opacity:1}}\n/* 관계 표시 */\n.tr-relrow{display:flex;align-items:center;gap:5px;font-size:11px;margin-top:2px}.tr-relrow>span:first-child{width:24px;color:#7a6a58}\n.tr-relpips{display:flex;gap:2px}.tr-relpips i{width:9px;height:9px;border-radius:2px;background:#d8ccb4}.tr-relpips i.on.trust{background:#4a8ad0}.tr-relpips i.on.affection{background:#d05a7a}\n.tr-relrow em{font-style:normal;color:#5a4a3a}.tr-relrow button{height:18px;min-width:20px;padding:0 4px;font-size:11px}\n.tr-relbox{display:flex;flex-direction:column;padding:3px 6px;border-radius:6px;background:#ffffff0d}.tr-relbox .tr-relrow>span:first-child,.tr-relbox .tr-relrow em{color:#a9b6c2}\n.tr-offnote{position:absolute;right:6px;bottom:3px;font-size:9px;color:#c9d5e0;opacity:.55;pointer-events:none;text-shadow:0 1px 2px #000}\n.tr-card .tr-pres{border-color:#f2c46d;color:#f2d79e}.tr-drop button.on{border-color:#f2c46d}\n.tr-inv{position:absolute;left:6px;right:6px;top:54px;display:flex;align-items:center;gap:8px;padding:4px 8px;font-size:12px;background:#2a1420e6;border:1px solid #e07a7a;border-radius:8px;color:#ffd9d2;z-index:3}\n.tr-inv b{color:#ffb0a0}.tr-inv span{flex:1}.tr-inv button{height:24px;font-size:11px}\n.tr-issue.hold{border-color:#e0a050;color:#ffd9a0;border-style:dashed}.tr-issue.hold i{background:#e0a050;color:#120f1e}\n/* v1.6 자유 대화 연출: 줄마다 인물 그림이 흔들리거나 다가선다 */\n.tr-tfx{position:absolute;inset:0;transform-origin:50% 100%}\n.tr-tfx.shake{animation:trshake .4s 2}.tr-tfx.zoom{animation:trzoom .5s ease-out}.tr-tfx.crack{animation:trshake .3s 3}\n.tr-talk .tr-flash{z-index:3}\n.tr-dbgrow{position:absolute;top:40px;left:6px;right:6px;display:flex;flex-wrap:wrap;gap:4px;z-index:6}\n.tr-dbgrow button{height:22px;padding:0 7px;font-size:11px;background:#1d2a36e6;border:1px dashed #8fb0c8;color:#cfe3f2;border-radius:6px}\n/* v1.6 체크인 카드 — 낡은 크림색 종이 + 금박 테두리 */\n.tr-card.tr-ck{background:#efe4cb;color:#2b2118;display:flex;flex-direction:column;font-family:Georgia,\"Noto Serif KR\",\"Nanum Myeongjo\",serif;overflow:hidden}\n.ck-paper{position:absolute;inset:0;pointer-events:none;background:\n radial-gradient(ellipse at 20% 10%,#fbf5e6 0,transparent 55%),radial-gradient(ellipse at 90% 95%,#dccaa2 0,transparent 60%),\n repeating-linear-gradient(0deg,rgba(120,90,40,.035) 0 1px,transparent 1px 3px),repeating-linear-gradient(90deg,rgba(120,90,40,.025) 0 1px,transparent 1px 4px),#efe4cb;\n box-shadow:inset 0 0 0 6px #efe4cb,inset 0 0 0 7px #b08d4a,inset 0 0 0 10px #efe4cb,inset 0 0 0 11px #d6b86e,inset 0 0 40px rgba(110,70,20,.25)}\n.ck-corner{position:absolute;width:26px;height:26px;fill:none;stroke:#b08d4a;stroke-width:1.4;pointer-events:none;z-index:1}\n.ck-corner path:last-child{fill:#b08d4a;stroke:none}\n.ck-corner.c0{left:12px;top:12px}.ck-corner.c1{right:12px;top:12px;transform:scaleX(-1)}.ck-corner.c2{left:12px;bottom:12px;transform:scaleY(-1)}.ck-corner.c3{right:12px;bottom:12px;transform:scale(-1,-1)}\n.ck-head{position:relative;z-index:2;display:flex;align-items:center;gap:8px;padding:18px 22px 4px}\n.ck-crest{width:44px;height:44px;flex:none}.ck-crest .g1{fill:#6e1f2a;stroke:#d6b86e;stroke-width:2}.ck-crest .g2{fill:none;stroke:#d6b86e;stroke-width:.8}\n.ck-crest .g3{fill:none;stroke:#e8cf8a;stroke-width:1}.ck-crest .lf{fill:#e8cf8a}.ck-crest .mono{font:700 20px Georgia,serif;fill:#f3e2b0}.ck-crest .st{fill:#f3e2b0}\n.ck-title{flex:1;min-width:0;display:flex;flex-direction:column}.ck-title b{font-size:17px;letter-spacing:3px;color:#3a2412}\n.ck-title span{font-size:8.5px;letter-spacing:1.6px;color:#8a6a3a}\n.ck-no{display:flex;flex-direction:column;align-items:flex-end;font-size:8px;color:#8a6a3a;letter-spacing:1px}.ck-no b{font-size:14px;color:#6e1f2a;letter-spacing:2px;font-family:\"Courier New\",monospace}.ck-no i{font-style:normal}\n.ck-rule{position:relative;z-index:2;height:9px;margin:2px 22px 0;border-top:1px solid #b08d4a;border-bottom:1px solid #d6b86e}\n.ck-rule i{position:absolute;left:50%;top:-4px;width:8px;height:8px;margin-left:-4px;background:#efe4cb;border:1px solid #b08d4a;transform:rotate(45deg)}\n.ck-view{position:relative;z-index:2;display:flex;gap:10px;height:178px;padding:8px 22px 0}\n.ck-frame{position:relative;width:124px;height:170px;flex:none}\n.ck-frame-in{position:absolute;left:10px;top:10px;right:10px;bottom:8px;overflow:hidden;clip-path:path(\"M0 152 L0 54 Q0 0 52 0 Q104 0 104 54 L104 152 Z\");background:radial-gradient(ellipse at 50% 35%,#fff8e6,#e2cfa4)}\n.ck-arch{position:absolute;inset:0;fill:none}.ck-arch path:first-child{stroke:#b08d4a;stroke-width:3}.ck-arch path:last-child{stroke:#e2c67e;stroke-width:1}\n.ck-side{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px}\n.ck-cap{font-size:8.5px;letter-spacing:1.8px;color:#8a6a3a;border-bottom:1px solid #d6b86e;padding-bottom:1px}\n.ck-stage{position:relative;width:110px;height:96px}\n.ck-ped{position:absolute;left:18px;right:18px;bottom:2px;height:14px;border-radius:50%;background:radial-gradient(#cdb37a,#9c7c42 70%,transparent 72%);box-shadow:0 3px 0 #7a5c2a}\n.ck-px{position:absolute;left:36px;bottom:12px;width:36px;height:54px}\n.ck-note{font-size:9px;color:#a08660;font-style:italic}\n.ck-form{position:relative;z-index:2;flex:1;overflow-y:auto;margin:6px 16px 0;padding:0 6px 6px}\n.ck-sec{display:flex;align-items:baseline;gap:6px;margin:8px 0 2px;border-bottom:1px solid #b08d4a}\n.ck-sec span{font-size:9px;letter-spacing:2.4px;color:#6e1f2a;font-weight:700}.ck-sec b{font-size:11px;color:#5a4426;font-weight:400}\n.ck-row{display:flex;align-items:flex-start;gap:6px;margin:5px 0}\n.ck-row>label{width:46px;flex:none;display:flex;flex-direction:column;font-size:11.5px;color:#3a2a18;padding-top:2px}.ck-row>label i{font-style:normal;font-size:7.5px;letter-spacing:1.2px;color:#a08660}\n.ck-row>div{display:flex;flex-wrap:wrap;gap:4px;flex:1}\n.ck-row input{flex:1;height:28px;border:none;border-bottom:1px solid #6b5230;background:transparent;font:16px Georgia,\"Noto Serif KR\",serif;color:#2b2118;outline:none;font-style:italic}\n.tr-card.tr-ck button.ck-opt{height:22px;padding:0 8px;font-size:11px;border:1px solid #c8ad78;background:linear-gradient(#fbf5e7,#efe3c6);color:#5a4426;border-radius:2px;box-shadow:inset 0 1px 0 #fff8}\n.tr-card.tr-ck button.ck-opt.on{background:linear-gradient(#7a2833,#5a1820);color:#f6e2b0;border-color:#4a1018;box-shadow:inset 0 1px 0 #ffffff22,0 0 0 1px #d6b86e}\n.tr-card.tr-ck button.ck-sw{width:20px;height:20px;border-radius:50%;border:2px solid #fbf5e7;box-shadow:0 0 0 1px #b08d4a;padding:0}\n.tr-card.tr-ck button.ck-sw.on{box-shadow:0 0 0 2px #6e1f2a,0 0 0 3px #d6b86e}\n.ck-terms{margin-top:8px;font-size:9px;color:#8a7250;line-height:1.5}\n.ck-foot{position:relative;z-index:2;display:flex;align-items:center;gap:8px;padding:6px 22px 18px;border-top:1px solid #b08d4a;margin:0 16px}\n.ck-sign{flex:1;display:flex;flex-direction:column}.ck-sign span{font-size:7.5px;letter-spacing:1.6px;color:#a08660}\n.ck-sign b{font:italic 400 17px Georgia,\"Noto Serif KR\",serif;color:#2a1d10;border-bottom:1px solid #6b5230;min-height:24px;padding-left:4px}\n.tr-card.tr-ck button.ck-cancel{height:26px;padding:0 10px;border:none;background:none;color:#7a6040;text-decoration:underline;font-size:12px}\n.tr-card.tr-ck button.ck-seal{width:58px;height:58px;border-radius:50%;border:none;padding:0;display:flex;flex-direction:column;align-items:center;justify-content:center;\n background:radial-gradient(circle at 35% 30%,#a8323f,#6e1f2a 60%,#4a1018);color:#f3d79a;box-shadow:0 2px 4px #0006,inset 0 0 0 3px #8a2834,inset 0 0 0 4px #c9a25e88;\n clip-path:polygon(50% 0,61% 4%,72% 2%,79% 10%,90% 12%,92% 23%,100% 31%,97% 42%,100% 53%,94% 62%,96% 74%,86% 80%,82% 91%,71% 92%,61% 100%,50% 96%,39% 100%,29% 92%,18% 91%,14% 80%,4% 74%,6% 62%,0 53%,3% 42%,0 31%,8% 23%,10% 12%,21% 10%,28% 2%,39% 4%)}\n.tr-card.tr-ck button.ck-seal b{font:700 18px Georgia,serif;line-height:1}.tr-card.tr-ck button.ck-seal span{font-size:9.5px;letter-spacing:1px;margin-top:1px}\n\n.tr-actor.host{bottom:0}\n.tr-actor.host.enter .tr-hspot{animation:trspot .9s cubic-bezier(.2,.8,.2,1) both}.tr-actor.host.enter .tr-hspot-floor{animation:trspotf .9s .3s both}.tr-actor.host.enter .tr-host-sil{animation:trhost .8s .45s both}\n/* 논스톱 증언 */\n.tr-ns{position:absolute;inset:0}\n.tr-ns-top{position:absolute;left:0;right:0;top:0;display:flex;align-items:center;gap:7px;font-size:12px;color:#e9dcc0}\n.tr-ns-top b{padding:1px 7px;background:#d9443a;color:#fff;letter-spacing:2px;font-size:11px;transform:skewX(-12deg)}\n.tr-ns-top span{flex:1}.tr-ns-top button{height:24px;padding:0 9px;font-size:12px;border-radius:12px;background:#120f1ed0;border:1px solid #e9c98c66;color:#f2d79e}\n.tr-ns-guide{position:absolute;left:0;right:0;top:28px;font-size:11px;color:#c9bfa9;text-shadow:0 1px 3px #000}\n.tr-ns-say{position:absolute;left:-6px;right:-6px;top:200px;padding:8px 18px 10px;background:linear-gradient(90deg,transparent,#06040cd0 12%,#06040cd0 88%,transparent);animation:trnsin .5s ease-out,trnsdrift 9s linear .5s forwards}\n.tr-ns-say.alt{top:214px}\n.tr-ns-say>b{font-size:12px;text-shadow:0 1px 2px #000}\n.tr-ns-text{margin-top:2px;font-size:17px;line-height:27px;font-weight:700;color:#fff;text-shadow:0 1px 0 #000,0 0 6px #000;word-break:keep-all}\n@keyframes trnsin{from{opacity:0}to{opacity:1}}\n@keyframes trnsdrift{from{transform:translateX(0)}to{transform:translateX(-12px)}}\n.tr-nseg{color:#fff;cursor:pointer;padding:0 1px;border-radius:3px;text-decoration:underline;text-decoration-color:#ffb54799;text-decoration-thickness:2px;text-underline-offset:5px}\n.tr-nseg.now{color:#ffb547;text-decoration:none;text-shadow:0 0 8px #ff8a1a,0 1px 0 #000;animation:trnsglow 1.2s ease-in-out infinite alternate}\n.tr-nseg.take{text-decoration-color:#5ccfff99}.tr-nseg.now.take{color:#8fe3ff;text-shadow:0 0 8px #2ab8ff,0 1px 0 #000}\n.tr-nseg.held{text-decoration:underline dotted;text-underline-offset:4px}\n.tr-nseg.broke{color:#ff4d4d;animation:trnsbreak .5s ease-out forwards}\n@keyframes trnsglow{from{filter:brightness(.9)}to{filter:brightness(1.25)}}\n@keyframes trnsbreak{0%{transform:none}30%{transform:scale(1.18) rotate(-3deg);filter:brightness(2)}100%{opacity:.25;letter-spacing:4px;filter:blur(1px)}}\n.tr-ns-dots{position:absolute;left:0;right:0;top:46px;display:flex;justify-content:flex-start;gap:5px}\n.tr-ns-dots i{font-style:normal;font-size:11px;padding:2px 8px;border-radius:10px;background:#120f1eb0;color:#9d9282;border:1px solid #ffffff22}\n.tr-ns-dots i.on{color:#ffd28a;border-color:#ffb54788}\n.tr-ns-gun{position:absolute;left:0;right:0;bottom:0;padding:8px;background:#0a0813ee;border:1px solid #8a7550;border-radius:10px;display:grid;gap:6px}\n.tr-ns-mode{display:flex;gap:5px}.tr-ns-mode button{flex:1;height:28px;border-radius:7px;background:#1b1628;border:1px solid #ffffff22;color:#cfc4ad;font-size:13px}\n.tr-ns-mode button.on{background:#3a2410;border-color:#ffb547;color:#ffd28a}.tr-ns-mode button.on.take{background:#0f2a3a;border-color:#5ccfff;color:#bfefff}\n.tr-ns-mag{display:flex;gap:6px;overflow-x:auto;padding:2px 0 4px;min-height:30px}\n.tr-blade{flex:none;position:relative;height:26px;padding:0 26px 0 25px;border:0;font-size:12px;font-weight:800;white-space:nowrap;letter-spacing:.3px;color:#062232;border-radius:3px 55% 55% 3px/3px 50% 50% 3px;background:linear-gradient(180deg,#f6fcff 0%,#cdeefa 30%,#79c3de 68%,#3d86a6 100%);box-shadow:inset 0 -2px 0 #00000030,inset 0 1px 0 #ffffffb0;opacity:.72;text-shadow:0 1px 0 #ffffff80}\n.tr-blade::before{content:'';position:absolute;left:0;top:0;bottom:0;width:13px;border-radius:3px 0 0 3px;background:linear-gradient(180deg,#f3e3a8,#b8903c 55%,#6e5018);box-shadow:inset -3px 0 0 #00000040,inset 2px 0 0 #ffffff40}\n.tr-blade::after{content:'';position:absolute;left:16px;right:14px;top:3px;height:4px;border-radius:2px;background:linear-gradient(90deg,#ffffff00,#ffffffaa 30%,#ffffff66 80%,#ffffff00)}\n.tr-blade.word{color:#2a1205;background:linear-gradient(180deg,#fff6dc 0%,#ffd88a 30%,#f0a63a 68%,#b8641a 100%);text-shadow:0 1px 0 #ffffff70}\n.tr-blade.word::before{background:linear-gradient(180deg,#e9b9a0,#a0503a 55%,#5a2414)}\n.tr-blade.on{opacity:1;filter:drop-shadow(0 0 4px #9fe6ff) drop-shadow(0 0 1px #fff)}.tr-blade.word.on{filter:drop-shadow(0 0 4px #ffb547) drop-shadow(0 0 1px #fff)}\n.tr-ns-hint{font-size:11px;color:#bfb39b;min-height:15px}\n.tr-bul{position:absolute;left:0;top:0;z-index:5;pointer-events:none;transform:translate(var(--x1),var(--y1))}\n.tr-bul .tr-blade{position:absolute;transform:translate(-50%,-50%);opacity:1;filter:drop-shadow(0 0 6px #fff)}\n.tr-bul.fire{animation:trbul .3s cubic-bezier(.5,0,.9,.4) both}\n.tr-bul.take{animation:trbul .5s cubic-bezier(.3,.1,.2,1) both}\n.tr-bul.take .tr-blade{animation:trtake .5s ease-in both}\n.tr-bul.back{animation:trric .48s ease-out both}\n.tr-bul.ok .tr-blade{animation:trbulhit .3s .28s ease-out both}\n@keyframes trbul{from{transform:translate(var(--x0),var(--y0))}to{transform:translate(var(--x1),var(--y1))}}\n.tr-bul.fire .tr-blade{transform:translate(-50%,-50%) rotate(var(--rot));box-shadow:inset 0 -2px 0 #00000030,-26px 0 18px -8px #ffffffc0}\n@keyframes trtake{from{transform:translate(-50%,-50%) scale(1.15)}60%{transform:translate(-50%,-50%) scale(.9)}to{transform:translate(-50%,-50%) scale(.6);opacity:.4}}\n@keyframes trric{from{transform:translate(var(--x1),var(--y1)) rotate(0)}to{transform:translate(calc(var(--x1) + 70px),calc(var(--y1) - 50px)) rotate(200deg);opacity:0}}\n@keyframes trbulhit{to{transform:translate(-50%,-50%) scale(1.6);opacity:0}}\n.tr-stage{-webkit-mask-image:linear-gradient(#000 78%,transparent);mask-image:linear-gradient(#000 78%,transparent)}\n/* 반론: 비주얼 노벨 */\n.tr-rb{display:grid;gap:6px}\n.tr-vn{position:relative;padding:15px 12px 10px;margin-top:10px;background:linear-gradient(#0a0813e8,#0a0813f8);border-top:2px solid #c0504a;border-radius:2px 2px 10px 10px;min-height:74px;box-shadow:0 -8px 22px #0008}\n.tr-vn-name{position:absolute;left:10px;top:-11px;padding:2px 14px 2px 10px;font-size:13px;font-weight:800;color:#fff;background:var(--c,#c0504a);clip-path:polygon(0 0,100% 0,calc(100% - 9px) 100%,0 100%)}\n.tr-evc{position:relative;display:flex;align-items:stretch;gap:5px}\n.tr-evc-nav{width:28px;border-radius:8px;background:#151121e0;border:1px solid #e9c98c44;color:#f2d79e;font-size:18px}\n.tr-evc-nav:disabled{opacity:.3}\n.tr-evc-card{flex:1;display:flex;align-items:center;gap:9px;padding:7px 9px;border-radius:9px;background:#151121e8;border:1px solid #ffffff22;cursor:pointer;animation:trnsin .2s}\n.tr-evc.on .tr-evc-card{border-color:#e9c98c;box-shadow:0 0 0 1px #e9c98c55 inset,0 0 12px #e9c98c33}\n.tr-evc-pic{flex:none;width:56px;height:56px;display:grid;place-items:center;border-radius:6px;background:radial-gradient(#3a3046,#1b1626)}\n.tr-evc-txt{flex:1;min-width:0;display:grid;gap:2px}.tr-evc-txt b{font-size:13px;color:#f2e6cc}\n.tr-evc-txt span{font-size:11px;color:#a99e88;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}\n.tr-evc-tag{flex:none;font-size:10px;color:#cdbf9f;align-self:flex-end}.tr-evc.on .tr-evc-tag{color:#f2d79e}\n.tr-evc-n{position:absolute;right:38px;top:4px;font-style:normal;font-size:10px;color:#8a8070}\n.tr-rbin{position:relative}\n.tr-rbin textarea{width:100%;box-sizing:border-box;resize:none;padding:8px 10px 34px;border-radius:10px;background:#f6f1e6;color:#2a1d10;border:0;font-size:14px;line-height:19px}\n.tr-rbgo{position:absolute;right:6px;bottom:6px;height:28px;padding:0 14px;border-radius:7px;border:0;background:#c0504a;color:#fff;font-weight:800;font-size:13px}\n.tr-rbgo:disabled{background:#b9a99a;color:#f3ece2}\n/* 반론 컷인: 말하는 도중에 끊고 들어온다 */\n.tr-objc{position:absolute;inset:0;z-index:3;pointer-events:none}\n.tr-objc-dim{position:absolute;inset:0;background:#000;animation:trobjdim 1.15s both}\n.tr-objc-band{position:absolute;left:-20px;right:-20px;top:110px;height:170px;background:#08070d;transform:skewY(-9deg);overflow:hidden;border-top:3px solid #fff;border-bottom:3px solid #c0504a;animation:trobjband 1.15s cubic-bezier(.15,.9,.25,1) both}\n.tr-objc-band>i{position:absolute;height:3px;background:linear-gradient(90deg,transparent,#fff,transparent);animation:trobjline .6s .1s ease-out both}\n.tr-objc-band>i.s1{left:0;width:70%;top:26px}.tr-objc-band>i.s2{right:0;width:60%;bottom:30px;animation-delay:.2s}\n.tr-objc-face{position:absolute;left:10px;top:-10px;width:220px;height:200px;overflow:hidden;transform:skewY(9deg);-webkit-mask-image:linear-gradient(90deg,#000 65%,transparent);mask-image:linear-gradient(90deg,#000 65%,transparent);animation:trobjface 1.15s ease-out both}\n.tr-objc-word{position:absolute;right:22px;top:300px;transform:rotate(-6deg);font-size:46px;font-weight:900;color:#fff;letter-spacing:2px;-webkit-text-stroke:2px #c0504a;text-shadow:4px 4px 0 #c0504a;animation:trobjword 1.15s cubic-bezier(.2,1.6,.4,1) both}\n.tr-objc-name{position:absolute;right:30px;top:360px;font-size:12px;color:#ffd0c8;letter-spacing:2px;animation:trobjword 1.15s both}\n@keyframes trobjdim{0%{opacity:0}15%,80%{opacity:.55}100%{opacity:0}}\n@keyframes trobjband{0%{transform:skewY(-9deg) translateX(-110%)}18%,82%{transform:skewY(-9deg) translateX(0)}100%{transform:skewY(-9deg) translateX(110%)}}\n@keyframes trobjline{from{transform:translateX(-100%);opacity:0}to{transform:translateX(30%);opacity:1}}\n@keyframes trobjface{0%{transform:skewY(9deg) translateX(-30px)}25%,100%{transform:skewY(9deg) translateX(0)}}\n@keyframes trobjword{0%,12%{opacity:0;transform:rotate(-6deg) scale(2.4)}30%{opacity:1;transform:rotate(-6deg) scale(1)}85%{opacity:1}100%{opacity:0}}\n/* 기억 현상: 암실 */\n.tr-dv-head{display:grid;gap:1px;text-align:center}.tr-dv-head b{font-size:13px;color:#f2d79e;letter-spacing:1px}.tr-dv-head span{font-size:11px;color:#b9ad96}\n.tr-dv{position:relative;height:230px;padding:10px;border-radius:12px;background:linear-gradient(#1a1418,#100c10);box-shadow:inset 0 0 0 1px #ffffff14;transition:background .8s}\n.tr-dv.wet{background:radial-gradient(ellipse at 50% 0,#5a0d0d,#1a0505 70%);box-shadow:inset 0 0 30px #000,inset 0 0 0 1px #ff3a3a22}\n.tr-dv.wet .tr-dv-paper{background:#e9dccf;transform:rotate(-1.2deg)}\n.tr-dv.clear .tr-dv-paper{animation:trglow 1.2s ease-out}\n@keyframes trdvpulse{50%{outline-color:#e9c98c}}\n\n.tr-objc-cut{position:absolute;left:-40px;top:96px;width:409px;height:238px;animation:trobjcut 1.15s cubic-bezier(.15,.9,.25,1) both}\n.tr-objc-cut .tr-objc-band{top:40px}\n@keyframes trobjcut{0%{transform:translateX(-105%);opacity:1}16%,84%{transform:translateX(0);opacity:1}100%{transform:translateX(105%);opacity:0}}\n.tr-ns-mag{scrollbar-width:none;-webkit-mask-image:linear-gradient(90deg,#000 86%,transparent);mask-image:linear-gradient(90deg,#000 86%,transparent);padding-right:24px}.tr-ns-mag::-webkit-scrollbar{display:none}\n/* 꿈 조각 잇기 */\n.tr-dr{position:relative;height:250px;border-radius:12px;overflow:hidden;background:#0c0a14;box-shadow:inset 0 0 0 1px #c9b4ff33,0 0 22px #6a4ad833}\n.tr-dr.bad{animation:trshake .4s}\n.tr-dr-pane{position:absolute;inset:0}\n.tr-dr-pane.a{clip-path:polygon(0 0,58% 0,42% 100%,0 100%)}.tr-dr-pane.b{clip-path:polygon(58% 0,100% 0,100% 100%,42% 100%)}\n.tr-dr-bg{position:absolute;inset:-6px;filter:blur(1.2px) saturate(.55) brightness(.62) sepia(.25)}\n.tr-dr-pane.a .tr-dr-bg{filter:blur(1.5px) saturate(.35) brightness(.52) sepia(.45) hue-rotate(-10deg)}\n.tr-dr-pane::after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 60%,transparent 40%,#0a0614cc);pointer-events:none}\n.tr-dr-tag{position:absolute;top:8px;font-size:12px;font-weight:800;letter-spacing:3px;color:#e6dcff;padding:2px 9px;border-radius:9px;background:#2a1e48cc;border:1px solid #c9b4ff55}\n.tr-dr-pane.a .tr-dr-tag{left:8px}.tr-dr-pane.b .tr-dr-tag{right:8px}\n.tr-dr-who{position:absolute;bottom:-118px;width:150px;margin-left:-75px;transition:transform .25s}\n.tr-dr-who img{width:150px;display:block;filter:drop-shadow(0 0 6px #b9a2ff66)}\n.tr-dr-who.run{transform:skewX(-9deg) translateX(6px)}.tr-dr-pane.b .tr-dr-who.run{transform:skewX(9deg) translateX(-6px)}\n.tr-dr-who.give{transform:rotate(-3deg)}\n.tr-dr-speed{position:absolute;left:-30px;top:110px;width:40px;height:60px;background:repeating-linear-gradient(0deg,transparent 0 8px,#ffffff88 8px 10px);opacity:.7}\n.tr-dr-ghost{position:absolute;bottom:0;width:90px;height:190px;margin-left:-45px;border-radius:45px 45px 8px 8px;background:#ffffff10;border:2px dashed #c9b4ff99;display:grid;place-items:center;font-size:40px;font-weight:900;color:#c9b4ff;animation:trnsglow 1.2s ease-in-out infinite alternate}\n.tr-dr-q{position:absolute;transform:translate(-50%,-50%);width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:#2a1e48;border:2px solid #c9b4ff;color:#fff;font-size:16px}\n.tr-dr-item{position:absolute;transform:translate(-50%,-50%);padding:3px;border-radius:7px;background:#ffffffd8;box-shadow:0 0 12px #fff8;transition:left .25s,top .25s}\n.tr-dr-item.give{animation:trdrgive 1.4s ease-in-out infinite alternate}\n@keyframes trdrgive{to{transform:translate(-30%,-50%)}}\n.tr-dr-prop{position:absolute;transform:translateX(-50%);display:block;pointer-events:none}\n.tr-dr-prop.shelf{top:30%;width:64px;height:6px;background:#8a6a40;box-shadow:0 2px 0 #4a3420}\n.tr-dr-prop.desk{top:70%;width:82px;height:30px;background:linear-gradient(#7a5a36 0 7px,#5a4024 7px);border-radius:3px}\n.tr-dr-prop.board{top:14%;width:44px;height:56px;background:#e8dcc0;border:3px solid #6a4a2a;border-radius:2px}\n.tr-dr-cut{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}.tr-dr-cut line{stroke:#e6dcff;stroke-width:.8;filter:drop-shadow(0 0 2px #b9a2ff);vector-effect:non-scaling-stroke}\n.tr-dr-arrow{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-style:normal;font-size:14px;color:#fff;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:#6a4ad8;box-shadow:0 0 10px #9a7ad8}\n.tr-dr-ctl{display:grid;gap:5px}\n.tr-dr-row{display:grid;grid-template-columns:88px 30px 1fr 30px;align-items:center;gap:5px;font-size:12px;color:#c9bfe0}\n.tr-dr-row button{height:28px;border-radius:7px;background:#1b1530;border:1px solid #c9b4ff44;color:#e6dcff;font-size:16px}\n.tr-dr-row b{text-align:center;height:28px;line-height:28px;border-radius:7px;background:#120f1e;border:1px solid #ffffff1a;color:#fff;font-size:13px}\n.tr-dr-row.empty b{color:#c9b4ff;border-style:dashed}\n\n.tr-ns-missbox{position:absolute;left:0;right:0;bottom:0;min-height:96px;cursor:pointer;animation:trnsin .18s}\n.tr-ttext.mono{color:#8fd8ff}\n.tr-vn-next{position:absolute;right:12px;bottom:8px;font-style:normal;font-size:11px;color:#cfc4ad;animation:trnsglow .8s ease-in-out infinite alternate}\n\n.tr-shade{position:absolute;inset:0;pointer-events:none;-webkit-mask-size:100% 100%;mask-size:100% 100%;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;mix-blend-mode:multiply}\n.tr-dbgbox{display:grid;gap:4px;border:1px dashed #6a5a8a;border-radius:8px;padding:6px}\n.tr-dbgrw{display:flex;flex-wrap:wrap;gap:4px}.tr-dbgrw button{height:26px;padding:0 7px;font-size:12px}.tr-dbgrw button.on{background:#6b4fa0;color:#fff}.tr-dbgrw button.dim{opacity:.45}\n.tr-gal{position:absolute;inset:0;z-index:60;background:#14101c;display:flex;flex-direction:column;gap:4px;padding:6px;overflow-y:auto}\n.tr-gal-stage{position:relative;width:360px;height:440px;margin:0 auto;overflow:hidden;background:linear-gradient(#2a2338,#171222);flex:none}\n.tr-gal-stage .tr-actor-in{position:absolute;left:0;top:0;width:360px;height:528px}\n.tr-gal-cap{position:absolute;left:6px;top:6px;font-size:12px;color:#fff;background:#0008;padding:2px 6px;border-radius:4px}\n.tr-dr-atl{position:absolute;transform:translateX(-50%);font-size:10px;color:#fff;background:#0009;padding:0 4px;border-radius:3px;white-space:nowrap}\n.tr-dr-dot{display:block;width:34px;height:34px;border-radius:50%;margin:0 auto;border:2px solid #fff8}\n";
const TN_ASSETS = {"url":"https://raw.githubusercontent.com/LEEJWOO/mystery-chatbot-lab/refs/heads/troemerei/prototype-v0.2/assets/pub/","chars":{"suzune":{"poses":{"default":{"src":"4940aa931d87.webp","w":1024,"h":1024,"def":"기본","eye":[508,262],"ed":124.3,"faces":{"불만":{"src":"8f0cf5e0b92d.webp","x":385,"y":190,"w":250,"h":184},"하라구로":{"src":"3d4f5e061804.webp","x":383,"y":190,"w":252,"h":184},"부끄러움":{"src":"90f21a8aa583.webp","x":385,"y":190,"w":250,"h":184},"격노":{"src":"cf38dd8b155a.webp","x":382,"y":190,"w":253,"h":184},"웃음":{"src":"3c5144924f7e.webp","x":384,"y":190,"w":251,"h":184},"패닉":{"src":"c856ebbc7107.webp","x":382,"y":190,"w":253,"h":184},"슬픔":{"src":"68bcb18866ea.webp","x":382,"y":190,"w":253,"h":184},"미소":{"src":"ce209e6c24a5.webp","x":382,"y":190,"w":253,"h":184},"놀람":{"src":"2f86fb728ffb.webp","x":382,"y":190,"w":253,"h":184},"의심":{"src":"93f627ae9f77.webp","x":382,"y":190,"w":253,"h":184},"곤란":{"src":"0687d27ac472.webp","x":384,"y":190,"w":251,"h":184}}},"crossed":{"src":"2c971e1a92b7.webp","w":1024,"h":1024,"def":"기본","eye":[501,249],"ed":130,"fit":"face 0.74 chin 0.98","faces":{"불만":{"src":"e9f8cfd3942d.webp","x":374,"y":182,"w":261,"h":183},"미소":{"src":"cf9ddf0402e0.webp","x":374,"y":182,"w":261,"h":183},"의심":{"src":"b82a2803548b.webp","x":374,"y":182,"w":261,"h":183}}},"point":{"src":"0d2545b410a9.webp","w":1024,"h":1024,"def":"기본","eye":[505,256],"ed":124,"fit":"face 0.68 chin 1.02","faces":{"하라구로":{"src":"cb79c5396408.webp","x":370,"y":186,"w":265,"h":181},"격노":{"src":"9a6e119aa8c6.webp","x":370,"y":186,"w":265,"h":181},"놀람":{"src":"8e621777d591.webp","x":370,"y":186,"w":265,"h":181}}},"think":{"src":"4fab6a34b05d.webp","w":1024,"h":1024,"def":"기본","eye":[506,256],"ed":124.6,"fit":"face 0.72 chin 1.02","faces":{"놀람":{"src":"617f28818f3e.webp","x":378,"y":186,"w":257,"h":177},"의심":{"src":"1910ef34dd2d.webp","x":378,"y":186,"w":257,"h":177},"곤란":{"src":"f7e05eab6f28.webp","x":378,"y":186,"w":257,"h":177}}}},"fit":{"s":1}},"mei":{"poses":{"default":{"src":"e87abecb7796.webp","w":1024,"h":1024,"def":"기본","eye":[496,260],"ed":127.7,"faces":{"불만":{"src":"3164d3cc04d4.webp","x":366,"y":171,"w":261,"h":235},"하라구로":{"src":"8a555b6a3b3e.webp","x":366,"y":171,"w":261,"h":235},"부끄러움":{"src":"5a28a65ee80f.webp","x":366,"y":171,"w":261,"h":235},"격노":{"src":"4e9c6218ed5a.webp","x":366,"y":171,"w":261,"h":235},"웃음":{"src":"a2f2f4231a90.webp","x":366,"y":171,"w":261,"h":235},"패닉":{"src":"1abfcd3f75fa.webp","x":366,"y":171,"w":261,"h":235},"슬픔":{"src":"ec3fad66e2b9.webp","x":366,"y":171,"w":261,"h":235},"미소":{"src":"707340869fc3.webp","x":366,"y":171,"w":261,"h":235},"놀람":{"src":"b8fb462b0e51.webp","x":386,"y":193,"w":221,"h":193},"의심":{"src":"bdc74c61d84a.webp","x":366,"y":171,"w":261,"h":235},"곤란":{"src":"882b3abb4380.webp","x":366,"y":171,"w":261,"h":235}}},"crossed":{"src":"ae269d3ab4c4.webp","w":1024,"h":1024,"def":"기본","eye":[499,259],"ed":126.6,"fit":"face 0.72 chin 1.01","faces":{"불만":{"src":"c72b9fb58d2b.webp","x":413,"y":197,"w":177,"h":175},"미소":{"src":"c1082bad172b.webp","x":413,"y":197,"w":177,"h":175},"의심":{"src":"312450ea08d7.webp","x":413,"y":197,"w":177,"h":175}}},"point":{"src":"57b5e4bcf39f.webp","w":1024,"h":1024,"def":"기본","eye":[497,260],"ed":127.5,"fit":"face 0.73 chin 0.99","faces":{"하라구로":{"src":"01538047f048.webp","x":413,"y":198,"w":169,"h":173},"격노":{"src":"c9fbba2d6045.webp","x":413,"y":198,"w":169,"h":173},"놀람":{"src":"f07a10ff4ea9.webp","x":413,"y":198,"w":169,"h":173}}},"think":{"src":"fe580ccae4ef.webp","w":1024,"h":1024,"def":"기본","eye":[497,260],"ed":126.6,"fit":"iris chin 0.99","faces":{"놀람":{"src":"434d5468a176.webp","x":416,"y":196,"w":167,"h":176},"의심":{"src":"8fe6d478584f.webp","x":416,"y":196,"w":167,"h":176},"곤란":{"src":"a06a72e7fba9.webp","x":416,"y":196,"w":167,"h":176}}}},"fit":{"s":1}},"ruoxi":{"poses":{"default":{"src":"c4c64b46909f.webp","w":1024,"h":1024,"def":"기본","eye":[502,269],"ed":119.3,"faces":{"불만":{"src":"88b945d011e0.webp","x":382,"y":198,"w":241,"h":187},"하라구로":{"src":"199e695ab01a.webp","x":382,"y":198,"w":241,"h":187},"부끄러움":{"src":"e496fd9c44e2.webp","x":382,"y":198,"w":241,"h":187},"격노":{"src":"acf9034877e9.webp","x":382,"y":198,"w":241,"h":187},"웃음":{"src":"7d3f6214af31.webp","x":382,"y":198,"w":241,"h":187},"패닉":{"src":"5602415cc264.webp","x":382,"y":198,"w":241,"h":187},"슬픔":{"src":"25e11db42f81.webp","x":382,"y":198,"w":241,"h":187},"미소":{"src":"c98a02d2a7f7.webp","x":382,"y":198,"w":241,"h":187},"놀람":{"src":"a38b0ab7d806.webp","x":382,"y":198,"w":241,"h":187},"의심":{"src":"56193e91db93.webp","x":382,"y":198,"w":241,"h":187},"곤란":{"src":"687cfd3dfaa6.webp","x":382,"y":198,"w":241,"h":187}}},"crossed":{"src":"c5f552e38379.webp","w":1024,"h":1024,"def":"기본","eye":[509,210],"ed":113,"fit":"face 0.91 chin 1.06","faces":{"불만":{"src":"9a1c9438e92d.webp","x":390,"y":142,"w":237,"h":178},"미소":{"src":"114e2ee20f80.webp","x":390,"y":142,"w":237,"h":178},"의심":{"src":"900584040bbc.webp","x":390,"y":142,"w":237,"h":178}}},"point":{"src":"b665be8f0e2b.webp","w":1024,"h":1024,"def":"기본","eye":[499,211],"ed":112,"fit":"face 0.88 chin 1.08","faces":{"하라구로":{"src":"0d7e0616fac5.webp","x":382,"y":142,"w":245,"h":179},"격노":{"src":"59958709b4b4.webp","x":382,"y":142,"w":245,"h":179},"놀람":{"src":"d9d889148a6f.webp","x":382,"y":142,"w":245,"h":179}}},"think":{"src":"fe2a1eb12022.webp","w":1024,"h":1024,"def":"기본","eye":[497,216],"ed":117.9,"fit":"face 0.86 chin 0.99","faces":{"놀람":{"src":"0875810975e1.webp","x":386,"y":142,"w":229,"h":183},"의심":{"src":"45c6336577b6.webp","x":386,"y":142,"w":229,"h":182},"곤란":{"src":"2af434e56fa7.webp","x":386,"y":142,"w":229,"h":183}}}},"fit":{"s":1}},"seoha":{"poses":{"default":{"src":"1887ee32da23.webp","w":1024,"h":1024,"def":"기본","eye":[508,250],"ed":127.7,"faces":{"불만":{"src":"aa854fb7506f.webp","x":378,"y":174,"w":261,"h":189},"하라구로":{"src":"790b794cad44.webp","x":378,"y":174,"w":261,"h":189},"부끄러움":{"src":"879a6209ca31.webp","x":378,"y":174,"w":261,"h":189},"격노":{"src":"4361d66de039.webp","x":378,"y":174,"w":261,"h":189},"웃음":{"src":"e15f917cb4b4.webp","x":378,"y":174,"w":261,"h":189},"패닉":{"src":"a2c11a53e8d9.webp","x":378,"y":174,"w":261,"h":189},"슬픔":{"src":"6f96d6b33bc6.webp","x":378,"y":174,"w":261,"h":189},"미소":{"src":"a2c90cc8c71b.webp","x":378,"y":174,"w":261,"h":189},"놀람":{"src":"2a8df3b7c7d8.webp","x":378,"y":174,"w":261,"h":189},"의심":{"src":"bd8ede743243.webp","x":378,"y":174,"w":261,"h":189},"곤란":{"src":"3164a072614d.webp","x":378,"y":174,"w":261,"h":189}}},"crossed":{"src":"18c279db6c67.webp","w":1024,"h":1024,"def":"기본","eye":[511,229],"ed":117.7,"fit":"face 0.94 chin 1.08","faces":{"불만":{"src":"2e1b747780f8.webp","x":390,"y":150,"w":253,"h":184},"미소":{"src":"baf3323855fc.webp","x":390,"y":150,"w":253,"h":184},"의심":{"src":"dc63fb22c461.webp","x":390,"y":150,"w":253,"h":184}}},"point":{"src":"4035426164da.webp","w":1024,"h":1024,"def":"기본","eye":[512,239],"ed":120.8,"fit":"face 0.90 chin 1.06","faces":{"하라구로":{"src":"0e21810a4580.webp","x":382,"y":158,"w":253,"h":188},"격노":{"src":"165ac9ef2944.webp","x":382,"y":158,"w":253,"h":188},"놀람":{"src":"9405e3ccf907.webp","x":382,"y":158,"w":253,"h":188}}},"think":{"src":"37e770a7db0b.webp","w":1024,"h":1024,"def":"기본","eye":[511,234],"ed":114.8,"fit":"face 0.93 chin 1.14","faces":{"놀람":{"src":"e6d1ceb72084.webp","x":390,"y":154,"w":245,"h":178},"의심":{"src":"6d8356aca756.webp","x":390,"y":154,"w":245,"h":178},"곤란":{"src":"f84654ca78ee.webp","x":390,"y":154,"w":245,"h":178}}}},"fit":{"s":1}},"clara":{"poses":{"default":{"src":"8932e32dc9d9.webp","w":1024,"h":1024,"def":"기본","eye":[506,231],"ed":115.9,"faces":{"불만":{"src":"eea1006f1473.webp","x":390,"y":162,"w":233,"h":175},"하라구로":{"src":"2ce07a221631.webp","x":390,"y":162,"w":233,"h":175},"부끄러움":{"src":"b117536a41ab.webp","x":390,"y":162,"w":233,"h":175},"격노":{"src":"035463e54f7a.webp","x":390,"y":162,"w":233,"h":175},"웃음":{"src":"44386a8ddd49.webp","x":390,"y":162,"w":233,"h":175},"패닉":{"src":"9941183e4aa9.webp","x":390,"y":162,"w":233,"h":175},"슬픔":{"src":"c25657a49bfe.webp","x":390,"y":162,"w":233,"h":175},"미소":{"src":"f5722e1ecd5e.webp","x":390,"y":162,"w":233,"h":175},"놀람":{"src":"86b088724206.webp","x":390,"y":162,"w":233,"h":175},"의심":{"src":"36c6dee9e747.webp","x":390,"y":162,"w":233,"h":175},"곤란":{"src":"efc00879d43d.webp","x":390,"y":162,"w":233,"h":175}}},"crossed":{"src":"aa68c9babf01.webp","w":1024,"h":1024,"def":"기본","eye":[509,210],"ed":118.3,"fit":"face 0.93 chin 0.98","faces":{"불만":{"src":"4c2d5f4469fd.webp","x":398,"y":142,"w":233,"h":176},"미소":{"src":"faa70e8dcb58.webp","x":398,"y":142,"w":233,"h":176},"의심":{"src":"c6587e47b53c.webp","x":398,"y":142,"w":233,"h":176}}},"point":{"src":"4531c1765373.webp","w":1024,"h":1024,"def":"기본","eye":[508,210],"ed":120.6,"fit":"face 0.90 chin 0.97","faces":{"하라구로":{"src":"c594e7bce0a3.webp","x":394,"y":146,"w":229,"h":173},"격노":{"src":"03969200268f.webp","x":394,"y":146,"w":229,"h":173},"놀람":{"src":"007ef0e7bcdd.webp","x":394,"y":146,"w":229,"h":173}}},"think":{"src":"8aa3b6ace917.webp","w":1024,"h":1024,"def":"기본","eye":[508,213],"ed":118.9,"fit":"face 0.92 chin 0.98","faces":{"놀람":{"src":"711f6b7b7d17.webp","x":390,"y":146,"w":237,"h":175},"의심":{"src":"fcd25a1d80aa.webp","x":390,"y":146,"w":237,"h":175},"곤란":{"src":"735f2dbba164.webp","x":390,"y":146,"w":237,"h":175}}}},"fit":{"s":1}},"odile":{"poses":{"default":{"src":"a2b8edca42c3.webp","w":1024,"h":1024,"def":"기본","eye":[500,306],"ed":121,"faces":{"불만":{"src":"f817e3395a1f.webp","x":378,"y":234,"w":245,"h":187},"하라구로":{"src":"748ac2fb3275.webp","x":378,"y":234,"w":245,"h":187},"부끄러움":{"src":"31e7097e4bb4.webp","x":378,"y":234,"w":245,"h":187},"격노":{"src":"517ec6e87ff0.webp","x":378,"y":234,"w":245,"h":187},"웃음":{"src":"8c71c25f245f.webp","x":378,"y":234,"w":245,"h":187},"패닉":{"src":"c3b5496d38b6.webp","x":378,"y":234,"w":245,"h":187},"슬픔":{"src":"f957ef687627.webp","x":378,"y":234,"w":245,"h":187},"미소":{"src":"81eeddbf33f0.webp","x":378,"y":234,"w":245,"h":187},"놀람":{"src":"20ecb61d2dac.webp","x":378,"y":234,"w":245,"h":187},"의심":{"src":"5784f420c4eb.webp","x":378,"y":234,"w":245,"h":187},"곤란":{"src":"57189f16570c.webp","x":378,"y":234,"w":245,"h":187}}},"crossed":{"src":"a58fd66b3700.webp","w":1024,"h":1024,"def":"기본","eye":[505,272],"ed":106.9,"fit":"face 0.87 chin 1.13","faces":{"불만":{"src":"710c6f8bb2a5.webp","x":386,"y":194,"w":237,"h":180},"미소":{"src":"7a412d25a87b.webp","x":386,"y":194,"w":237,"h":180},"의심":{"src":"aec4913595cb.webp","x":386,"y":194,"w":237,"h":180}}},"point":{"src":"b99e16716127.webp","w":1024,"h":1024,"def":"기본","eye":[491,283],"ed":104.8,"fit":"face 0.66 chin 1.20","faces":{"하라구로":{"src":"f43349157303.webp","x":378,"y":202,"w":241,"h":179},"격노":{"src":"7dbfea1d9abb.webp","x":378,"y":202,"w":241,"h":179},"놀람":{"src":"afddfab0f752.webp","x":378,"y":202,"w":241,"h":179}}},"think":{"src":"22ca0015a40d.webp","w":1024,"h":1024,"def":"기본","eye":[503,268],"ed":106.3,"fit":"face 0.86 chin 1.14","faces":{"놀람":{"src":"eec29a948f73.webp","x":386,"y":190,"w":233,"h":178},"의심":{"src":"e8aa298b1974.webp","x":386,"y":190,"w":233,"h":178},"곤란":{"src":"8b0e74b3a7a5.webp","x":386,"y":190,"w":233,"h":178}}}},"fit":{"s":1}}},"map":{"src":"ec4813000dd6.webp","w":1080,"h":648},"sprites":{"src":"a663b46f027e.webp","w":432,"h":324,"ids":["suzune","mei","ruoxi","seoha","clara","odile"],"cw":36,"ch":54,"dirs":{"down":{"idle":1,"walk":[0,1,2,1]},"left":{"idle":4,"walk":[3,4,5,4]},"right":{"idle":7,"walk":[6,7,8,7]},"up":{"idle":10,"walk":[9,10,11,10]}}},"avatar":{"cw":36,"ch":54,"layers":["base","hair","top","bottom","skin"],"dirs":{"down":{"idle":0,"walk":[1,2,3,4]},"up":{"idle":5,"walk":[6,7,8,9]},"left":{"idle":10,"walk":[11,12,13,14]},"right":{"idle":15,"walk":[16,17,18,19]}},"sheets":{"short_pants":"8c33c7ba5ede.webp","short_skirt":"85709ac469a3.webp","messy_pants":"641168325f35.webp","messy_skirt":"30794767e4a7.webp","bob_pants":"ddc7bab2e068.webp","bob_skirt":"35ee23458840.webp","long_pants":"80b79fa4a688.webp","long_skirt":"3b3f61db5c35.webp"}},"parts":{"src":"c8069f74a158.webp","w":1024,"h":1232,"eyes":{"p":[[[84.5,145.5],[136.5,138.5]],[[84.5,145.5],[136.5,140.5]],[[84.5,147],[137,140.5]],[[84.5,148.5],[136.5,141]]],"c":[[[233,140],[288,108.5]],[[233,140.5],[289.5,111.5]],[[231.5,137],[287,109]],[[231.5,145],[289,108]]]},"map":{"c.b1":[434,634,94,137,180,56,"h"],"c.b2":[335,634,98,138,180,55,"h"],"c.b3":[0,634,123,139,180,53,"h"],"c.b4":[710,474,132,142,180,50,"h"],"c.bg":[344,474,365,153,39,32,""],"c.brow0":[278,1201,19,4,211,117,"b"],"c.brow1":[235,1201,12,16,212,114,"b"],"c.ear1":[89,1132,42,64,334,74,""],"c.ear2":[132,1132,42,64,334,74,""],"c.ear3":[175,1132,42,64,334,74,""],"c.el0":[618,1036,100,71,219,85,""],"c.el1":[814,1036,105,69,220,89,""],"c.el2":[513,1036,104,75,213,83,""],"c.el3":[408,1036,104,77,211,81,""],"c.ew0":[0,1132,88,68,223,87,""],"c.ew1":[218,1132,91,62,223,93,""],"c.ew2":[719,1036,94,70,218,87,""],"c.ew3":[920,1036,91,69,220,86,""],"c.f0":[529,634,216,134,174,50,"h"],"c.f1":[520,774,209,131,174,54,"h"],"c.f2":[0,774,199,133,175,52,"h"],"c.f3":[124,634,210,138,176,47,"h"],"c.f4":[746,634,206,134,172,51,"h"],"c.fs0":[0,908,197,127,183,56,""],"c.fs1":[198,908,192,124,183,59,""],"c.fs2":[391,908,184,124,184,58,""],"c.fs3":[730,774,195,128,185,55,""],"c.fs4":[576,908,190,124,181,58,""],"c.line":[393,0,388,178,16,21,""],"c.mouth":[0,1201,46,30,259,152,""],"c.skin1":[200,774,159,131,205,53,""],"c.skin2":[360,774,159,131,205,53,""],"c.skin3":[767,908,155,121,207,61,""],"p.b1":[843,474,121,139,49,71,"h"],"p.b2":[0,0,208,303,22,71,"h"],"p.b3":[209,0,183,268,48,69,"h"],"p.b4":[0,474,183,159,25,69,"h"],"p.brow0":[66,1201,83,18,67,111,"b"],"p.brow1":[150,1201,84,18,67,112,"b"],"p.el0":[310,1132,94,37,64,124,""],"p.el1":[581,1132,91,34,65,126,""],"p.el2":[489,1132,91,35,65,127,""],"p.el3":[673,1132,92,34,63,127,""],"p.ew0":[405,1132,83,35,69,125,""],"p.ew1":[935,1132,83,30,69,129,""],"p.ew2":[766,1132,84,33,69,127,""],"p.ew3":[851,1132,83,31,69,129,""],"p.f0":[618,304,148,159,38,59,"h"],"p.f1":[767,304,140,159,37,59,"h"],"p.f2":[782,0,131,174,40,59,"h"],"p.f3":[462,304,155,168,36,59,"h"],"p.f4":[184,474,159,156,27,59,"h"],"p.fs0":[102,1036,101,92,59,83,""],"p.fs1":[0,1036,101,95,59,83,""],"p.fs2":[204,1036,101,91,59,83,""],"p.fs3":[923,908,101,97,59,83,""],"p.fs4":[306,1036,101,88,59,83,""],"p.iris":[47,1201,18,26,0,0,"e"],"p.mouth":[248,1201,29,12,102,166,""],"p.skin1":[0,304,153,169,48,83,""],"p.skin2":[154,304,153,169,48,83,""],"p.skin3":[308,304,153,169,48,83,""]}},"bg":{"라운지":"7968c24adad7.webp","바":"768daefc0ee6.webp","복도":"072166cd55e2.webp","객실":"f72e74d184e8.webp","테라스":"8b6a070da189.webp"},"items":{"bar_log":"885bf16a647f.webp","brooch":"d7e4ca44747e.webp","card":"0a398f0148e2.webp","glove":"1221a67d1950.webp","program":"8cf59c4efd94.webp","score":"63782019f26f.webp","sketch":"a4df8e4ffae6.webp","velvet":"720a3388d058.webp"}};
/* Troemerei NPC simulation core v0.5 — 결정적 NPC 일정·경로·기억. DOM/네트워크/LLM 의존 없음. */
const trNPC = (() => {
  const abs = Math.abs;
  const posKey = (x,y) => x+','+y;
  const manhattan = (a,b) => abs(a.x-b.x)+abs(a.y-b.y);
  const clone = obj => JSON.parse(JSON.stringify(obj));
  const clock = n => String(Math.floor(n/3600)%24).padStart(2,'0')+':'+String(Math.floor(n/60)%60).padStart(2,'0')+':'+String(n%60).padStart(2,'0');
  const secs = time => { const [h,m] = time.split(':').map(Number); return h*3600+m*60; };
  const random = s => {let x=s.rng|0; x^=x<<13; x^=x>>>17; x^=x<<5; s.rng=x>>>0;return (s.rng>>>0)/4294967296;};
  const inBounds = (w,x,y) => x>=0 && y>=0 && x<w.map.width && y<w.map.height;
  const walkable = (w,x,y) => inBounds(w,x,y) && w.map.rows[y][x] !== '#';
  const node = (s,id) => s.npcs.find(n=>n.id===id);
  const landmark = (w,id) => w.map.landmarks.find(x=>x.id===id);
  const DAY=86400;
  const josa=(w,a,b)=>{const c=String(w).charCodeAt(String(w).length-1)-0xac00;return w+(c>=0&&c<11172&&c%28?a:b);};
  // 방 번호(-1은 통로). 같은 방이고 6칸 이내면 서로 보인다(통로끼리는 3칸).
  function areaOf(w,x,y){return w.map.areas.findIndex(a=>x>=a.x0&&x<=a.x1&&y>=a.y0&&y<=a.y1);}
  // 시선을 막는 칸: 벽과 키 큰 가구('#'). 낮은 가구(low: 책상·벤치·상자·분수 등)는 막지 않는다.
  const blockCache=new WeakMap();
  function blockers(w){
    let b=blockCache.get(w);if(b)return b;
    const low=new Set();for(const p of w.map.props||[])if(p.low)for(let y=p.y;y<p.y+p.h;y++)for(let x=p.x;x<p.x+p.w;x++)low.add(posKey(x,y));
    b=new Set();w.map.rows.forEach((r,y)=>[...r].forEach((c,x)=>{if(c==='#'&&!low.has(posKey(x,y)))b.add(posKey(x,y));}));
    blockCache.set(w,b);return b;
  }
  // 두 칸 사이 직선(브레젠험)이 막힌 칸을 지나지 않으면 보인다.
  // 대칭 판정: A→B와 B→A 직선이 둘 다 막히지 않아야 보인다(방향에 따라 결과가 달라지지 않게)
  function lineOfSight(w,a,b){return losOne(w,a,b)&&losOne(w,b,a);}
  function losOne(w,a,b){
    const B=blockers(w);let x=a.x,y=a.y;const dx=abs(b.x-a.x),dy=-abs(b.y-a.y),sx=a.x<b.x?1:-1,sy=a.y<b.y?1:-1;let err=dx+dy;
    while(!(x===b.x&&y===b.y)){const e2=2*err;if(e2>=dy){err+=dy;x+=sx;}if(e2<=dx){err+=dx;y+=sy;}if(x===b.x&&y===b.y)break;if(B.has(posKey(x,y)))return false;}
    return true;
  }
  // 시야: 같은 방 안 w.sightRange 칸(기본 6). 문 칸(어느 방에도 속하지 않음)은 맞닿은 방들에 함께 속한 것으로 본다.
  function areasNear(w,x,y){const r=areaOf(w,x,y);if(r>=0)return [r];const o=[];for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const k=areaOf(w,x+dx,y+dy);if(k>=0&&!o.includes(k))o.push(k);}return o;}
  function sees(w,a,b){const A=areasNear(w,a.x,a.y),B=areasNear(w,b.x,b.y);if(!A.some(k=>B.includes(k)))return false;
    const both=areaOf(w,a.x,a.y)<0&&areaOf(w,b.x,b.y)<0;return manhattan(a,b)<=(both?3:(w.sightRange||6))&&lineOfSight(w,a,b);}
  // 기억: [사실ID, 역할, 시각]. 역할 0 직접 · 1 목격 · 2+i 인물 i에게 들음(증언). 인물당 최근 12개.
  function learn(target,factId,role,time){
    if(!target.mem)target.mem=[];
    if(target.mem.some(m=>m[0]===factId&&m[1]===role))return;
    target.mem.push([factId,role,time]);if(target.mem.length>12)target.mem.shift();
  }
  function witness(w,s,actor,factId,direct){
    for(const id of direct){const m=node(s,id);if(m)learn(m,factId,0,s.clock);}
    for(const o of s.npcs)if(!direct.includes(o.id)&&sees(w,o,actor))learn(o,factId,1,s.clock);
    if(sees(w,s.player,actor)){learn(s.player,factId,1,s.clock);checkScenes(w,s);}
  }
  function updateSeen(w,s){
    for(const n of s.npcs)if(sees(w,s.player,n))s.player.seen[n.id]=[areaOf(w,n.x,n.y),s.clock];
    checkScenes(w,s);checkCases(w,s);
  }
  // ---------- 사건: 실제로 일어난 일(플래그) → 발견(시선) → 방송·집합 → 현장 방에 들어가면 사건 대본(집합·조사) → 갈래별 재판 ----------
  // w.cases=[{id, flag, from(이 시각 이후 발견), spot(랜드마크), watchers:[NPC id], task(모두 현장으로 가는 일정), trial(집합·조사 대본 코드), notice}]
  // s.cases[id] = [단계(1 발견·2 시작), 발견 시각, 발견자(0 플레이어, i+1 NPC)]
  function checkCases(w,s){
    if(!w.cases)return;if(!s.cases)s.cases={};
    for(const c of w.cases){
      const st=s.cases[c.id];const l=landmark(w,c.spot);if(!l)continue;
      if(!st){
        if(!s.flags[c.flag]||(c.from&&s.clock%DAY<secs(c.from)))continue;
        let by=-1;if(sees(w,s.player,l))by=0;
        else for(const id of c.watchers||[]){const i=s.npcs.findIndex(n=>n.id===id);if(i>=0&&sees(w,s.npcs[i],l)){by=i+1;break;}}
        if(by<0)continue;
        s.cases[c.id]=[1,s.clock,by];
        addLog(w,s,(c.notice||'사건이 발견되었습니다.')+' (발견: '+(by===0?'당신':nm(w,s,w.npcs[by-1].id))+')','world');
        for(const n of s.npcs){ // 모두 현장으로
          if(n.mode==='accompany')continue;
          n.queued=n.queued.filter(t=>t.id!==c.task.id);n.queued.unshift(clone(c.task));
          if(n.mode!=='busy'&&n.mode!=='paused'){n.intent=null;n.mode='idle';n.route=[];n.nextMoveAt=s.clock+2;}
        }
      }else if(st[0]===1&&!s.trial&&areaOf(w,s.player.x,s.player.y)===areaOf(w,l.x,l.y)){
        const room=areaOf(w,l.x,l.y),all=s.npcs.every(n=>n.mode==='accompany'||areaOf(w,n.x,n.y)===room);
        if(all||s.clock-st[1]>=(c.wait||600)){st[0]=2;openTrial(w,s,c.trial,false);}
      }
    }
  }
  function branchLetter(w,s){const b=(w.branches||[]).find(b=>!b.slot&&s.flags[b.flag]);return b?b.letter:'A';}
  // 목격 장면(앨범): 정해 둔 장면만 해금한다(목격 기록을 글로 쌓지 않는다).
  //  fact: 플레이어가 그 사실을 직접 보거나 겪었을 때(증언으로 들은 건 제외)
  //  npc+area(+from/to): 그 인물이 그 방에 있는 걸 그 시간대에 봤을 때
  function checkScenes(w,s){
    if(!w.scenes)return;const p=s.player;if(!p.scenes)p.scenes={};
    for(const sc of w.scenes){
      if(p.scenes[sc.id]!==undefined)continue;
      let ok=false;
      if(sc.fact)ok=(p.mem||[]).some(m=>m[0]===sc.fact&&m[1]<=1);
      else if(sc.npc){const n=node(s,sc.npc),tod=s.clock%DAY,lm=sc.near&&landmark(w,sc.near);
        // near: 그 인물이 그 자리(랜드마크) 반경 radius칸 안에 있을 때만 — '그 방에 있었다'가 아니라 '그 근처에 있었다'
        ok=!!n&&sees(w,p,n)&&(!sc.area||(w.map.areas[areaOf(w,n.x,n.y)]||{}).name===sc.area)&&(!lm||manhattan(n,lm)<=(sc.radius||1))&&(!sc.from||tod>=absTime(sc.from))&&(!sc.to||tod<absTime(sc.to));}
      if(ok)p.scenes[sc.id]=s.clock;
    }
  }
  // 로그 공개는 시야 판정(sees)과 같은 기준을 쓴다.
  function addLog(w,s,text,type='world',at=null) {
    const visible=type==='player'||!at||sees(w,s.player,at);
    s.logs.push({time:s.clock,text,type,visible});
    if(s.logs.length>100)s.logs.shift();
  }
  function createWorld(w,seed=246813579){
    const t0=w.startTime?secs(w.startTime):9*3600; // 시작 시각(세계 데이터 startTime, 없으면 09:00)
    const s={schema:'TROEMEREI_NPC_V1',version:1,worldId:w.map.id,day:1,clock:t0,
      rng:seed>>>0 || 1, player:{x:w.player.x,y:w.player.y,route:[],nextMoveAt:0,mem:[],seen:{},items:{},talked:{},scenes:{}},
      npcs:w.npcs.map((n,i)=>({id:n.id,x:n.x,y:n.y,mode:'idle',intent:null,route:[],
        nextMoveAt:t0+10+i*4,busyUntil:0,blockedSince:null,completed:[],
        excluded:[],lastTask:'',lastCompleted:{},queued:[],meetings:[],followOffset:0,mem:(n.knows||[]).map(f=>[f,0,t0])})),
      flags:Object.fromEntries((w.flagNames||[]).map(f=>[f,false])),
      logs:[],revision:0,pend:null,pk:'',pc:0};
    relInit(w,s.player);
    s.player.look=null; // 체크인 전(첫 화면에서 외형을 고른다)
    addLog(w,s,'시뮬레이션이 시작되었다. NPC들은 각자의 일정에 따라 행동한다.','player');
    // Decisions exist from the first frame; the player can cancel a planned visit before movement.
    for(const n of s.npcs)decide(w,s,n);
    updateSeen(w,s);
    return s;
  }
  function route(w,s,from,to,{ignorePlayer=false,ignoreNpc=null}={}){
    if (!walkable(w,to.x,to.y))return [];
    const occupied=new Set(s.npcs.filter(n=>n.id!==ignoreNpc && !(n.id===from.id)).map(n=>posKey(n.x,n.y)));
    if(!ignorePlayer)occupied.add(posKey(s.player.x,s.player.y));
    const q=[{x:from.x,y:from.y}],prev=new Map([[posKey(from.x,from.y),null]]),v=new Map([[posKey(from.x,from.y),q[0]]]);
    for(let i=0;i<q.length;i++){
      const p=q[i], k=posKey(p.x,p.y);
      if(p.x===to.x&&p.y===to.y){const out=[];let curr=k;while(prev.get(curr)!==null){out.push(v.get(curr));curr=prev.get(curr);}return out.reverse();}
      for(const [dx,dy] of [[1,0],[0,1],[-1,0],[0,-1]]){
        const nx=p.x+dx,ny=p.y+dy,nk=posKey(nx,ny);
        if(walkable(w,nx,ny)&&!prev.has(nk)&&(!occupied.has(nk)||(nx===from.x&&ny===from.y))){
          const point={x:nx,y:ny};prev.set(nk,k);v.set(nk,point);q.push(point);
        }
      }
    }
    return [];
  }
  function goalOf(w,s,task){
    if(task.targetPlayer)return {target:s.player,goal:{x:s.player.x,y:s.player.y}}; // 플레이어를 찾아가 먼저 말 걸기
    if(task.targetNpc){const n=node(s,task.targetNpc);return n?{target:n,goal:{x:n.x,y:n.y}}:null;}
    const p=landmark(w,task.landmark);return p?{target:null,goal:{x:p.x,y:p.y}}:null;
  }
  function routeFor(w,s,n,task){
    const g=goalOf(w,s,task);if(!g)return null;
    if(g.target){
      const endpoints=[[1,0],[0,1],[-1,0],[0,-1]].map(([dx,dy])=>({x:g.goal.x+dx,y:g.goal.y+dy})).filter(p=>walkable(w,p.x,p.y));
      let best=null;
      for(const p of endpoints){const r=route(w,s,n,p,{ignoreNpc:n.id});
        if((r.length||manhattan(n,p)===0) && (!best||r.length<best.length)) best=r;
      }
      return best;
    }
    const direct=route(w,s,n,g.goal,{ignoreNpc:n.id});
    if(direct.length || manhattan(n,g.goal)===0)return direct;
    // A point of interest can be occupied by another NPC; approach its free side.
    const occupied=s.npcs.some(other=>other.id!==n.id&&other.x===g.goal.x&&other.y===g.goal.y)||(s.player.x===g.goal.x&&s.player.y===g.goal.y); // 플레이어가 서 있어도 옆으로
    if(occupied){
      let best=null;
      for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
        const p={x:g.goal.x+dx,y:g.goal.y+dy};if(!walkable(w,p.x,p.y))continue;
        const r=route(w,s,n,p,{ignoreNpc:n.id});
        if((r.length||manhattan(n,p)===0)&&(!best||r.length<best.length))best=r;
      }
      return best;
    }
    return direct;
  }
  function weightedPick(s,entries){
    const total=entries.reduce((acc,x)=>acc+x.score,0);let v=random(s)*total;
    for(const x of entries){v-=x.score;if(v<0)return x.task;}return entries[entries.length-1].task;
  }
  function isAvailable(s,n,t){
    if(n.excluded.includes(t.id)||n.completed.includes(t.id)&&t.once)return false;
    // ifFlag: 그 플래그(배열이면 그중 하나)가 켜졌을 때만 / unlessFlag: 켜져 있으면 안 함
    if(t.ifFlag&&![].concat(t.ifFlag).some(f=>s.flags[f]))return false;
    if(t.unlessFlag&&[].concat(t.unlessFlag).some(f=>s.flags[f]))return false;
    const tod=s.clock%DAY; // 일정 시각은 '그날 기준'으로 비교한다(자정이 지나도 다음 날 다시 선택).
    if(tod<secs(t.from||'00:00') ||tod>=secs(t.until||'23:59'))return false;
    if(n.lastCompleted[t.id] && s.clock-n.lastCompleted[t.id]<(t.cooldownSeconds||0))return false;
    return true;
  }
  function decide(w,s,n){
    const spec=w.npcs.find(x=>x.id===n.id);
    const queue=n.queued.filter(t=>!n.completed.includes(t.id));
    const candidates=queue.length?queue:spec.agenda.filter(t=>isAvailable(s,n,t));
    if(!candidates.length){n.nextMoveAt=s.clock+25;return;}
    const maxP=Math.max(...candidates.map(t=>t.priority||0));
    const choices=candidates.filter(t=>(t.priority||0)===maxP).map(t=>({task:t,
      score:Math.max(0.05,(t.weight||1)*(t.id===n.lastTask?0.2:1))}));
    const task=clone(weightedPick(s,choices));
    const way=routeFor(w,s,n,task);
    if(way===null ||(!way.length&&!hasReached(w,s,n,task))){
      n.nextMoveAt=s.clock+20;return;
    }
    n.intent=task;n.mode='moving';n.route=way;n.nextMoveAt=s.clock+(spec.stepSeconds||7);n.blockedSince=null;
    addLog(w,s,nm(w,s,spec.id)+'이(가) 새로운 목적지를 향해 움직이기 시작했다.','npc',n);
    if(!way.length)arrive(w,s,n);
  }
  function hasReached(w,s,n,task){
    const g=goalOf(w,s,task);
    if(!g)return false;
    if(g.target)return manhattan(n,g.target)===1;
    if(manhattan(n,g.goal)===0)return true;
    const occupied=s.npcs.some(other=>other.id!==n.id&&other.x===g.goal.x&&other.y===g.goal.y);
    return occupied&&manhattan(n,g.goal)===1;
  }
  function arrive(w,s,n){
    const spec=w.npcs.find(x=>x.id===n.id),task=n.intent;
    if(!task){n.mode='idle';return;}
    if(!hasReached(w,s,n,task)){
      const r=routeFor(w,s,n,task);n.route=r||[];n.nextMoveAt=s.clock+6;return;
    }
    if(task.targetNpc){
      // 만남: 상대가 동행 중이거나 다른 일에 묶여 있으면 시작하지 않고 잠시 뒤 다시 본다.
      const m=node(s,task.targetNpc);
      if(!m||m.mode==='accompany'||m.mode==='busy'){n.route=[];n.nextMoveAt=s.clock+20;return;}
      // 상대도 만남이 끝날 때까지 붙잡아 둔다(멈춤). 일정은 유지되므로 끝나면 하던 일을 계속한다.
      m.mode='paused';m.busyUntil=Math.max(m.busyUntil||0,s.clock+(task.durationSeconds||30));m.nextMoveAt=m.busyUntil;m.route=[];
    }
    n.mode='busy';n.route=[];n.busyUntil=s.clock+(task.durationSeconds||30);n.nextMoveAt=n.busyUntil;
    if(task.targetPlayer){addLog(w,s,nm(w,s,spec.id)+'이(가) 다가와 말을 걸었다.','call',n);return;}
    addLog(w,s,nm(w,s,spec.id)+'이(가) '+(task.kind==='meet'?'다른 인물과 대화를 시작했다.':'목적지에서 행동을 시작했다.'),'npc',n);
  }
  function complete(w,s,n){
    const task=n.intent;if(!task){n.mode='idle';return;}
    const spec=w.npcs.find(x=>x.id===n.id);
    if(task.targetPlayer){finishCall(s,n);addLog(w,s,nm(w,s,spec.id)+'이(가) 대답을 기다리다 돌아갔다.','npc',n);return;}
    if(task.targetNpc){
      // 끝나는 순간에도 상대가 곁에 있어야 만남이 성립한다(도중에 데려가면 무산 → 다시 찾아간다).
      const m=node(s,task.targetNpc);
      if(!m||m.mode==='accompany'||manhattan(n,m)!==1){
        n.mode='moving';n.route=[];n.busyUntil=0;n.nextMoveAt=s.clock+5;
        addLog(w,s,nm(w,s,spec.id)+'의 만남이 중간에 끊겼다.','npc',n);return;
      }
    }
    n.completed.push(task.id);n.lastCompleted[task.id]=s.clock;n.lastTask=task.id;
    n.queued=n.queued.filter(t=>t.id!==task.id);
    addLog(w,s,nm(w,s,spec.id)+'이(가) '+(task.kind==='meet'?'만남':'활동')+'을 마쳤다.','npc',n);
    for(const r of w.onComplete||[]){
      if(r.when.npc===n.id&&r.when.task===task.id&&(!r.when.targetNpc||r.when.targetNpc===task.targetNpc)){
        if(r.setFlag)s.flags[r.setFlag]=true;
        if(r.queueTask)n.queued.push(clone(r.queueTask));
        if(r.publicLog)addLog(w,s,r.publicLog,'world',n);
        if(r.fact)witness(w,s,n,r.fact,[n.id,r.when.targetNpc].filter(Boolean));
      }
    }
    if(task.onCompleteFlag)s.flags[task.onCompleteFlag]=true;
    if(task.onCompleteFact)witness(w,s,n,task.onCompleteFact,[n.id]);
    n.mode='idle';n.intent=null;n.route=[];n.nextMoveAt=s.clock+5;n.busyUntil=0;
  }
  function npcStep(w,s,n){
    if(n.mode==='accompany')return;
    if(n.mode==='busy'){
      if(s.clock>=n.busyUntil)complete(w,s,n);return;
    }
    if(n.mode==='paused'){
      if(s.clock>=n.busyUntil){n.mode=n.intent?'moving':'idle';n.nextMoveAt=s.clock+4;}
      return;
    }
    if(n.mode==='idle'){decide(w,s,n);return;}
    if(n.mode!=='moving')return;
    if(!n.intent){n.mode='idle';n.nextMoveAt=s.clock+5;return;}
    if(playerBlocks(w,s,n.intent)){if(manhattan(n,s.player)===1){askMove(w,s,n,n.intent);return;}}
    else if(s.block&&s.block.npc===n.id)s.block=null;
    if(hasReached(w,s,n,n.intent)){arrive(w,s,n);return;}
    if(!n.route.length || !isStepNext(n,n.route[0])){
      const r=routeFor(w,s,n,n.intent);n.route=r||[];
      if(!n.route.length){n.nextMoveAt=s.clock+12;return;}
    }
    const next=n.route[0];const blocker=posKey(next.x,next.y);
    const blockedByPlayer=blocker===posKey(s.player.x,s.player.y);
    const blockedByNpc=s.npcs.some(other=>other.id!==n.id&&blocker===posKey(other.x,other.y));
    if(blockedByPlayer||blockedByNpc){
      if(n.blockedSince===null)n.blockedSince=s.clock;
      if(s.clock-n.blockedSince>=8){
        const alternate=routeFor(w,s,n,n.intent);
        if(alternate&&alternate.length&&posKey(alternate[0].x,alternate[0].y)!==blocker){
          n.route=alternate;n.blockedSince=null;
          addLog(w,s,nm(w,s,n.id)+'이(가) 막힌 통로를 피해 우회했다.','npc',n);
        }else if(s.clock-n.blockedSince>=35){
          n.intent=null;n.mode='idle';n.route=[];n.nextMoveAt=s.clock+30;n.blockedSince=null;
          addLog(w,s,nm(w,s,n.id)+'이(가) 이동 계획을 잠시 보류했다.','npc',n);
        }
      }
      n.nextMoveAt=s.clock+4;return;
    }
    n.x=next.x;n.y=next.y;n.route.shift();n.blockedSince=null;
    n.nextMoveAt=s.clock+(w.npcs.find(x=>x.id===n.id).stepSeconds||7);
    if(hasReached(w,s,n,n.intent))arrive(w,s,n);
  }
  // ---------- 비켜 달라는 말: 플레이어가 인물이 가려던 자리에 서 있으면, 다가와 말을 건다(AI 없이 대본 대사) ----------
  // task.block = {tries(몇 번까지 부탁하나, 기본 w.blockTalk.tries 또는 1), wait(대답 기다리는 초, 기본 40), urgent, reason}
  // 부탁 횟수를 넘기면 단념: 한 번뿐인 일(once)은 그날 다시 하지 않는다(→ 사건을 막는 길), 반복하는 일은 쉬었다가 다시 고른다.
  function playerBlocks(w,s,task){if(!task||task.targetPlayer||task.targetNpc)return false;const g=goalOf(w,s,task);return !!g&&s.player.x===g.goal.x&&s.player.y===g.goal.y;}
  function askMove(w,s,n,task){
    const b=task.block||{},bt=w.blockTalk||{},max=b.tries||bt.tries||1;if(!n.asks)n.asks={};
    const k=(n.asks[task.id]||0)+1;
    if(k>max){
      delete n.asks[task.id];if(task.once)n.excluded.push(task.id);else n.lastCompleted[task.id]=s.clock;
      n.intent=null;n.mode='idle';n.route=[];n.nextMoveAt=s.clock+20;if(s.block&&s.block.npc===n.id)s.block=null;
      addLog(w,s,nm(w,s,n.id)+'이(가) 단념하고 다른 일을 하러 갔다.','npc',n);return;
    }
    n.asks[task.id]=k;n.mode='paused';n.route=[];n.busyUntil=s.clock+(b.wait||bt.wait||40);n.nextMoveAt=n.busyUntil;
    s.block={npc:n.id,task:task.id,n:k,max,urgent:!!b.urgent,at:s.clock,reason:b.reason||bt.reason||'당신이 서 있는 자리에 볼일이 있어 비켜 주었으면 하는 듯하다'};
    addLog(w,s,nm(w,s,n.id)+'이(가) 다가와 비켜 달라고 말을 걸었다.','call',n);
  }
  // 먼저 말 걸기 일정 끝내기(대화를 받았거나, 거절했거나, 기다리다 지침)
  function finishCall(s,n){const t=n.intent;if(t){n.completed.push(t.id);n.lastCompleted[t.id]=s.clock;n.lastTask=t.id;}n.mode='idle';n.intent=null;n.route=[];n.busyUntil=0;n.nextMoveAt=s.clock+5;}
  function caller(w,s){return s.npcs.find(n=>n.mode==='busy'&&n.intent&&n.intent.targetPlayer&&manhattan(n,s.player)===1)||null;}
  const isStepNext=(n,to)=>manhattan(n,to)===1;
  function stepPlayer(w,s){
    if(!s.player.route.length)return;
    let next=s.player.route[0];
    const occupied=s.npcs.some(n=>n.x===next.x&&n.y===next.y);
    if(!isStepNext(s.player,next)||occupied){
      const dest=s.player.route[s.player.route.length-1];
      const reroute=route(w,s,s.player,dest,{ignorePlayer:true});
      s.player.route=reroute;
      if(!reroute.length){s.player.nextMoveAt=0;return;}
      next=reroute[0];
    }
    const old={x:s.player.x,y:s.player.y};
    s.player.x=next.x;s.player.y=next.y;s.player.route.shift();
    s.player.nextMoveAt=s.player.route.length?s.clock+(w.player.moveSeconds||4):0;
    for(const n of s.npcs.filter(n=>n.mode==='accompany')){n.x=old.x;n.y=old.y;}
  }
  // 다음 예정 행동 시각으로 바로 건너뛴다(그 사이엔 아무도 움직이지 않으므로 1초씩 도는 것과 결과가 같다).
  // 긴 대기에서도 계산량이 '행동 횟수'에만 비례해 UUMMAI의 5초 실행 제한에 걸리지 않는다.
  function nextDue(s,w){
    let t=Infinity;
    if(w&&inInvestigation(w,s))t=Math.min(t,Math.max(s.trial.sub,s.clock+1)); // 조사 마감
    if(w)for(const c of w.cases||[]){const v=(s.cases||{})[c.id];if(v&&v[0]===1){const at=v[1]+(c.wait||600);if(at>s.clock)t=Math.min(t,at);}}
    if(w)for(const c of w.cases||[])if(c.from&&s.flags[c.flag]&&!(s.cases||{})[c.id]){const at=Math.floor(s.clock/DAY)*DAY+secs(c.from);if(at>s.clock)t=Math.min(t,at);} // 발견 가능 시각
    if(s.player.route.length)t=Math.min(t,Math.max(s.player.nextMoveAt,s.clock+1));
    for(const n of s.npcs)if(n.mode!=='accompany')t=Math.min(t,Math.max(n.nextMoveAt,s.clock+1));
    return t;
  }
  function advance(w,state,seconds){
    const s=clone(state),end=s.clock+Math.max(0,Math.min(7200,Math.floor(seconds)));
    while(s.clock<end){
      if(s.trial&&!inInvestigation(w,s))break; // 재판 중에는 시간이 흐르지 않는다
      const t=nextDue(s,w);
      if(t>end){s.clock=end;updateSeen(w,s);break;}
      if(t-1>s.clock){s.clock=t-1;updateSeen(w,s);if(s.trial&&!inInvestigation(w,s))break;} // 직전 초까지 보이던 인물의 '마지막으로 본 시각'
      s.clock=t;
      if(s.player.route.length&&s.player.nextMoveAt<=s.clock)stepPlayer(w,s);
      for(const n of s.npcs){if(n.mode!=='accompany'&&n.nextMoveAt<=s.clock)npcStep(w,s,n);}
      updateSeen(w,s);checkDeadline(w,s);
      if(s.trial&&!inInvestigation(w,s))break; // 재판이 열리면 시간 정지(마감·집합 시작 순간에서 멈춤)
    }
    s.day=1+Math.floor(s.clock/DAY);
    s.revision++;
    return s;
  }
  // 시간 건너뛰기: 최대 2일. stop(s)가 참이 되는 순간(사건 단위) 멈춘다 → {state, stopped}.
  function advanceUntil(w,state,seconds,stop){
    const s=clone(state),end=s.clock+Math.max(0,Math.min(2*DAY,Math.floor(seconds)));let stopped=false;
    while(s.clock<end){
      if(s.trial&&!inInvestigation(w,s))break; // 재판 중에는 시간이 흐르지 않는다
      const t=nextDue(s,w);
      if(t>end){s.clock=end;updateSeen(w,s);break;}
      if(t-1>s.clock){s.clock=t-1;updateSeen(w,s);if(s.trial&&!inInvestigation(w,s))break;}
      s.clock=t;
      if(s.player.route.length&&s.player.nextMoveAt<=s.clock)stepPlayer(w,s);
      for(const n of s.npcs){if(n.mode!=='accompany'&&n.nextMoveAt<=s.clock)npcStep(w,s,n);}
      updateSeen(w,s);checkDeadline(w,s);
      if(s.trial&&!inInvestigation(w,s))break; // 재판이 열리면 시간 정지(마감·집합 시작 순간에서 멈춤)
      if(stop&&stop(s)){stopped=true;break;}
    }
    s.day=1+Math.floor(s.clock/DAY);s.revision++;
    return {state:s,stopped};
  }
  // 절대 시각(초) ← '2일 06:00' 또는 '06:00'(1일)
  function absTime(v){if(typeof v==='number')return v;const m=/^(?:(\d+)일\s*)?(\d{1,2}):(\d{2})$/.exec(String(v||'').trim());return m?((+(m[1]||1))-1)*DAY+(+m[2])*3600+(+m[3])*60:0;}
  // 물건: 등장 조건(시각 from·플래그 flag)이 맞고 아직 아무도 가져가지 않았을 때만 그 자리에 있다.
  function itemsAt(w,s,lmId){
    return (w.items||[]).filter(it=>it.at===lmId&&!(s.player.items||{})[it.id]&&(!it.from||s.clock>=absTime(it.from))&&(!it.flag||s.flags[it.flag]));
  }
  // 시간대(아침·오후·저녁·밤)와 날짜. 첫 시간대 이전(새벽)은 전날 밤으로 본다.
  function slotOf(w,s){
    const slots=w.slots||[];if(!slots.length)return null;
    const tod=s.clock%DAY;let day=1+Math.floor(s.clock/DAY),i=-1;
    slots.forEach((sl,k)=>{if(tod>=absTime(sl.from))i=k;});
    if(i<0){i=slots.length-1;day--;}
    return {day,index:i,name:slots[i].name,start:(day-1)*DAY+absTime(slots[i].from)};
  }
  // 이전 방식(1초씩). 테스트에서 결과 동일성 비교용.
  function advanceSlow(w,state,seconds){
    const s=clone(state),end=s.clock+Math.max(0,Math.min(7200,Math.floor(seconds)));
    for(;s.clock<end;){
      if(s.trial&&!inInvestigation(w,s))break; // 재판 중에는 시간이 흐르지 않는다
      s.clock++;
      if(s.player.route.length&&s.player.nextMoveAt<=s.clock)stepPlayer(w,s);
      for(const n of s.npcs){if(n.mode!=='accompany'&&n.nextMoveAt<=s.clock)npcStep(w,s,n);}
      updateSeen(w,s);checkDeadline(w,s);
      if(s.trial&&!inInvestigation(w,s))break; // 재판이 열리면 시간 정지(마감·집합 시작 순간에서 멈춤)
    }
    s.day=1+Math.floor(s.clock/DAY);
    s.revision++;
    return s;
  }
  // AI가 붙인 사건 코드(e)는 조건을 검사한 뒤에만 인정한다. 대화가 반영되기 전(pend가 남아 있을 때) 호출.
  function applyEvent(w,state,e){
    const code=String(e||'').trim().toUpperCase();
    if(!code)return {state,accepted:false,reason:''};
    const rule=(w.events||{})[code];
    if(!rule)return {state,accepted:false,reason:'알 수 없는 사건 코드'};
    const kinds=rule.kinds||(rule.kind?[rule.kind]:null);
    if(kinds&&!kinds.includes(state.pk))return {state,accepted:false,reason:'대화 종류가 맞지 않음'};
    if(rule.npcs&&!rule.npcs.includes(state.pend))return {state,accepted:false,reason:'이 인물에게는 인정되지 않음'};
    if(rule.present&&state.pv!==rule.present)return {state,accepted:false,reason:'그 증거를 제시하지 않음'};
    if(rule.flag&&state.flags[rule.flag])return {state,accepted:false,reason:'이미 기록됨'};
    if(rule.trial){const T=state.trial,tr=T&&(w.trials||[])[T.i];
      if(!tr||tr.code!==rule.trial||T.phase!==rule.phase)return {state,accepted:false,reason:'지금 재판 단계와 맞지 않음'};}
    const s=clone(state);
    relApplyMap(w,s,rule.rel);
    if(rule.trial){
      if(rule.hold){const tr=w.trials[s.trial.i],ph=tr.phases[s.trial.phase],k=(tr.issues||[]).findIndex(x=>x.id===(ph&&ph.issue));if(k>=0)s.trial.hold=(s.trial.hold||0)|(1<<k);}
      trialNext(w,s);return {state:s,accepted:true,reason:'',hold:!!rule.hold};}
    if(rule.flag)s.flags[rule.flag]=true;
    for(const f of rule.setFlags||[])s.flags[f]=true; // 함께 켜는 깃발(예: 재판 전에 이미 밝혀졌다는 표시)
    addLog(w,s,rule.log||('사건 '+code+' 기록'),'world');
    return {state:s,accepted:true,reason:''};
  }
  // 증언(k): AI가 '대상이 대사로 말한 기억'의 코드를 적으면, 대상이 정말 그 기억을 가졌을 때만
  // 플레이어 단서에 '○○에게 들음'으로 기록한다. 사실이 참이라고 확정하지는 않는다(주장으로만 보관).
  // 기억 코드는 사실마다 고정(code). 배열 순서가 바뀌어도 같은 코드 = 같은 사실.
  function factCode(w,id){const f=(w.facts||[]).find(f=>f.id===id);return f&&f.code?'기억'+f.code:'';}
  // k 문자열 → [{code, line}] ('기억K3R8@3' = 원본 3번째 줄에서 말함. 줄 번호가 없으면 마지막 줄로 본다)
  function parseK(k){return [...String(k||'').matchAll(/(?:기억)?([A-Z0-9]{4})(?:@(\d{1,2}))?/g)].map(m=>({code:m[1],line:m[2]?+m[2]:0}));}
  function hearFacts(w,state,k){
    const out={state,accepted:[],rejected:[]};
    const codes=[...new Set((Array.isArray(k)?k:parseK(k)).map(x=>x.code))];
    if(!codes.length)return out;
    const n=state.pend&&node(state,state.pend);
    if(!n){out.rejected=codes.map(c=>[c,'대화 상대가 없음']);return out;}
    const s=clone(state),m=node(s,n.id),idx=w.npcs.findIndex(x=>x.id===n.id);
    for(const c of codes){
      const f=(w.facts||[]).find(x=>x.code===c);
      if(!f){out.rejected.push([c,'없는 기억 번호']);continue;}
      if(!(m.mem||[]).some(x=>x[0]===f.id)){out.rejected.push([c,'이 인물은 모르는 일']);continue;}
      learn(s.player,f.id,2+idx,s.clock);out.accepted.push(c);
    }
    out.state=s;return out;
  }
  // ---------- 관계: 인물이 플레이어를 어떻게 여기는지(척도별 0~100 → 단계 1~N) ----------
  // w.rel.scales=[{id,key,name,levels:[단계 이름…]}], 인물별 시작값은 npc.rel={trust:50,…}(없는 척도는 그 인물에게 없음)
  function relScales(w){return (w.rel&&w.rel.scales)||[];}
  function relInit(w,player){player.rel={};for(const n of w.npcs){const o={};for(const sc of relScales(w))if(n.rel&&n.rel[sc.id]!==undefined)o[sc.id]=n.rel[sc.id];player.rel[n.id]=o;}}
  // 척도에 opposite:true면 플레이어(체크인 성별, 없으면 player.sex)와 성별이 다른 인물에게만 있다
  function relOn(w,s,id,sc){const S=relScales(w).find(x=>x.id===sc);if(!S||!S.opposite)return true;const n=w.npcs.find(x=>x.id===id),L=(s.player||{}).look,ps=L?(L.g===1?'f':'m'):(w.player.sex||'m');return !!n&&n.sex!==ps;}
  // 화면에 보이는 이름: 가명(alias)은 그 깃발이 설 때까지
  function nm(w,s,id){const n=w.npcs.find(x=>x.id===id);if(!n)return id;return n.alias&&!((s&&s.flags)||{})[n.alias.until]?n.alias.name:n.name;}
  function relLevel(w,s,id,sc){const v=(((s.player||{}).rel||{})[id]||{})[sc];if(v===undefined||!relOn(w,s,id,sc))return 0;const S=relScales(w).find(x=>x.id===sc),N=((S&&S.levels)||[0,0,0,0,0]).length;return Math.min(N,Math.floor(v/(100/N))+1);}
  function relAdd(w,s,id,d){if(!d||!id)return;const all=s.player.rel||(s.player.rel={}),r=all[id]||(all[id]={});for(const k in d)if(r[k]!==undefined&&relOn(w,s,id,k))r[k]=Math.max(0,Math.min(100,r[k]+(d[k]|0)));}
  // AI의 r='t+1a-1': 대화 상대의 마음 변화. 척도마다 한 번에 ±1단계(=aiStep점)까지만.
  function applyRel(w,state,id,code){
    const out={state,changed:{}};if(!code||!id)return out;
    const s=clone(state),step=(w.rel&&w.rel.aiStep)||4,d={},re=/([A-Za-z가-힣]+)\s*([+-])\s*(\d)/g;let m;
    while((m=re.exec(String(code)))){const sc=relScales(w).find(x=>x.key===m[1]||x.id===m[1]||x.name===m[1]);if(!sc||!+m[3])continue;d[sc.id]=(m[2]==='-'?-1:1)*step;}
    const before=JSON.stringify((s.player.rel||{})[id]||{});relAdd(w,s,id,d);
    if(JSON.stringify((s.player.rel||{})[id]||{})!==before)out.changed=d;out.state=s;return out;
  }
  function relApplyMap(w,s,map){if(map)for(const id in map)relAdd(w,s,id,map[id]);}
  // ---------- 재판(시제품) ----------
  // s.trial = {i: 재판 번호, phase: 단계, hp: 재판 전용 체력, sub: 단계 안 진행도}. 재판 중에는 시간이 흐르지 않는다.
  // 설정 메뉴의 시험 시작: 재판 자료를 모두 지급. 사건 연쇄로 열릴 때는 실제로 모은 것만(부족한 필수 자료는 지배인이 건넨다고 알림).
  function startTrial(w,state,code){const s=clone(state);openTrial(w,s,code,true);return s;}
  function openTrial(w,s,code,grantAll){
    const i=(w.trials||[]).findIndex(t=>t.code===code);if(i<0)return;
    const tr=w.trials[i];s.trial={i,phase:0,hp:tr.hp||5,sub:0,failed:0,hold:0};
    if(!s.player.items)s.player.items={};
    const miss=(tr.evidence||[]).filter(id=>s.player.items[id]===undefined);
    if(!s.player.given)s.player.given={};
    for(const id of miss){s.player.items[id]=s.clock;s.player.given[id]=1;}
    if(miss.length&&!grantAll)addLog(w,s,'지배인이 미처 챙기지 못한 자료를 건넸다: '+miss.map(id=>((w.items||[]).find(x=>x.id===id)||{}).name).join(', '),'world');
    s.player.route=[];addLog(w,s,(tr.kind==='case'?'사건: ':'재판이 열렸다: ')+tr.title,'player');enterPhase(w,s);
  }
  // 조사 단계에 들어가면: 마감 시각을 sub에 적고, 자료를 지급하고, 모인 사람들을 풀어 준다(각자 일정으로).
  function enterPhase(w,s){
    const T=s.trial;if(!T)return;const ph=w.trials[T.i].phases[T.phase];if(!ph)return;
    for(const f of ph.setFlags||[])s.flags[f]=true; // 이 단계에 들어서면 서는 깃발(예: 가명이 본명으로 바뀜)
    if(ph.type!=='investigate')return;
    const cs=(w.cases||[]).find(c=>c.trial===w.trials[T.i].code),found=cs&&(s.cases||{})[cs.id]?s.cases[cs.id][1]:null;
    T.sub=ph.until?Math.floor(s.clock/DAY)*DAY+secs(ph.until):(ph.afterFound!=null&&found!=null)?found+ph.afterFound*60:s.clock+(ph.minutes||30)*60;
    T.sub=Math.max(T.sub,s.clock+300); // 최소 5분
    if(!s.player.given)s.player.given={};
    for(const id of ph.grant||[])if(s.player.items[id]===undefined){s.player.items[id]=s.clock;s.player.given[id]=1;}
    for(const n of s.npcs){const g=n.queued.find(t=>/^gather_/.test(t.id));if(g){n.queued=n.queued.filter(t=>t!==g);}
      if(n.intent&&/^gather_/.test(n.intent.id)){n.intent=null;n.mode='idle';n.route=[];n.busyUntil=0;n.nextMoveAt=s.clock+3;}}
    addLog(w,s,'조사 시간이 시작되었다. 마감 '+clock(T.sub).slice(0,5),'world');
  }
  function trialNext(w,s){
    const tr=w.trials[s.trial.i],cur=tr.phases[s.trial.phase];if(cur)relApplyMap(w,s,cur.rel);s.trial.phase++;s.trial.sub=0;
    if(s.trial.phase>=tr.phases.length){
      if(tr.flag)s.flags[tr.flag]=true;s.trial=null;
      // 연쇄: 집합·조사 대본이 끝나면 갈래에 맞는 재판으로(then: [{if:플래그, code}, …], 처음 맞는 것)
      const nx=(tr.then||[]).find(t=>!t.if||s.flags[t.if]);
      if(nx){openTrial(w,s,nx.code,false);return;}
      addLog(w,s,(tr.kind==='case'?'사건 정리가 끝났다: ':'재판이 끝났다: ')+tr.title,'player');return;
    }
    enterPhase(w,s);
  }
  function inInvestigation(w,s){const T=s.trial;return !!(T&&(w.trials[T.i].phases[T.phase]||{}).type==='investigate');}
  // 시간이 흐를 때: 조사 마감이 되면 개정
  function checkDeadline(w,s){if(inInvestigation(w,s)&&s.clock>=s.trial.sub){addLog(w,s,'조사 시간이 끝났다. 재판장으로 모인다.','world');trialNext(w,s);}}
  // 틀림: 체력 -1. 0이 되면 꿈(노멀)에서는 그 단계로 되감기고, 현실(진엔딩)에서는 실패로 끝난다.
  function trialHit(w,state){
    const s=clone(state),T=s.trial;if(!T)return {state:s,result:''};
    T.hp--;if(T.hp>0)return {state:s,result:'hit'};
    if(s.flags[w.realityFlag||'true_route']){T.failed=1;return {state:s,result:'fail'};}
    T.hp=(w.trials[T.i].hp||5);T.sub=0;addLog(w,s,'……정신을 차리니, 조금 전 그 순간이었다.','player');return {state:s,result:'rewind'};
  }
  function trialStep(w,state,action){
    const s=clone(state);if(!s.trial)return s;
    if(action==='NEXT')trialNext(w,s);else if(action==='SUB')s.trial.sub++;else if(action==='QUIT'){s.trial=null;addLog(w,s,'(시험) 재판을 중단했다.','player');}
    return s;
  }
  // 로어북을 켜는 표식. 화면이 매 메시지 머리말에 붙인다(검색 범위 '현재 유저 입력만' 항목용).
  function markers(w,s){
    const out=['#장'+(w.chapter||1)];
    if(s.trial&&w.trials&&w.trials[s.trial.i])out.push(inInvestigation(w,s)?'#조사'+w.trials[s.trial.i].code+branchLetter(w,s):'#재판'+w.trials[s.trial.i].code);
    // 시간대 갈래 표식: #1일저녁A. A는 인라인(메인), 조건이 맞으면 B·C…(어느 갈래인지는 화면이 판정)
    const sl=slotOf(w,s);
    if(sl){const b=(w.branches||[]).find(b=>(!b.flag||s.flags[b.flag])&&(!b.slot||b.slot===sl.day+'일'+sl.name));out.push('#'+sl.day+'일'+sl.name+(b?b.letter:'A'));}
    for(const m of w.markers||[])if(s.flags[m.flag])out.push(m.token);
    return out;
  }
  function dispatch(w,state,action){
    let s=clone(state);const player=s.player;
    if(action.type==='MOVE_TO'||action.type==='MOVE_ONE'){
      const target=action.type==='MOVE_ONE'?{x:player.x+action.dx,y:player.y+action.dy}:{x:action.x,y:action.y};
      if(!walkable(w,target.x,target.y)){addLog(w,s,'그곳으로는 이동할 수 없다.','player');return s;}
      const p=route(w,s,player,target,{ignorePlayer:true});
      if(!p.length&&manhattan(player,target)>0){addLog(w,s,'갈 수 있는 경로가 없다.','player');return s;}
      player.route=p;player.nextMoveAt=s.clock+(w.player.moveSeconds||4);
      addLog(w,s,p.length?'목적지로 이동을 시작했다.':'이미 그곳에 있다.','player');
    }else if(action.type==='ACCOMPANY'){
      const n=node(s,action.npcId);
      if(!n||manhattan(player,n)>1){addLog(w,s,'동행하려면 해당 인물 가까이 있어야 한다.','player');return s;}
      if(n.mode==='busy'||n.mode==='accompany'||(n.intent&&!n.intent.interruptible)){
        addLog(w,s,'지금은 동행할 수 없다.','player');return s;
      }
      if(n.intent){
        // onAccompany: 'cancel'(기본, 이번 일정은 다시 고르지 않음) / 'postpone'(동행이 끝나면 다시 고를 수 있음)
        if(n.intent.onAccompany!=='postpone')n.excluded.push(n.intent.id);
        if(n.intent.onInterrupt)s.flags[n.intent.onInterrupt]=true;
        if(n.intent.onInterruptFact)learn(n,n.intent.onInterruptFact,0,s.clock);
      }
      n.mode='accompany';n.intent=null;n.route=[];n.nextMoveAt=0;n.busyUntil=0;n.blockedSince=null;
      addLog(w,s,nm(w,s,n.id)+'이(가) 동행을 수락했다. 기존 방문 일정은 취소됐다.','player');
    }else if(action.type==='RELEASE'){
      const n=node(s,action.npcId);
      if(n&&n.mode==='accompany'){n.mode='idle';n.nextMoveAt=s.clock+5; n.route=[];
        addLog(w,s,nm(w,s,n.id)+'이(가) 다시 독립 행동을 시작했다.','player');}
    }else if(action.type==='TALK_REQUEST'){
      // 대화는 AI가 응답한 뒤 applyTalk()로 시간을 반영한다. 여기서는 대상만 잠근다.
      const n=node(s,action.npcId);
      // 2칸 이내 + 시야가 트여 있으면 상대가 바빠도 말은 걸 수 있다(들어줄지는 AI가 상태를 보고 정한다)
      if(!n||manhattan(player,n)>(w.talkRange||2)||!lineOfSight(w,player,n)){addLog(w,s,'대화하려면 인물에게 더 다가가야 한다.','player');return s;}
      if(n.mode==='busy'&&n.intent&&n.intent.targetPlayer)finishCall(s,n);
      if(!player.talked)player.talked={};if(player.talked[n.id]===undefined)relAdd(w,s,n.id,(w.rel||{}).firstTalk);player.talked[n.id]=s.clock;
      s.pend=n.id;s.pk=action.kind||'T';s.pc=Math.max(0,Math.min(2000,action.chars|0));player.route=[];player.nextMoveAt=0;
    }else if(action.type==='WAIT')return advance(w,s,action.seconds||60);
    else if(action.type==='SEARCH'){
      // 조사: 랜드마크 자리나 그 가구 칸 바로 옆에서. 시간이 든다. 있으면 소지품으로.
      const l=landmark(w,action.landmark);
      if(!l)return s;
      const spots=[{x:l.x,y:l.y},...(l.hit||[]).map(h=>({x:h[0],y:h[1]}))];
      if(!spots.some(p=>manhattan(player,p)<=1)){addLog(w,s,'조사하려면 '+l.name+' 가까이 가야 한다.','player');return s;}
      const wasInv=inInvestigation(w,s);
      const t=advance(w,s,w.searchSeconds||20);s=t;
      if(wasInv&&!inInvestigation(w,s)){addLog(w,s,'조사하던 도중 마감이 되었다. 아무것도 챙기지 못했다.','player');return s;}
      const found=itemsAt(w,s,l.id);
      if(!s.player.items)s.player.items={};
      for(const it of found)s.player.items[it.id]=s.clock;
      addLog(w,s,found.length?l.name+'에서 '+josa(found.map(i=>i.name).join(', '),'을','를')+' 찾았다.':l.name+' 주변을 뒤졌지만 아무것도 없었다.','player');
      return s;
    }else if(action.type==='DISMISS_CALL'){
      const n=node(s,action.npcId);
      if(n&&n.mode==='busy'&&n.intent&&n.intent.targetPlayer){finishCall(s,n);addLog(w,s,nm(w,s,n.id)+'이(가) 아쉬운 얼굴로 돌아갔다.','player');}
    }else if(action.type==='UNSTUCK'){
      // 끼임 탈출: 지금 칸에서 한 칸도 못 움직일 때만, 가장 가까운 '빠져나갈 수 있는 빈칸'으로 옮긴다(시간 0).
      const occ=new Set(s.npcs.filter(n=>n.mode!=='accompany').map(n=>posKey(n.x,n.y)));
      const free=(x,y)=>walkable(w,x,y)&&!occ.has(posKey(x,y));
      const D4=[[1,0],[-1,0],[0,1],[0,-1]];
      const canMove=(x,y)=>D4.some(([dx,dy])=>free(x+dx,y+dy));
      if(walkable(w,player.x,player.y)&&canMove(player.x,player.y)){addLog(w,s,'막혀 있지 않다.','player');return s;}
      const q=[[player.x,player.y]],seen=new Set([posKey(player.x,player.y)]);let to=null;
      for(let i=0;i<q.length&&!to;i++){const [x,y]=q[i];
        for(const [dx,dy] of D4){const nx=x+dx,ny=y+dy,k=posKey(nx,ny);if(!inBounds(w,nx,ny)||seen.has(k))continue;seen.add(k);
          if(free(nx,ny)&&canMove(nx,ny)){to={x:nx,y:ny};break;}q.push([nx,ny]);}}
      if(!to){addLog(w,s,'빠져나갈 곳이 없다.','player');return s;}
      player.x=to.x;player.y=to.y;player.route=[];player.nextMoveAt=0;addLog(w,s,'끼인 곳에서 빠져나왔다.','player');
    }
    else if(action.type==='CLEAR_ROUTE'){s.player.route=[];s.player.nextMoveAt=0;addLog(w,s,'이동을 멈췄다.','player');}
    s.revision++;return s;
  }
  // AI 응답의 경과 시간(초)을 반영한다. 같은 체크포인트에서 다시 마운트해도 결과가 같다.
  function applyTalk(w,state,seconds){
    const sec=Math.max(0,Math.min(900,Math.floor(Number(seconds)||0)));
    let s=clone(state);
    if(s.pend===undefined)s.pend=null;
    const n=s.pend?node(s,s.pend):null;
    // 하던 일이 있으면(일하는 중·만남 대기) 그 일이 대화한 만큼 늦어진다. 아니면 그 자리에 멈춰 대화.
    if(n&&(n.mode==='busy'||n.mode==='paused')){n.busyUntil=Math.max(n.busyUntil||s.clock,s.clock)+sec;n.nextMoveAt=Math.max(n.nextMoveAt,n.busyUntil);}
    else if(n&&n.mode!=='accompany'){n.mode='paused';n.busyUntil=s.clock+sec;n.nextMoveAt=n.busyUntil;}
    s.player.route=[];s.player.nextMoveAt=0;s.pend=null;s.pk='';s.pc=0;
    if(sec>0){addLog(w,s,(n?nm(w,s,n.id)+'와(과) ':'')+'대화하며 '+sec+'초가 지났다.','player');s=advance(w,s,sec);}
    else s.revision++;
    return s;
  }
  // 대화 시간은 AI가 정하지 않고 글자 수로 계산한다(초당 약 6자 + 기본 4초).
  function talkSeconds(userChars,replyChars){return Math.max(5,Math.min(600,Math.ceil(((userChars|0)+(replyChars|0))/6)+4));}
  // NPC가 스스로 아는 현재 행동을 짧은 말로.
  function describe(w,s,n){
    const name=id=>nm(w,s,id), place=id=>(landmark(w,id)||{}).name||'어딘가';
    if(n.mode==='accompany')return '플레이어와 동행 중';
    if(s.block&&s.block.npc===n.id)return place(n.intent&&n.intent.landmark)+'에 볼일이 있는데 플레이어가 그 자리에 서 있어, 비켜 달라고 말을 건 참('+s.block.n+'번째 부탁'+(s.block.urgent?', 급한 일':'')+')';
    if(n.mode==='busy'&&n.intent)return n.intent.targetNpc?name(n.intent.targetNpc)+'와 이야기하는 중':place(n.intent.landmark)+'에서 일하는 중';
    if(n.intent)return n.intent.targetNpc?name(n.intent.targetNpc)+'에게 가는 중':place(n.intent.landmark)+' 쪽으로 가는 중';
    return '한가함';
  }
  function diagnostics(w,s){
    return s.npcs.map(n=>({id:n.id,name:nm(w,s,n.id),mode:n.mode,
      pos:`(${n.x},${n.y})`,plan:n.intent?.id||null,nextMoveAt:n.nextMoveAt,remaining:n.route.length,
      completed:n.completed.join(',')||'—',excluded:n.excluded.join(',')||'—'}));
  }
  function validate(w,s){
    if(s.schema!=='TROEMEREI_NPC_V1'||s.worldId!==w.map.id)throw Error('Invalid checkpoint schema/world');
    for(const x of [s.player,...s.npcs])if(!walkable(w,x.x,x.y))throw Error('Invalid position '+x.x+','+x.y);
    return true;
  }
  return {createWorld, nm, inInvestigation, branchLetter, relScales, relLevel, relAdd, applyRel, startTrial, trialHit, trialStep, caller, parseK, lineOfSight, advance, advanceUntil, absTime, itemsAt, slotOf, advanceSlow, applyEvent, hearFacts, factCode, markers, dispatch, applyTalk, talkSeconds, describe, areaOf, sees, route, walkable, clock, diagnostics, validate, clone};
})();

/* Troemerei 상태 압축 코덱 v2 — AI가 매 턴 그대로 복사하는 문자열을 최소화한다.
   상태 JSON(약 1,000자 이상) → base64url 약 100~150자. 끝 2바이트는 손상 검사용 체크섬.
   로그는 화면 표시용이라 저장하지 않는다. 경로·타이머·완료 기록은 그대로 보존해 결정성을 유지한다. */
const trCodec = (() => {
  const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  const MODES = ['idle', 'moving', 'busy', 'paused', 'accompany'];
  const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  const VERSION = 11;
  // 플레이어 외형 항목(체크인): 성별·앞머리·뒷머리·머리색·눈 모양·눈동자색·피부·옷·옷 색·장신구
  const LOOK_KEYS = ['g', 'hf', 'hb', 'hc', 'eye', 'ec', 'sk', 'of', 'oc', 'ac'];
  const KINDS = ['', 'T', 'I', 'A', 'P', 'R'];

  function hash32(text) { let h = 0x811c9dc5; for (const ch of text) { h ^= ch.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; } return h >>> 0; }
  const hash16 = text => { const h = hash32(text); return (h ^ (h >>> 16)) & 0xffff; };
  // 세계 지문: 맵·일정·후속 규칙·사실·플래그 정의가 하나라도 바뀌면 달라진다 → 옛 코드를 조용히 잘못 읽지 않는다.
  // 세계 지문: 상태 해석·판정에 영향을 주는 규칙은 전부 넣는다(설명 문구·그림은 제외). dataVersion을 올려도 거부된다.
  function fingerprint(w) {
    const strip = o => JSON.parse(JSON.stringify(o, (k, v) => ['desc', 'text', 'caption', 'title', 'profile', 'notes', 'self', 'seen', 'player', 'log', 'publicLog', 'name', 'color', 'symbol', 'icon', 'img'].includes(k) ? undefined : v));
    return hash32(JSON.stringify(strip({ id: w.map.id, v: w.version || 1, dv: w.dataVersion || 0, rows: w.map.rows, areas: w.map.areas.map(a => [a.x0, a.y0, a.x1, a.y1]),
      lm: w.map.landmarks, props: w.map.props || [], npcs: w.npcs, rules: w.onComplete || [], pl: w.player, facts: (w.facts || []).map(f => [f.id, f.code]),
      flags: w.flagNames || [], items: w.items || [], scenes: w.scenes || [], events: w.events || {}, branches: w.branches || [], notices: (w.notices || []).map(n => n.time),
      cases: w.cases || [], rel: ((w.rel || {}).scales || []).map(x => [x.id, x.key, (x.levels || []).length, !!x.opposite]), relGain: [(w.rel || {}).aiStep || 0, (w.rel || {}).firstTalk || {}], slots: w.slots || [], markers: w.markers || [], trials: w.trials || [], chapter: w.chapter || 1, search: w.searchSeconds || 0 })));
  }
  function taskTable(w) {
    const list = [];
    const add = t => { if (t && t.id && !list.some(x => x.id === t.id)) list.push(t); };
    for (const n of w.npcs) for (const t of n.agenda || []) add(t);
    for (const r of w.onComplete || []) add(r.queueTask);
    for (const c of w.cases || []) add(c.task); // 사건 발견 시 모두 현장으로
    return list;
  }
  function meta(w) {
    if (w.__codec) return w.__codec;
    const tasks = taskTable(w);
    const facts = (w.facts || []).map(f => f.id);
    const m = { tasks, index: new Map(tasks.map((t, i) => [t.id, i])), flags: w.flagNames || [], facts, fidx: new Map(facts.map((f, i) => [f, i])), fp: fingerprint(w) };
    Object.defineProperty(w, '__codec', { value: m, enumerable: false });
    return m;
  }

  function writer() {
    const b = [];
    const api = {
      byte(v) { b.push(v & 255); },
      uint(v) { v = Math.floor(v); if (v < 0) throw Error('음수 저장 불가'); do { let x = v % 128; v = Math.floor(v / 128); if (v) x |= 128; b.push(x); } while (v); },
      sint(v) { api.uint(v < 0 ? -2 * v - 1 : 2 * v); },
      u32(v) { for (let i = 0; i < 4; i++) b.push((v >>> (i * 8)) & 255); },
      bytes: b,
    };
    return api;
  }
  function reader(b) {
    let p = 0;
    const need = () => { if (p >= b.length) throw Error('상태 코드가 잘렸습니다'); };
    const api = {
      byte() { need(); return b[p++]; },
      uint() { let v = 0, mul = 1, x; do { need(); x = b[p++]; v += (x & 127) * mul; mul *= 128; } while (x & 128); return v; },
      sint() { const v = api.uint(); return v % 2 ? -(v + 1) / 2 : v / 2; },
      u32() { let v = 0; for (let i = 0; i < 4; i++) { need(); v |= b[p++] << (i * 8); } return v >>> 0; },
      done() { return p === b.length; },
    };
    return api;
  }
  function fletcher(bytes) { let a = 0, c = 0; for (const x of bytes) { a = (a + x) % 255; c = (c + a) % 255; } return [a, c]; }
  function toB64(bytes) { let out = '', i = 0; for (; i + 2 < bytes.length; i += 3) { const n = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2]; out += B64[n >> 18] + B64[n >> 12 & 63] + B64[n >> 6 & 63] + B64[n & 63]; } const r = bytes.length - i; if (r === 1) { const n = bytes[i] << 16; out += B64[n >> 18] + B64[n >> 12 & 63]; } else if (r === 2) { const n = bytes[i] << 16 | bytes[i + 1] << 8; out += B64[n >> 18] + B64[n >> 12 & 63] + B64[n >> 6 & 63]; } return out; }
  function fromB64(text) {
    const clean = String(text || '').trim();
    if (!/^[A-Za-z0-9_-]+$/.test(clean)) throw Error('상태 코드에 허용되지 않은 문자가 있습니다');
    const vals = Array.from(clean, ch => B64.indexOf(ch)), out = [];
    for (let i = 0; i < vals.length; i += 4) { const n = (vals[i] << 18) | ((vals[i + 1] || 0) << 12) | ((vals[i + 2] || 0) << 6) | (vals[i + 3] || 0); out.push(n >> 16 & 255); if (i + 2 < vals.length) out.push(n >> 8 & 255); if (i + 3 < vals.length) out.push(n & 255); }
    return out;
  }

  // 시각: 0은 '없음', 그 외에는 현재 시각과의 차이를 저장해 짧게 만든다.
  const putTime = (o, t, clock) => o.uint(!t ? 0 : (t - clock < 0 ? -2 * (t - clock) - 1 : 2 * (t - clock)) + 1);
  const getTime = (r, clock) => { const v = r.uint(); if (!v) return 0; const z = v - 1; return clock + (z % 2 ? -(z + 1) / 2 : z / 2); };
  function putRoute(o, from, route) {
    o.uint(route.length); let prev = from, acc = 0, k = 0;
    for (const p of route) {
      const d = DIRS.findIndex(([dx, dy]) => prev.x + dx === p.x && prev.y + dy === p.y);
      if (d < 0) throw Error('연속되지 않은 경로는 저장할 수 없습니다');
      acc |= d << (k * 2); k++; prev = p;
      if (k === 4) { o.byte(acc); acc = 0; k = 0; }
    }
    if (k) o.byte(acc);
  }
  function getRoute(r, from) {
    const len = r.uint(), out = []; let prev = from, acc = 0;
    for (let i = 0; i < len; i++) { if (i % 4 === 0) acc = r.byte(); const [dx, dy] = DIRS[(acc >> ((i % 4) * 2)) & 3]; prev = { x: prev.x + dx, y: prev.y + dy }; out.push(prev); }
    return out;
  }
  const putList = (o, ids, m) => { const set = [...new Set(ids)].filter(id => m.index.has(id)); o.uint(set.length); for (const id of set) o.uint(m.index.get(id)); };
  const getList = (r, m) => { const n = r.uint(), out = []; for (let i = 0; i < n; i++) out.push(task(m, r.uint()).id); return out; };
  const task = (m, i) => { if (!m.tasks[i]) throw Error('상태 코드의 행동 번호가 세계 데이터에 없습니다'); return m.tasks[i]; };
  const putMem = (o, mem, m, clock) => { const list = (mem || []).filter(x => m.fidx.has(x[0])); o.uint(list.length); for (const [f, role, t] of list) { o.uint(m.fidx.get(f)); o.uint(role | 0); o.uint(Math.max(0, clock - t)); } };
  const getMem = (r, m, clock) => { const n = r.uint(), out = []; for (let i = 0; i < n; i++) { const f = m.facts[r.uint()]; if (f === undefined) throw Error('상태 코드의 사실 번호가 세계 데이터에 없습니다'); const role = r.uint(); out.push([f, role, clock - r.uint()]); } return out; };

  function pack(w, s) {
    const m = meta(w), o = writer(), clock = s.clock;
    o.byte(VERSION); o.u32(m.fp);
    o.uint(s.revision || 0); o.uint(s.day || 1); o.uint(clock); o.u32(s.rng >>> 0);
    const fb = Math.ceil(m.flags.length / 8);
    for (let i = 0; i < fb; i++) { let v = 0; for (let j = 0; j < 8; j++) if (s.flags[m.flags[i * 8 + j]]) v |= 1 << j; o.byte(v); }
    o.uint(s.pend ? s.npcs.findIndex(n => n.id === s.pend) + 1 : 0);
    o.byte(Math.max(0, KINDS.indexOf(s.pk || ''))); o.uint(s.pc || 0); o.uint(s.pv ? (w.items || []).findIndex(x => x.id === s.pv) + 1 : 0); // 대화 중 제시한 증거
    o.byte(s.player.x); o.byte(s.player.y); putRoute(o, s.player, s.player.route); putTime(o, s.player.route.length ? s.player.nextMoveAt : 0, clock);
    putMem(o, s.player.mem, m, clock);
    for (const it of w.items || []) { const v = (s.player.items || {})[it.id]; o.uint(v === undefined ? 0 : clock - v + 1); } // 0 = 아직 안 가짐
    { let gv = 0; (w.items || []).forEach((it, i) => { if ((s.player.given || {})[it.id]) gv += 2 ** i; }); o.uint(gv); } // 지배인이 지급한 자료
    // 체크인 외형: 없으면 0. 있으면 1 + 항목 번호들 + 이름(UTF-8)
    { const L = s.player.look; if (!L) o.uint(0); else { o.uint(1); for (const k of LOOK_KEYS) o.uint(Math.max(0, L[k] | 0)); const nb = Array.from(new TextEncoder().encode(String(L.name || '').slice(0, 12))); o.uint(nb.length); nb.forEach(v => o.byte(v)); } }
    for (const sc of w.scenes || []) { const v = (s.player.scenes || {})[sc.id]; o.uint(v === undefined ? 0 : clock - v + 1); } // 목격 장면 해금 시각
    let tk = 0; w.npcs.forEach((n, i) => { if ((s.player.talked || {})[n.id] !== undefined) tk |= 1 << i; }); o.uint(tk); // 말 걸어 본 인물
    const rs = (w.rel || {}).scales || [];
    for (const spec of w.npcs) for (const sc of rs) if (spec.rel && spec.rel[sc.id] !== undefined) { const v = ((s.player.rel || {})[spec.id] || {})[sc.id]; o.uint(Math.max(0, Math.min(100, v === undefined ? spec.rel[sc.id] : v))); } // 관계 값
    for (const c of w.cases || []) { const v = (s.cases || {})[c.id]; if (!v) o.uint(0); else { o.uint(v[0]); o.uint(Math.max(0, clock - v[1])); o.uint(v[2]); } } // 사건 진행
    if (s.trial) { o.uint(s.trial.i + 1); o.uint(s.trial.phase); o.uint(s.trial.hp); o.uint(s.trial.sub); o.uint(s.trial.failed ? 1 : 0); o.uint(s.trial.hold || 0); } else o.uint(0); // 재판 진행
    for (const spec of w.npcs) { const v = (s.player.seen || {})[spec.id]; if (!v) o.uint(0); else { o.uint(v[0] + 2); o.uint(Math.max(0, clock - v[1])); } }
    for (const spec of w.npcs) {
      const n = s.npcs.find(x => x.id === spec.id);
      o.byte(n.x); o.byte(n.y); o.byte(MODES.indexOf(n.mode));
      o.uint(n.intent ? m.index.get(n.intent.id) + 1 : 0);
      putRoute(o, n, n.route);
      putTime(o, n.nextMoveAt, clock); putTime(o, n.busyUntil, clock);
      o.uint(n.blockedSince === null ? 0 : clock - n.blockedSince + 1);
      const done = [...new Set(n.completed)].filter(id => m.index.has(id));
      o.uint(done.length); for (const id of done) { o.uint(m.index.get(id)); o.uint(Math.max(0, clock - (n.lastCompleted[id] || clock))); }
      putList(o, n.excluded, m); putList(o, n.queued.map(t => t.id), m);
      o.uint(n.lastTask && m.index.has(n.lastTask) ? m.index.get(n.lastTask) + 1 : 0);
      putMem(o, n.mem, m, clock);
      const asks = Object.entries(n.asks || {}).filter(([id]) => m.index.has(id)); o.uint(asks.length); for (const [id, k] of asks) { o.uint(m.index.get(id)); o.uint(k); } // 비켜 달라는 부탁 횟수
    }
    const sum = fletcher(o.bytes);
    return toB64([...o.bytes, ...sum]);
  }

  function unpack(w, text) {
    const m = meta(w), all = fromB64(text);
    if (all.length < 6) throw Error('상태 코드가 너무 짧습니다');
    const body = all.slice(0, -2), [a, c] = fletcher(body);
    if (a !== all[all.length - 2] || c !== all[all.length - 1]) throw Error('상태 코드가 손상되었습니다(체크섬 불일치)');
    const r = reader(body);
    if (r.byte() !== VERSION) throw Error('상태 코드 형식 버전이 다릅니다(이전 버전에서 만든 코드)');
    if (r.u32() !== m.fp) throw Error('세계 데이터(맵·일정)가 바뀌어 이 상태 코드를 읽을 수 없습니다');
    const s = { schema: 'TROEMEREI_NPC_V1', version: 1, worldId: w.map.id, logs: [] };
    s.revision = r.uint(); s.day = r.uint(); const clock = s.clock = r.uint(); s.rng = r.u32();
    s.flags = {}; const fb = Math.ceil(m.flags.length / 8);
    for (let i = 0; i < fb; i++) { const v = r.byte(); for (let j = 0; j < 8 && i * 8 + j < m.flags.length; j++) s.flags[m.flags[i * 8 + j]] = !!(v & (1 << j)); }
    const pend = r.uint(); s.pk = KINDS[r.byte()] || ''; s.pc = r.uint(); const pv = r.uint(); s.pv = pv ? ((w.items || [])[pv - 1] || {}).id || '' : '';
    const px = r.byte(), py = r.byte();
    s.player = { x: px, y: py }; s.player.route = getRoute(r, s.player); s.player.nextMoveAt = getTime(r, clock);
    s.player.mem = getMem(r, m, clock); s.player.seen = {}; s.player.items = {};
    for (const it of w.items || []) { const v = r.uint(); if (v) s.player.items[it.id] = clock - (v - 1); }
    s.player.given = {}; { let gv = r.uint(); (w.items || []).forEach((it, i) => { if (Math.floor(gv / 2 ** i) % 2) s.player.given[it.id] = 1; }); }
    { if (r.uint()) { const L = {}; for (const k of LOOK_KEYS) L[k] = r.uint(); const n = r.uint(), nb = []; for (let q = 0; q < n; q++) nb.push(r.byte()); L.name = new TextDecoder().decode(new Uint8Array(nb)); s.player.look = L; } else s.player.look = null; }
    s.player.scenes = {}; for (const sc of w.scenes || []) { const v = r.uint(); if (v) s.player.scenes[sc.id] = clock - (v - 1); }
    s.player.talked = {}; const tk = r.uint(); w.npcs.forEach((n, i) => { if (tk & (1 << i)) s.player.talked[n.id] = 0; });
    s.player.rel = {}; for (const spec of w.npcs) { const o = {}; for (const sc of ((w.rel || {}).scales || [])) if (spec.rel && spec.rel[sc.id] !== undefined) o[sc.id] = r.uint(); s.player.rel[spec.id] = o; }
    s.cases = {}; for (const c of w.cases || []) { const st = r.uint(); if (st) s.cases[c.id] = [st, clock - r.uint(), r.uint()]; }
    const ti = r.uint(); s.trial = ti ? { i: ti - 1, phase: r.uint(), hp: r.uint(), sub: r.uint(), failed: r.uint(), hold: r.uint() } : null;
    if (s.trial && !(w.trials || [])[s.trial.i]) throw Error('상태 코드의 재판 번호가 세계 데이터에 없습니다');
    for (const spec of w.npcs) { const a = r.uint(); if (a) s.player.seen[spec.id] = [a - 2, clock - r.uint()]; }
    s.npcs = w.npcs.map(() => {
      const n = { x: r.byte(), y: r.byte() };
      n.mode = MODES[r.byte()]; if (!n.mode) throw Error('NPC 상태 값 오류');
      const it = r.uint(); n.intent = it ? JSON.parse(JSON.stringify(task(m, it - 1))) : null;
      n.route = getRoute(r, n); n.nextMoveAt = getTime(r, clock); n.busyUntil = getTime(r, clock);
      const bs = r.uint(); n.blockedSince = bs ? clock - (bs - 1) : null;
      n.completed = []; n.lastCompleted = {};
      const dn = r.uint(); for (let i = 0; i < dn; i++) { const id = task(m, r.uint()).id; n.completed.push(id); n.lastCompleted[id] = clock - r.uint(); }
      n.excluded = getList(r, m); n.queued = getList(r, m).map(id => JSON.parse(JSON.stringify(m.tasks[m.index.get(id)])));
      const lt = r.uint(); n.lastTask = lt ? task(m, lt - 1).id : '';
      n.meetings = []; n.followOffset = 0; n.mem = getMem(r, m, clock);
      n.asks = {}; const an = r.uint(); for (let i = 0; i < an; i++) { const id = task(m, r.uint()).id; n.asks[id] = r.uint(); }
      return n;
    });
    w.npcs.forEach((spec, i) => { s.npcs[i] = { id: spec.id, ...s.npcs[i] }; });
    s.pend = pend ? s.npcs[pend - 1].id : null;
    if (!r.done()) throw Error('상태 코드 뒤에 알 수 없는 데이터가 있습니다');
    return s;
  }
  return { pack, unpack, hash16, fingerprint };
})();

/* AI 대사 문자열 해석 + AI 인계 메시지 생성.
   대사 형식(d 속성): 줄 구분은 |, 인물 대사는 `이름:대사` 또는 `이름(표정):대사`, 서술은 `*서술`.
   색·속도·크기 같은 연출 기본값은 JSX가 가진다(AI가 매번 적지 않는다). */
const trTalk = (() => {
  const LINE = /^([^:：*|()]{1,20})(?:\(([^()]{1,20})\))?\s*[:：]\s*(.+)$/s;
  // 괄호 안: 표정과 움직임을 · , / 로 함께 쓸 수 있다. 예) 유리(놀람·흔들림):…  움직임: 흔들림·다가섬·번쩍·깨짐
  const FX = { '흔들림': 'shake', '흔들': 'shake', shake: 'shake', '다가섬': 'zoom', '다가': 'zoom', zoom: 'zoom', '번쩍': 'flash', flash: 'flash', '깨짐': 'crack', crack: 'crack' };
  // 자세 낱말(생각·지목·팔짱·기본자세)은 표정과 따로 뽑는다
  const POSE = { '생각': 'think', '고민': 'think', '추리': 'think', '지목': 'point', '가리킴': 'point', '삿대질': 'point', '팔짱': 'crossed', '기본자세': 'default', think: 'think', point: 'point', crossed: 'crossed' };
  function face(expr) { const t = String(expr || '').split(/[·,\/\s]+/).filter(Boolean); return { expression: t.filter(x => !FX[x] && !POSE[x]).join(' '), fx: (t.map(x => FX[x]).find(Boolean)) || '', pose: (t.map(x => POSE[x]).find(Boolean)) || '' }; }
  function parse(raw) {
    if (!raw) return [];
    return String(raw).split('|').map(x => x.trim()).filter(Boolean).slice(0, 24).map(part => {
      if (part[0] === '*') return { speaker: '', expression: '', text: part.slice(1).trim().slice(0, 600), narration: true };
      const m = LINE.exec(part);
      if (!m || /^\d+$/.test(m[1].trim())) return { speaker: '', expression: '', text: part.slice(0, 600), narration: true };
      return { speaker: m[1].trim(), ...face(m[2]), text: m[3].trim().slice(0, 600), narration: false };
    }).filter(x => x.text);
  }
  // 화면 3줄에 넘치는 발화는 같은 화자의 여러 페이지로 나눈다(전각 1칸, 반각 0.55칸 기준).
  const PAGE = 54;
  const width = ch => /[\u1100-\u11ff\u3000-\u9fff\uac00-\ud7af\uff00-\uffef]/.test(ch) ? 1 : 0.55;
  // 각 페이지에 원본 줄 번호(src)와 그 줄 안에서의 시작 글자 위치(off)를 남긴다 → 끼어들기 위치·증언 시점을 원본 기준으로 계산.
  function paginate(lines, limit = PAGE) {
    const out = [];
    lines.forEach((l, src) => {
      const all = Array.from(l.text); let pos = 0;
      while (pos < all.length) {
        let w = 0, cut = all.length - pos;
        for (let i = pos; i < all.length; i++) { w += width(all[i]); if (w > limit) { cut = i - pos; break; } }
        if (pos + cut < all.length) { let b = -1; for (let i = cut; i > cut * 0.5; i--) if (/[\s.,!?…。、~」]/.test(all[pos + i - 1])) { b = i; break; } if (b > 0) cut = b; }
        const text = all.slice(pos, pos + cut).join('');
        if (text.trim()) out.push({ ...l, text, src, off: pos });
        pos += cut;
      }
    });
    return out;
  }
  // 화면 페이지 위치(idx, 글자 수) → 원본 줄 위치(줄 번호 0부터, 그 줄 안 글자 수)
  function origPos(pages, idx, chars) { const p = pages[idx]; return p ? [p.src, p.off + chars] : [0, 0]; }
  // 끼어들기: 내가 한 말은 전부, 상대 대사는 '가장 멀리 읽은 위치'까지만 대화 시간에 넣는다.
  function partialSeconds(lines, lineIndex, chars, userChars) {
    const seen = lines.slice(0, lineIndex).reduce((n, l) => n + Array.from(l.text).length, 0) + Math.max(0, chars | 0);
    return Math.max(5, Math.min(600, Math.ceil(((userChars | 0) + seen) / 6) + 4));
  }
  // kind: T 대화, I 끼어들기, A 추리 제시, P 자유 행동. ctx: 화면이 실제 상태로 만든 사실 줄(대상 상태·기억, 내 단서).
  function handoff({ kind, target = '', where = '', time = '', marks = [], ctx = [], cut = '', text = '', code }) {
    const head = ['TRM1', kind, target, cut ? 'cut=' + cut : ''].filter(Boolean).join(' ');
    const where2 = [time, where, ...marks].filter(Boolean).join(' ');
    return [head + (where2 ? ' | ' + where2 : ''), ...ctx.filter(Boolean), text, 's=' + code].filter(Boolean).join('\n');
  }
  return { parse, paginate, origPos, partialSeconds, handoff };
})();

// 360×540(2:3) 기준 화면. 폭이 다르면 비율을 유지한 채 통째로 확대·축소한다.
const TR_W = 360, TR_H = 540, TR_CELL = 36;
const TR_IMP = { idle: '한가해 보인다', moving: '어딘가 바빠 보인다', busy: '무언가에 집중하고 있다', paused: '이야기를 들어 주고 있다', accompany: '곁에서 함께 걷고 있다' };
const TR_BG = ['#25344a', '#2d3a30', '#283a4a', '#2c3550'];
// 화면 이름: 가명(alias)이 있으면 그 깃발이 서기 전까지 가명으로 보인다. TR_FLAGS는 그릴 때마다 상태의 깃발로 갱신.
let TR_FLAGS = {};
const trNpcRaw = id => TN_WORLD.npcs.find(n => n.id === id);
const trNpc = id => { const n = trNpcRaw(id); if (!n) return { name: id, color: '#999', symbol: '?' }; return n.alias && !TR_FLAGS[n.alias.until] ? { ...n, name: n.alias.name, real: n.name } : n; };
// 대사의 화자 이름 → 인물 id. 본명·가명·부르는 이름(call) 모두 받는다.
const trNameIs = (n, name) => n.name === name || (n.alias && n.alias.name === name) || (n.call || []).includes(name);
const trArea = (x, y) => { const i = trNPC.areaOf(TN_WORLD, x, y); return i < 0 ? '통로' : TN_WORLD.map.areas[i].name; };
const trHM = n => trNPC.clock(n).slice(0, 5);
const trFact = (id, role, who) => {
  const f = (TN_WORLD.facts || []).find(x => x.id === id); if (!f) return id;
  if (who === 'player' && role >= 2) { const src = TN_WORLD.npcs[role - 2]; return src ? src.name + '의 증언: ' + ((f.self || {})[src.id] || f.seen || id) : id; }
  if (who === 'player') return f.player || f.seen || id;
  return role === 0 ? ((f.self || {})[who] || f.seen || id) : (f.seen || id);
};
// 대상 기억은 코드로만 보낸다(채팅에 비밀이 그대로 보이지 않게). 내용은 같은 코드를 키워드로 켜지는 로어북 항목에 있다.
const trMemCode = (id, role) => trNPC.factCode(TN_WORLD, id) + (role === 0 ? '직' : role === 1 ? '목' : '들');
// 공지(매일 반복) 중 (from, to] 사이의 것들. [{t: 절대 시각, n: 공지}]
const trNotices = (from, to) => { const out = []; for (let d = Math.floor(from / 86400); d <= Math.floor(to / 86400); d++) for (const n of TN_WORLD.notices || []) { const t = d * 86400 + trNPC.absTime(n.time); if (t > from && t <= to) out.push({ t, n }); } return out.sort((a, b) => a.t - b.t); };
// 받침에 따라 조사 고르기(이/가, 을/를)
const trJosa = (w, a, b) => { const c = String(w).charCodeAt(String(w).length - 1) - 0xac00; return w + (c >= 0 && c < 11172 && c % 28 ? a : b); };
const trVisible = (s, n) => trNPC.sees(TN_WORLD, s.player, n);
const trChars = lines => lines.reduce((k, l) => k + Array.from(l.text).length, 0);

// ---------- 그림: 장소 배경 + 인물 레이어(몸 + 표정 조각) ----------
// 주소 표(TN_ASSETS)는 빌드할 때 끼워 넣는다. 파일 이름은 내용 해시라 이름만으로 무엇인지 알 수 없다.
const TR_A = typeof TN_ASSETS === 'object' && TN_ASSETS ? TN_ASSETS : {};
const trUrl = f => f ? (/^https?:/.test(f) ? f : (TR_A.url || '') + f) : '';
// AI가 쓴 표정 낱말 → 준비된 표정. 목록에 없으면 기본 표정.
// 표정 12종(대본·AI 공통 이름). AI가 쓴 낱말은 아래 유의어로 맞춘다. 앞쪽이 우선.
const TR_FACES = ['기본', '미소', '웃음', '의심', '놀람', '곤란', '부끄러움', '불만', '슬픔', '격노', '패닉', '하라구로'];
const TR_SYN = {
  하라구로: ['하라구로', '음흉', '사악', '비열', '속검', '흑심', '비웃', '냉소', '악랄'], 격노: ['격노', '분노', '격분', '노발', '버럭', '폭발', '화가 치'],
  패닉: ['패닉', '공포', '겁', '질린', '비명', '혼란', '사색', '경악'], 부끄러움: ['부끄', '수줍', '쑥스', '민망', '홍조', '얼굴이 붉', '창피'],
  슬픔: ['슬', '울', '눈물', '침울', '서글', '애통', '우울', '풀죽'], 곤란: ['곤란', '난처', '당황', '쩔쩔', '머쓱', '진땀', '어색'],
  의심: ['의심', '수상', '미심', '갸웃', '노려', '흘겨', '경계', '날카'], 불만: ['불만', '짜증', '삐', '언짢', '뾰로통', '찡그', '못마땅', '부루퉁', '토라', '화'],
  놀람: ['놀', '깜짝', '어리둥절', '의아', '멍', '헉'], 웃음: ['웃음', '활짝', '폭소', '깔깔', '신나', '즐거', '기뻐', '환하', '장난'],
  미소: ['미소', '웃', '흐뭇', '반가', '상냥', '다정', '부드'], 기본: ['기본', '평상', '무표정', '담담', '차분', '진지', '덤덤'] };
function trFaceWord(expr) {
  const e = String(expr || '').trim(); if (!e) return '기본';
  if (TR_FACES.includes(e)) return e;
  for (const k of Object.keys(TR_SYN)) if (TR_SYN[k].some(w => e.includes(w))) return k;
  return '기본';
}
// 자세 4종. 자세를 안 정했으면 표정에 따라 고른다(그 자세에 그 표정 그림이 있을 때만).
const TR_POSE_NAME = { default: '기본', think: '생각', point: '지목', crossed: '팔짱' };
const TR_AUTO_POSE = { 의심: 'think', 곤란: 'think', 격노: 'point', 하라구로: 'point', 불만: 'crossed' };
const trPoses = c => c ? (c.poses || { default: c }) : {};
const trHasFace = (P, f) => !!P && (f === (P.def || '기본') || !!(P.faces || {})[f]);
// 고를 그림: {pose, P, face}. 요청 자세에 그 표정이 없으면 기본 자세로.
function trPick(c, expr, pose) {
  const ps = trPoses(c), f = trFaceWord(expr), want = pose && ps[pose] ? pose : (TR_AUTO_POSE[f] && ps[TR_AUTO_POSE[f]] && trHasFace(ps[TR_AUTO_POSE[f]], f) ? TR_AUTO_POSE[f] : 'default');
  const k = trHasFace(ps[want], f) ? want : (ps.default ? 'default' : want);
  const P = ps[k] || ps.default; return { pose: k, P, face: trHasFace(P, f) ? f : (P && P.def) || '기본' };
}
function trFace(c, expr) { return trPick(c, expr, '').face; }

const TR_STEP_MS = 180, TR_FRAME_MS = 90;
// 탐색 화면 인물: 스프라이트 묶음에서 방향(하·상·좌·우)과 걷기 단계에 맞는 칸을 고른다.
// 칸 번호는 주소 표의 sprites.dirs = {down:{idle, walk:[…]}, …}를 따른다(걷기 장수 자유). 우가 없으면 좌를 뒤집는다.
// ---------- 플레이어 외형(체크인) ----------
// 지금 그림은 임시(코드로 그리는 벡터·자동 도트). 부품 그림(투명 PNG)이 오면 같은 항목 번호로 바꿔 끼운다.
const AV = {
  g: ['남성', '여성'],
  hf: ['일자 앞머리', '옆가르마', '가운데 가르마', '넘긴 머리', '삐침 머리'],
  hb: ['짧게', '단발', '긴 머리', '포니테일', '양갈래'],
  hc: [['흑', '#25222b'], ['갈', '#6b4630'], ['밤', '#3d2a22'], ['금', '#e2bd5e'], ['백', '#ecebf0'], ['은', '#aab2c0'], ['적', '#a83a3a'], ['분홍', '#eea0b8'], ['청', '#4a6ab0'], ['녹', '#4f8a6a']],
  eye: ['둥근 눈', '올라간 눈', '처진 눈', '가는 눈'],
  ec: [['갈', '#6b4630'], ['흑', '#2a2230'], ['청', '#4a78c8'], ['녹', '#3f9a6a'], ['회', '#8a96a6'], ['적', '#b04a4a'], ['금', '#d0a040']],
  sk: [['1', '#f6d7c0'], ['2', '#eec3a0'], ['3', '#d9a078'], ['4', '#a8704c'], ['5', '#6e4630']],
  of: ['셔츠', '후드', '코트', '니트', '원피스', '정장'],
  oc: [['남색', '#2f3f5f'], ['먹색', '#3a3a3a'], ['베이지', '#e3dccd'], ['와인', '#7a2f3a'], ['초록', '#3f6a4f'], ['흰색', '#f2f2f2'], ['파랑', '#4a6ab0'], ['겨자', '#c48a3a']],
  ac: ['없음', '둥근 안경', '각진 안경', '머리핀', '리본', '귀걸이'],
};
const AV_DEFAULT = { g: 0, hf: 1, hb: 0, hc: 0, eye: 0, ec: 0, sk: 0, of: 0, oc: 0, ac: 0, name: '' };
const avC = (k, i) => typeof i === 'string' ? i : (AV[k][i] || AV[k][0])[1]; // 인물 데이터는 색을 직접(#hex) 줄 수도 있다
const avShade = (hex, k) => '#' + [1, 3, 5].map(i => Math.max(0, Math.min(255, Math.round(parseInt(hex.slice(i, i + 2), 16) * k))).toString(16).padStart(2, '0')).join('');
// 걷기 도트: 회색조 층(윤곽·머리·상의·하의·피부) 위에 고른 색을 곱해 입힌다(CSS 마스크 — 그림 서버의 CORS 허용 필요)
function avMap(L) { return { sheet: ((L.hb >= 2) ? 'long' : L.hb === 1 ? 'bob' : L.hf === 4 ? 'messy' : 'short') + '_' + (L.of === 4 ? 'skirt' : 'pants'), cols: [null, avC('hc', L.hc), avC('oc', L.oc), L.of === 4 ? avShade(avC('oc', L.oc), .8) : '#3a3a48', avC('sk', L.sk)] }; }
function trAvatarPx(L, col, style) {
  const A = TR_A.avatar; if (!A) return null; const m = avMap(L), url = trUrl(A.sheets[m.sheet]); if (!url) return null;
  const n = A.layers.length, W = A.cw * 20, H = A.ch * n, at = r => `${-col * A.cw}px ${-r * A.ch}px`;
  const lay = r => ({ position: 'absolute', inset: 0, backgroundImage: `url(${url})`, backgroundSize: `${W}px ${H}px`, backgroundPosition: at(r), imageRendering: 'pixelated' });
  return <div style={{ position: 'absolute', width: A.cw, height: A.ch, isolation: 'isolate', ...style }}>
    {A.layers.map((_, r) => r === 0 ? null : <React.Fragment key={r}><div style={lay(r)} /><div style={{ position: 'absolute', inset: 0, background: m.cols[r], mixBlendMode: 'multiply', WebkitMaskImage: `url(${url})`, maskImage: `url(${url})`, WebkitMaskSize: `${W}px ${H}px`, maskSize: `${W}px ${H}px`, WebkitMaskPosition: at(r), maskPosition: at(r), WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat' }} /></React.Fragment>)}
    <div style={lay(0)} /></div>;
}
// ---------- 파츠 초상·컷인 (TR_A.parts: tools/avatar_parts.py) ----------
// 머리·눈썹·눈동자는 회색조 파츠에 SVG 그라데이션 맵(어두움→기본색→밝음)을 씌워 칠한다. 그림 서버 CORS가 필요 없다.
const avMix = (a, b, t) => '#' + [1, 3, 5].map(i => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - t) + parseInt(b.slice(i, i + 2), 16) * t).toString(16).padStart(2, '0')).join('');
function trTintDefs(L) {
  const hc = avC('hc', L.hc), ec = avC('ec', L.ec), ch = h => [1, 3, 5].map(i => (parseInt(h.slice(i, i + 2), 16) / 255).toFixed(3));
  const f = (id, cs) => { const T = cs.map(ch), t = j => T.map(x => x[j]).join(' '); return <filter key={id} id={id} colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values=".3 .59 .11 0 0 .3 .59 .11 0 0 .3 .59 .11 0 0 0 0 0 1 0" />
    <feComponentTransfer><feFuncR type="table" tableValues={t(0)} /><feFuncG type="table" tableValues={t(1)} /><feFuncB type="table" tableValues={t(2)} /></feComponentTransfer></filter>; };
  // 밝은 머리색(금·백·은·분홍)은 그림자를 덜 어둡게
  const lt = (parseInt(hc.slice(1, 3), 16) + parseInt(hc.slice(3, 5), 16) + parseInt(hc.slice(5, 7), 16)) / 765 > .55;
  return <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true"><defs>
    {f('trt-h' + L.hc, lt ? [avShade(hc, .35), avShade(hc, .6), avShade(hc, .82), hc, avMix(hc, '#ffffff', .6)] : [avShade(hc, .25), avShade(hc, .5), avShade(hc, .78), hc, avMix(hc, '#ffffff', .4)])}
    {f('trt-b' + L.hc, [avShade(hc, .2), avShade(hc, .4), avShade(hc, .6), avShade(hc, .8), hc])}
    {f('trt-e' + L.ec, [avShade(ec, .2), avShade(ec, .5), ec, avMix(ec, '#ffffff', .25), avMix(ec, '#ffffff', .6)])}</defs></svg>;
}
const AV_SKIN = [[1, 'brightness(1.04)'], [1, 'brightness(.95) saturate(1.06)'], [2, ''], [2, 'brightness(.86)'], [3, '']];
function trPart(P, L, k, at) {
  const m = P.map[k]; if (!m) return null;
  const tint = m[6] === 'h' ? 'url(#trt-h' + L.hc + ')' : m[6] === 'b' ? 'url(#trt-b' + L.hc + ')' : m[6] === 'e' ? 'url(#trt-e' + L.ec + ')' : '';
  return <div key={k + (at ? at.join(',') : '')} style={{ position: 'absolute', left: at ? at[0] : m[4], top: at ? at[1] : m[5], width: m[2], height: m[3], backgroundImage: `url(${trUrl(P.src)})`, backgroundSize: `${P.w}px ${P.h}px`, backgroundPosition: `${-m[0]}px ${-m[1]}px`, filter: [tint, at && at[2]].filter(Boolean).join(' ') || undefined, mixBlendMode: /fs\d/.test(k) ? 'multiply' : undefined }} />;
}
// 옷: 초상 좌표(240×280)에서 목 아래를 덮는다
function trOutfit(L) {
  const oc = avC('oc', L.oc), od = avShade(oc, .78), ol = avMix(oc, '#ffffff', .35), m = L.g === 0 ? 10 : 0, cx = 120;
  const body = `M${cx - 21} 213 Q${cx - 44} 219 ${cx - 72 - m} 221 Q${30 - m} 226 ${20 - m} 256 L${14 - m} 281 L${230 + m} 281 L${222 + m} 256 Q${212 + m} 224 ${cx + 72 + m} 219 Q${cx + 44} 216 ${cx + 21} 211`;
  const close = ` Q${cx} 234 ${cx - 21} 214 Z`, sh = <path d={`M${cx - 72 - m} 224 Q${cx - 20} 242 ${cx} 240 Q${cx + 22} 242 ${cx + 72 + m} 222`} fill="none" stroke={od} strokeWidth="2" opacity=".5" />;
  const pieces = {
    0: <><path d={body + close} fill={oc} /><path d={`M${cx - 23} 212 L${cx - 4} 238 L${cx - 30} 236 Z M${cx + 23} 210 L${cx + 4} 238 L${cx + 30} 234 Z`} fill="#f4f2ee" stroke={od} strokeWidth="1" />{[248, 262, 276].map(y => <circle key={y} cx={cx} cy={y} r="2" fill={od} />)}</>,
    1: <><path d={`M${cx - 46} 222 Q${cx} 200 ${cx + 46} 220 L${cx + 52} 236 Q${cx} 222 ${cx - 52} 238 Z`} fill={od} /><path d={body + ` Q${cx} 222 ${cx - 21} 214 Z`} fill={oc} /><path d={`M${cx - 10} 232 L${cx - 12} 262 M${cx + 10} 231 L${cx + 12} 260`} stroke="#f2f2f2" strokeWidth="2" /></>,
    2: <><path d={body + close} fill={oc} /><path d={`M${cx - 21} 214 L${cx} 270 L${cx + 21} 212 Z`} fill="#f2efe8" /><path d={`M${cx - 21} 214 L${cx - 40} 226 L${cx - 18} 250 L${cx} 270 Z M${cx + 21} 212 L${cx + 40} 224 L${cx + 18} 250 L${cx} 270 Z`} fill={od} /></>,
    3: <><path d={body + ` Q${cx} 226 ${cx - 21} 214 Z`} fill={oc} /><path d={`M${cx - 22} 214 Q${cx} 230 ${cx + 22} 212`} fill="none" stroke={ol} strokeWidth="6" />{[0, 1, 2, 3, 4, 5].map(i => <path key={i} d={`M${46 + i * 30} 250 l0 30`} stroke={od} strokeWidth="1" opacity=".35" />)}</>,
    4: <><path d={body + ` Q${cx} 240 ${cx - 21} 214 Z`} fill={oc} /><path d={`M${cx - 34} 224 Q${cx} 246 ${cx + 34} 222`} fill="none" stroke="#f4f2ee" strokeWidth="5" /><path d={`M${cx - 8} 240 l-10 10 l10 -2 l10 2 Z`} fill={avC('oc', (L.oc + 3) % 8)} /></>,
    5: <><path d={body + close} fill={avShade('#2a2a33', 1)} /><path d={`M${cx - 21} 214 L${cx} 274 L${cx + 21} 212 Z`} fill="#f4f2ee" /><path d={`M${cx - 4} 232 L${cx + 4} 232 L${cx + 7} 270 L${cx} 278 L${cx - 7} 270 Z`} fill={oc} /><path d={`M${cx - 21} 214 L${cx - 38} 228 L${cx - 16} 252 L${cx} 274 Z M${cx + 21} 212 L${cx + 38} 226 L${cx + 16} 252 L${cx} 274 Z`} fill="#1c1c24" /></>,
  };
  return <svg width="240" height="280" viewBox="0 0 240 280" style={{ position: 'absolute', left: 0, top: 0 }}>{pieces[L.of] || pieces[0]}{sh}</svg>;
}
function trAccPortrait(L, E) {
  const [a, b] = E, gl = '#3a3040';
  if (L.ac === 1) return <svg width="240" height="280" style={{ position: 'absolute', left: 0, top: 0 }}><g fill="none" stroke={gl} strokeWidth="2"><circle cx={a[0]} cy={a[1]} r="15" /><circle cx={b[0]} cy={b[1]} r="15" /><path d={`M${a[0] + 15} ${a[1] - 2} Q${(a[0] + b[0]) / 2} ${(a[1] + b[1]) / 2 - 8} ${b[0] - 15} ${b[1] - 2}`} /></g></svg>;
  if (L.ac === 2) return <svg width="240" height="280" style={{ position: 'absolute', left: 0, top: 0 }}><g fill="#ffffff22" stroke={gl} strokeWidth="2"><rect x={a[0] - 17} y={a[1] - 11} width="34" height="22" rx="3" /><rect x={b[0] - 17} y={b[1] - 11} width="34" height="22" rx="3" /><path d={`M${a[0] + 17} ${a[1] - 4} L${b[0] - 17} ${b[1] - 4}`} /></g></svg>;
  if (L.ac === 3) return <svg width="240" height="280" style={{ position: 'absolute', left: 0, top: 0 }}><path d="M150 96 l20 -8 l3 6 l-20 8 Z" fill="#e9c98c" stroke="#8a6a30" /><circle cx="168" cy="90" r="4" fill="#d06a8a" /></svg>;
  if (L.ac === 4) return <svg width="240" height="280" style={{ position: 'absolute', left: 0, top: 0 }}><path d="M160 74 l-18 -12 l2 22 Z M160 74 l20 -12 l-2 22 Z" fill="#c0504a" stroke="#7a2a2a" /><circle cx="160" cy="74" r="4" fill="#9a3a3a" /></svg>;
  if (L.ac === 5) return <svg width="240" height="280" style={{ position: 'absolute', left: 0, top: 0 }}><circle cx="165" cy="168" r="3" fill="#e9c98c" stroke="#8a6a30" /><circle cx="165" cy="176" r="4.5" fill="#e9c98c" stroke="#8a6a30" /></svg>;
  return null;
}
// 입식 초상: 240×280 좌표의 파츠를 scale 배로. 파츠가 없으면 임시 벡터.
function trAvatarImg(L, scale, style) {
  const P = TR_A.parts; if (!P) return null;
  const sk = AV_SKIN[L.sk] || AV_SKIN[0], E = (P.eyes.p[L.eye] || P.eyes.p[0]), im = P.map['p.iris'];
  return <div style={{ position: 'absolute', width: 240, height: 280, transform: `scale(${scale})`, transformOrigin: '0 0', ...style }}>{trTintDefs(L)}
    {trPart(P, L, 'p.b' + L.hb)}
    <div style={{ position: 'absolute', inset: 0, filter: sk[1] || undefined }}>{trPart(P, L, 'p.skin' + sk[0])}</div>
    {trOutfit(L)}{trPart(P, L, 'p.ew' + L.eye)}
    {E.map(([x, y], i) => <React.Fragment key={i}>{trPart(P, L, 'p.iris', [x - im[2] / 2, y - im[3] / 2])}{trPart(P, L, 'p.hl', [x - im[2] / 2, y - im[3] / 2])}</React.Fragment>)}
    {trPart(P, L, 'p.el' + L.eye)}{trPart(P, L, 'p.brow' + (L.g === 0 ? 1 : 0))}{trPart(P, L, 'p.mouth')}{trPart(P, L, 'p.fs' + L.hf)}{trPart(P, L, 'p.f' + L.hf)}{trAccPortrait(L, E)}</div>;
}
// 반론 컷인: 틀(409×238) 안 사선 칸에 얼굴을 맞춘다
function trCutinImg(L, style) {
  const P = TR_A.parts; if (!P) return null;
  const sk = AV_SKIN[L.sk] || AV_SKIN[0], E = P.eyes.c[L.eye] || P.eyes.c[0], ec = avC('ec', L.ec);
  return <div style={{ position: 'absolute', width: 409, height: 238, ...style }}>{trTintDefs(L)}
    <div style={{ position: 'absolute', inset: 0, clipPath: 'polygon(402px 31px,405px 31px,405px 186px,36px 186px)', background: 'linear-gradient(100deg,#06050a 30%,#1d1424)' }}>{trPart(P, L, 'c.bg')}
      {trPart(P, L, 'c.b' + L.hb)}<div style={{ position: 'absolute', inset: 0, filter: sk[1] || undefined }}>{trPart(P, L, 'c.skin' + sk[0])}{trPart(P, L, 'c.ear' + sk[0])}</div>
      {trPart(P, L, 'c.ew' + L.eye)}
      <svg width="409" height="238" style={{ position: 'absolute', left: 0, top: 0 }}>{E.map(([x, y], i) => { const r = i ? 1 : .6; return <g key={i}><ellipse cx={x} cy={y + 2} rx={12 * r} ry={17 * r} fill={avShade(ec, .55)} /><ellipse cx={x} cy={y + 4} rx={9 * r} ry={13 * r} fill={ec} /><ellipse cx={x} cy={y + 3} rx={4.5 * r} ry={7 * r} fill={avShade(ec, .25)} /><circle cx={x - 4 * r} cy={y - 6 * r} r={3.4 * r} fill="#fff" /></g>; })}</svg>
      {trPart(P, L, 'c.el' + L.eye)}{trPart(P, L, 'c.brow' + (L.g === 0 ? 1 : 0))}{trPart(P, L, 'c.mouth')}{trPart(P, L, 'c.fs' + L.hf)}{trPart(P, L, 'c.f' + L.hf)}</div>
    {trPart(P, L, 'c.line')}</div>;
}
// 상반신 초상(임시 벡터). 360×540 좌표. 파츠가 있으면 파츠 초상을 쓴다.
function trAvatar(L, style) {
  if (TR_A.parts) { const w = style.width || 150; return <div style={{ ...style, overflow: 'hidden' }}>{trAvatarImg(L, w / 168, { left: -30 * w / 168, top: -40 * w / 168 })}</div>; }
  const hc = avC('hc', L.hc), hd = avShade(hc, .78), hl = avShade(hc, 1.15), sk = avC('sk', L.sk), sd = avShade(sk, .88), ec = avC('ec', L.ec), oc = avC('oc', L.oc), od = avShade(oc, .8), f = L.g === 1;
  const sh = f ? 96 : 112; // 어깨 반폭
  const back = [null,
    <path key="b" d="M108 190 Q100 300 128 330 L232 330 Q260 300 252 190 Z" fill={hd} />,
    <path key="b" d="M104 190 Q84 380 120 460 L240 460 Q276 380 256 190 Z" fill={hd} />,
    <g key="b"><path d="M248 150 Q320 190 300 330 Q292 380 270 400 Q286 320 250 230 Z" fill={hd} /></g>,
    <g key="b"><path d="M110 170 Q50 230 64 360 Q70 400 90 410 Q84 320 118 240 Z" fill={hd} /><path d="M250 170 Q310 230 296 360 Q290 400 270 410 Q276 320 242 240 Z" fill={hd} /></g>][L.hb] || null;
  const front = [
    <path key="f" d="M110 175 Q112 100 180 96 Q248 100 250 175 Q236 150 230 178 L200 160 L180 182 L160 160 L130 178 Q124 150 110 175 Z" fill={hc} />,
    <path key="f" d="M108 190 Q104 104 180 96 Q256 100 252 180 Q230 140 196 136 Q150 140 132 196 Q122 170 108 190 Z" fill={hc} />,
    <path key="f" d="M108 192 Q104 102 180 96 Q256 102 252 192 Q240 140 186 128 L180 150 L174 128 Q120 140 108 192 Z" fill={hc} />,
    <path key="f" d="M110 170 Q114 96 180 92 Q246 96 250 170 Q236 120 180 116 Q124 120 110 170 Z" fill={hc} />,
    <path key="f" d="M106 190 L118 120 Q150 88 196 96 Q246 104 254 176 L240 160 L236 186 L216 150 L200 180 L184 146 L166 182 L150 150 L134 188 L124 160 Z" fill={hc} />][L.hf] || null;
  const ey = 222, eye = (x, k) => { const e = L.eye;
    if (e === 3) return <path key={k} d={`M${x - 14} ${ey} Q${x} ${ey - 6} ${x + 14} ${ey}`} stroke="#2a2230" strokeWidth="3.5" fill="none" />;
    const tilt = e === 1 ? -5 : e === 2 ? 5 : 0, mir = x > 180 ? -1 : 1;
    return <g key={k}><ellipse cx={x} cy={ey + 2} rx="11" ry={e === 0 ? 14 : 12} fill="#fff" /><ellipse cx={x} cy={ey + 4} rx="8" ry={e === 0 ? 11 : 9} fill={ec} /><circle cx={x + 3} cy={ey} r="2.6" fill="#fff" />
      <path d={`M${x - 15} ${ey - 9 - tilt * mir} Q${x} ${ey - 16} ${x + 15} ${ey - 9 + tilt * mir}`} stroke="#2a2230" strokeWidth="4" fill="none" strokeLinecap="round" /></g>; };
  const outfit = [
    <g key="o"><path d={`M${180 - sh} 540 Q${180 - sh} 380 150 352 L210 352 Q${180 + sh} 380 ${180 + sh} 540 Z`} fill={oc} /><path d="M150 352 L180 392 L210 352 L196 346 L180 368 L164 346 Z" fill="#f4f2ee" /></g>,
    <g key="o"><path d={`M${180 - sh} 540 Q${180 - sh} 372 146 350 L214 350 Q${180 + sh} 372 ${180 + sh} 540 Z`} fill={oc} /><path d="M140 352 Q180 400 220 352 Q216 380 180 396 Q144 380 140 352 Z" fill={od} /><path d="M172 400 L172 440 M188 400 L188 440" stroke="#eee" strokeWidth="3" /></g>,
    <g key="o"><path d={`M${180 - sh} 540 Q${180 - sh} 372 150 350 L210 350 Q${180 + sh} 372 ${180 + sh} 540 Z`} fill={oc} /><path d="M150 350 L180 440 L210 350 L200 346 L180 410 L160 346 Z" fill="#33303a" /><path d="M150 350 L132 420 L176 470 Z M210 350 L228 420 L184 470 Z" fill={od} /></g>,
    <g key="o"><path d={`M${180 - sh} 540 Q${180 - sh} 376 150 352 L210 352 Q${180 + sh} 376 ${180 + sh} 540 Z`} fill={oc} /><path d="M150 352 Q180 374 210 352" stroke={od} strokeWidth="10" fill="none" /><path d="M120 460 L240 460" stroke={od} strokeWidth="4" strokeDasharray="6 6" /></g>,
    <g key="o"><path d={`M${180 - sh + 10} 540 Q${180 - sh + 6} 380 152 352 L208 352 Q${180 + sh - 6} 380 ${180 + sh - 10} 540 Z`} fill={oc} /><path d="M152 352 Q180 380 208 352" stroke="#f4f2ee" strokeWidth="6" fill="none" /><path d="M140 452 L220 452" stroke={od} strokeWidth="6" /></g>,
    <g key="o"><path d={`M${180 - sh} 540 Q${180 - sh} 372 150 350 L210 350 Q${180 + sh} 372 ${180 + sh} 540 Z`} fill={oc} /><path d="M154 350 L180 420 L206 350 Z" fill="#f4f2ee" /><path d="M176 372 L184 372 L188 430 L180 440 L172 430 Z" fill="#7a2f3a" /><path d="M154 350 L140 410 L180 470 L170 420 Z M206 350 L220 410 L180 470 L190 420 Z" fill={od} /></g>][L.of] || null;
  const acc = [null,
    <g key="a" stroke="#2a2a30" strokeWidth="3.5" fill="none"><circle cx="152" cy="226" r="19" /><circle cx="208" cy="226" r="19" /><path d="M171 224 L189 224" /></g>,
    <g key="a" stroke="#2a2a30" strokeWidth="3.5" fill="none"><rect x="132" y="212" width="40" height="28" rx="4" /><rect x="188" y="212" width="40" height="28" rx="4" /><path d="M172 224 L188 224" /></g>,
    <g key="a"><rect x="216" y="132" width="34" height="8" rx="3" fill="#e8c66a" transform="rotate(-20 233 136)" /></g>,
    <g key="a" fill="#c0303a"><path d="M226 112 L250 98 L250 126 Z M226 112 L202 98 L202 126 Z" transform="translate(16 0)" /><circle cx="242" cy="112" r="6" /></g>,
    <g key="a" fill="#e8c66a"><circle cx="113" cy="262" r="5" /><circle cx="247" cy="262" r="5" /></g>][L.ac] || null;
  return <svg viewBox="0 0 360 540" style={style} aria-hidden="true">
    {back}
    <path d="M164 300 L164 352 L196 352 L196 300 Z" fill={sd} />
    {outfit}
    <ellipse cx="114" cy="234" rx="10" ry="16" fill={sk} /><ellipse cx="246" cy="234" rx="10" ry="16" fill={sk} />
    <path d="M114 190 Q114 300 180 320 Q246 300 246 190 Q246 120 180 116 Q114 120 114 190 Z" fill={sk} />
    {eye(152, 'l')}{eye(208, 'r')}
    <path d="M172 276 Q180 282 188 276" stroke="#a0505a" strokeWidth="3" fill="none" strokeLinecap="round" />
    <ellipse cx="140" cy="258" rx="10" ry="5" fill="#f2a8a0" opacity=".5" /><ellipse cx="220" cy="258" rx="10" ry="5" fill="#f2a8a0" opacity=".5" />
    {front}<path d="M150 110 Q180 100 214 112" stroke={hl} strokeWidth="5" fill="none" opacity=".6" />
    {acc}
  </svg>;
}
function trCharSprite(c, animRef, movedRef, sel, bad, look) {
  const now = Date.now(), A = animRef.current;
  const a = A[c.id] || (A[c.id] = { x: c.x, y: c.y, dir: 'down', step: 0, at: -1e9 });
  if (a.x !== c.x || a.y !== c.y) {
    const dx = c.x - a.x, dy = c.y - a.y;
    a.dir = Math.abs(dx) >= Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
    a.step++; a.at = now; a.x = c.x; a.y = c.y;
  }
  const el = now - a.at, walking = el < TR_STEP_MS;
  if (el < TR_STEP_MS + TR_FRAME_MS) movedRef.current = true;
  const sp = TR_A.sprites, row = sp ? sp.ids.indexOf(c.id) : -1;
  const df = c.n ? trNpc(c.id) : { name: '나', color: '#f6dfab', symbol: '나' };
  const pos = { transform: `translate(${c.x * TR_CELL}px,${c.y * TR_CELL}px)` };
  const tag = c.n ? <div className="tr-tag" style={{ borderColor: df.color }}>{df.name}{c.n.mode === 'accompany' ? ' ★' : ''}</div> : null;
  if (c.n) { const raw = trNpcRaw(c.id); look = raw && raw.look && !(sp && row >= 0 && !bad[trUrl(sp.src)]) ? raw.look : null; } // 보행 도트 시트에 없는 인물만 조립 도트(체크인 부품)로
  if ((c.id === 'player' || (c.n && trNpcRaw(c.id) && trNpcRaw(c.id).look)) && look && TR_A.avatar) { const ac = TR_A.avatar.dirs[a.dir] || TR_A.avatar.dirs.down; let k = ac.idle;
    if (walking) { const per = Math.max(1, Math.ceil(ac.walk.length / 2)); k = ac.walk[((a.step - 1) * per + Math.min(per - 1, Math.floor(el / (TR_STEP_MS / per)))) % ac.walk.length]; }
    return <div key={c.id} className="tr-ch" style={pos}><div className={'tr-shadow' + (sel ? ' sel' : '')} />{trAvatarPx(look, k, { left: (TR_CELL - TR_A.avatar.cw) / 2, bottom: 2 })}{tag}</div>; }
  if (!sp || row < 0 || bad[trUrl(sp.src)]) return <div key={c.id} className="tr-ch" style={pos}>
    <div className="tr-tok" style={{ background: df.color, outline: sel ? '2px dashed #f0d29a' : 'none' }}>{df.symbol}</div>{tag}</div>;
  const dirs = sp.dirs || {}, flip = a.dir === 'right' && !dirs.right, set = dirs[flip ? 'left' : a.dir] || dirs.down || { idle: 0, walk: [] };
  let col = set.idle;
  if (walking && set.walk && set.walk.length) {
    // 한 칸 이동 동안 걷기 그림을 (장수/2)장씩 넘긴다 → 두 칸에 한 주기.
    const per = Math.max(1, Math.ceil(set.walk.length / 2));
    col = set.walk[((a.step - 1) * per + Math.min(per - 1, Math.floor(el / (TR_STEP_MS / per)))) % set.walk.length];
  }
  return <div key={c.id} className="tr-ch" style={pos}>
    <div className={'tr-shadow' + (sel ? ' sel' : '')} />
    <div className="tr-px" style={{ position: 'absolute', left: (TR_CELL - sp.cw) / 2, bottom: 2, width: sp.cw, height: sp.ch, backgroundImage: `url(${trUrl(sp.src)})`, backgroundSize: `${sp.w}px ${sp.h}px`, backgroundPosition: `${-col * sp.cw}px ${-row * sp.ch}px`, transform: flip ? 'scaleX(-1)' : 'none' }} />
    {tag}</div>;
}

// ---------- 관계 ----------
const TR_REL = (TN_WORLD.rel || {}).scales || [];
const trRelHidden = st => !!(st && st.flags && st.flags[TN_WORLD.realityFlag || 'true_route']); // 진엔딩 루트에서는 관계를 보여 주지 않는다
const trRelName = id => (TR_REL.find(x => x.id === id) || { name: id }).name;
// '신뢰 보통 · 애정 호감' (그 인물에게 있는 척도만)
function trRelLine(st, id) {
  return TR_REL.map(sc => { const lv = trNPC.relLevel(TN_WORLD, st, id, sc.id); return lv ? sc.name + ' ' + sc.levels[lv - 1] : ''; }).filter(Boolean).join(' · ');
}
// 시험용 표시: 단계 칸
function trRelBars(st, id, onRel) {
  if (!onRel && trRelHidden(st)) return null;
  return TR_REL.map(sc => { const lv = trNPC.relLevel(TN_WORLD, st, id, sc.id); if (!lv) return null;
    return <div key={sc.id} className="tr-relrow"><span>{sc.name}</span><span className="tr-relpips">{sc.levels.map((_, i) => <i key={i} className={i < lv ? 'on ' + sc.id : ''} />)}</span><em>{sc.levels[lv - 1]}</em>
      {onRel ? <><button onClick={() => onRel(id, sc.id, -10)}>－</button><button onClick={() => onRel(id, sc.id, 10)}>＋</button></> : null}</div>; });
}
// 디버그: 대화 화면에서 돈 들이지 않고 확인하는 고정 대사(관계 반영 인사 + 표정·움직임·글자 연출)
function trDebugTalk(st, id) {
  const D = TN_WORLD.debugTalk || {}, name = trNpc(id).name, mk = (x, extra) => ({ speaker: name, expression: x.face || '', pose: x.pose || '', fx: x.fx || '', text: x.text, narration: false, ...extra });
  const g = D.greet ? (D.greet.alt || []).find(a => trCond(st, a.if, id)) || D.greet : null;
  const rel = trRelLine(st, id);
  return [g ? { label: '관계 인사', lines: [{ speaker: '', expression: '', fx: '', text: '(시험) ' + name + ' → 나: ' + (rel || '관계 없음'), narration: true }, mk(g)] } : null,
    ...(D.tests || []).map(t => ({ label: t.label, lines: [mk(t)] }))].filter(Boolean);
}
// 비켜 달라는 대사: 인물 데이터 block[부탁 차례] (없으면 공통 한 줄). 관계에 따라 alt.
function trBlockLines(st, b) {
  const spec = trNpcRaw(b.npc) || {}, name = trNpc(b.npc).name, set = spec.block || [[{ text: '저기, 거기 잠깐만 비켜 주시겠어요?', face: '곤란' }]];
  return set[Math.min(b.n, set.length) - 1].map(x => { const L = trLineOf(st, { who: b.npc, ...x }); return { speaker: name, expression: L.face || '', pose: L.pose || '', fx: L.fx || '', text: L.text, narration: false }; });
}
// 진행자·나의 실루엣(얼굴 그림 없이)
function trHostSil() {
  return <svg className="tr-host-sil" viewBox="0 0 160 260" aria-hidden="true"><defs><linearGradient id="trhs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1d1830" /><stop offset="1" stopColor="#07060c" /></linearGradient></defs>
    <path d="M80 18c22 0 36 17 36 40s-14 44-36 44-36-21-36-44 14-40 36-40z M32 122c12-10 30-14 48-14s36 4 48 14c14 12 22 40 24 138H8c2-98 10-126 24-138z" fill="url(#trhs)" stroke="#e9c98c" strokeOpacity=".55" strokeWidth="1.5" />
    <path d="M66 122l14 10 14-10-4 18-10-6-10 6z" fill="#e9c98c" opacity=".7" /></svg>;
}
function trMeSil() {
  return <svg className="tr-me-sil" viewBox="0 0 160 260" aria-hidden="true"><path d="M80 30c20 0 33 15 33 36s-13 40-33 40-33-19-33-40 13-36 33-36z M30 126c13-9 31-13 50-13s37 4 50 13c14 11 20 40 22 134H8c2-94 8-123 22-134z" fill="#0d1726" stroke="#8fc3ff" strokeOpacity=".7" strokeWidth="1.5" /></svg>;
}

// ---------- 재판 대본 도우미 ----------
// 재판 진행자: 이름은 세계 데이터(host.name)에서만. 정체를 드러내는 이름은 화면에 쓰지 않는다.
const TR_HOST = TN_WORLD.host || { name: '진행자' };
const trIdByName = name => name === TR_HOST.name ? 'host' : name === '나' ? 'me' : ((TN_WORLD.npcs.find(n => trNameIs(n, name)) || {}).id || '');
// 조건: talked·seen(인물 id), fact, scene, item, flag, rel. not:{…}은 반대. 여러 키는 모두 만족해야 함
// rel: {who?: 인물 id(없으면 그 줄의 화자), trust: [최소, 최대] 단계 또는 최소 단계 숫자, affection: …}
function trCond(st, c, who) {
  if (!c) return true; const p = st.player;
  if (c.not) return !trCond(st, c.not, who);
  if (c.here && !trHere(st, c.here === true ? who : c.here)) return false;
  if (c.allHere && !st.npcs.every(n => trHere(st, n.id))) return false;
  if (c.hold) { const T = st.trial, TR = T && TN_WORLD.trials[T.i], k = TR ? (TR.issues || []).findIndex(x => x.id === c.hold) : -1; if (k < 0 || !((T.hold || 0) & (1 << k))) return false; }
  if (c.rel) { const id = c.rel.who || who; for (const sc in c.rel) { if (sc === 'who') continue; const lv = trNPC.relLevel(TN_WORLD, st, id, sc), r = c.rel[sc], [a, b] = Array.isArray(r) ? r : [r, 99]; if (!lv || lv < a || lv > b) return false; } }
  if (c.talked && (p.talked || {})[c.talked] === undefined) return false;
  if (c.seen && !(p.seen || {})[c.seen]) return false;
  if (c.fact && !(p.mem || []).some(m => m[0] === c.fact)) return false;
  if (c.scene && (p.scenes || {})[c.scene] === undefined) return false;
  if (c.item && (p.items || {})[c.item] === undefined) return false;
  if (c.flag && !st.flags[c.flag]) return false;
  return true;
}
// 그 인물이 지금 플레이어와 같은 방에 있는가(집합 장면에서 아직 안 온 사람은 말하지 않는다)
function trHere(st, id) { const n = st.npcs.find(v => v.id === id); return !!n && trNPC.areaOf(TN_WORLD, n.x, n.y) === trNPC.areaOf(TN_WORLD, st.player.x, st.player.y); }
// 실제 기록 끼워 넣기: {{fact:ID}} → 그 일이 처음 일어난 시각(누군가의 기억에 남은 가장 이른 시각)
function trFill(st, o) {
  if (!JSON.stringify(o).includes('{{')) return o;
  return JSON.parse(JSON.stringify(o).replace(/\{\{fact:(\w+)\}\}/g, (_, id) => { let t = Infinity; for (const m of [...st.npcs.flatMap(n => n.mem || []), ...(st.player.mem || [])]) if (m[0] === id) t = Math.min(t, m[2]); return t < Infinity ? trHM(t) : '??:??'; }));
}
// 대본 한 줄 → {who, face, text, fx, speed, cut}. 문자열 '이름(표정):대사' / '*서술'도 받는다. alt는 앞에서부터 조건이 맞는 첫 변형.
function trLineOf(st, x) {
  if (typeof x === 'string') { const L = trTalk.parse(x)[0] || { text: x, narration: true }; return { who: L.narration ? '' : trIdByName(L.speaker), name: L.speaker, face: L.expression, pose: L.pose || '', text: L.text }; }
  const alt = (x.alt || []).find(a => trCond(st, a.if, x.who));
  return { ...x, ...(alt || {}), alt: undefined, if: undefined };
}
// 강조 표기: [[강조]] 붉게·굵게, <<크게>> 크고 금빛, ((속삭임)) 작고 흐리게
function trSegs(t) {
  const out = []; const re = /\[\[(.+?)\]\]|<<(.+?)>>|\(\((.+?)\)\)/g; let i = 0, m;
  while ((m = re.exec(t))) { if (m.index > i) out.push({ t: t.slice(i, m.index), c: '' }); out.push({ t: m[1] || m[2] || m[3], c: m[1] ? 'em' : m[2] ? 'big' : 'wh' }); i = re.lastIndex; }
  if (i < t.length) out.push({ t: t.slice(i), c: '' }); return out;
}
function trTyped(segs, n) {
  const out = []; let left = n;
  segs.forEach((g, i) => { if (left <= 0) return; const ch = Array.from(g.t), part = ch.slice(0, left).join(''); left -= ch.length; out.push(g.c ? <span key={i} className={'trm-' + g.c}>{part}</span> : <span key={i}>{part}</span>); });
  return out;
}
// 화면이 깨지는 조각(반론·모순 연출)
const trItem = id => TN_WORLD.items.find(x => x.id === id);
// 증거 그림: 자산에 그림이 있으면 그것, 없으면 종류별 임시 아이콘
function trItemPic(it, size) {
  const u = ((TR_A.items || {})[it.id]);
  if (u) return <img src={trUrl(u)} alt="" style={{ width: size, height: size, objectFit: 'contain' }} />;
  const btn = /단추|버튼/.test(it.name);
  return <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">{btn ? <><circle cx="20" cy="20" r="12" fill="#c9b48a" stroke="#6b5530" strokeWidth="1.5" />{[[16, 16], [24, 16], [16, 24], [24, 24]].map(([x, y]) => <circle key={x + '' + y} cx={x} cy={y} r="1.8" fill="#6b5530" />)}</>
    : <><path d="M10 5 H26 L32 11 V35 H10 Z" fill="#f3ead6" stroke="#8a7550" strokeWidth="1.2" /><path d="M26 5 V11 H32" fill="#d9ccb0" stroke="#8a7550" strokeWidth="1" />{[15, 19, 23, 27].map(y => <path key={y} d={`M14 ${y} H${y === 27 ? 22 : 28}`} stroke="#9a8a6a" strokeWidth="1.2" />)}</>}</svg>;
}
// 논스톱에서 빗나갔을 때: 맞힌 줄의 인물 한마디(관계 단계 1~5에 따라) + 주인공 혼잣말. ph.miss[who] / ph.mono 로 덮어쓸 수 있다.
const TR_MISS = [
  { if: { rel: { trust: [4, 5] } }, text: '음…… 그건 좀 아닌 것 같아요. 제 말을 한 번만 더 들어 봐 주실래요?', face: '' },
  { if: { rel: { trust: [1, 2] } }, text: '하, 엉뚱한 데를 찌르시네. 똑바로 좀 들어요.', face: '불만' },
  { text: '에? 그게 지금 이 얘기랑 무슨 상관인데요?', face: '놀람' }];
const TR_MONO = ['……아니야, 그게 아니야. 다시 생각해 보자.', '엉뚱한 곳을 찔렀다. 증언 어딘가에 진짜 모순이 숨어 있을 거야…….', '침착하자. 누가 무슨 말을 했는지, 처음부터 다시 듣자.'];
function trMissLine(st, ph, who) {
  const own = (ph.miss || {})[who];
  if (own) return trLineOf(st, { who, ...own });
  const m = TR_MISS.find(a => trCond(st, a.if, who)) || TR_MISS[TR_MISS.length - 1]; return { who, text: m.text, face: m.face };
}
// 논스톱 증언: {구절}이 약점(쏠 수 있는 말). 괄호는 화면에 보이지 않는다.
function trNsParse(text) {
  const out = []; let seg = 0; String(text).split(/(\{[^}]*\})/).forEach(t => { if (!t) return; if (t[0] === '{') out.push({ t: t.slice(1, -1), s: seg++ }); else out.push({ t, s: -1 }); });
  return out;
}
function trShards() {
  const pieces = [[0, 0, 50, 0, 35, 45], [50, 0, 100, 0, 70, 40], [100, 0, 100, 50, 70, 40], [0, 0, 35, 45, 0, 60], [35, 45, 70, 40, 55, 75], [70, 40, 100, 50, 100, 100], [0, 60, 35, 45, 55, 75], [0, 60, 55, 75, 0, 100], [55, 75, 100, 100, 0, 100], [70, 40, 55, 75, 100, 100]];
  return <div className="tr-shards">{pieces.map((q, i) => <i key={i} style={{ clipPath: `polygon(${q[0]}% ${q[1]}%,${q[2]}% ${q[3]}%,${q[4]}% ${q[5]}%)`, animationDelay: (i % 4) * 0.04 + 's', '--dx': ((q[0] + q[2] + q[4]) / 3 - 50) * 0.6 + 'px', '--dy': ((q[1] + q[3] + q[5]) / 3 - 50) * 0.6 + 'px' }} />)}
    <svg viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points="35,45 70,40 55,75 35,45 0,60 M70,40 100,50" fill="none" stroke="#fff" strokeWidth=".6" /><polyline points="35,45 50,0 M70,40 100,0 M55,75 100,100 M55,75 0,100" fill="none" stroke="#fff" strokeWidth=".6" /></svg></div>;
}

// 인물 레이어: 자세 그림(평상시 얼굴 포함) 위에 표정 조각, 그 위에 '맨 위 조각'(턱 앞 손 등)을 같은 비율 좌표로 겹친다.
// 인물마다 fit = {s: 배율, dy: 위아래 보정(px)} 으로 키·머리 크기를 맞춘다. 그림이 없으면 임시 실루엣.
const TR_ED = 66, TR_EYE_Y = 134;
// 동선 재현용 최단 걸음 수: 점들을 차례로 지나 마지막 점(또는 그 옆 칸)까지
function trShortest(pts, end) {
  const W = TN_WORLD, bfs = (a, goal) => { const seen = new Set([a + '']), q = [[a, 0]];
    while (q.length) { const [[x, y], d] = q.shift(); if (goal(x, y)) return d;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy, k = nx + ',' + ny; if (!seen.has(k) && trNPC.walkable(W, nx, ny)) { seen.add(k); q.push([[nx, ny], d + 1]); } } } return 999; };
  let n = 0; for (let i = 1; i < pts.length; i++) n += bfs(pts[i - 1], (x, y) => x === pts[i][0] && y === pts[i][1]);
  return n + bfs(pts[pts.length - 1], (x, y) => Math.abs(x - end[0]) + Math.abs(y - end[1]) <= 1);
}
// 작은 자리(꿈 조각 등)용 인물 그림: 예전 한 장 그림(src) 또는 기본 자세 그림, 없으면 머리색 점
function trThumb(id) {
  const c = (TR_A.chars || {})[id], n = trNpc(id);
  if (c && c.src) return { src: c.src };
  const P = c && c.poses && c.poses.default;
  if (!P || !P.src) return { hair: n.hair || n.color || '#999' };
  const k = P.ed ? 24 / P.ed : 150 / P.w; // 눈 사이 24px 로 맞춘다
  return { src: P.src, crop: { width: P.w * k, maxWidth: 'none', marginLeft: P.eye ? 75 - P.eye[0] * k : 75 - P.w * k / 2, marginBottom: P.eye ? 300 - (P.h - P.eye[1]) * k - 14 : 0 } };
}
function trActor(id, expr, pose, onBad, bad) {
  const c = (TR_A.chars || {})[id], pick = trPick(c, expr, pose), P = pick.P;
  if (!P || !P.src || bad[trUrl(P.src)]) return trActorStub(id, pick.face, pose || TR_AUTO_POSE[pick.face] || 'default');
  // 자세마다 그림의 구도가 달라도 기본 자세의 두 눈 위치·눈 사이 거리에 맞춰 머리 크기와 자리를 고정한다.
  // 인물마다 머리 크기를 맞춘다: 기본 자세의 눈 사이를 TR_ED px, 눈높이를 TR_EYE_Y px 로(fit.s·fit.dy 로 미세 조정).
  const fit = (c && c.fit) || {}, R = (c.poses || {}).default || P, auto = R.eye && R.ed;
  const u0 = auto ? TR_ED / R.ed * (fit.s || 1) : 528 * (fit.s || 1) / R.h;
  const top0 = auto ? TR_EYE_Y + (fit.dy || 0) - R.eye[1] * u0 : 528 + (fit.dy || 0) - R.h * u0, left0 = auto ? TR_W / 2 - R.eye[0] * u0 : (TR_W - R.w * u0) / 2;
  const ok = P !== R && P.eye && P.ed && R.eye && R.ed, u = ok ? u0 * R.ed / P.ed : u0;
  const left = ok ? left0 + R.eye[0] * u0 - P.eye[0] * u : left0, top = ok ? top0 + R.eye[1] * u0 - P.eye[1] * u : top0, W = P.w * u, H = P.h * u;
  const f = pick.face !== (P.def || '기본') && (P.faces || {})[pick.face];
  const pct = (a, b) => (a / b * 100) + '%', layer = (L, k) => L && !bad[trUrl(L.src)] ? <img key={k} src={trUrl(L.src)} alt="" onError={() => onBad(trUrl(L.src))} style={{ position: 'absolute', left: pct(L.x, P.w), top: pct(L.y, P.h), width: pct(L.w, P.w), height: pct(L.h, P.h) }} /> : null;
  // 하라구로: 그림에는 그림자를 넣지 않고, 눈 위쪽에 어두운 그늘을 인물 윤곽 안에만 덮는다.
  const E = P.eye, D = P.ed || P.w * .12, shade = pick.face === '하라구로' && E ? <div className="tr-shade" style={{ WebkitMaskImage: `url(${trUrl(P.src)})`, maskImage: `url(${trUrl(P.src)})`,
    background: `radial-gradient(ellipse ${D * 1.7 / P.w * 100}% ${D * 1.05 / P.h * 100}% at ${E[0] / P.w * 100}% ${(E[1] - D * .42) / P.h * 100}%, rgba(28,8,44,.62), rgba(28,8,44,.42) 55%, rgba(28,8,44,0) 100%)` }} /> : null;
  return <div style={{ position: 'absolute', left, top, width: W, height: H }}>
    <img src={trUrl(P.src)} alt="" onError={() => onBad(trUrl(P.src))} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
    {layer(f, 'f')}{layer(P.over, 'o')}{shade}
  </div>;
}
// 임시 실루엣: 머리색·옷색과 자세(팔 모양), 표정(눈·입)을 대충 그려 그림 없이도 연출을 확인한다.
function trActorStub(id, face, pose) {
  const n = trNpc(id), hair = n.hair || n.color || '#999', cloth = n.cloth || '#3a3346', skin = '#f3dccb';
  const eye = { 놀람: 'o', 패닉: 'o', 부끄러움: '^', 웃음: '^', 미소: '^', 슬픔: 'v', 의심: '-', 하라구로: '-', 격노: '>', 불만: '-', 곤란: 'v', 기본: '.' }[face] || '.';
  const mouth = { 웃음: 'M162 214 Q180 232 198 214', 미소: 'M168 216 Q180 224 192 216', 놀람: 'M176 216 a4 6 0 1 0 8 0 a4 6 0 1 0 -8 0', 패닉: 'M170 214 Q180 206 190 214 Q180 226 170 214', 슬픔: 'M168 222 Q180 214 192 222', 격노: 'M166 218 L194 218', 불만: 'M168 220 Q180 216 192 220', 곤란: 'M168 218 Q174 214 180 218 Q186 222 192 218', 하라구로: 'M162 212 Q182 230 200 208', 의심: 'M170 218 L190 216', 부끄러움: 'M172 218 Q180 222 188 218', 기본: 'M172 218 L188 218' }[face];
  const E = (x) => eye === 'o' ? <circle cx={x} cy="186" r="7" fill="#fff" stroke="#222" strokeWidth="2" /> : eye === '^' ? <path d={`M${x - 8} 190 Q${x} 180 ${x + 8} 190`} stroke="#222" strokeWidth="3" fill="none" /> : eye === 'v' ? <path d={`M${x - 8} 182 Q${x} 192 ${x + 8} 186`} stroke="#222" strokeWidth="3" fill="none" /> : eye === '>' ? <path d={`M${x - 9} 180 L${x + 9} 188`} stroke="#222" strokeWidth="4" /> : eye === '-' ? <path d={`M${x - 8} 186 L${x + 8} 186`} stroke="#222" strokeWidth="4" /> : <ellipse cx={x} cy="186" rx="5" ry="7" fill="#222" />;
  const arms = { default: <><path d="M110 300 Q90 400 104 470" stroke={cloth} strokeWidth="30" fill="none" strokeLinecap="round" /><path d="M250 300 Q270 400 256 470" stroke={cloth} strokeWidth="30" fill="none" strokeLinecap="round" /></>,
    think: <><path d="M110 300 Q90 400 104 470" stroke={cloth} strokeWidth="30" fill="none" strokeLinecap="round" /><path d="M250 300 Q262 330 214 250" stroke={cloth} strokeWidth="30" fill="none" strokeLinecap="round" /><circle cx="204" cy="238" r="16" fill={skin} /></>,
    point: <><path d="M110 300 Q90 400 104 470" stroke={cloth} strokeWidth="30" fill="none" strokeLinecap="round" /><path d="M250 300 Q300 300 330 262" stroke={cloth} strokeWidth="30" fill="none" strokeLinecap="round" /><circle cx="336" cy="254" r="14" fill={skin} /></>,
    crossed: <path d="M112 330 Q180 380 248 330 M112 360 Q180 320 248 362" stroke={cloth} strokeWidth="30" fill="none" strokeLinecap="round" /> }[pose] || null;
  return <svg viewBox="0 0 360 528" width={TR_W} height="528" style={{ position: 'absolute', bottom: 0, left: 0 }} aria-hidden="true">
    <path d="M60 528 Q70 300 180 270 Q290 300 300 528 Z" fill={cloth} /><rect x="166" y="236" width="28" height="40" fill={skin} />
    <ellipse cx="180" cy="190" rx="62" ry="72" fill={skin} /><path d="M112 200 Q104 100 180 104 Q256 100 248 200 Q238 140 180 142 Q122 140 112 200 Z" fill={hair} />
    {E(158)}{E(202)}<path d={mouth} stroke="#7a2e2e" strokeWidth="3" fill={face === '놀람' || face === '패닉' ? '#7a2e2e' : 'none'} />
    {face === '부끄러움' ? <><ellipse cx="146" cy="206" rx="12" ry="6" fill="#f08a8a" opacity=".6" /><ellipse cx="214" cy="206" rx="12" ry="6" fill="#f08a8a" opacity=".6" /></> : null}
    {face === '하라구로' ? <rect x="112" y="118" width="136" height="60" fill="#000" opacity=".28" /> : null}
    {arms}<text x="180" y="512" textAnchor="middle" fontSize="15" fill="#fff" opacity=".75">{n.name} · {face} · {TR_POSE_NAME[pose] || pose}</text>
  </svg>;
}

// AI 출력: <Troemerei s='상태코드' d='이름:대사|*서술' />  (자유 행동 P에만 t='초', 사건 코드는 e='…', 대화 상대의 마음 변화는 r='t+1')
function Troemerei({ s = '', t = '', d = '', e = '', k = '', f = '', r = '' }) {
  const parsed = useMemo(() => trTalk.parse(d), [d]), lines = useMemo(() => trTalk.paginate(parsed), [parsed]);
  const free = !!String(f).trim();
  const [boot] = useState(() => {
    // 화면 밖 대화 응답(f)인데 상태 코드가 없으면 새 세계로 시작하지 않고 복원 화면을 띄운다.
    if (!s) return free ? { base: null, error: '화면 밖 대화의 응답에 상태 코드가 없습니다', ev: null } : { base: trNPC.createWorld(TN_WORLD), error: '', ev: null };
    try {
      let base = trCodec.unpack(TN_WORLD, s), ev = null, heard = null;
      // 화면 밖(UUMMAI 입력창) 대화의 응답: 시간·사건을 바꾸지 않고 마지막 전송 시점에서 이어진다.
      if (free) return { base: { ...trNPC.clone(base), pend: null, pk: '', pc: 0 }, error: '', ev: null, heard: null };
      // 사건 코드·증언은 화면이 조건을 검사한 뒤에만 상태에 반영한다(대화 시간 반영 전에 검사).
      if (e) { const r = trNPC.applyEvent(TN_WORLD, base, e); base = r.state; ev = { code: String(e), accepted: r.accepted, reason: r.reason }; }
      // 마음 변화(r): 대화(T·I)·반론(R) 상대에게만, 척도마다 ±1단계까지
      let rc = null; if (r && base.pend && ['T', 'I', 'R'].includes(base.pk)) { const x = trNPC.applyRel(TN_WORLD, base, base.pend, r); base = x.state; if (Object.keys(x.changed).length) rc = { id: base.pend, changed: x.changed }; }
      // 재판 반론(R)의 응답: 사건 코드가 인정되면 다음 단계(applyEvent가 처리), 아니면 재판 체력 -1. 재판 중에는 시간이 흐르지 않는다.
      if (base.pk === 'R') {
        let tres = 'ok';
        if (!(ev && ev.accepted)) { const h = trNPC.trialHit(TN_WORLD, base); base = h.state; tres = h.result; }
        return { base: trNPC.applyTalk(TN_WORLD, base, 0), error: '', ev, heard, rmode: true, tres, rc };
      }
      return { base, error: '', ev, heard, rc };
    } catch (err) { return { base: null, error: err.message, ev: null, heard: null }; }
  });
  const replySec = b => (b && b.pk === 'P' && String(t).trim() !== '') ? Math.max(0, Math.min(900, Math.floor(Number(t) || 0))) : trNPC.talkSeconds(b ? b.pc : 0, trChars(lines));
  const pendNpc = boot.base && boot.base.pend;
  const stRef = useRef(null), trLock = useRef('');
  const [state, setState] = useState(() => !boot.base ? null : boot.rmode ? boot.base : (s && !lines.length) ? trNPC.applyTalk(TN_WORLD, boot.base, replySec(boot.base)) : boot.base);
  const [talk, setTalk] = useState(() => boot.base && lines.length && !boot.rmode ? { npc: free ? null : pendNpc || null, idx: 0, shown: 0, cut: false, fresh: false } : null);
  // 받은 응답의 대화 시간을 이미 반영했는지(대사가 있으면 다 읽거나 끊을 때 반영).
  const [consumed, setConsumed] = useState(() => !lines.length || free || !!boot.rmode);
  // 재판 화면 상태(화면 안에서만 쓰는 값)
  const [tv, setTv] = useState(() => ({ reply: !!boot.rmode && lines.length > 0, idx: 0, shown: 0, stmt: 0, drawer: false, vote: '', ev: '', fx: boot.rmode && !lines.length ? boot.tres : '', voted: false, g: {} }));
  const [trText, setTrText] = useState('');
  // 재판 대사 타자 효과(대사별 속도)
  const typeRef = useRef(null);
  // 반론: 상대 주장이 흐르다(0) → 끊고 들어가는 컷인(1) → 반론 입력(2)
  useEffect(() => { const R = rbRef.current; if (!R) return; const id = setTimeout(() => setTv(v => { const g = v.g || {};
    if ((g.rb || 0) === 0) { const rs = (g.rs || 0) + 1; return { ...v, g: { ...g, rs, rb: rs > R.cut ? 1 : 0 } }; } return g.rb === 1 ? { ...v, g: { ...g, rb: 2 } } : v; }), R.rb === 1 ? 1150 : R.ms); return () => clearTimeout(id); });
  // 논스톱 증언: 한 글자씩 천천히 → 잠시 머문 뒤 다음 사람 → 끝나면 처음부터(멈춤·발사 중엔 정지)
  useEffect(() => { const N = nsRef.current; if (!N) return; const id = setTimeout(() => setTv(v => { const g = v.g || {}, li = g.li || 0, sh = (g.sh || 0) + 1;
    return { ...v, g: sh > N.lens[li] + N.hold ? { ...g, li: (li + 1) % N.lens.length, sh: 0 } : { ...g, sh } }; }), N.ms); return () => clearTimeout(id); });
  useEffect(() => { const L = typeRef.current; if (!L || tv.shown >= L.len) return; const id = setTimeout(() => setTv(v => ({ ...v, shown: v.shown + 1 })), L.ms); return () => clearTimeout(id); });
  const [menu, setMenu] = useState(null);
  const [preview, setPreview] = useState(null);
  const [sheet, setSheet] = useState('');
  // 체크인(외형 고르기): 새 게임 첫 화면, 또는 설정에서 다시 열기. AI 호출 없음.
  const [ck, setCk] = useState(null), [ckTick, setCkTick] = useState(0);
  const ckShow = !!(state && !state.trial && (ck || (!state.player.look && !state.revision)));
  useEffect(() => { if (!ckShow) return; const h = setInterval(() => setCkTick(v => v + 1), 140); return () => clearInterval(h); }, [ckShow]);
  const [drop, setDrop] = useState(false);
  const [text, setText] = useState('');
  const [pres, setPres] = useState(''); // 대화 중 제시할 증거(소지품 id)
  const [codeText, setCodeText] = useState('');
  const [toast, setToast] = useState(() => {
    if (!boot.base) return '';
    if (free) return '화면 밖 대화 · ' + trHM(boot.base.clock) + ' 시점에서 이어집니다';
    if (boot.ev && boot.ev.accepted) return (boot.base.logs.slice(-1)[0] || {}).text || '';
    if (boot.rc && !trRelHidden(boot.base)) return trNpc(boot.rc.id).name + ' · ' + Object.entries(boot.rc.changed).map(([sc, d2]) => trRelName(sc) + (d2 > 0 ? ' ▲' : ' ▼')).join(' ');
    return s && !lines.length && boot.base.pk ? '응답을 반영했습니다' : '';
  });
  const [manual, setManual] = useState('');
  const [debug, setDebug] = useState(false);
  const [sent, setSent] = useState('');
  const [scale, setScale] = useState(1);
  const [gal, setGal] = useState(null); // 디버그: 표정·자세 갤러리
  const [badImg, setBadImg] = useState({}); // 불러오지 못한 그림은 임시 그림으로 대체
  const rbRef = useRef(null);
  const nsBox = useRef(null), nsGun = useRef(null), nsRef = useRef(null);
  const outRef = useRef(null), padRef = useRef(null), svgRef = useRef(null), farRef = useRef([0, 0]), heardRef = useRef(null);
  // 걷기 연출: 인물별 직전 칸·방향·걸음 수. 칸이 바뀌면 그쪽을 보고 한 걸음 걷는다(우는 좌 그림을 뒤집음).
  const animRef = useRef({}), movedRef = useRef(false), roomRef = useRef(-1);
  const [wokeBy, setWokeBy] = useState(''), [pick, setPick] = useState(null), [found, setFound] = useState(null), [restH, setRestH] = useState(-1), [restM, setRestM] = useState(0);
  const [, setTick] = useState(0);
  // 걷는 인물이 있으면 걷기 칸이 넘어가도록 짧게 다시 그린다(걸음이 끝나면 멈춤).
  // 비켜 달라는 말(엔진 state.block): AI 없이 그 인물의 대본 대사를 재판 대화처럼 흘려 보여 주고, 끝나면 맵으로 돌아온다.
  const blockSeen = useRef('');
  useEffect(() => { const b = state && state.block; if (!b || state.trial) return; const key = b.npc + '@' + b.at; if (blockSeen.current === key) return; blockSeen.current = key;
    setTalk({ npc: b.npc, local: trTalk.paginate(trBlockLines(state, b)), idx: 0, shown: 0, fresh: false, done: false, block: trNpc(b.npc).name + ' · ' + b.reason }); setSheet(''); setMenu(null);
  }, [state && state.block ? state.block.npc + '@' + state.block.at : '']);
  useEffect(() => { if (!movedRef.current) return; movedRef.current = false; const id = setTimeout(() => setTick(v => v + 1), TR_FRAME_MS); return () => clearTimeout(id); });

  useEffect(() => {
    // 높이 기준은 화면(screen) 크기로 잡는다. UUMMAI는 컴포넌트를 내용 높이에 맞춘 iframe에 넣으므로
    // innerHeight를 쓰면 '작아짐→iframe 작아짐→더 작아짐' 순환이 생긴다(v0.4 PC·모바일 축소 원인).
    let lastW = -1;
    const fit = () => { const el = outRef.current; if (!el) return; const w = el.getBoundingClientRect().width || TR_W; if (Math.abs(w - lastW) < 1) return; lastW = w;
      const sh = (typeof screen !== 'undefined' && screen.availHeight) || 0; const h = sh > 300 ? sh - 200 : 99999;
      setScale(Math.max(0.6, Math.min(1.6, w / TR_W, h / TR_H))); };
    fit();
    if (typeof ResizeObserver === 'function' && outRef.current) { const ro = new ResizeObserver(fit); ro.observe(outRef.current); return () => ro.disconnect(); }
    if (typeof window !== 'undefined') { window.addEventListener('resize', fit); return () => window.removeEventListener('resize', fit); }
  }, []);
  TR_FLAGS = (state && state.flags) || {};
  typeRef.current = null; nsRef.current = null; rbRef.current = null; // 재판 화면이 그려질 때만 다시 채운다
  const tlines = talk && talk.local ? talk.local : lines; // 디버그 시험 대사는 AI 응답과 따로(시간·기억에 반영 안 함)
  const line = talk && !talk.fresh && !talk.done ? tlines[talk.idx] : null;
  const segsL = line ? trSegs(line.text) : [], chars = Array.from(segsL.map(g => g.t).join('')); // 강조 표기를 뺀 실제 글자
  const full = !line || talk.shown >= chars.length;
  const lastLine = !!line && talk.idx === tlines.length - 1;
  const closed = !!(state && state.trial && !trNPC.inInvestigation(TN_WORLD, state)); // 조사 마감 뒤: 듣던 대화만 마저 듣는다
  const canInput = talk && !talk.block && !sent && !closed && (talk.fresh || talk.cut || (lastLine && full) || talk.done);
  // 되감아 다시 읽어도 '이미 말해진 위치'는 줄지 않는다(끼어들기 시간·cut 기준).
  if (line) { const [fi, fs] = farRef.current; if (talk.idx > fi || (talk.idx === fi && talk.shown > fs)) farRef.current = [talk.idx, talk.shown]; }
  useEffect(() => {
    if (!line || talk.cut || full) return;
    const id = setInterval(() => setTalk(v => v && ({ ...v, shown: Math.min(chars.length, v.shown + 1) })), 30);
    return () => clearInterval(id);
  }, [talk && talk.idx, talk && talk.cut, full, chars.length]);

  // 이동 중에만 시간이 흐른다. 새 인물이 시야에 들어오면 자동으로 멈춘다.
  useEffect(() => {
    if (!state || sent || talk || !state.player.route.length) return;
    const id = setTimeout(() => {
      const before = new Set(state.npcs.filter(n => trVisible(state, n)).map(n => n.id));
      let next = trNPC.advance(TN_WORLD, state, TN_WORLD.player.moveSeconds || 4);
      const fresh = next.npcs.filter(n => trVisible(next, n) && !before.has(n.id));
      if (fresh.length && next.player.route.length) { next = trNPC.dispatch(TN_WORLD, next, { type: 'CLEAR_ROUTE' }); setToast(fresh.map(n => trNpc(n.id).name).join('·') + '이(가) 보여 멈췄다'); }
      setState(next);
    }, 160);
    return () => clearTimeout(id);
  }, [state, sent, talk]);

  if (!state) return <div className="tr-out" ref={outRef} style={{ height: TR_H * scale }}><style>{TN_CSS}</style><div className="tr-card" style={{ transform: `scale(${scale})` }}>
    <div className="tr-err"><b>상태 코드를 읽을 수 없습니다</b><div className="tr-mut">{boot.error}</div>
      <div>직전 인계 메시지의 <b>s=</b> 뒤 값을 붙여넣으면 이어서 진행할 수 있습니다.</div>
      <textarea className="tr-ta" rows={4} value={codeText} onChange={e => setCodeText(e.target.value)} />
      <button style={{ height: 34 }} onClick={() => { try { const v = trCodec.unpack(TN_WORLD, codeText.trim()); setState(trNPC.applyTalk(TN_WORLD, v, 0)); } catch (e) { setToast(e.message); } }}>이 코드로 복원</button>
      <button style={{ height: 34 }} onClick={() => setState(trNPC.createWorld(TN_WORLD))}>처음부터 시작</button>
      {toast ? <div className="tr-mut">{toast}</div> : null}</div></div></div>;

  const p = state.player, area = trNPC.areaOf(TN_WORLD, p.x, p.y);
  // 방 하나 = 한 화면. 문 칸(통로)에 서 있으면 직전 방을 계속 보여 준다. 계산은 층 전체 격자 그대로.
  let room = area >= 0 ? area : roomRef.current; if (room < 0) room = 0;
  const roomChanged = roomRef.current >= 0 && roomRef.current !== room; roomRef.current = room;
  const RM = TN_WORLD.map.areas[room], rx0 = (RM.x0 - 1) * TR_CELL, ry0 = (RM.y0 - 1) * TR_CELL, rx1 = (RM.x1 + 2) * TR_CELL, ry1 = (RM.y1 + 2) * TR_CELL;
  const HUD_H = 56, fitAxis = (lo, hi, view, c, off) => hi - lo <= view ? lo - (view - (hi - lo)) / 2 - off : Math.max(lo - off, Math.min(hi - view, c - view / 2));
  const camX = fitAxis(rx0, rx1, TR_W, (p.x + .5) * TR_CELL, 0);
  const camY = fitAxis(ry0, ry1, TR_H - HUD_H, (p.y + .5) * TR_CELL + 20, HUD_H);
  const inRoom = (x, y) => x >= RM.x0 - 1 && x <= RM.x1 + 1 && y >= RM.y0 - 1 && y <= RM.y1 + 1;
  const busy = !!sent;

  function act(a) { if (busy) return; setState(v => trNPC.dispatch(TN_WORLD, v, a)); }
  function step(dx, dy) {
    setPreview(null); setMenu(null);
    setState(v => { if (v.player.route.length) return v; const a = trNPC.dispatch(TN_WORLD, v, { type: 'MOVE_ONE', dx, dy }); return a.player.route.length ? trNPC.advance(TN_WORLD, a, TN_WORLD.player.moveSeconds || 4) : a; });
  }
  function padDown(dx, dy) { if (busy) return; step(dx, dy); clearInterval(padRef.current); padRef.current = setInterval(() => step(dx, dy), 240); }
  function padUp() { clearInterval(padRef.current); padRef.current = null; }
  // 키보드 방향키 = 십자 패드(누르고 있으면 계속 걷는다). 글 입력 중에는 무시.
  const keyRef = useRef('');
  useEffect(() => {
    const K = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
    const typing = e => /INPUT|TEXTAREA|SELECT/.test((e.target && e.target.tagName) || '') || (e.target && e.target.isContentEditable);
    const down = e => { const d = K[e.key]; if (!d || typing(e)) return; e.preventDefault(); if (keyRef.current === e.key) return; keyRef.current = e.key; padDown(d[0], d[1]); };
    const up = e => { if (!K[e.key] || keyRef.current !== e.key) return; keyRef.current = ''; padUp(); };
    window.addEventListener('keydown', down); window.addEventListener('keyup', up); const bl = () => { if (keyRef.current) { keyRef.current = ''; padUp(); } }; window.addEventListener('blur', bl);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); window.removeEventListener('blur', bl); };
  });

  function tapMap(e) {
    if (busy) return;
    const r = svgRef.current.getBoundingClientRect();
    const x = Math.floor((camX + (e.clientX - r.left) * TR_W / r.width) / TR_CELL), y = Math.floor((camY + (e.clientY - r.top) * TR_H / r.height) / TR_CELL);
    // 인물 그림은 1.5칸 높이라 머리 쪽(한 칸 위)을 눌러도 그 인물로 본다.
    const who = state.npcs.find(n => n.x === x && (n.y === y || n.y === y + 1) && (debug || trVisible(state, n)));
    if (who) { setPreview(null); setMenu({ kind: 'npc', id: who.id }); return; }
    const lm = TN_WORLD.map.landmarks.find(l => (l.x === x && l.y === y || (l.hit || []).some(h => h[0] === x && h[1] === y)) && trNPC.areaOf(TN_WORLD, l.x, l.y) === room);
    if (lm) { setPreview(null); setMenu({ kind: 'lm', id: lm.id }); return; }
    setMenu(null);
    if (!trNPC.walkable(TN_WORLD, x, y)) { setPreview(null); return; }
    const ta = trNPC.areaOf(TN_WORLD, x, y);
    // 다른 방(문 너머)도 눌러서 갈 수 있다. 그 방 사람은 들어가기 전까지 보이지 않는다.
    if (preview && preview.x === x && preview.y === y) { setPreview(null); act({ type: 'MOVE_TO', x, y }); return; }
    const path = trNPC.route(TN_WORLD, state, p, { x, y }, { ignorePlayer: true });
    if (!path.length) { setPreview(null); return; }
    setPreview({ x, y, path, sec: path.length * (TN_WORLD.player.moveSeconds || 4) });
  }

  function npcContext(next, id) {
    const n = next.npcs.find(v => v.id === id), name = trNpc(id).name;
    const mem = (n.mem || []).slice(-5).map(m => trHM(m[2]) + ' ' + trMemCode(m[0], m[1]));
    const rel = trRelLine(next, id);
    return [name + ' 상태: ' + trNPC.describe(TN_WORLD, next, n), rel ? name + ' → 플레이어: ' + rel : '', mem.length ? name + ' 기억: ' + mem.join(' / ') : ''];
  }
  // 추리(A)·자유 행동(P): 지금 같은 방에서 보이는 사람과 그들이 하던 일(대상이 없으므로 현장 인물을 알려 준다)
  function presentLine(next) { const v = next.npcs.filter(n => trVisible(next, n)); return '함께 있는 사람: ' + (v.length ? v.map(n => trNpc(n.id).name + '(' + trNPC.describe(TN_WORLD, next, n) + ')').join(', ') : '없음'); }
  function meLine(next) { const L = next.player.look; return L ? '나: ' + L.name + ' (' + AV.g[L.g] + ')' : ''; }
  function evidLine(next) { const it = (TN_WORLD.items || []).filter(x => (next.player.items || {})[x.id] !== undefined); return it.length ? '내 증거: ' + it.map(x => x.name).join(', ') : ''; }
  // A·P: 현장 인물마다 관계와 최근 기억(코드). 반응할 사람이 아는 것만 넘긴다.
  function presentCtx(next) { return next.npcs.filter(n => trVisible(next, n)).flatMap(n => npcContext(next, n.id).slice(1)); }
  function settledLine(next) { const T = next.trial; if (!T) return ''; const TR = TN_WORLD.trials[T.i]; const done = (TR.issues || []).filter(x => { let last = -1; TR.phases.forEach((p, i) => { if (p.issue === x.id) last = i; }); return last >= 0 && T.phase > last; });
    return done.length ? '재판에서 확정된 것: ' + done.map(x => x.q + ' → ' + x.a).join(' / ') : ''; }
  function clueLine(next) { const c = (next.player.mem || []).slice(-6).map(m => trFact(m[0], m[1], 'player')); return c.length ? '내 단서: ' + c.join(' / ') : ''; }
  function applyReply(kind) {
    if (!lines.length || consumed) return state;
    const full = replySec(boot.base);
    const [fi, fs] = farRef.current;
    // 증언(k)은 그 줄을 실제로 끝까지 들은 경우에만 단서가 된다(끼어들어 끊으면 뒤쪽 증언은 무효).
    let base = boot.base;
    if (k) {
      const [os, oc] = trTalk.origPos(lines, fi, fs), heardAll = kind !== 'I';
      const items = trNPC.parseK(k).map(x => ({ ...x, at: x.line ? Math.min(parsed.length, x.line) - 1 : parsed.length - 1 }));
      const ok = items.filter(x => heardAll || x.at < os || (x.at === os && oc >= Array.from((parsed[os] || { text: '' }).text).length));
      const r = trNPC.hearFacts(TN_WORLD, base, ok);
      base = r.state; heardRef.current = { raw: String(k), accepted: r.accepted, rejected: [...r.rejected, ...items.filter(x => !ok.includes(x)).map(x => [x.code, '끊겨서 못 들음'])] };
    }
    return trNPC.applyTalk(TN_WORLD, base, kind === 'I' ? trTalk.partialSeconds(lines, fi, fs, boot.base.pc) : full);
  }
  function send(kind, opt) {
    const pIt = !opt && pres ? (TN_WORLD.items || []).find(x => x.id === pres) : null;
    const msg = (opt && opt.text) || text.trim() || (pIt ? '(' + pIt.name + '을(를) 내민다)' : ''); if (!msg || busy) return;
    const chars = Array.from(msg).length;
    let next = applyReply(kind), target = '', ctx = [], cut = '';
    if (kind === 'I') { const [os, oc] = trTalk.origPos(lines, farRef.current[0], farRef.current[1]); cut = `${os + 1}/${parsed.length}:${oc}`; }
    const id = (opt && opt.npc) || ((kind === 'T' || kind === 'I') && talk ? talk.npc : null);
    if (id) {
      next = trNPC.dispatch(TN_WORLD, next, { type: 'TALK_REQUEST', npcId: id, kind, chars });
      if (next.pend !== id) { setToast('지금은 말을 걸 수 없습니다'); return; }
      target = trNpc(id).name; ctx = [meLine(next), ...npcContext(next, id), opt && opt.situation, pIt ? '제시한 증거: ' + pIt.name + '(' + pIt.desc + ')' : '', clueLine(next), evidLine(next)];
      next = { ...next, pv: pIt ? pIt.id : '' };
    } else {
      next = { ...trNPC.clone(next), pk: kind === 'T' ? 'P' : kind, pc: chars, pend: null, pv: '' };
      ctx = [meLine(next), presentLine(next), ...presentCtx(next), clueLine(next), evidLine(next)];
    }
    const code = trCodec.pack(TN_WORLD, next);
    const message = trTalk.handoff({ kind: id ? kind : (kind === 'T' ? 'P' : kind), target, cut, where: trArea(next.player.x, next.player.y), time: next.day + '일 ' + trHM(next.clock), marks: trNPC.markers(TN_WORLD, next), ctx, text: msg, code });
    // 전송 함수가 없으면 보낼 문장을 직접 보여 준다. 실패하면(비동기 포함) 잠금을 풀고 원래 상태로 돌린다.
    if (typeof sendMessage !== 'function') { setManual(message); return; }
    const prev = { state, consumed };
    const fail = err => { setState(prev.state); setConsumed(prev.consumed); setSent(''); setToast('전송 실패: ' + ((err && err.message) || '알 수 없는 오류') + ' · 다시 보내 주세요'); };
    try {
      const r = sendMessage(message);
      setState(next); setConsumed(true); setSent(message); setText(''); setDrop(false); setPres('');
      if (r && typeof r.then === 'function') r.then(v => { if (v === false) fail(); }, fail);
    } catch (e) { fail(e); }
  }
  function heardToast() { const h = heardRef.current; if (h && h.accepted.length) setToast('단서 추가: ' + trNpc(boot.base.pend).name + '의 증언 ' + h.accepted.length + '건'); }
  function endTalk() {
    if (talk && talk.block) { setToast(talk.block); setTalk(null); return; } // 비켜 달라는 대본 대화는 AI 응답과 무관
    if (!consumed) { const nx = applyReply('T'); setState(nx); setConsumed(true); heardToast(); }
    setTalk(null); setText(''); setDrop(false); setPres('');
  }
  function talkAction(type) {
    let next = applyReply(talk.cut ? 'I' : 'T'); setConsumed(true); heardToast();
    if (type === 'LOOK') { setState(next); setTalk(v => ({ ...v, done: true })); setToast(trNpc(talk.npc).name + ' · ' + TR_IMP[next.npcs.find(n => n.id === talk.npc).mode]); setDrop(false); return; }
    next = trNPC.dispatch(TN_WORLD, next, { type, npcId: talk.npc });
    setState(next); setTalk(null); setDrop(false); setToast((next.logs[next.logs.length - 1] || {}).text || '');
  }
  // 시간 건너뛰기: 공지 시각, 새로 보이는 인물, 보이는 사건 기록에서 멈춘다.
  function skipTo(target, exact) {
    if (busy) return;
    const start = trNPC.dispatch(TN_WORLD, state, { type: 'CLEAR_ROUTE' });
    // 시각 지정(exact)은 공지에서 멈추지 않고 그 시각까지 간다(지나간 공지는 알림으로만). 다른 쉬기는 공지 시각에서 멈춘다.
    const passed = trNotices(start.clock, target), note = exact ? null : passed[0], end = note ? note.t : target;
    // 지나가는 사람(이동 중)은 무시하고, 누군가 내 곁(1칸)에 멈춰 서면 멈춘다.
    const near = x => x.npcs.filter(n => n.mode !== 'accompany' && n.mode !== 'moving' && Math.abs(n.x - x.player.x) + Math.abs(n.y - x.player.y) <= 1 && trVisible(x, n)).map(n => n.id);
    const seen0 = new Set(near(start));
    const r = trNPC.advanceUntil(TN_WORLD, start, end - start.clock, x => near(x).some(id => !seen0.has(id)) || x.logs.some(l => l.visible && (l.type === 'world' || l.type === 'call') && l.time > start.clock));
    const s2 = r.state, who = near(s2).filter(id => !seen0.has(id)).map(id => trNpc(id).name);
    const lg = s2.logs.filter(l => l.visible && l.type === 'world' && l.time > start.clock).slice(-1)[0];
    setState(s2); setSheet(''); setPreview(null); setMenu(null);
    const cl = trNPC.caller(TN_WORLD, s2); setWokeBy(r.stopped && cl ? cl.id : '');
    setToast(r.stopped ? (who.length ? trJosa(who.join('·'), '이', '가') + ' 다가와서 쉬던 것을 멈췄다' : lg ? lg.text : '무슨 일이 생겨 멈췄다') : note ? '공지 · ' + trHM(note.t) + ' ' + note.n.text + (note.n.place ? ' (' + note.n.place + ')' : '') : trNPC.clock(s2.clock).slice(0, 5) + '까지 쉬었다');
  }
  stRef.current = state;
  if (!state || !state.trial) trLock.current = '';
  // ---------- 재판 ----------
  const resetTv = { idx: 0, shown: 0, stmt: 0, drawer: false, vote: '', ev: '', voted: false, g: {}, votes: null, vn: 0, rl: 0 };
  const trKey = st => st && st.trial ? st.trial.i + ':' + st.trial.phase : '';
  const trAt = key => key && trKey(stRef.current) === key; // 타이머가 돌 때 아직 그 재판·그 단계인가
  const trNextIf = key => setState(v => trKey(v) === key ? trNPC.trialStep(TN_WORLD, v, 'NEXT') : v);
  function trialWrong(key) { if (key && !trAt(key)) return; const cur = stRef.current || state; if (!cur.trial || trLock.current === trKey(cur)) return; const h = trNPC.trialHit(TN_WORLD, cur); setState(h.state); trLock.current = ''; setTv(v => ({ ...v, drawer: false, fx: h.result })); if (h.result === 'hit') setTimeout(() => setTv(v => ({ ...v, fx: v.fx === 'hit' ? '' : v.fx })), 800); }
  // 정답: 도장(+모순이면 화면 깨짐) → 다음 단계
  // 지금 끝내는 단계가 어떤 쟁점의 마지막 단계면, 그 쟁점의 답 카드가 표시줄로 날아간다
  function flyFor(st, at) { const T = st.trial; if (!T) return null; const TR = TN_WORLD.trials[T.i], ph = TR.phases[at]; if (!ph || !ph.issue) return null;
    let last = -1; TR.phases.forEach((p, i) => { if (p.issue === ph.issue) last = i; }); const k = (TR.issues || []).findIndex(x => x.id === ph.issue);
    return last === at && k >= 0 ? { k, text: TR.issues[k].a } : null; }
  function flyGo(fl) { if (fl) setTimeout(() => setTv(v => ({ ...v, fly: v.fly === fl ? null : v.fly })), 1500); return fl; }
  function trialRight(label, wait) {
    const key = trKey(state); if (!key || trLock.current === key) return; trLock.current = key; // 연출 대기 중 중복 입력 잠금
    const fl = flyFor(state, state.trial.phase); setTv(v => ({ ...v, drawer: false, fx: label || 'ok' }));
    setTimeout(() => { if (!trAt(key)) return; trNextIf(key); setTv(v => ({ ...v, ...resetTv, fx: '', fly: flyGo(fl) })); }, wait || 1100);
  }
  function trialNext() { const key = trKey(state); if (!key || trLock.current === key) return; trLock.current = key; const fl = flyFor(state, state.trial.phase); trNextIf(key); setTv(v => ({ ...v, ...resetTv, fly: flyGo(fl) })); }
  // 투표: 나 → 다른 참가자들이 한 명씩. 각자 자기 판단(ph.beliefs, 없으면 정답)대로 찍되, 나를 깊이 믿는 사람(신뢰 ph.follow단계 이상)은 내 표를 따른다.
  // 최다 득표가 하나면 그 사람으로 결정(동률이면 표가 갈림 = 실패). 결정이 정답이면 다음, 아니면 체력 -1.
  function castVote(ph) {
    const me = tv.vote, voters = (ph.voters || TN_WORLD.npcs.map(n => n.id)).filter(id => id !== 'me');
    const votes = [{ id: 'me', pick: me }, ...voters.map(id => ({ id, pick: trNPC.relLevel(TN_WORLD, state, id, 'trust') >= (ph.follow || 4) ? me : ((ph.beliefs || {})[id] || ph.answer) }))];
    const cnt = {}; votes.forEach(x => { cnt[x.pick] = (cnt[x.pick] || 0) + 1; }); const top = Math.max(...Object.values(cnt)), tops = Object.keys(cnt).filter(k2 => cnt[k2] === top);
    const result = tops.length === 1 ? tops[0] : '', gap = 520, t0 = votes.length * gap + 500, key = trKey(state); if (tv.voted || trLock.current === key) return;
    setTv(v => ({ ...v, voted: true, votes, vn: 1, result }));
    votes.forEach((_, i) => i && setTimeout(() => setTv(v => ({ ...v, vn: i + 1 })), i * gap));
    setTimeout(() => setTv(v => ({ ...v, rl: 1 })), t0);
    setTimeout(() => setTv(v => ({ ...v, rl: 2 })), t0 + 60);
    setTimeout(() => setTv(v => ({ ...v, rl: 3 })), t0 + (result ? 2700 : 1400));
    setTimeout(() => { if (!trAt(key)) return; (me === ph.answer && result === ph.answer) ? trialRight('결정', 900) : (setTv(v => ({ ...v, ...resetTv })), trialWrong(key)); }, t0 + (result ? 3900 : 2600));
  }
  function trReel(ph, tv) {
    const opts = ph.options, H = 120, idx = Math.max(0, opts.indexOf(tv.result)), strip = Array.from({ length: 7 }, () => opts).flat();
    const y = tv.rl >= 2 && tv.result ? -(6 * opts.length + idx) * H : 0;
    return <div className="tr-reelwrap"><div className="tr-reel-t">투표 결과</div>
      {tv.result ? <div className="tr-reel"><div className="tr-reel-strip" style={{ transform: `translateY(${y}px)`, transition: tv.rl >= 2 ? 'transform 2.5s cubic-bezier(.12,.7,.18,1)' : 'none' }}>
        {strip.map((id, i) => <div key={i} className="tr-reel-cell">{trPortrait(id, 96, 116)}</div>)}</div></div> : <div className="tr-reel split">표가 갈렸다</div>}
      <div className={'tr-reel-name' + (tv.rl >= 3 ? ' on' : '')}>{tv.result ? trNpc(tv.result).name : '결정 없음'}</div></div>;
  }
  function sendRebut(ph) {
    const msg = trText.trim(); if (!msg || busy) return;
    const it = (TN_WORLD.items || []).find(x => x.id === tv.ev), npc = trNpc(ph.npc), TR = TN_WORLD.trials[state.trial.i];
    const next = { ...trNPC.clone(state), pend: ph.npc, pk: 'R', pc: Array.from(msg).length };
    const ctx = [meLine(next), '재판: ' + TR.title + ' · 반론 상대 ' + npc.name, trRelLine(next, ph.npc) ? npc.name + ' → 플레이어: ' + trRelLine(next, ph.npc) : '', npc.name + '의 주장: ' + ph.claim, '제시한 증거: ' + (it ? it.name + '(' + it.desc + ')' : '없음'), settledLine(next), clueLine(next), evidLine(next)];
    const message = trTalk.handoff({ kind: 'R', target: npc.name, where: '재판장', time: next.day + '일 ' + trHM(next.clock), marks: trNPC.markers(TN_WORLD, next), ctx, text: msg, code: trCodec.pack(TN_WORLD, next) });
    if (typeof sendMessage !== 'function') { setManual(message); return; }
    try { const r = sendMessage(message); setSent(message); setTrText(''); if (r && typeof r.then === 'function') r.then(v => { if (v === false) setSent(''); }, () => { setSent(''); setToast('전송 실패 · 다시 보내 주세요'); }); }
    catch (err) { setToast('전송 실패: ' + err.message); }
  }
  function trCheckin() {
    const L = ck || state.player.look || AV_DEFAULT, set = (k, v) => setCk({ ...L, [k]: v });
    const A = TR_A.avatar, wk = A ? A.dirs.down.walk : [], col = A ? (ckTick % 8 < 4 ? wk[ckTick % wk.length] : A.dirs[['left', 'up', 'right', 'down'][Math.floor(ckTick / 8) % 4]].idle) : 0;
    const chips = (k, label, en) => <div className="ck-row"><label><i>{en}</i>{label}</label><div>{AV[k].map((o, i) => Array.isArray(o)
      ? <button key={i} className={'ck-sw' + (L[k] === i ? ' on' : '')} style={{ background: o[1] }} title={o[0]} onClick={() => set(k, i)} />
      : <button key={i} className={'ck-opt' + (L[k] === i ? ' on' : '')} onClick={() => set(k, i)}>{o}</button>)}</div></div>;
    const sec = (en, ko) => <div className="ck-sec"><span>{en}</span><b>{ko}</b></div>;
    const done = () => { const look = { ...L, name: String(L.name || '').trim().slice(0, 12) || '손님' }; setState(v => { const x = trNPC.clone(v); x.player.look = look; x.revision++; return x; }); setCk(null); setToast(look.name + ' 님, 체크인을 마쳤습니다.'); };
    const corner = r => <svg key={r} className={'ck-corner c' + r} viewBox="0 0 40 40" aria-hidden="true"><path d="M2 38 L2 8 Q2 2 8 2 L38 2" /><path d="M7 38 L7 12 Q7 7 12 7 L38 7" /><path d="M12 12 q6 0 6 6 q-6 0 -6 -6 Z" /></svg>;
    return <div className="tr-out" ref={outRef} style={{ height: TR_H * scale }}><style>{TN_CSS}</style>
      <div className="tr-card tr-ck" style={{ transform: `scale(${scale})` }}>
        <div className="ck-paper" />{[0, 1, 2, 3].map(corner)}
        <div className="ck-head">
          <svg className="ck-crest" viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="32" r="29" className="g1" /><circle cx="32" cy="32" r="25" className="g2" />
            <path d="M14 40 Q12 26 22 16 M50 40 Q52 26 42 16" className="g3" />
            {[0, 1, 2, 3, 4].map(k => <ellipse key={'l' + k} cx={16 + k * 1.2} cy={38 - k * 5} rx="2.2" ry="4" transform={`rotate(${-30 + k * 12} ${16 + k * 1.2} ${38 - k * 5})`} className="lf" />)}
            {[0, 1, 2, 3, 4].map(k => <ellipse key={'r' + k} cx={48 - k * 1.2} cy={38 - k * 5} rx="2.2" ry="4" transform={`rotate(${30 - k * 12} ${48 - k * 1.2} ${38 - k * 5})`} className="lf" />)}
            <text x="32" y="40" textAnchor="middle" className="mono">R</text><path d="M32 9 l2 4 4 .6 -3 2.8 .8 4 -3.8 -2 -3.8 2 .8 -4 -3 -2.8 4 -.6 Z" className="st" />
          </svg>
          <div className="ck-title"><b>HOTEL RÊVERIE</b><span>GUEST REGISTRATION · 숙박 카드</span></div>
          <div className="ck-no"><span>No.</span><b>{String(1 + ((state.rng || 0) % 9000)).padStart(4, '0')}</b><i>DAY 1 · {trNPC.clock(state.clock).slice(0, 5)}</i></div>
        </div>
        <div className="ck-rule"><i /></div>
        <div className="ck-view">
          <div className="ck-frame"><div className="ck-frame-in">{TR_A.parts ? trAvatarImg(L, .64, { left: -21, top: -32 }) : trAvatar(L, { position: 'absolute', left: -14, top: -4, width: 150, height: 225 })}</div>
            <svg className="ck-arch" viewBox="0 0 124 170" aria-hidden="true"><path d="M4 168 L4 62 Q4 4 62 4 Q120 4 120 62 L120 168 Z" /><path d="M10 162 L10 64 Q10 10 62 10 Q114 10 114 64 L114 162 Z" /></svg></div>
          <div className="ck-side"><div className="ck-cap">PREVIEW · 미리보기</div>
            <div className="ck-stage"><div className="ck-ped" /><div className="ck-px">{A ? trAvatarPx(L, col, { left: 0, bottom: 0, transform: 'scale(1.5)', transformOrigin: 'left bottom' }) : null}</div></div>
            <div className="ck-cap">WALKING · 걸음</div><div className="ck-note">그림은 임시입니다</div></div>
        </div>
        <div className="ck-form">
          {sec('GUEST', '투숙객')}
          <div className="ck-row"><label><i>NAME</i>성함</label><input value={L.name || ''} maxLength={12} placeholder="이름을 적어 주십시오" onChange={e => set('name', e.target.value)} /></div>
          {chips('g', '성별', 'SEX')}
          {sec('APPEARANCE', '용모')}
          {chips('hf', '앞머리', 'FRINGE')}{chips('hb', '뒷머리', 'HAIR')}{chips('hc', '머리색', 'COLOR')}{chips('eye', '눈', 'EYES')}{chips('ec', '눈동자', 'IRIS')}{chips('sk', '피부', 'SKIN')}
          {sec('ATTIRE', '복장')}
          {chips('of', '옷', 'DRESS')}{chips('oc', '옷 색', 'TONE')}{chips('ac', '장신구', 'ACCENT')}
          <div className="ck-terms">※ 기재하신 사항은 체크인 후에도 프런트(설정)에서 고치실 수 있습니다.</div>
        </div>
        <div className="ck-foot">
          <div className="ck-sign"><span>SIGNATURE · 서명</span><b>{String(L.name || '').trim() || '\u00a0'}</b></div>
          {state.player.look ? <button className="ck-cancel" onClick={() => setCk(null)}>취소</button> : null}
          <button className="ck-seal" onClick={done}><b>R</b><span>체크인</span></button>
        </div>
      </div></div>;
  }
  // ---------- 논스톱 증언(엇갈린 증언) ----------
  // 증언이 돌아가며 흐르고, 빛나는 구절(약점)에 탄환을 쏜다. absorb면 남의 구절을 '회수'해 말 탄환으로 쓸 수 있다.
  function trNonstop(ph, evid) {
    const g = tv.g || {}, li = g.li || 0, sh = g.sh || 0, lines = ph.lines.map(L => trNsParse(L.text)), mode = g.mode || 'fire', words = g.words || [];
    const lens = lines.map(P => P.reduce((n, x) => n + Array.from(x.t).length, 0));
    nsRef.current = g.shot || g.pause || g.miss || tv.fx ? null : { lens, hold: 26, ms: 80 };
    const bullets = [...evid.map(it => ({ key: 'e:' + it.id, k: 'ev', id: it.id, t: it.name })), ...words.map(x => ({ key: 'w:' + x.l + '.' + x.s, k: 'w', l: x.l, s: x.s, t: x.t }))];
    const sel = bullets.find(b => b.key === g.sel) || null, who = ph.lines[li].who, c = trNpc(who);
    const setG = f => setTv(v => ({ ...v, g: { ...v.g, ...(typeof f === 'function' ? f(v.g || {}) : f) } }));
    const at = el => { const B = nsBox.current.getBoundingClientRect(), k = B.width / (nsBox.current.offsetWidth || 1), r = el.getBoundingClientRect(); return { x: (r.left + r.width / 2 - B.left) / k, y: (r.top + r.height / 2 - B.top) / k }; };
    const hit = (b, l, x) => (ph.answers || []).some(a => a.at[0] === l && a.at[1] === x && (b.k === 'ev' ? [].concat(a.ev || []).includes(b.id) : !!a.word && a.word[0] === b.l && a.word[1] === b.s));
    const onSeg = (l, x, t, e) => {
      if (g.shot || tv.fx || !nsBox.current) return;
      const p = at(e.currentTarget), q = nsGun.current ? at(nsGun.current) : { x: 174, y: 400 };
      if (mode === 'take') { // 회수: 구절이 칼날에 담겨 약실로 빨려 들어온다
        setG({ shot: { kind: 'take', x0: p.x, y0: p.y, x1: q.x, y1: q.y, t } });
        setTimeout(() => setG(o => { const ws = [...(o.words || []).filter(y => !(y.l === l && y.s === x)), { l, s: x, t }].slice(-2); return { shot: null, words: ws, sel: 'w:' + l + '.' + x, mode: 'fire', hint: '「' + t + '」 회수 — 부딪치는 약점에 쏜다' }; }), 520);
        return;
      }
      if (!sel) { setG({ hint: '먼저 아래에서 탄환을 고른다' }); return; }
      const ok = hit(sel, l, x);
      setG({ shot: { kind: 'fire', x0: q.x, y0: q.y, x1: p.x, y1: p.y, t: sel.t, ok } });
      setTimeout(() => {
        if (ok) { setG({ broke: l + '.' + x }); if (sel.k === 'ev') setTv(v => ({ ...v, ev: sel.id })); trialRight('모순!', 1500); }
        else { setG(o => ({ shot: { ...o.shot, back: true }, hint: '' })); trialWrong();
          setTimeout(() => setG(o => ({ shot: null, miss: { step: 0, who: ph.lines[l].who, n: o.nmiss || 0 }, nmiss: (o.nmiss || 0) + 1 })), 560); }
      }, 300);
    };
    let n = 0;
    const text = lines[li].map((x, i) => { const L = Array.from(x.t), vis = Math.max(0, Math.min(L.length, sh - n)); n += L.length; if (!vis) return null;
      const part = L.slice(0, vis).join(''); if (x.s < 0) return <span key={i}>{part}</span>;
      const id = li + '.' + x.s, held = words.some(y => y.l === li && y.s === x.s), now = vis < L.length || (sh === n && sh < lens[li]);
      return <span key={i} className={'tr-nseg' + (now ? ' now' : '') + (mode === 'take' ? ' take' : '') + (held ? ' held' : '') + (g.broke === id ? ' broke' : '')} onClick={e => onSeg(li, x.s, x.t, e)}>{part}</span>; });
    const S = g.shot, M = g.miss;
    if (M) { // 빗나간 뒤: 인물의 한마디 → 내 혼잣말 → 다시 증언 처음부터
      const L = M.step === 0 ? trMissLine(state, ph, M.who) : null, mono = (ph.mono || TR_MONO)[M.n % (ph.mono || TR_MONO).length], me = state.player.look ? state.player.look.name : '나';
      return <div className="tr-ns" ref={nsBox} onClick={() => setG(o => o.miss.step === 0 ? { miss: { ...o.miss, step: 1 } } : { miss: null, sh: 0 })}>
        <div className="tr-ns-top"><b>NONSTOP</b><span>{ph.title}</span></div>
        <div key={M.step} className="tr-vn tr-ns-missbox"><div className="tr-vn-name" style={{ '--c': L ? trNpc(L.who).color : '#3a6a8a' }}>{L ? trNpc(L.who).name : me}</div>
          <div className={'tr-ttext' + (L ? '' : ' mono')}>{trTyped(trSegs(L ? L.text : mono), 999)}</div><i className="tr-vn-next">▼</i></div></div>;
    }
    return <div className="tr-ns" ref={nsBox}>
      <div className="tr-ns-top"><b>NONSTOP</b><span>{ph.title}</span><button onClick={() => setG(o => ({ pause: !o.pause }))}>{g.pause ? '▶ 계속' : 'Ⅱ 멈춤'}</button></div>
      <div className="tr-ns-guide">{ph.guide}</div>
      <div key={li} className={'tr-ns-say' + (li % 2 ? ' alt' : '')}><b style={{ color: c.color }}>{c.name}</b><div className="tr-ns-text">{text}</div></div>
      <div className="tr-ns-dots">{ph.lines.map((L, i) => <i key={i} className={i === li ? 'on' : ''} onClick={() => setG({ li: i, sh: 0 })}>{trNpc(L.who).name}</i>)}</div>
      <div className="tr-ns-gun" ref={nsGun}>
        {ph.absorb ? <div className="tr-ns-mode"><button className={mode === 'fire' ? 'on' : ''} onClick={() => setG({ mode: 'fire', hint: '' })}>발사</button><button className={mode === 'take' ? 'on take' : ''} onClick={() => setG({ mode: 'take', hint: '빛나는 구절을 눌러 회수한다' })}>회수</button></div> : null}
        <div className="tr-ns-mag">{bullets.map(b => <button key={b.key} className={'tr-blade' + (b.k === 'w' ? ' word' : '') + (g.sel === b.key ? ' on' : '')} onClick={() => setG({ sel: b.key, mode: 'fire', hint: '' })}>{b.t}</button>)}
          {!bullets.length ? <span className="tr-mut">쓸 수 있는 탄환이 없다</span> : null}</div>
        <div className="tr-ns-hint">{g.hint || (sel ? '장전: ' + sel.t + ' — 빛나는 말을 눌러 쏜다' : '탄환을 고른 뒤, 흐르는 증언의 빛나는 말을 누른다')}</div>
      </div>
      {S ? <div className={'tr-bul ' + S.kind + (S.back ? ' back' : '') + (S.ok ? ' ok' : '')} style={{ '--x0': S.x0 + 'px', '--y0': S.y0 + 'px', '--x1': S.x1 + 'px', '--y1': S.y1 + 'px', '--rot': (S.kind === 'fire' ? Math.atan2(S.y1 - S.y0, S.x1 - S.x0) * 180 / Math.PI : 0) + 'deg' }}><span className={'tr-blade' + (S.kind === 'take' || (sel && sel.k === 'w') ? ' word' : '')}>{S.t}</span></div> : null}
    </div>;
  }
  // ---------- 꿈 조각 잇기: 사선으로 나뉜 '전 → 후' 두 장면. 「?」 칸만 바꿀 수 있다 ----------
  // 장면 = { bg, who, pose, obj, at }. rounds[i].ask = [['a'|'b', 칸], ...]
  function trDream(ph) {
    const g = tv.g || {}, ri = Math.min(state.trial.sub || 0, ph.rounds.length - 1), R = ph.rounds[ri], pick = (g.r || {})[ri] || {};
    const OPT = { who: [...(ph.cast || []), ''], pose: ['서 있음', '달림', '건넴'], at: ph.ats || ['손', '바닥', '선반', '탁자', '순서표'], bg: ph.rooms || ['자료실', '작업실', '정원', '광장'], obj: [...(ph.objs || []), ''] };
    const NAME = { who: '누가', pose: '자세', at: '물건 자리', bg: '장소', obj: '물건' }, ask = R.ask.map(([side, f]) => side + '.' + f);
    const val = (side, f) => ask.includes(side + '.' + f) ? pick[side + '.' + f] : R[side][f];
    const cyc = (side, f, d) => { const k = side + '.' + f, o = OPT[f], cur = pick[k], n = cur === undefined ? (d > 0 ? 0 : o.length - 1) : (o.indexOf(cur) + d + o.length) % o.length;
      setTv(v => ({ ...v, g: { ...v.g, bad: 0, r: { ...(v.g.r || {}), [ri]: { ...pick, [k]: o[n] } } } })); };
    const label = (f, x) => x === undefined ? '?' : f === 'who' ? (x ? trNpc(x).name : '아무도 없음') : f === 'obj' ? (x ? (trItem(x) || {}).name || x : '없음') : x;
    const room = name => { const b = (TR_A.bg || {})[name]; if (b) return { backgroundImage: `url(${trUrl(b)})`, backgroundSize: 'cover', backgroundPosition: 'center' };
      const A = (TN_WORLD.map.areas || []).find(x => x.name === name), M = TR_A.map; if (!A || !M) return { background: '#1a1626' };
      const w = (A.x1 - A.x0 + 1) * TR_CELL, k = 230 / w; // 그 방 부분만 확대
      return { backgroundImage: `url(${trUrl(M.src)})`, backgroundSize: `${M.w * k}px ${M.h * k}px`, backgroundPosition: `${-A.x0 * TR_CELL * k}px ${-A.y0 * TR_CELL * k + 20}px` }; };
    const scene = side => { const bg = val(side, 'bg'), who = val(side, 'who'), pose = val(side, 'pose'), obj = val(side, 'obj'), at = val(side, 'at'), L = side === 'a', cx = L ? 26 : 74;
      const ch = who ? trThumb(who) : null, it = obj ? trItem(obj) : null, run = pose === '달림', give = pose === '건넴';
      // 물건 자리: 기본 다섯 곳 + 대본이 정한 자리(ph.atProp = {자리: 'shelf'|'desk'|'board'} 로 받침 모양을 고른다)
      const AP = ph.atProp || {}, kind = at === '선반' ? 'shelf' : at === '탁자' ? 'desk' : at === '순서표' ? 'board' : AP[at];
      const atPos = { 손: [cx + (L ? 9 : -9), 52], 바닥: [cx + (L ? 12 : -12), 84], shelf: [L ? 10 : 90, 26], desk: [cx + (L ? 14 : -14), 66], board: [L ? 16 : 82, 25] };
      const ip = !at ? null : atPos[at] || atPos[kind] || atPos.desk;
      return <div className={'tr-dr-pane ' + (L ? 'a' : 'b')}>
        <div className="tr-dr-bg" style={bg === undefined ? { background: '#120f1c' } : room(bg)} />
        {kind ? <i className={'tr-dr-prop ' + kind} style={{ left: ip[0] + '%' }} /> : null}{at && !['손', '바닥', '선반', '탁자', '순서표'].includes(at) ? <span className="tr-dr-atl" style={{ left: ip[0] + '%', top: (ip[1] + 9) + '%' }}>{at}</span> : null}
        {who === undefined ? <div className="tr-dr-ghost" style={{ left: cx + '%' }}>?</div>
          : ch ? <div className={'tr-dr-who' + (run ? ' run' : '') + (give ? ' give' : '')} style={{ left: cx + '%' }}>{ch.src ? <img src={trUrl(ch.src)} alt="" style={ch.crop} /> : <i className="tr-dr-dot" style={{ background: ch.hair }} />}{run ? <i className="tr-dr-speed" /> : null}</div> : null}
        {pose === undefined && who ? <b className="tr-dr-q" style={{ left: cx + '%', top: '40%' }}>?</b> : null}
        {it && ip ? <div className={'tr-dr-item' + (give && at === '손' ? ' give' : '')} style={{ left: ip[0] + '%', top: ip[1] + '%' }}>{trItemPic(it, 30)}</div> : it && at === undefined ? <b className="tr-dr-q" style={{ left: (L ? 40 : 60) + '%', top: '62%' }}>?</b> : null}
        <span className="tr-dr-tag">{L ? '전' : '후'}</span></div>; };
    const done = ask.every(k => pick[k] !== undefined);
    const submit = () => { const ok = R.ask.every(([side, f]) => pick[side + '.' + f] === R[side][f]);
      if (!ok) { setTv(v => ({ ...v, g: { ...v.g, bad: (v.g.bad || 0) + 1 } })); trialWrong(); return; }
      if (ri + 1 >= ph.rounds.length) trialRight('이어졌다'); else { setToast('조각 ' + (ri + 1) + ' 이어짐'); setState(v => trNPC.trialStep(TN_WORLD, v, 'SUB')); } };
    return <div className="tr-debate">
      <div className="tr-dv-head"><b>{ph.title} · 조각 {ri + 1}/{ph.rounds.length}</b><span>{R.cap || ph.guide}</span></div>
      <div className={'tr-dr' + (g.bad ? ' bad' : '')} key={ri + '.' + (g.bad || 0)}>{scene('a')}{scene('b')}<svg className="tr-dr-cut" viewBox="0 0 100 100" preserveAspectRatio="none"><line x1="58" y1="0" x2="42" y2="100" /></svg><i className="tr-dr-arrow">▶</i></div>
      <div className="tr-dr-ctl">{R.ask.map(([side, f]) => { const k = side + '.' + f; return <div key={k} className={'tr-dr-row' + (pick[k] === undefined ? ' empty' : '')}>
        <span>{side === 'a' ? '전' : '후'} · {NAME[f]}</span><button onClick={() => cyc(side, f, -1)}>‹</button><b>{label(f, pick[k])}</b><button onClick={() => cyc(side, f, 1)}>›</button></div>; })}</div>
      <button className="tr-tbtn gold" disabled={!done || !!tv.fx} onClick={submit}>{done ? '이 흐름으로 이어 붙인다' : '「?」를 모두 채운다'}</button>
    </div>;
  }
  // ---------- 반론: 비주얼 노벨식. 상대가 말하는 도중 끊고 들어간다 ----------
  function trRebut(ph, evid, step) {
    const g = tv.g || {}, c = trNpc(ph.npc), segs = trSegs(ph.claim), len = segs.reduce((n, x) => n + Array.from(x.t).length, 0);
    const cut = Math.max(8, Math.floor(len * .7)); // 주장의 7할쯤에서 끊는다
    rbRef.current = step === 2 ? null : { len, cut: cut + 5, ms: 42, rb: step };
    // 주장 글은 끝까지 다 나오지 않고 끊긴다(컷인이 끼어든다). 입력 단계에서는 전체를 다시 보여 준다.
    const shown = step === 2 ? len : Math.min(cut, g.rs || 0), k = Math.max(0, Math.min(evid.length - 1, g.ei || 0)), it = evid[k];
    const box = <div className="tr-vn" onClick={() => step === 0 && setTv(v => ({ ...v, g: { ...v.g, rb: 1, rs: cut } }))}>
      <div className="tr-vn-name" style={{ '--c': c.color }}>{c.name}</div><div className="tr-ttext">{trTyped(segs, shown)}{step < 2 && shown >= cut ? '—' : ''}</div></div>;
    if (step < 2) return box;
    const on = it && tv.ev === it.id;
    return <div className="tr-rb">{box}
      {it ? <div className={'tr-evc' + (on ? ' on' : '')}>
        <button className="tr-evc-nav" disabled={evid.length < 2} onClick={() => setTv(v => ({ ...v, g: { ...v.g, ei: (k + evid.length - 1) % evid.length } }))}>‹</button>
        <div key={it.id} className="tr-evc-card" onClick={() => setTv(v => ({ ...v, ev: v.ev === it.id ? '' : it.id }))}>
          <div className="tr-evc-pic">{trItemPic(it, 52)}</div>
          <div className="tr-evc-txt"><b>{it.name}</b><span>{it.desc}</span></div>
          <div className="tr-evc-tag">{on ? '함께 제시 ✓' : '눌러서 제시'}</div></div>
        <button className="tr-evc-nav" disabled={evid.length < 2} onClick={() => setTv(v => ({ ...v, g: { ...v.g, ei: (k + 1) % evid.length } }))}>›</button>
        <i className="tr-evc-n">{k + 1}/{evid.length}</i></div> : null}
      <div className="tr-rbin"><textarea rows={3} value={trText} placeholder={c.name + '의 주장에 내 말로 맞선다'} onChange={e => setTrText(e.target.value.slice(0, 400))} />
        <button className="tr-rbgo" disabled={!trText.trim() || busy} onClick={() => sendRebut(ph)}>반론하기</button></div></div>;
  }
  function trTrialScreen() {
    const T = state.trial, TR = TN_WORLD.trials[T.i], ph = trFill(state, TR.phases[T.phase] || { type: 'talk', lines: [] });
    const evid = (TR.evidence || []).filter(id => (state.player.items || {})[id] !== undefined).map(id => TN_WORLD.items.find(x => x.id === id));
    // 대사 줄: 대본(조건부 변형 alt) 또는 AI 반론 응답
    let cur = null, total = 0, onEnd = null;
    if (tv.reply && lines.length) {
      const L = lines[Math.min(tv.idx, lines.length - 1)]; total = lines.length;
      cur = { who: L.narration ? '' : trIdByName(L.speaker), name: L.speaker, face: L.expression, pose: L.pose || '', text: L.text };
      onEnd = () => { const fl = boot.tres === 'ok' ? flyFor(state, state.trial.phase - 1) : null; setTv(v => ({ ...v, reply: false, ...resetTv, fx: boot.tres || '', fly: flyGo(fl) })); if (boot.tres === 'hit' || boot.tres === 'ok') setTimeout(() => setTv(v => ({ ...v, fx: v.fx === boot.tres ? '' : v.fx })), 1000); };
    } else if (ph.type === 'talk') {
      const all = ph.lines.filter(x => !(x.here && x.who && !trHere(state, x.who))).map(x => trLineOf(state, x)); total = all.length; cur = all[Math.min(tv.idx, total - 1)]; onEnd = trialNext;
    }
    const segs = cur ? trSegs(cur.text) : [], len = segs.reduce((n, g) => n + Array.from(g.t).length, 0), done = tv.shown >= len;
    typeRef.current = cur && !sent ? { len, ms: Math.round(30 / (cur.speed || 1)) } : null;
    const tapLine = () => { if (!cur) return; if (!done) { setTv(v => ({ ...v, shown: len })); return; } if (tv.idx + 1 < total) setTv(v => ({ ...v, idx: v.idx + 1, shown: 0 })); else onEnd && onEnd(); };
    const issues = TR.issues || [], solvedUntil = id => { let last = -1; TR.phases.forEach((p, i) => { if (p.issue === id) last = i; }); return last; };
    const issueOf = TR.phases.slice(0, T.phase + 1).reduce((a, p) => p.issue || a, '');
    const ns = !cur && !sent && ph.type === 'nonstop', rb = !cur && !sent && ph.type === 'rebut', rbStep = rb ? ((tv.g || {}).rb || 0) : -1;
    const split = rbStep === 1, stageFx = cur && cur.fx ? cur.fx : '', mini = !cur && ph.type !== 'trans' && !rb && !ns;
    const nsMiss = ns && (tv.g || {}).miss, nsMissL = nsMiss && nsMiss.step === 0 ? trMissLine(state, ph, nsMiss.who) : null;
    const nsL = ns && !nsMissL ? trLineOf(state, ph.lines[(tv.g || {}).li || 0]) : null; // 논스톱 지금 줄(표정·자세)
    const speakerId = cur ? cur.who : nsMissL ? nsMissL.who : nsL ? nsL.who : (ph.type === 'debate' ? ph.lines[tv.stmt].who : ph.type === 'rebut' ? ph.npc : '');
    let body = null;
    if (sent) body = <div className="tr-tcard"><div className="tr-mut">반론을 전달했습니다. 상대의 대답이 새 화면에서 이어집니다.</div></div>;
    else if (cur) body = <div className="tr-tbox2" onClick={tapLine}>
      <div className="tr-name"><b style={{ color: cur.who && cur.who !== 'host' && cur.who !== 'me' ? trNpc(cur.who).color : '#e9c98c' }}>{cur.who === 'host' ? TR_HOST.name : cur.who === 'me' ? '나' : cur.who ? (cur.name || trNpc(cur.who).name) : ''}</b><span>{tv.idx + 1}/{total}{done ? ' ▼' : ''}</span></div>
      <div className={'tr-ttext' + (cur.who ? '' : ' narr')}>{trTyped(segs, tv.shown)}</div></div>;
    else if (ph.type === 'trans') {
      const k = issues.findIndex(x => x.id === ph.issue);
      body = <div className="tr-trans" onClick={trialNext}><div className="tr-trans-n">{ph.text}</div><div className="tr-trans-q">{(issues[k] || {}).q}</div><div className="tr-mut">눌러서 계속</div></div>;
    } else if (ph.type === 'debate') {
      const st = ph.lines[tv.stmt], c = trNpc(st.who);
      body = <div className="tr-debate">
        <div className="tr-mut" style={{ textAlign: 'center' }}>{ph.title} · 모순되는 증언에 증거를 내민다</div>
        <div key={tv.stmt} className="tr-stmt"><div className="tr-tpor sm">{trPortrait(st.who, 64, 80)}</div><div><b style={{ color: c.color }}>{c.name}</b><div className="tr-ttext">「{st.text}」</div></div></div>
        <div className="tr-dots">{ph.lines.map((_, i) => <i key={i} className={i === tv.stmt ? 'on' : ''} />)}</div>
        <div style={{ display: 'flex', gap: 5 }}><button className="tr-tbtn" onClick={() => setTv(v => ({ ...v, stmt: (v.stmt + ph.lines.length - 1) % ph.lines.length, drawer: false }))}>‹ 이전</button>
          <button className="tr-tbtn gold" style={{ flex: 2 }} onClick={() => setTv(v => ({ ...v, drawer: !v.drawer }))}>이 증언에 증거 제시</button>
          <button className="tr-tbtn" onClick={() => setTv(v => ({ ...v, stmt: (v.stmt + 1) % ph.lines.length, drawer: false }))}>다음 ›</button></div>
        {tv.drawer ? <div className="tr-drawer">{evid.map(it => <button key={it.id} className="tr-evi" onClick={() => ([].concat(st.answers || st.answer).includes(it.id) ? (setTv(v => ({ ...v, ev: it.id })), trialRight('모순!', 1400)) : trialWrong())}><b>{it.name}</b><span>{it.desc}</span></button>)}</div> : null}
      </div>;
    } else if (ns) body = trNonstop(ph, evid);
    else if (rb) body = trRebut(ph, evid, rbStep);
    else if (ph.type === 'pairs') {
      // 엇갈린 증언: 여러 사람의 증언에서 서로 부딪치는 두 문장(다른 사람끼리)을 고른다
      const g = tv.g, wi = g.w === undefined ? 0 : g.w, sel = g.sel || [], W0 = ph.witnesses[wi];
      const has = (a, b) => sel.some(x => x[0] === a && x[1] === b);
      const tap = (a, b) => setTv(v => { const cs = v.g.sel || []; const on = cs.some(x => x[0] === a && x[1] === b); const ns = on ? cs.filter(x => !(x[0] === a && x[1] === b)) : [...cs.filter(x => x[0] !== a), [a, b]].slice(-2); return { ...v, g: { ...v.g, sel: ns } }; });
      const ok = sel.length === 2 && (ph.answers || [ph.answer]).some(ans => ans.every(a => sel.some(x => x[0] === a[0] && x[1] === a[1])));  // 정답 짝이 여럿일 수 있다
      body = <div className="tr-debate"><div className="tr-mut" style={{ textAlign: 'center' }}>{ph.title} · {ph.guide}</div>
        <div className="tr-wtabs">{ph.witnesses.map((x, i) => <button key={i} className={(i === wi ? 'on' : '') + (sel.some(s2 => s2[0] === i) ? ' mark' : '')} onClick={() => setTv(v => ({ ...v, g: { ...v.g, w: i } }))}>{trPortrait(x.who, 34, 40)}<span>{trNpc(x.who).name}</span></button>)}</div>
        <div key={wi} className="tr-col" style={{ animation: 'trin .25s' }}>{W0.parts.map((t, i) => <button key={i} className={'tr-part' + (has(wi, i) ? ' on' : '')} onClick={() => tap(wi, i)}>「{t}」</button>)}</div>
        <div className="tr-picked">{sel.length ? sel.map((x, i) => <span key={i}>{trNpc(ph.witnesses[x[0]].who).name} 「{ph.witnesses[x[0]].parts[x[1]]}」</span>) : <span className="tr-mut">다른 두 사람의 문장을 하나씩 고른다</span>}</div>
        <button className="tr-tbtn gold" disabled={sel.length < 2} onClick={() => (ok ? trialRight('모순!', 1400) : (setTv(v => ({ ...v, g: { ...v.g, sel: [] } })), trialWrong()))}>이 두 문장이 부딪친다</button></div>;
    } else if (ph.type === 'combine') {
      const g = tv.g, sel = g.sel || [], got = g.got || [];
      const tap = (d, i) => setTv(v => { const cs = v.g.sel || []; const on = cs.some(x => x[0] === d && x[1] === i); return { ...v, g: { ...v.g, sel: on ? cs.filter(x => !(x[0] === d && x[1] === i)) : [...cs.filter(x => x[0] !== d), [d, i]].slice(-2) } }; });
      const same = (a, b) => a[0] === b[0] && a[1] === b[1];
      const tryIt = () => { const k = ph.combos.findIndex(c => (same(c.a, sel[0]) && same(c.b, sel[1])) || (same(c.a, sel[1]) && same(c.b, sel[0])));
        if (k < 0 || got.includes(k)) { setTv(v => ({ ...v, g: { ...v.g, sel: [] } })); trialWrong(); return; }
        const ng = [...got, k]; setTv(v => ({ ...v, g: { ...v.g, got: ng, sel: [], fresh: k } }));
        if (ng.length >= ph.combos.length) trialRight('추론 완성', 1300); };
      body = <div className="tr-debate"><div className="tr-mut" style={{ textAlign: 'center' }}>{ph.title} · {ph.guide}</div>
        <div className="tr-docs">{ph.docs.map((d, di) => <div key={di} className="tr-doc"><b>{d.title}</b>{d.parts.map((t, i) => <button key={i} className={'tr-part' + (sel.some(x => x[0] === di && x[1] === i) ? ' on' : '')} onClick={() => tap(di, i)}>{t}</button>)}</div>)}</div>
        <div className="tr-facts">{got.map(k => <div key={k} className={'tr-fact' + (g.fresh === k ? ' fresh' : '')}>◆ {ph.combos[k].fact}</div>)}{Array.from({ length: ph.combos.length - got.length }, (_, i) => <div key={'x' + i} className="tr-fact lock">? ? ?</div>)}</div>
        <button className="tr-tbtn gold" disabled={sel.length < 2} onClick={tryIt}>맞대 보기</button></div>;
    } else if (ph.type === 'route') {
      const g = tv.g, path = g.path || [ph.start], C = 11, M = TN_WORLD.map, last = path[path.length - 1];
      const tap = e => { if (g.ok) return; const r = e.currentTarget.getBoundingClientRect(), x = Math.floor((e.clientX - r.left) / r.width * M.width), y = Math.floor((e.clientY - r.top) / r.height * M.height);
        if (path.length > 1 && x === last[0] && y === last[1]) { setTv(v => ({ ...v, g: { ...v.g, path: path.slice(0, -1) } })); return; }
        if (Math.abs(x - last[0]) + Math.abs(y - last[1]) !== 1 || !trNPC.walkable(TN_WORLD, x, y)) return;
        setTv(v => ({ ...v, g: { ...v.g, path: [...path, [x, y]] } })); };
      const check = () => { let k = 0; for (const p2 of path) if (k < ph.via.length && p2[0] === ph.via[k][0] && p2[1] === ph.via[k][1]) k++; const end = path[path.length - 1];
        if (!(k === ph.via.length && Math.abs(end[0] - ph.end[0]) + Math.abs(end[1] - ph.end[1]) <= 1)) return false;
        // ph.slack: 최단 경로(꼭 지날 칸을 차례로 거쳐 도착 칸 옆까지)보다 몇 칸까지 더 걸어도 되는가. 없으면 길이는 보지 않는다.
        return ph.slack === undefined || path.length - 1 <= trShortest([ph.start, ...ph.via], ph.end) + ph.slack; };
      const pts = path.map(p2 => `${(p2[0] + .5) * C},${(p2[1] + .5) * C}`).join(' ');
      body = <div className="tr-debate"><div className="tr-mut" style={{ textAlign: 'center' }}>{ph.title} · {ph.guide}</div>
        <div className="tr-mini" style={{ width: M.width * C, height: M.height * C }} onClick={tap}>
          {TR_A.map ? <img className="tr-px" src={trUrl(TR_A.map.src)} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: .85 }} /> : null}
          <svg style={{ position: 'absolute', inset: 0 }} width="100%" height="100%"><polyline points={pts} fill="none" stroke="#f2c46d" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" opacity={g.ok ? .35 : 1} />
            {g.ok ? <polyline className="tr-draw" points={pts} fill="none" stroke="#fff6d0" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" pathLength="1" /> : null}
            <circle cx={(ph.start[0] + .5) * C} cy={(ph.start[1] + .5) * C} r="5" fill="#9ad87a" /><rect x={ph.end[0] * C - 2} y={ph.end[1] * C - 2} width={C + 4} height={C + 4} fill="none" stroke="#ff9a8a" strokeWidth="2" />
            <circle cx={(last[0] + .5) * C} cy={(last[1] + .5) * C} r="5" fill="#fff" stroke="#3a2a14" /></svg></div>
        <div className="tr-mut" style={{ textAlign: 'center' }}>{path.length - 1}칸 · 이웃 칸을 눌러 잇고, 끝 칸을 다시 누르면 지운다</div>
        <div style={{ display: 'flex', gap: 5 }}><button className="tr-tbtn" disabled={g.ok} onClick={() => setTv(v => ({ ...v, g: { ...v.g, path: [ph.start] } }))}>처음부터</button>
          <button className="tr-tbtn gold" style={{ flex: 2 }} disabled={path.length < 3 || g.ok} onClick={() => { if (check()) { setTv(v => ({ ...v, g: { ...v.g, ok: true } })); setTimeout(() => trialRight('동선 일치'), 1000); } else trialWrong(); }}>이 길이었다</button></div></div>;
    } else if (ph.type === 'dream') body = trDream(ph);
    else if (ph.type === 'crystal') {
      // 진상 결정: 모서리를 누르면 그 자리 단서 다섯 장이 부채꼴로 펼쳐진다
      const g = tv.g, put = g.put || {}, open = g.open, R2 = 88, cx = 174, cy = 118;
      const pts = ph.slots.map((_, i) => { const a2 = -Math.PI / 2 + i * 2 * Math.PI / ph.slots.length; return [cx + R2 * Math.cos(a2), cy + R2 * Math.sin(a2)]; });
      const filled = Object.keys(put).length;
      body = <div className="tr-debate"><div className="tr-mut" style={{ textAlign: 'center' }}>{ph.title} · {ph.guide}</div>
        <div className={'tr-crys' + (g.win ? ' win' : '')}><svg style={{ position: 'absolute', inset: 0 }} width="100%" height="100%"><polygon points={pts.map(p2 => p2.join(',')).join(' ')} fill="#9a7ad822" stroke="#9a7ad8" strokeWidth="2" />
          {pts.map((p2, i) => put[i] ? <line key={i} x1={cx} y1={cy} x2={p2[0]} y2={p2[1]} stroke="#f2c46d" strokeWidth="2" opacity=".7" /> : null)}
          <polygon className="tr-core" points={pts.map(p2 => [cx + (p2[0] - cx) * .32, cy + (p2[1] - cy) * .32].join(',')).join(' ')} fill="#f2c46d" opacity={filled / ph.slots.length * .8 + .12} /></svg>
          {ph.slots.map((sl, i) => <button key={i} className={'tr-face' + (open === i ? ' on' : '') + (put[i] ? ' set' : '')} style={{ left: pts[i][0], top: pts[i][1] }} onClick={() => setTv(v => ({ ...v, g: { ...v.g, open: v.g.open === i ? undefined : i } }))}><small>{sl.label}</small>{put[i] || '?'}</button>)}
          {open !== undefined ? <div className="tr-fan" onClick={() => setTv(v => ({ ...v, g: { ...v.g, open: undefined } }))}>{ph.slots[open].options.map((o, k) => { const ang = -Math.PI / 2 + k * 2 * Math.PI / 5; // 가운데에서 꽃잎처럼 다섯 장
            return <button key={o} className={'tr-fancard' + (put[open] === o ? ' on' : '')} style={{ left: cx + 84 * Math.cos(ang), top: cy + 6 + 78 * Math.sin(ang), animationDelay: (k * .05) + 's' }}
              onClick={e => { e.stopPropagation(); setTv(v => ({ ...v, g: { ...v.g, put: { ...(v.g.put || {}), [open]: o }, open: undefined } })); }}>{o}</button>; })}</div> : null}</div>
        <div className="tr-mut" style={{ textAlign: 'center' }}>{filled} / {ph.slots.length}면 · 모서리를 누르면 단서가 펼쳐진다</div>
        <button className="tr-tbtn gold" disabled={filled < ph.slots.length || g.win} onClick={() => { if (ph.slots.every((sl, i) => put[i] === sl.answer)) { setTv(v => ({ ...v, g: { ...v.g, win: true } })); setTimeout(() => trialRight('진상 결정', 1300), 700); } else trialWrong(); }}>진상을 굳힌다</button></div>;
    } else if (ph.type === 'vote') {
      body = <div className="tr-debate">
        <div className="tr-mut" style={{ textAlign: 'center' }}>투표 · {ph.question}</div>
        <div className="tr-votes">{ph.options.map(id => { const n = tv.votes ? tv.votes.slice(0, tv.vn).filter(x => x.pick === id).length : 0;
          return <button key={id} className={'tr-vote' + (tv.vote === id ? ' on' : '')} onClick={() => !tv.voted && setTv(v => ({ ...v, vote: id }))}>{trPortrait(id, 76, 92)}<b>{trNpc(id).name}{tv.votes ? ' · ' + n + '표' : ''}</b>
          {tv.votes ? <span className="tr-bar"><i style={{ width: (n / tv.votes.length * 100) + '%' }} /></span> : null}</button>; })}</div>
        {tv.votes ? <div className="tr-voters">{tv.votes.map((x, i) => <span key={x.id} className={'tr-voter' + (i < tv.vn ? ' in' : '')}><b>{x.id === 'me' ? '나' : trNpc(x.id).name}</b>{i < tv.vn ? '→' + trNpc(x.pick).name : '…'}</span>)}</div> : null}
        <button className="tr-tbtn gold" disabled={!tv.vote || tv.voted} onClick={() => castVote(ph)}>투표한다</button></div>;
    }
    const maxHp = TR.hp || 5, ch = speakerId && speakerId !== 'host' && speakerId !== 'me' ? (TR_A.chars || {})[speakerId] : null;
    const crack = ['모순!'].includes(tv.fx);
    return <div className="tr-out" ref={outRef} style={{ height: TR_H * scale }}><style>{TN_CSS}</style>
      <div className="tr-card tr-court" style={{ transform: `scale(${scale})` }}>
        {/* 무대: 말하는 사람의 모습(표정 조각)과 재판 참가자 자리 */}
        <div key={T.phase + '-' + speakerId + '-' + (stageFx || (cur && cur.cut) ? tv.idx : '') + (tv.reply ? 'r' : '')} className={'tr-stage' + (mini ? ' mini' : '') + (split ? ' split' : '') + (stageFx ? ' fx-' + stageFx : '')}>
          {TR_A.bg && TR_A.bg[TR.stage || '재판장'] ? <img src={trUrl(TR_A.bg[TR.stage || '재판장'])} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: .6 }} /> : <div className="tr-spot-light" />}
          {!mini && speakerId && speakerId !== 'host' && speakerId !== 'me' && trNpcRaw(speakerId) ? <div className="tr-actor"><div className="tr-actor-in">{trActor(speakerId, cur ? cur.face : nsMissL ? nsMissL.face : nsL ? nsL.face || '' : '', cur ? cur.pose || '' : nsMissL ? nsMissL.pose || '' : nsL ? nsL.pose || '' : '', u => setBadImg(v => ({ ...v, [u]: true })), badImg)}</div></div> : null}
          {!mini && speakerId === 'host' ? <div className={'tr-actor host' + (T.phase === 0 && tv.idx === 0 ? ' enter' : '')}><div className="tr-hspot" /><div className="tr-hspot-floor" />{trHostSil()}</div> : null}
          {split ? <div className="tr-objc"><div className="tr-objc-dim" /><div className="tr-objc-cut">{state.player.look && TR_A.parts ? trCutinImg(state.player.look, { left: 0, top: 0 }) : <div className="tr-objc-band"><div className="tr-objc-face">{trMeSil()}</div></div>}</div><b className="tr-objc-word">반론!</b><span className="tr-objc-name">{state.player.look ? state.player.look.name : '나'}</span></div> : null}
          {stageFx === 'flash' ? <div className="tr-flash" /> : null}
          {cur && cur.cut ? <div className="tr-cutin"><div className="tr-cutband">{trPortrait(cur.who, 70, 84)}<b>{cur.cut}!</b></div></div> : null}
          {stageFx === 'crack' ? trShards() : null}
        </div>
        <div className={'tr-thead' + (tv.fx === 'hit' ? ' shake' : '')}><div><b>{TR.title}</b><div className="tr-mut">재판 · {T.phase + 1}/{TR.phases.length}</div></div>
          <div className="tr-hp">{Array.from({ length: maxHp }, (_, i) => <i key={i} className={(i < T.hp ? 'on' : '') + (tv.fx === 'hit' && i === T.hp ? ' brk' : '')}>{tv.fx === 'hit' && i === T.hp ? <><u /><u /><u /><u /></> : null}</i>)}</div>
          <button className="tr-hbtn" onClick={() => setState(v => trNPC.trialStep(TN_WORLD, v, 'QUIT'))}>중단</button></div>
        {/* 쟁점 진행: 풀린 쟁점은 답이 붙고, 지금 쟁점은 빛난다 */}
        <div className="tr-issues">{issues.map((x, i) => { const held = ((T.hold || 0) & (1 << i)) && !(x.confirmAt != null && T.phase > x.confirmAt), sv = T.phase > solvedUntil(x.id) && !held; return <div key={x.id} className={'tr-issue' + (sv ? ' done' : '') + (held ? ' hold' : '') + (tv.fly && tv.fly.k === i ? ' pop' : '') + (x.id === issueOf && !sv ? ' now' : '')}><i>{i + 1}</i>{held ? '보류 · ' + x.q : sv ? x.a : x.id === issueOf ? x.q : '? ? ?'}</div>; })}</div>
        <div className={'tr-tbody' + (tv.fx === 'hit' ? ' shake' : '')}>{body}</div>
        {tv.fx && !['hit', 'rewind', 'fail'].includes(tv.fx) ? <>{crack ? trShards() : null}<div className={'tr-stamp' + (crack ? ' big' : '')}>{tv.fx === 'ok' ? '반론 성공' : tv.fx}</div></> : null}
        {tv.fx === 'hit' ? <><div className="tr-hurt" /><div className="tr-stamp bad">빗나갔다</div></> : null}
        {tv.fly ? <div className="tr-fly" style={{ '--tx': ((tv.fly.k + .5) / Math.max(1, issues.length) * 100) + '%' }}><i>{tv.fly.k + 1}</i><b>{tv.fly.text}</b></div> : null}
        {ph.type === 'vote' && tv.rl ? trReel(ph, tv) : null}
        {tv.fx === 'rewind' ? <div className="tr-rewind" onClick={() => setTv(v => ({ ...v, fx: '' }))}><div className="tr-ripple"><i /><i /><i /></div><div className="tr-clock"><b /></div>
          <div className="tr-whisper">뭐, 이런 전개도 가능하겠지만…… 그럴 리는 없지. 피곤한가?</div><span className="tr-mut tr-later">눌러서 계속</span></div> : null}
        {tv.fx === 'fail' || T.failed ? <div className="tr-rewind fail"><b>되돌릴 수 없다</b><span className="tr-mut">재판 실패</span><button className="tr-tbtn" onClick={() => setState(v => trNPC.trialStep(TN_WORLD, v, 'QUIT'))}>나가기 (시험)</button></div> : null}
        {manual ? <div className="tr-box" style={{ bottom: 5 }}><div className="tr-mut">아래 내용을 복사해 채팅 입력창에 보내 주세요.</div><textarea className="tr-ta" readOnly rows={5} value={manual} /><button style={{ height: 28 }} onClick={() => setManual('')}>닫기</button></div> : null}
      </div></div>;
  }
  // 먼저 말을 걸어온 인물에게 응답: 대화 화면을 열고 바로 인계(AI가 그 인물의 첫마디를 쓴다)
  function answerCall(id) {
    const asleep = wokeBy === id; setWokeBy('');
    setTalk({ npc: id, idx: 0, shown: 0, cut: false, fresh: true });
    send('T', { npc: id, text: asleep ? '(눈을 뜨고 돌아본다)' : '(돌아본다)', situation: '상황: ' + trJosa(trNpc(id).name, '이', '가') + ' 먼저 다가와 말을 걸었다' + (asleep ? ' · 플레이어는 쉬다가 깜빡 잠들어 있었다' : '') });
  }
  function menuDo(kind) {
    const m = menu; setMenu(null);
    if (m.kind === 'lm') { const lm = TN_WORLD.map.landmarks.find(l => l.id === m.id); if (kind === 'LOOK') setToast(lm.name + '을(를) 살펴봤다 (0초)'); if (kind === 'GO') act({ type: 'MOVE_TO', x: lm.x, y: lm.y }); if (kind === 'SEARCH') { if (busy) return; const next = trNPC.dispatch(TN_WORLD, state, { type: 'SEARCH', landmark: lm.id }); const got = (TN_WORLD.items || []).filter(it => next.player.items[it.id] !== undefined && (state.player.items || {})[it.id] === undefined); setState(next); setToast((next.logs[next.logs.length - 1] || {}).text || ''); if (got.length) setFound(got); } return; }
    const n = state.npcs.find(v => v.id === m.id);
    if (kind === 'TALK') { setTalk({ npc: m.id, idx: 0, shown: 0, cut: false, fresh: true }); setText(''); return; }
    if (kind === 'LOOK') { setToast(trNpc(m.id).name + ' · ' + TR_IMP[n.mode] + ' (0초)'); return; }
    act({ type: kind, npcId: m.id });
  }

  // ---------- 1:1 대화 화면 ----------
  if (talk) {
    const n = talk.npc ? state.npcs.find(v => v.id === talk.npc) : null;
    const def = n ? trNpc(talk.npc) : { name: '상황', color: '#6b7a8c', symbol: '…' };
    const sp = line && !line.narration ? (TN_WORLD.npcs.find(x => trNameIs(x, line.speaker)) || null) : null;
    // 지금 보일 인물: 이 줄까지 마지막으로 말한 사람(서술 줄은 직전 화자 유지). 없으면 대화 상대.
    let who = n ? { npc: trNpc(talk.npc), id: talk.npc, expr: '' } : null;
    if (line) for (let i = talk.idx; i >= 0; i--) { const L = tlines[i]; if (!L.narration) { const m = TN_WORLD.npcs.find(x => trNameIs(x, L.speaker)); who = { npc: m ? trNpc(m.id) : { name: L.speaker, color: '#6b7a8c', symbol: '?' }, id: m ? m.id : '', expr: L.expression, pose: L.pose || '' }; break; } }
    const ch = who && who.id && (TR_A.chars || {})[who.id];
    const face = ch ? trFace(ch, who.expr) : '';
    const bg = trUrl((TR_A.bg || {})[trArea(state.player.x, state.player.y)]);
    const boxBottom = canInput ? 92 : 5;
    return <div className="tr-out" ref={outRef} style={{ height: TR_H * scale }}><style>{TN_CSS}</style>
      <div className="tr-card" style={{ transform: `scale(${scale})`, background: TR_BG[Math.max(0, area)] }}>
        <div className="tr-talk">
          {bg && !badImg[bg] ? <img src={bg} alt="" onError={() => setBadImg(v => ({ ...v, [bg]: true }))} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
          <div key={'fx' + talk.idx + (talk.local ? 'L' : '')} className={'tr-tfx' + (line && line.fx ? ' ' + line.fx : '')}>
          {who && who.id ? trActor(who.id, who.expr, who.pose, u => setBadImg(v => ({ ...v, [u]: true })), badImg) : who ?
            <svg viewBox="0 0 360 540" style={{ position: 'absolute', inset: 0 }} aria-hidden="true"><ellipse cx="180" cy="520" rx="150" ry="230" fill={who.npc.color} opacity=".55" /><circle cx="180" cy="190" r="78" fill={who.npc.color} opacity=".9" /><text x="180" y="212" textAnchor="middle" fontSize="64" fontWeight="700" fill="#14212c">{who.npc.symbol}</text></svg> : null}
          </div>
          {line && line.fx === 'flash' ? <div key={'fl' + talk.idx} className="tr-flash" /> : null}
          {line && line.fx === 'crack' ? <div key={'cr' + talk.idx}>{trShards()}</div> : null}
          {debug && talk.npc && !sent ? <div className="tr-dbgrow">{talk.local ? <button onClick={() => setTalk(v => ({ ...v, local: null, fresh: true, idx: 0, shown: 0 }))}>■ 시험 끝</button> : null}
            {trDebugTalk(state, talk.npc).map((b, i) => <button key={i} onClick={() => setTalk(v => ({ ...v, local: trTalk.paginate(b.lines), idx: 0, shown: 0, fresh: false, done: false }))}>{b.label}</button>)}</div> : null}
          <div className="tr-hud"><span className="tr-pill">{def.name} · {trArea(n ? n.x : state.player.x, n ? n.y : state.player.y)}</span><span style={{ flex: 1 }} /><span className="tr-pill tr-time">{trNPC.clock(state.clock)}</span></div>
          <div className="tr-toast" style={{ right: 'auto' }}>{closed ? '조사 시간이 끝났다 · 대화를 마치면 재판으로' : toast || (n ? TR_IMP[n.mode] : '행동의 결과')}</div>
          {line ? <div className="tr-box" style={{ bottom: boxBottom }} onClick={() => { if (talk.cut) return; if (!full) setTalk(v => ({ ...v, shown: chars.length })); else if (!lastLine) setTalk(v => ({ ...v, idx: v.idx + 1, shown: 0 })); else if (talk.block) { setToast(talk.block); setTalk(null); } }}>
            <div className="tr-name"><b style={{ color: sp ? sp.color : '#b9c9d6' }}>{line.narration ? '서술' : line.speaker}{line.expression ? ' · ' + line.expression : ''}</b><span>{talk.local && !talk.block ? '시험 · ' : ''}{talk.idx + 1}/{tlines.length}{talk.cut ? ' · 멈춤' : full ? ' ▼' : ''}</span></div>
            <div className={'tr-line' + (line.narration ? ' narr' : '')}>{trTyped(segsL, talk.shown)}</div>
            <div className="tr-ctl" onClick={e => e.stopPropagation()}>
              <button disabled={talk.idx < 1 || talk.cut} onClick={() => setTalk(v => ({ ...v, idx: v.idx - 1, shown: 0 }))}>‹</button>
              <button disabled={lastLine || talk.cut} onClick={() => setTalk(v => ({ ...v, idx: v.idx + 1, shown: 0 }))}>›</button>
              <button disabled={talk.cut} onClick={() => setTalk(v => ({ ...v, shown: 0 }))}>↺</button>
              <span style={{ flex: 1 }} />
              {!(lastLine && full) && !talk.cut ? <button disabled={busy} onClick={() => { setTalk(v => ({ ...v, cut: true })); setText(''); }}>끼어들기</button> : null}
              {talk.cut ? <button onClick={() => setTalk(v => ({ ...v, cut: false }))}>끼어들기 취소</button> : null}
              <button disabled={busy || talk.cut} onClick={endTalk}>{lastLine && full ? '대화 끝' : '넘기고 닫기'}</button>
            </div></div> : null}
          {canInput ? <div className="tr-in">
            {drop && n ? <div className="tr-drop">
              {n.mode === 'accompany' ? <button onClick={() => talkAction('RELEASE')}>동행 종료</button> : <button disabled={n.mode === 'busy' || (n.intent && !n.intent.interruptible)} onClick={() => talkAction('ACCOMPANY')}>동행 요청</button>}
              <button onClick={() => talkAction('LOOK')}>관찰 (0초)</button>
              {(TN_WORLD.items || []).filter(it => (state.player.items || {})[it.id] !== undefined).map(it => <button key={it.id} className={pres === it.id ? 'on' : ''} onClick={() => { setPres(v => v === it.id ? '' : it.id); setDrop(false); }}>제시: {it.name}</button>)}
              {!(TN_WORLD.items || []).some(it => (state.player.items || {})[it.id] !== undefined) ? <button disabled>제시할 증거 없음</button> : null}
            </div> : null}
            <div className="tr-in-top">{n ? <button onClick={() => setDrop(v => !v)}>행동 ▾</button> : null}<button onClick={() => setText(v => v + '**')}>*</button><button onClick={() => setText(v => v + '""')}>"</button>
              {pres ? <button className="tr-pres" onClick={() => setPres('')}>제시: {((TN_WORLD.items || []).find(x => x.id === pres) || {}).name} ✕</button> : null}
              <span style={{ flex: 1 }} />{talk.cut ? <span className="tr-mut">끊은 뒤 대사는 무효</span> : !line ? <button onClick={endTalk}>대화 끝</button> : null}</div>
            <div style={{ display: 'flex', gap: 4 }}><textarea className="tr-ta" rows={2} value={text} placeholder={n ? def.name + '에게 할 말이나 행동' : '이어서 할 행동'} onChange={e => setText(e.target.value.slice(0, 500))} />
              <button className="tr-send" disabled={!text.trim() && !pres} onClick={() => send(talk.cut ? 'I' : 'T')}>보내기</button></div>
          </div> : null}
          {sent ? <div className="tr-box" style={{ bottom: 5 }}><div className="tr-line" style={{ height: 'auto' }}>전달했습니다. AI 응답의 새 화면에서 이어집니다.</div></div> : null}
          {manual ? <div className="tr-box" style={{ bottom: 5 }}><div className="tr-mut">자동 전송을 쓸 수 없는 환경입니다. 아래 내용을 복사해 채팅 입력창에 보내 주세요.</div>
            <textarea className="tr-ta" readOnly rows={5} value={manual} onFocus={e => e.target.select()} /><button style={{ height: 28 }} onClick={() => setManual('')}>닫기</button></div> : null}
        </div></div></div>;
  }

  // ---------- 재판 화면 ----------
  if (ckShow) return trCheckin();
  const investigating = trNPC.inInvestigation(TN_WORLD, state);
  if (state.trial && !talk && !investigating) return trTrialScreen();

  // ---------- 탐색 화면 ----------
  const vis = state.npcs.filter(n => debug || trVisible(state, n));
  const mn = menu && menu.kind === 'npc' ? state.npcs.find(v => v.id === menu.id) : null;
  const ml = menu && menu.kind === 'lm' ? TN_WORLD.map.landmarks.find(l => l.id === menu.id) : null;
  const dist = mn ? Math.abs(p.x - mn.x) + Math.abs(p.y - mn.y) : 0;
  const talkOk = !!mn && dist <= (TN_WORLD.talkRange || 2) && trVisible(state, mn);
  const near = dist <= 1, canAcc = near && mn && mn.mode !== 'busy' && mn.mode !== 'accompany' && (!mn.intent || mn.intent.interruptible);
  const caller = trNPC.caller(TN_WORLD, state);
  const recent = state.logs.filter(e => e.visible && e.type === 'world' && state.clock - e.time < 600).slice(-1)[0];
  const nextNote = trNotices(state.clock, state.clock + 86400)[0];
  return <div className="tr-out" ref={outRef} style={{ height: TR_H * scale }}><style>{TN_CSS}</style>
    <div className="tr-card" style={{ transform: `scale(${scale})` }}>
      <div ref={svgRef} className="tr-map" onClick={tapMap}>
        <div className="tr-world" style={{ width: TN_WORLD.map.width * TR_CELL, height: TN_WORLD.map.height * TR_CELL, transform: `translate(${-camX}px,${-camY}px)`, transition: roomChanged ? 'none' : undefined,
          clipPath: 'none' }}>
          {TR_A.map && !badImg[trUrl(TR_A.map.src)] ? <img className="tr-px" src={trUrl(TR_A.map.src)} alt="" onError={() => setBadImg(v => ({ ...v, [trUrl(TR_A.map.src)]: true }))} style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }} />
            : <svg style={{ position: 'absolute', inset: 0 }} width="100%" height="100%">{trStaticLayer()}</svg>}
          {TN_WORLD.map.areas.map((a, i) => i === room ? null : <div key={'f' + i} className="tr-fog" style={{ left: a.x0 * TR_CELL, top: a.y0 * TR_CELL - 18, width: (a.x1 - a.x0 + 1) * TR_CELL, height: (a.y1 - a.y0 + 1) * TR_CELL + 18, opacity: debug ? .3 : .74 }} />)}
          <svg style={{ position: 'absolute', inset: 0, overflow: 'visible' }} width="100%" height="100%" pointerEvents="none">
            {(preview ? preview.path : p.route).map((q, i) => <circle key={i} cx={(q.x + .5) * TR_CELL} cy={(q.y + .5) * TR_CELL} r={i === (preview ? preview.path : p.route).length - 1 ? 7 : 3.5} fill={preview ? '#f6e3b4' : '#f2c46d'} opacity={preview ? .9 : .75} stroke="#3a2a14" strokeWidth="1" />)}
            {ml ? [[ml.x, ml.y], ...(ml.hit || [])].map(([hx, hy], i) => <rect key={i} x={hx * TR_CELL + 2} y={hy * TR_CELL + 2} width={TR_CELL - 4} height={TR_CELL - 4} rx="6" fill="none" stroke="#f6d48a" strokeWidth="2" strokeDasharray={i ? '4 3' : ''} />) : null}
          </svg>
          {[...vis.map(n => ({ id: n.id, x: n.x, y: n.y, n })), { id: 'player', x: p.x, y: p.y, n: null }].sort((a, b) => a.y - b.y).map(c => trCharSprite(c, animRef, movedRef, menu && menu.id === c.id, badImg, state.player.look))}
        </div>
        <div key={'fade' + room} className="tr-fade" />
      </div>
      <div className="tr-hud"><span className="tr-pill tr-area"><i />{RM.name}</span><span className="tr-pill tr-time">{state.day}일 {trNPC.clock(state.clock)}</span><span style={{ flex: 1 }} />
        <button className="tr-hbtn" disabled={busy} title="10초 진행" onClick={() => { setPreview(null); setState(v => trNPC.dispatch(TN_WORLD, v, { type: 'WAIT', seconds: 10 })); }}>+10초</button><button className="tr-hbtn" onClick={() => setSheet('rest')}>휴식</button><button className="tr-hbtn" onClick={() => setSheet('note')}>노트</button><button className="tr-hbtn" aria-label="메뉴" onClick={() => setSheet('set')}>≡</button></div>
      {investigating ? (() => { const ph = TN_WORLD.trials[state.trial.i].phases[state.trial.phase]; return <div className="tr-inv"><b>조사 중</b><span>마감 {trHM(state.trial.sub)}</span>
        {ph.declare ? <button disabled={busy} onClick={() => trialNext()}>조사 끝 · 재판으로</button> : <span className="tr-mut">마감이 되면 재판이 열린다</span>}</div>; })()
        : (TN_WORLD.cases || []).filter(c => ((state.cases || {})[c.id] || [])[0] === 1).map(c => { const l = TN_WORLD.map.landmarks.find(x => x.id === c.spot); const here = state.npcs.filter(n => trNPC.areaOf(TN_WORLD, n.x, n.y) === trNPC.areaOf(TN_WORLD, l.x, l.y)).length, inRoom = trNPC.areaOf(TN_WORLD, state.player.x, state.player.y) === trNPC.areaOf(TN_WORLD, l.x, l.y);
          return <div key={c.id} className="tr-inv"><b>사건 발생</b><span>{inRoom ? '모이는 중 ' + here + '/' + state.npcs.length + ' · 최대 ' + trHM(state.cases[c.id][1] + (c.wait || 600)) + '까지 기다림' : trArea(l.x, l.y) + '(으)로 모인다'}</span></div>; })}
      <div className="tr-offnote">입력창에 직접 치면 마지막 전송 시점으로 돌아갑니다</div>
      <div className="tr-toast">{toast || (recent ? trHM(recent.time) + ' ' + recent.text : nextNote ? '다음 공지 ' + trHM(nextNote.t) + ' ' + nextNote.n.text + (nextNote.n.place ? ' · ' + nextNote.n.place : '') : '인물·물건을 누르면 행동을 고를 수 있다')}</div>
      {caller && !found && !menu && !preview ? <div className="tr-call"><div><b>{trJosa(trNpc(caller.id).name, '이', '가')}</b> 다가와 말을 걸었다{wokeBy === caller.id ? ' · 깜빡 잠들어 있었다' : ''}</div>
        <div style={{ display: 'flex', gap: 5, marginTop: 5 }}><button className="tr-callyes" disabled={busy} onClick={() => answerCall(caller.id)}>돌아본다</button><button disabled={busy} onClick={() => { act({ type: 'DISMISS_CALL', npcId: caller.id }); setWokeBy(''); }}>나중에</button></div></div> : null}
      {found ? <div className="tr-found" onClick={() => setFound(null)}><div className="tr-found-h">증거 획득</div>{found.map(it => <div key={it.id}><b>{it.name}</b><div className="tr-mut">{it.desc}</div></div>)}<div className="tr-mut" style={{ textAlign: 'right' }}>눌러서 닫기 · 노트 › 증거</div></div> : null}
      <div className="tr-padbase" />
      {[[0, -1, 38, 425, 0], [-1, 0, 4, 459, 270], [1, 0, 72, 459, 90], [0, 1, 38, 493, 180]].map(([dx, dy, x, y, r]) => <button key={r} className="tr-pad" style={{ left: x, top: y }} disabled={busy} onPointerDown={e => { e.preventDefault(); padDown(dx, dy); }} onPointerUp={padUp} onPointerLeave={padUp} onPointerCancel={padUp}>
        <svg width="14" height="14" viewBox="0 0 14 14" style={{ transform: `rotate(${r}deg)` }}><path d="M7 2 L12.5 11 L1.5 11 Z" fill="currentColor" /></svg></button>)}
      {preview && !menu ? <div className="tr-preview" onClick={() => setPreview(null)}>{preview.path.length}칸 · {preview.sec}초 걸림 — 같은 칸을 한 번 더 누르면 출발</div> : null}
      {mn ? <div className="tr-menu"><div className="tr-menu-h"><b>{trNpc(mn.id).name}</b><span>{dist}칸 · {TR_IMP[mn.mode]}</span></div>
        <div className="tr-menu-g">
          <button disabled={!talkOk || busy} onClick={() => menuDo('TALK')}>대화</button>
          <button disabled={!canAcc || busy} onClick={() => menuDo('ACCOMPANY')}>동행 요청</button>
          <button disabled={mn.mode !== 'accompany' || busy} onClick={() => menuDo('RELEASE')}>동행 종료</button>
          <button disabled={busy} onClick={() => menuDo('LOOK')}>관찰 0초</button></div>
        {!near ? <div className="tr-menu-why">대화·동행은 바로 옆 칸에서 할 수 있다</div> : mn.mode === 'busy' ? <div className="tr-menu-why">지금은 하던 일에 집중하고 있다</div> : null}</div> : null}
      {ml ? <div className="tr-menu"><div className="tr-menu-h"><b>{ml.name}</b><span>{Math.abs(p.x - ml.x) + Math.abs(p.y - ml.y)}칸</span></div>
        <div className="tr-menu-g"><button onClick={() => menuDo('LOOK')}>관찰 0초</button><button onClick={() => menuDo('SEARCH')}>조사</button><button onClick={() => menuDo('GO')}>여기로 이동</button><button onClick={() => setMenu(null)}>닫기</button></div></div> : null}
      {sent ? <div className="tr-preview" style={{ left: 112 }}>전달했습니다. 새 화면에서 이어집니다.</div> : null}
      {gal ? trGallery(gal, setGal, badImg, setBadImg) : null}
      {sheet ? trSheet({ onDbg: (fn, msg) => { setState(v => { const x = trNPC.clone(v); fn(x); return x; }); if (msg) setToast(msg); }, onGal: () => { setGal({ id: TN_WORLD.npcs[0].id, pose: 'default', face: '기본' }); setSheet(''); }, onLook: () => { setCk(state.player.look || AV_DEFAULT); setSheet(''); }, onRel: (id, sc, d2) => setState(v => { const x = trNPC.clone(v); trNPC.relAdd(TN_WORLD, x, id, { [sc]: d2 }); return x; }), ev: boot.ev, heard: heardRef.current || (k ? { raw: String(k), accepted: [], rejected: [], wait: true } : null), free, tab: sheet, setTab: setSheet, state, debug, setDebug, busy, rest: { h: restH, setH: setRestH, mi: restM, setMi: setRestM }, onSkip: skipTo, onTrial: code => { setState(trNPC.startTrial(TN_WORLD, state, code)); setSheet(''); setTv({ reply: false, idx: 0, shown: 0, stmt: 0, drawer: false, vote: '', ev: '', fx: '', voted: false, g: {} }); }, onTrialAt: (code, n) => { let x = trNPC.startTrial(TN_WORLD, state, code); for (let i = 0; i < n; i++) x = trNPC.trialStep(TN_WORLD, x, 'NEXT'); setState(x); setSheet(''); setTv({ reply: false, idx: 0, shown: 0, stmt: 0, drawer: false, vote: '', ev: '', fx: '', voted: false, g: {} }); }, onUnstuck: () => { const n = trNPC.dispatch(TN_WORLD, state, { type: 'UNSTUCK' }); setState(n); setSheet(''); setToast((n.logs[n.logs.length - 1] || {}).text || ''); }, pick, setPick,
        onWait: sec => { act({ type: 'WAIT', seconds: sec }); setSheet(''); }, codeText, setCodeText,
        onRestore: () => { try { const v = trCodec.unpack(TN_WORLD, codeText.trim()); setState(trNPC.applyTalk(TN_WORLD, v, 0)); setSheet(''); setToast('상태 코드를 복원했습니다'); } catch (e) { setToast('복원 실패: ' + e.message); } },
        onFree: () => { setSheet('free'); setText(''); }, text, setText, send, sent }) : null}
    </div></div>;
}

// 움직이지 않는 지도 층: 한 번만 만들고 다시 그리지 않는다.
// 움직이지 않는 지도 층(함수 호출로 사용: 대문자 이름은 UUMMAI가 별도 컴포넌트로 인식하므로 피한다).
const trStaticLayer = (() => {
  let cache = null;
  return () => {
    if (cache) return cache;
    const out = [];
    TN_WORLD.map.rows.forEach((row, y) => row.split('').forEach((c, x) => { const i = trNPC.areaOf(TN_WORLD, x, y); out.push(<rect key={x + '-' + y} x={x * TR_CELL} y={y * TR_CELL} width={TR_CELL} height={TR_CELL} fill={c === '#' ? '#0f1a27' : TR_BG[Math.max(0, i)]} stroke="#5f7585" strokeOpacity=".09" />); }));
    TN_WORLD.map.landmarks.forEach(l => out.push(<g key={'l' + l.id}><rect x={l.x * TR_CELL + 6} y={l.y * TR_CELL + 6} width={TR_CELL - 12} height={TR_CELL - 12} rx="4" fill="#e0bc78" opacity=".22" /><text x={(l.x + .5) * TR_CELL} y={(l.y + .5) * TR_CELL + 6} fontSize="16" textAnchor="middle" fill="#eddbaf">{l.icon}</text></g>));
    cache = <g pointerEvents="none">{out}</g>;
    return cache;
  };
})();

// 디버그 도구: 증거·앨범·기억 즉시 획득, 깃발 켜고 끄기, 방 이동, 사건 즉시 발생, 표정·자세 갤러리
function trDebugBox(state, onDbg, onGal) {
  const W = TN_WORLD, flags = [...new Set([...(W.debugFlags || []), ...(W.cases || []).map(c => c.flag), ...W.npcs.map(n => n.alias && n.alias.until).filter(Boolean)])];
  const tp = a => onDbg(x => { const cx = (a.x0 + a.x1) >> 1, cy = (a.y0 + a.y1) >> 1, occ = new Set(x.npcs.map(n => n.x + ',' + n.y)); let best = null;
    for (let y = a.y0; y <= a.y1; y++) for (let xx = a.x0; xx <= a.x1; xx++) if (trNPC.walkable(W, xx, y) && !occ.has(xx + ',' + y)) { const d = Math.abs(xx - cx) + Math.abs(y - cy); if (!best || d < best[0]) best = [d, xx, y]; }
    if (best) { x.player.x = best[1]; x.player.y = best[2]; x.player.route = []; } }, a.name + '(으)로 이동');
  return <div className="tr-dbgbox">
    <div className="tr-mut">디버그 도구</div>
    <div className="tr-dbgrw">
      <button onClick={() => onDbg(x => { for (const it of W.items || []) if (x.player.items[it.id] === undefined) x.player.items[it.id] = x.clock; }, '증거 전부 획득')}>증거 전부</button>
      <button onClick={() => onDbg(x => { for (const sc of W.scenes || []) if (x.player.scenes[sc.id] === undefined) x.player.scenes[sc.id] = x.clock; }, '앨범 전부 획득')}>앨범 전부</button>
      <button onClick={() => onDbg(x => { const have = new Set(x.player.mem.map(m => m[0])); for (const f of W.facts || []) if (!have.has(f.id)) x.player.mem.push([f.id, 0, x.clock]); }, '기억 전부 획득')}>기억 전부</button>
      <button onClick={() => onDbg(x => { x.player.items = {}; x.player.given = {}; x.player.scenes = {}; }, '증거·앨범 비움')}>비우기</button>
      <button onClick={onGal}>표정·자세 갤러리</button>
    </div>
    <div className="tr-mut">증거 하나씩</div>
    <div className="tr-dbgrw">{(W.items || []).map(it => <button key={it.id} className={state.player.items[it.id] !== undefined ? 'on' : ''} onClick={() => onDbg(x => { if (x.player.items[it.id] === undefined) x.player.items[it.id] = x.clock; else delete x.player.items[it.id]; })}>{it.name}</button>)}</div>
    {flags.length ? <><div className="tr-mut">깃발</div><div className="tr-dbgrw">{flags.map(f => <button key={f} className={state.flags[f] ? 'on' : ''} onClick={() => onDbg(x => { x.flags[f] = !x.flags[f]; })}>{f}</button>)}</div></> : null}
    <div className="tr-mut">방 이동</div>
    <div className="tr-dbgrw">{W.map.areas.map((a, i) => <button key={i} onClick={() => tp(a)}>{a.name}</button>)}</div>
    {(W.cases || []).length ? <><div className="tr-mut">사건 즉시 발생(발견 처리)</div><div className="tr-dbgrw">{W.cases.map(c => <button key={c.id} onClick={() => onDbg(x => { x.flags[c.flag] = true; x.cases = x.cases || {}; x.cases[c.id] = [1, x.clock - (c.wait || 600), 0]; }, c.id + ' 발견')}>{c.id}</button>)}</div></> : null}
  </div>;
}
function trGallery(g, setG, badImg, setBadImg) {
  const W = TN_WORLD, c = (TR_A.chars || {})[g.id], P = trPoses(c), poses = ['default', 'think', 'point', 'crossed'];
  const has = (pose, f) => trHasFace(P[pose], f);
  return <div className="tr-gal"><div className="tr-gal-stage"><div className="tr-actor-in" style={{ transform: 'none' }}>{trActor(g.id, g.face, g.pose, u => setBadImg(v => ({ ...v, [u]: true })), badImg)}</div>
    <div className="tr-gal-cap">{trNpc(g.id).name} · {TR_POSE_NAME[g.pose]} · {g.face}{has(g.pose, g.face) ? '' : ' (없음→대체)'}</div></div>
    <div className="tr-dbgrw">{W.npcs.map(n => <button key={n.id} className={n.id === g.id ? 'on' : ''} onClick={() => setG({ ...g, id: n.id })}>{trNpc(n.id).name}</button>)}</div>
    <div className="tr-dbgrw">{poses.map(p => <button key={p} className={p === g.pose ? 'on' : ''} onClick={() => setG({ ...g, pose: p })}>{TR_POSE_NAME[p]}{P[p] ? '' : '·'}</button>)}</div>
    <div className="tr-dbgrw">{TR_FACES.map(f => <button key={f} className={(f === g.face ? 'on' : '') + (has(g.pose, f) ? '' : ' dim')} onClick={() => setG({ ...g, face: f })}>{f}</button>)}</div>
    <div className="tr-dbgrw"><button onClick={() => setG(null)}>닫기</button></div>
  </div>;
}
function trSheet({ onDbg, onGal, ev, heard, free, tab, setTab, state, debug, setDebug, busy, onSkip, onUnstuck, onTrial, onTrialAt, onRel, onLook, pick, setPick, rest, onWait, codeText, setCodeText, onRestore, onFree, text, setText, send, sent }) {
  const tabs = [['note', '수첩'], ['scene', '목격'], ['item', '증거'], ['clue', '단서'], ['rest', '휴식'], ['set', '설정']];
  const mem = (state.player.mem || []).slice().reverse();
  return <div className="tr-sheet">
    <div className="tr-tabs">{tabs.map(([k, l]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => { setTab(k); setPick(null); }}>{l}</button>)}<button style={{ flex: 'none', width: 34 }} onClick={() => setTab('')}>✕</button></div>
    <div className="tr-body">
      {tab === 'clue' ? (mem.length ? mem.map((m, i) => <div className="tr-row" key={i}><time>{trHM(m[2])}</time>{trFact(m[0], m[1], 'player')}</div>) : <div className="tr-mut">아직 직접 보거나 들은 단서가 없다.</div>) : null}
      {tab === 'item' ? (() => { const its = (TN_WORLD.items || []).filter(it => (state.player.items || {})[it.id] !== undefined).sort((a, b) => state.player.items[b.id] - state.player.items[a.id]);
        return its.length ? its.map(it => { const l = TN_WORLD.map.landmarks.find(x => x.id === it.at); return <div className="tr-row" key={it.id}><b>{it.name}</b> <span className="tr-mut">{Math.floor(state.player.items[it.id] / 86400) + 1}일 {trHM(state.player.items[it.id])} · {(state.player.given || {})[it.id] ? '지배인에게서 받음' : (l ? l.name : '') + '에서 발견'}</span><div className="tr-mut">{it.desc}</div></div>; }) : <div className="tr-mut">아직 찾은 증거가 없다. 물건을 눌러 「조사」하면 찾을 수 있다.</div>; })() : null}
      {tab === 'rest' ? trRest({ state, busy, onSkip, ...rest }) : null}
      {tab === 'note' ? trNotebook(state, pick, setPick, debug ? onRel : null) : null}
      {tab === 'scene' ? trScenes(state, pick, setPick) : null}
      {tab === 'set' ? <div style={{ display: 'grid', gap: 6, paddingTop: 4 }}>
        <button style={{ height: 32 }} disabled={busy} onClick={onFree}>자유 행동 · 추리 입력</button>
        <button style={{ height: 32 }} disabled={busy} onClick={onUnstuck}>끼임 탈출 (움직일 수 없을 때 가까운 빈칸으로)</button>
        {(TN_WORLD.trials || []).map(t => <div key={t.code} style={{ display: 'grid', gap: 4 }}><button style={{ height: 32 }} disabled={busy || !!state.trial} onClick={() => onTrial(t.code)}>재판 시제품 시작 · {t.title} (시험)</button>
          <div className="tr-mut">단계 바로가기(시험용)</div>
          <div className="tr-grid h">{t.phases.map((ph, i) => <button key={i} disabled={busy || !!state.trial} title={ph.title || ph.type} onClick={() => onTrialAt(t.code, i)}>{i + 1}</button>)}</div>
          <div className="tr-mut">{t.phases.map((ph, i) => (i + 1) + '.' + ({ talk: '대사', debate: '증거 제시', pairs: '엇갈린 증언', combine: '구절 짝짓기', rebut: 'AI 반론', develop: '기억 현상', route: '동선 재현', strings: '실 엮기', dream: '꿈 조각', crystal: '진상 결정', vote: '투표' }[ph.type] || ph.type)).join(' · ')}</div></div>)}
        <button onClick={onLook}>외형 다시 고르기(체크인 카드)</button>
        <div className="tr-mut">관계 조절(시험용 · ±10점, 20점마다 한 단계)</div>
        {TN_WORLD.npcs.map(n => <div key={n.id} className="tr-relbox"><b>{n.name}</b>{trRelBars(state, n.id, onRel)}</div>)}
        <div className="tr-mut">최근 기록</div>
        <div style={{ maxHeight: 130, overflowY: 'auto' }}>{state.logs.filter(e => debug || e.visible).slice(-20).reverse().map((e, i) => <div className="tr-row" key={i} style={{ fontSize: 12 }}><time>{trHM(e.time)}</time>{e.text}</div>)}</div>
        <label className="tr-mut"><input type="checkbox" checked={debug} onChange={e => setDebug(e.target.checked)} /> 디버그 (숨은 인물·기록 표시)</label>
        {debug ? trDebugBox(state, onDbg, onGal) : null}
        <div className="tr-mut">상태 코드</div><div className="tr-mono">{trCodec.pack(TN_WORLD, state)}</div>
        <textarea className="tr-ta" rows={2} value={codeText} onChange={e => setCodeText(e.target.value)} placeholder="복원할 상태 코드" />
        <button style={{ height: 30 }} disabled={busy} onClick={onRestore}>이 코드로 복원</button>
        {free ? <div className="tr-mut">이 화면: 화면 밖 대화의 응답(시간 변화 없음)</div> : null}
        {heard ? <div className="tr-mut">받은 증언 코드: {heard.raw} · {heard.wait ? '대사를 다 들으면 반영' : '인정 ' + (heard.accepted.join(',') || '없음')}{heard.rejected.length ? ' · 거부 ' + heard.rejected.map(r => r[0] + '(' + r[1] + ')').join(', ') : ''}</div> : null}
        {ev ? <div className="tr-mut">받은 사건 코드: {ev.code} · {ev.accepted ? '인정' : '거부(' + (ev.reason || '조건 불일치') + ')'}</div> : null}
        <div className="tr-mut">표식: {trNPC.markers(TN_WORLD, state).join(' ')}</div>
        <div className="tr-mut">시험판 v2.0 · 「라운지의 사라진 브로치」(본편 아님)</div></div> : null}
      {tab === 'free' ? <div style={{ display: 'grid', gap: 6, paddingTop: 4 }}>
        <div className="tr-mut">인물이 아닌 상대로 하는 행동이나, 지금까지의 추리를 적는다.</div>
        <textarea className="tr-ta" rows={4} value={text} onChange={e => setText(e.target.value.slice(0, 500))} placeholder="행동이나 추리" />
        <div style={{ display: 'flex', gap: 4 }}><button style={{ flex: 1, height: 34 }} disabled={!text.trim() || !!sent} onClick={() => send('P')}>행동 전달</button><button style={{ flex: 1, height: 34 }} disabled={!text.trim() || !!sent} onClick={() => send('A')}>추리 제시</button></div>
        {sent ? <div className="tr-mut">전달했습니다. 새 화면에서 이어집니다.</div> : null}</div> : null}
    </div></div>;
}

// 휴식 패널: 다음 시간대까지 / 자고 아침으로 / 시각 지정. 미리보기는 공지 일정만(남의 계획은 보이지 않는다).
function trRest({ state, busy, onSkip, h, setH, mi, setMi }) {
  const now = state.clock, D = 86400, sl = trNPC.slotOf(TN_WORLD, state), slots = TN_WORLD.slots || [];
  const nextSlot = (() => { for (let d = Math.floor(now / D); d <= Math.floor(now / D) + 1; d++) for (const x of slots) { const t = d * D + trNPC.absTime(x.from); if (t > now) return { t, name: x.name }; } return null; })();
  const morning = (() => { const t = Math.floor(now / D) * D + 7 * 3600; return t > now + 3600 ? t : t + D; })();
  const pick = h >= 0 ? (() => { const t = Math.floor(now / D) * D + h * 3600 + mi * 60; return t > now ? t : t + D; })() : 0;
  const label = t => (Math.floor(t / D) + 1) + '일 ' + trHM(t), dur = t => { const m = Math.round((t - now) / 60); return (m >= 60 ? Math.floor(m / 60) + '시간 ' : '') + (m % 60) + '분 뒤'; };
  const notes = pick ? trNotices(now, pick) : [];
  return <div style={{ display: 'grid', gap: 6, paddingTop: 4 }}>
    <div className="tr-mut">지금 {label(now)}{sl ? ' · ' + sl.name : ''} · 쉬는 동안에도 다른 사람들은 움직인다. 누가 나타나거나 공지가 있으면 멈춘다.</div>
    {nextSlot ? <button className="tr-big" disabled={busy} onClick={() => onSkip(nextSlot.t)}>다음 시간대까지 쉬기<small>{nextSlot.name} {label(nextSlot.t)} · {dur(nextSlot.t)}</small></button> : null}
    <button className="tr-big" disabled={busy} onClick={() => onSkip(morning)}>자고 아침으로<small>{label(morning)} · {dur(morning)}</small></button>
    <div className="tr-mut" style={{ marginTop: 4 }}>시각 지정</div>
    <div className="tr-grid h">{Array.from({ length: 24 }, (_, i) => <button key={i} className={h === i ? 'on' : ''} onClick={() => setH(i)}>{String(i).padStart(2, '0')}</button>)}</div>
    <div className="tr-grid m">{[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(m => <button key={m} className={mi === m ? 'on' : ''} onClick={() => setMi(m)}>:{String(m).padStart(2, '0')}</button>)}</div>
    {pick ? <div className="tr-prev"><b>{label(pick)}</b> · {dur(pick)}{notes.length ? notes.map((x, i) => <div key={i} className="tr-mut">{trHM(x.t)} 공지 · {x.n.text}{x.n.place ? ' (' + x.n.place + ')' : ''} — 지나감(멈추지 않음)</div>) : <div className="tr-mut">그 사이 공지 없음</div>}</div> : null}
    <button className="tr-big" disabled={busy || !pick} onClick={() => onSkip(pick, true)} style={pick && Math.floor(pick / D) > Math.floor(now / D) ? { borderColor: '#d07070' } : null}>{!pick ? '시각을 고르세요' : Math.floor(pick / D) > Math.floor(now / D) ? '이미 지난 시각 → 내일 ' + trHM(pick) + '까지 건너뛰기' : trHM(pick) + '까지 건너뛰기'}</button>
  </div>;
}

// ---------- 인물 수첩 · 목격 장면 (글 기록을 쌓지 않고, 정해 둔 메모·장면만 해금) ----------
function trNoteOpen(st, id, u) {
  u = u || {}; const p = st.player;
  if (u.talked) return (p.talked || {})[id] !== undefined;
  if (u.seen) return !!(p.seen || {})[id];
  if (u.fact) return (p.mem || []).some(m => m[0] === u.fact);
  if (u.scene) return (p.scenes || {})[u.scene] !== undefined;
  if (u.flag) return !!st.flags[u.flag];
  return true;
}
// 인물 그림: 대화용 몸 그림이 있으면 윗부분, 없으면 탐색 스프라이트(정면)를 크게.
function trPortrait(id, w, h) {
  const c = (TR_A.chars || {})[id], sp = TR_A.sprites, row = sp ? sp.ids.indexOf(id) : -1, df = trNpc(id);
  const P = c && c.poses && c.poses.default;
  if (P && P.src && P.eye) { const k = w * .3 / (P.ed || P.w * .12); // 자세 그림: 눈을 기준으로 얼굴·상반신을 잘라 보인다
    return <div style={{ width: w, height: h, overflow: 'hidden', position: 'relative', background: '#e9dcc0' }}><img src={trUrl(P.src)} alt="" style={{ position: 'absolute', left: w / 2 - P.eye[0] * k, top: h * .36 - P.eye[1] * k, width: P.w * k, height: P.h * k, maxWidth: 'none' }} /></div>; }
  if (c && c.src) return <div style={{ width: w, height: h, overflow: 'hidden', position: 'relative', background: '#e9dcc0' }}><img src={trUrl(c.src)} alt="" style={{ position: 'absolute', left: '50%', top: 0, width: w * 1.6, transform: 'translateX(-50%)' }} /></div>;
  if (sp && row >= 0) { const k = Math.max(1, Math.floor(Math.min(w / sp.cw, h / sp.ch))), col = (sp.dirs && sp.dirs.down) ? sp.dirs.down.idle : 0;
    return <div style={{ width: w, height: h, display: 'grid', placeItems: 'center', background: '#e9dcc0' }}><div className="tr-px" style={{ width: sp.cw * k, height: sp.ch * k, backgroundImage: `url(${trUrl(sp.src)})`, backgroundSize: `${sp.w * k}px ${sp.h * k}px`, backgroundPosition: `${-col * sp.cw * k}px ${-row * sp.ch * k}px` }} /></div>; }
  return <div style={{ width: w, height: h, display: 'grid', placeItems: 'center', background: df.color, fontSize: 28, fontWeight: 700, color: '#14212c' }}>{df.symbol}</div>;
}
function trNotebook(st, pick, setPick, onRel) {
  const met = n => !!(st.player.seen || {})[n.id] || (st.player.talked || {})[n.id] !== undefined;
  if (pick && pick.note) {
    const n = TN_WORLD.npcs.find(x => x.id === pick.note), known = met(n);
    return <div className="tr-nb-detail">
      <button className="tr-back" onClick={() => setPick(null)}>‹ 수첩</button>
      <div style={{ display: 'flex', gap: 8 }}><div style={{ filter: known ? 'none' : 'brightness(0) opacity(.55)' }}>{trPortrait(n.id, 120, 170)}</div>
        <div className="tr-slip" style={{ flex: 1 }}><b style={{ color: '#8a3b2b' }}>{known ? n.name : '???'}</b><div>{known ? n.profile : '아직 만나지 못했다'}</div>{known ? trRelBars(st, n.id, onRel) : null}</div></div>
      <div className="tr-slips">{(n.notes || []).map((x, i) => trNoteOpen(st, n.id, x.unlock) ? <div key={i} className="tr-slip">· {x.text}</div> : <div key={i} className="tr-slip lock"><b>? ? ?</b></div>)}</div>
    </div>;
  }
  return <div className="tr-cards">{TN_WORLD.npcs.map(n => { const open = (n.notes || []).filter(x => trNoteOpen(st, n.id, x.unlock)).length, known = met(n);
    return <button key={n.id} className="tr-card2" onClick={() => setPick({ note: n.id })}><div style={{ filter: known ? 'none' : 'brightness(0) opacity(.55)' }}>{trPortrait(n.id, 70, 92)}</div>
      <div style={{ flex: 1, minWidth: 0 }}><b>{known ? n.name : '???'}</b><div className="tr-mut2">{known ? n.profile : '아직 만나지 못했다'}</div><div className="tr-mut2">메모 {open} / {(n.notes || []).length}</div>{known ? trRelBars(st, n.id) : null}</div></button>; })}</div>;
}
function trScenes(st, pick, setPick) {
  const got = st.player.scenes || {}, list = TN_WORLD.scenes || [];
  const who = sc => sc.npc ? [sc.npc] : Object.keys(((TN_WORLD.facts || []).find(f => f.id === sc.fact) || {}).self || {});
  const img = sc => sc.img || (TR_A.scenes || {})[sc.id], art = (sc, w, h) => img(sc) ? <img src={trUrl(img(sc))} alt="" style={{ width: w, height: h, objectFit: 'cover' }} /> :
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 2, background: 'linear-gradient(#3b4a5e,#1c2533)' }}>{who(sc).map(id => <div key={id}>{trPortrait(id, Math.round(w / 2.6), Math.round(h * .8))}</div>)}</div>;
  if (pick && pick.scene) { const sc = list.find(x => x.id === pick.scene), t = got[sc.id];
    return <div className="tr-nb-detail"><button className="tr-back" onClick={() => setPick(null)}>‹ 목격</button>{art(sc, 336, 190)}
      <div className="tr-slip"><b>{sc.title}</b><div>{sc.caption}</div><div className="tr-mut2">{Math.floor(t / 86400) + 1}일 {trHM(t)}에 봤다</div></div></div>; }
  return <div><div className="tr-mut" style={{ margin: '2px 0 6px' }}>직접 본 장면만 남는다 · {Object.keys(got).length} / {list.length}</div>
    <div className="tr-grid2">{list.map(sc => got[sc.id] !== undefined ? <button key={sc.id} className="tr-scene" onClick={() => setPick({ scene: sc.id })}>{art(sc, 164, 96)}<span>{sc.title}</span></button>
      : <div key={sc.id} className="tr-scene lock"><b>? ? ?</b></div>)}</div></div>;
}
