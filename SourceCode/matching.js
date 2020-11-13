window.onload = start;

var card = new Array(16); // 카드 배열

var catImage = new Array("../Image/Cat/01.jpg", "../Image/Cat/01.jpg","../Image/Cat/02.jpg", "../Image/Cat/02.jpg","../Image/Cat/03.jpg", "../Image/Cat/03.jpg","../Image/Cat/04.jpg", "../Image/Cat/04.jpg","../Image/Cat/05.jpg", "../Image/Cat/05.jpg","../Image/Cat/06.jpg", "../Image/Cat/06.jpg","../Image/Cat/07.jpg", "../Image/Cat/07.jpg","../Image/Cat/08.jpg", "../Image/Cat/08.jpg");
var catImageFlag = new Array("0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0");
// var flipCard =  new Array("0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0");

var cnt = 0; // 플레이어가 카드를 뒤집은 횟수(2가 되면 서로 같은 카드인지 확인)
var selectCard = new Array(2); // 사용자가 현재 선택한 카드 배열(1번에 최대 2장의 앞면을 보는 것이 가능)
var nowClickCount = 0; // 플레이어가 카드를 뒤집은 총 횟수(2회 클릭 시에 1 증가)

// 시작 함수
function start(){

    var playTable = document.createElement("table");
    var playBoard = document.getElementById("playBoard");
    playTable.id = "playTable";
    playTable.style.marginLeft="auto";
    playTable.style.marginRight="auto";
    playBoard.appendChild(playTable);

    for(var i = 0; i < card.length; i++){
        if((i % 4) == 0){
            var tr = document.createElement("tr");
            playTable.appendChild(tr);
        }
        var td = document.createElement("td");
        card[i] = document.createElement("img");
        card[i].src = "../Image/Cat/backCat.jpg";
        card[i].id = "card" + i;
        card[i].setAttribute("onclick", "flip(this)");
        card[i].style.visibility ='visible';
        card[i].style.width = "100px";
        tr.appendChild(td);
        td.appendChild(card[i]);
    }
    shuffle();
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

function flip(obj){
    if(obj.flipFlag == 1) return;
    if(cnt != 0){
        if(selectCard[0].id==obj.id) return;
        //else if(selectCard[1].id==obj.id) return;
    }
    selectCard[cnt] = obj;
    obj.src = obj.cat;
    cnt++; // cnt 1 증가
    if(cnt == 2){
        if(selectCard[0].src != selectCard[1].src){ // 한 세트의 짝맞추기를 실패하면 해당 카드는 다시 뒷면으로 돌아간다
            selectCard[0].src = "../Image/Cat/backCat.jpg";
            selectCard[1].src = "../Image/Cat/backCat.jpg";
        }
        else{ // 한 세트의 짝을 맞추면 해당 카드의 flipFlag는 1이 된다
            selectCard[0].flipFlag = 1;
            selectCard[1].flipFlag = 1;
            /* 짝맞추기가 완료되었는지 확인하는 코드 */
            var flag = true;
            for(var i=0;i<card.length;i++){
                if(card[i].flipFlag == 0){
                    flag = false;
                }
            }
            if (flag == true){
                clear(); // 짝맞추기 완료
            }
        }
        nowClickCount++; // nowClickCnt 1 증가
        document.querySelector("#clickCnt").value = nowClickCount; // nowClickCnt를 html의 clickCnt에 반영
        cnt = 0; // cnt 초기화
    }
}

function clear(){
    confirm("모든 짝을 맞추셨습니다. 게임을 재시작하세요!");
    // 현재 기록을 로컬 스토리지에 추가...
    restart();
}



// function flip(obj){
//     if(obj.flipFlag == 1) return;
//     obj.src = obj.cat;
//     if(nowClickCount>0){
//         if(selectCard[cnt].id==obj.id);
//     }
//     selectCard[cnt] = obj;
//     cnt++; // cnt 1 증가
//     if(cnt == 2){
//         if(selectCard[0].src != selectCard[1].src){
//             selectCard[0].src = "../Image/Cat/backCat.jpg";
//             selectCard[1].src = "../Image/Cat/backCat.jpg";
//         }
//         else{
//             selectCard[0].flipFlag = 1;
//             selectCard[1].flipFlag = 1;
            
//         }
//         nowClickCount++; // nowClickCnt 1 증가
//         console.log(nowClickCount);
//         document.querySelector("#clickCnt").value = nowClickCount; // nowClickCnt를 html의 clickCnt에 반영
//         cnt = 0; // cnt 초기화
//     }
// }

function restart(){
    window.location.reload();
}