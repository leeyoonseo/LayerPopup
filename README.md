## LayePopup

레이어팝업 생성, 삽입, 삭제 컴포넌트
=================================

### 문서 업데이트
```
npm run jsdoc
```

### For example 

```
const LayerPopup = new LayerPopup({
    title : '공지사항',
    content : '오늘부터 7일간 사이트 접속이 불가능합니다.'
}, function(res){ // res = true or false
    // callback
});

el.addEventListner('click', () => {
    LayerPopup.open();
});
```