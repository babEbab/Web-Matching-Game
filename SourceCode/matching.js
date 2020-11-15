var card = new Array(16); // 카드 배열

/* 고양이 이미지 배열과 해당 배열의 사용 여부를 알려주는 Flag */
var catImage = new Array("../Image/Cat/01.jpg", "../Image/Cat/01.jpg","../Image/Cat/02.jpg", "../Image/Cat/02.jpg","../Image/Cat/03.jpg", "../Image/Cat/03.jpg","../Image/Cat/04.jpg", "../Image/Cat/04.jpg","../Image/Cat/05.jpg", "../Image/Cat/05.jpg","../Image/Cat/06.jpg", "../Image/Cat/06.jpg","../Image/Cat/07.jpg", "../Image/Cat/07.jpg","../Image/Cat/08.jpg", "../Image/Cat/08.jpg");
var catImageFlag = new Array("0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0");
var backCat = "../Image/Cat/backCat.jpg";

var cnt = 0; // 플레이어가 카드를 뒤집은 횟수(2가 되면 서로 같은 카드인지 확인)
var selectCard = new Array(2); // 사용자가 현재 선택한 카드 배열(1번에 최대 2장의 앞면을 보는 것이 가능)
var nowClickCount = 0; // 플레이어가 카드를 뒤집은 총 횟수(2회 클릭 시에 1 증가)
var recordList = new Array();
var bestCnt = 99999; // 레코드의 최고 기록

window.onload = start;

// 시작 함수
function start(){
    /* 로컬 스토리지에 등록된 값을 가져와서 최고 기록과 평균 기록을 구함 */
    // recordList에 로컬 스토리지의 값 가져오기
    var value = localStorage.getItem("localRecordList");
    if (value != null) {
        var storedStorage = JSON.parse(value);
        storedStorage.forEach(function (Record) {
            recordList.push(Record);
        });
    }
    // recordList의 값을 통해 최고 기록과 평균 기록 구하기
    if(recordList.length == 0){
        var averCnt = 0;
        bestCnt = 0; // 레코드가 아무 기록도 되어있지 않으면 최고 기록은 0이다
    }
    else{
    var averCnt = 0;
    for(var i = 0; i < recordList.length; i++){
        averCnt += recordList[i].record;
        if(recordList[i].record < bestCnt){
            bestCnt = recordList[i].record;
        }
    }
    averCnt = Math.round(averCnt / recordList.length * 10) / 10;
    }

    // averCnt와 bestCnt를 html의 averCnt와 bestCnt에 반영
    document.querySelector("#averCnt").value = averCnt;
    document.querySelector("#bestCnt").value = bestCnt;
    /* 현재 플레이 보드 */
    var playTable = document.createElement("table");
    var playBoard = document.getElementById("playBoard");
    playTable.id = "playTable";
    playTable.style.marginLeft="auto";
    playTable.style.marginRight="auto";
    playTable.style.border="";
    playBoard.appendChild(playTable);
    makeCard(); // 카드의 이미지와 관련된 설정
    shuffle(); // 카드 섞기
}

// 카드의 이미지와 관련된 설정
function makeCard(){
    for(var i = 0; i < card.length; i++){
        if((i % 4) == 0){
            var tr = document.createElement("tr");
            tr.style.padding = "1px";
            playTable.appendChild(tr);
        }
        var td = document.createElement("td");
        td.style.padding ="1px";

        card[i] = document.createElement("img");
        card[i].src = backCat;
        card[i].id = "card" + i;
        card[i].setAttribute("onclick", "flip(this)");
        card[i].style.visibility ='visible';
        card[i].style.width = "100px";
        tr.appendChild(td);
        td.appendChild(card[i]);
    }
    /* 카드의 짝이 맞춰졌는지 확인하는 변수(card[i].flipFlag)의 초기화 */
    for(var i = 0; i < card.length; i++){
        card[i].flipFlag = 0;
    }
}

// 카드 셔플 함수
function shuffle(){

    for(var i = 0; i < catImage.length; i++){
        while(1){
            var tmp=Math.floor(Math.random()*16);
            if (catImageFlag[tmp] == 0){
               card[i].cat = catImage[tmp];
               catImageFlag[tmp] = 1;
               break;
            }
        }
    }
}

// 카드 뒤집기 함수
function flip(obj){
    if(obj.flipFlag == 1) return;
    if(cnt != 0){
        if(selectCard[0].id == obj.id) return;
    }
    selectCard[cnt] = obj;
    obj.src = obj.cat;
    cnt++; // cnt 1 증가
    if(cnt == 2){
        if(selectCard[0].src != selectCard[1].src){ // 한 세트의 짝맞추기를 실패하면 해당 카드는 다시 뒷면으로 돌아간다
            // 0.5초 후에 카드가 뒷면으로 돌아간다
            setTimeout(function(){
                selectCard[0].src = backCat;
                selectCard[1].src = backCat;
            }, 500);
        }
        else{ // 한 세트의 짝을 맞추면 해당 카드의 flipFlag는 1이 된다
            selectCard[0].flipFlag = 1;
            selectCard[1].flipFlag = 1;
            /* 짝맞추기가 완료되었는지 확인하는 코드 */
            var flag = true; // 짝맞추기 완료 여부를 알려주는 flag. true로 초기화
            for(var i = 0; i < card.length; i++){
                if(card[i].flipFlag == 0){
                    flag = false; // 짝맞추기가 완료되지 않았으므로 false로 값을 변경한 뒤 for문 빠져나오기
                    break;
                }
            }
            if (flag == true){ // 짝맞추기 완료
                clear(); // 짝맞추기가 완료되었으므로 게임을 재시작한다
            }
        }
        nowClickCount++; // nowClickCnt 1 증가
        document.querySelector("#clickCnt").value = nowClickCount; // nowClickCnt를 html의 clickCnt에 반영
        cnt = 0; // cnt 초기화
    }
}

// 짝맞추기 성공 함수
function clear(){
    if(nowClickCount < bestCnt){
        confirm("최고 기록 갱신!\n축하합니다! 게임을 재시작하세요.");
    }
    else{
        confirm("모든 짝을 맞추셨습니다. 게임을 재시작하세요!");
    }
    // 현재 기록을 로컬 스토리지에 추가...
    var recordObj = {
        record: nowClickCount
    }
    recordList.push(recordObj);
    localStorage.setItem("localRecordList", JSON.stringify(recordList));
    nowClickCount = 0; // 현재 기록 초기화
    restart();
}

// 모든 레코드를 지우는 함수
function removeRecordlist() {
    localStorage.clear();
    window.location.reload();
}

// 게임을 재시작하는 함수
function restart(){
    window.location.reload();
}