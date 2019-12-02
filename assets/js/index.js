// 옵션 없음
const defaultPopup = new LayerPopup();
document.getElementById('default').addEventListener('click', () => {
    defaultPopup.open();
});

// 스크롤 제거
const nonScrollPopup = new LayerPopup({
    scroll : false
});
document.getElementById('nonScrolling').addEventListener('click', () => {
    nonScrollPopup.open();
});

// 타이틀, 콘텐츠
const EditPopup = new LayerPopup({
     title : '알림',
     content : '오늘은 문화가 있는 수요일입니다.\n롯데시네마, CGV : 오후 5시~9시까지 5,000원에 영화를 관람할 수 있습니다.'
});
document.getElementById('edit').addEventListener('click', () => {
    EditPopup.open();
});

// 해당위치에 팝업 삽입
const appendPopup = new LayerPopup({
    appendPosition : '.append_box'
});
document.getElementById('append').addEventListener('click', () => {
    appendPopup.open();
});

// 배경 제거
const nonDimPopup = new LayerPopup({
    dim : false
});
document.getElementById('nonDim').addEventListener('click', () => {
    nonDimPopup.open();
});

// 만료일
// 만료일-기본형
const expirePopup = new LayerPopup({
    expire : true
});
document.getElementById('expire').addEventListener('click', () => {
    expirePopup.open();
});
// 만료일-단수
const expireOptPopup = new LayerPopup({
    expire : true,
    expireData : {
        date : 365,
        id : 'opt_year',
        label : '1년간 팝업을 보기 싫어요'
    }
});
document.getElementById('expire_btn').addEventListener('click', () => {
    expireOptPopup.open();
});
// 만료일-복수
const expireOptsPopup = new LayerPopup({
    expire : true,
    expireData : [
        {
            date : 365,
            id : 'opts_day',
            label : '하루동안보지않기'
        },
        {
            date : 365,
            id : 'opts_mon',
            label : '한달동안보지않기'
        }
        ,
        {
            date : 365,
            id : 'opts_never',
            label : '다시보지않기'
        }
    ]
});
document.getElementById('expire_btns').addEventListener('click', () => {
    expireOptsPopup.open();
});

// 버튼 설정(커스텀)
// 단수
const customOptPopup = new LayerPopup({
    customButton : true,
    customButtonData : {
        type : 'button',
        label : '닫기'
    }
});
document.getElementById('custom_btn').addEventListener('click', () => {
    customOptPopup.open();
});
// 복수
const customOptsPopup = new LayerPopup({
    customButton : true,
    customButtonData : [
        {
            type : 'button',
            label : '월요일'
        },
        {
            type : 'button',
            label : '수요일'
        },
        {
            type : 'button',
            label : '금요일'
        }
    ]
});
document.getElementById('custom_btns').addEventListener('click', () => {
    customOptsPopup.open();
});
// 버튼-이벤트 설정
const customAllPopup = new LayerPopup({
    customButton : true,
    customButtonData : [
        {
            type : 'button',
            label : '메세지변경',
            event : function(){
                const {content} = this.LayerPopup;
                content.innerText = '메세지를 변경했습니다!.'
            }
        },
        {
            type : 'button',
            label : '만료일팝업열기',
            event : function(){
                expirePopup.open();
            }

        },
        {
            type : 'button',
            label : '닫기'
        }
    ]
});
document.getElementById('custom').addEventListener('click', () => {
    customAllPopup.open();
});

// 닫기버튼 설정
// 제거
const closeButtonRemovePopup = new LayerPopup({
    closeButton : false
});
document.getElementById('close_btn_remove').addEventListener('click', () => {
    closeButtonRemovePopup.open();
});
// 버튼명 변경
const closeButtonModifyPopup = new LayerPopup({
    closeButtonData : {
        label : '닫기'
    }
});
document.getElementById('close_btn_modify').addEventListener('click', () => {
    closeButtonModifyPopup.open();
});
// 버튼이미지 변경
const closeButtonImgPopup = new LayerPopup({
    closeButtonData : {
        src : './assets/img/close.png',
        label : '닫기'
    }
});
document.getElementById('close_btn_img').addEventListener('click', () => {
    closeButtonImgPopup.open();
});

// 콜백함수
const callbackPopup = new LayerPopup(function(res){
    const message = (res) 
        ? '확인을 클릭하셨습니다.' 
        : '취소를 클릭하셨습니다.';

        alert(message);
});
document.getElementById('callback').addEventListener('click', () => {
    callbackPopup.open();
});

// 여러개의 팝업 호출
const overlapPopup = new LayerPopup({
    title : '첫번째 팝업',
    content : '2초 후 2번째 팝업이 오픈됩니다.'
});
const overlapPopup2 = new LayerPopup({
    title : '두번째 팝업',
    content : '버튼 클릭 시 3번째 팝업이 오픈됩니다.',
    customButton : true,
    customButtonData : {
        label : '새로운 팝업열기',
        event : function(){
            overlapPopup3.open();
        }
    }
});
const overlapPopup3 = new LayerPopup({
    title : '세번째 팝업',
    content : '팝업을 전체 다 닫아야지 배경이 제거됩니다.'
});
document.getElementById('overlap').addEventListener('click', () => {
    overlapPopup.open();

    setTimeout(() => {
        overlapPopup2.open();
    },2000);
});

// 디자인 팝업 만들기 예제1
const customData = {
    sale : {
        title : '<p class="custom_sale_sub_title">Christmas</p>'
              + '<p class="custom_sale_main_title">BIG<br>SALE</p>',
        content : '<p class="custom_sale_sub_text">2019.12.10~2019.12.30</p>'
                + '<p class="custom_sale_main_text"><strong>40만원</strong> 이상 구매 고객에게' 
                + '<strong>20만원대</strong>의\n다양한 당첨 경품을 드립니다.<p>'
    },
    stop : {
        title : '<p class="title">가나다라마바\n<strong>서비스 일시 중단 안내</strong></p>'
              +  '<p class="sub_title">정기 점검 및 보안 업그레이드를 위하여 서비스가 일시중지 됩니다.'
              +  '\n설문 작성과 결과확인 및 설문 응답도 진행이 되지 않습니다.</p>',
        content : '<p class="title">작업일시</p>' 
                + '<p class="date">2019년 10월 01일(화) 10:00 ~ 12:00</p>' 
                + '<p class="text">※ 작업일정은 시스템 작업 사정에 따라 다소 변동될 수 있습니다.</p>'
    }
}
const userCustomSalePopup = new LayerPopup({
    className : 'custom_sale',
    title : customData.sale.title,
    content : customData.sale.content,
    expire : true,
    expireData : {
        data : 1,
        id : 'custom_sale_expire',
        label : '하루동안보지않기'
    },
    closeButtonData : {
        src : './assets/img/exm_close.png',
        label : '닫기'
    },
    customButton : true,
    customButtonData : [
        {
            className : 'more',
            label : '바로가기',
            event : function(){
                alert('바로가기 완료.');
                this.LayerPopup.close();
            },
        }
    ]
});
document.getElementById('userCustom_sale').addEventListener('click', () => {
    userCustomSalePopup.open();
});

// 디자인 팝업 만들기 예제2
const userCustomStopPopup = new LayerPopup({
    className : 'custom_stop',
    title : customData.stop.title,
    content: customData.stop.content,
    closeButton :false,
    button :false,
    expire : true,
    expireData : {
        date : 1,
        id : 'custom_stop_expire',
        label : '하루동안보지않기'
    },
});
document.getElementById('userCustom_stop').addEventListener('click', () => {
    userCustomStopPopup.open();
});

// 팝업 제거
const removePopup = new LayerPopup({
    customButton : true,
    customButtonData : [
        {
            label : '팝업삭제',
            event : function(){
                this.LayerPopup.remove();
            }
        }
    ]
});
document.getElementById('remove').addEventListener('click', () => {
    removePopup.open();
});