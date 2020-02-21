## initialize

#### For example 

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