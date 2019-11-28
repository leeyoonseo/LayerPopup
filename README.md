# LayerPopup

Initialize LayerPopup // 제목

// ==== 영역
new LayerPopup(parameters, callbackFunction);

parameters - object
callbackFunction - function



// ==== 영역

For example 
<pre>
    <code>
        const LayerPopup = new LayerPopup({
            title : '공지사항',
            content : '오늘부터 7일간 사이트 접속이 불가능합니다.'
        }, function(res){ // res = true or false
            // callback
        });

        el.addEventListner('click', () => {
            LayerPopup.open();
        });
    </code>
</pre>

LayerPopup parameters // 제목

parameters | type | default | description //표 제목
1. appendPosition | String | 'body' | id or class or tagName
2. className | String | 'popup' | 셋팅 class명
3. title | String or Object | '타이틀' | 팝업 타이틀 텍스트 및 객체
4. content | String or Object | '팝업 메세지를 입력해...' | 팝업 내용 텍스트 및 객체
5. dim | Boolean | true | 배경화면 셋팅 여부
== 만료일 설정
6. expire | Boolean | false | 만료일 설정 여부
7. expireData | Object
date | Number | 1 | 만료 날짜 값
id | String | 'day' | 만료 체크박스 id
label | String | '하루간보지않기' | 만료 체크박스 label
=== 버튼 설정
8. closeButton | Boolean | true | 창 닫기 버튼 여부
9. closeButtonLabel | String | 'x' | 창 닫기 버튼 텍스트 
10. customButton | Boolean | false | 버튼 추가하여 사용 여부(true일 경우 기본 버튼 사용안함)
11. button | Object or Array | 
type | String | '' | 버튼 타입
className | String | '' | 버튼 class
label | String | '' | 버튼 label
event | Function | '' | 버튼 이벤트

// ===== parameters 끝

LayerPopup callbackFunction // 제목

callbackFunction | Function | 기본 버튼에서 확인, 취소 클릭 시 콜백 함수. (확인 = true, 취소 = false 리턴)

// ====== callbackFunction 끝

<pre>
    <code>
        this.options = Object.assign({}, {
            appendPosition : 'body', // id, class, tagName 값 가능하나 중복되는 영역 값 불가
            className : 'popup', 
            title : '타이틀',
            content : '팝업 메세지를 입력해주세요.\n메세지는 텍스트나 객체도 가능합니다.', // 메세지나 객체 삽입
            dim : true, // true or false 
            
            // 만료일 설정
            expired : false,           
            expireData : {
                date : 1,
                image : '',
                className : 'close_expired',
                id : 'day',
                label : '하루간보지않기'
            },

            customButton : false, // true 일때

            // 여러개 일 경우 배열로 작성
            button : [
                {
                    type : '',
                    className : '',
                    label : '',
                    event : '',
                }
            ],
        }, options);
    </code>
</pre>

// readme 참고 https://swiperjs.com/api/