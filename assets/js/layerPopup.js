class LayerPopup{
    // [D] callback은 기본 확인, 취소 버튼 쓸 때 true, false 값을 리턴 받을 수 있다.
    constructor(options, callback){
        this.name = "LayerPopup";

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
        
        this.callback = callback || '';
        this.init();
    }

    init(){
        this.create();
    }

    create(){
        const { className, customButton, title, dim, expired, expireData } = this.options;

        // 기본
        this.wrap = createElement({className : className + '_wrap'});

        if(title) {
            this.header = createElement({className : className + '_header'});
        }

        this.container = createElement({className : className + '_container'});
        this.footer = createElement({className : className + '_footer'});
        this.content = createElement({tag : 'div', className : className + '_content'});
        this.buttonsWrap = createElement({tag : 'div', className : className + '_buttons_wrap'});

        // 버튼
        if(customButton){
            const that = this;
            const { button } = this.options;

            if(button === ''){
                // 기본 버튼
                defaultButtons.call(this);

            }else if(Array.isArray(button) && button.length > 1){
            // 버튼 여러개
                console.log('여러개 생성',button);
                
                button.map((e) => {
                    // console.log(123,type, className, label);
                    let el = createElement.call(that, { 
                        tag : 'button', 
                        type : e.type, 
                        className : e.className, 
                        label : e.label 
                    });

                    that.buttonsWrap.append(el);
                });                

            // 버튼 한개
            }else{
                console.log('한개 생성',button);
                let btn = (Array.isArray(button)) ? button[0] : button;

                const el = createElement.call(this, { 
                    tag : 'button', 
                    type : btn.type, 
                    className : btn.className, 
                    label : btn.label 
                });
                
                this.buttonsWrap.append(el);
            }

        }else{
            // 기본 버튼
            defaultButtons.call(this);
        }        

        // 배경
        this.dim = document.querySelector('[data-type="dim"]');
        if(dim && !this.dim) {
            this.dim = createElement({className : className + '_dim' });
        }

        // 타이틀
        if(title !== ''){
            this.title = createElement({tag : 'p', className : 'title'});
        }

        // 만료일 설정
        if(expired && expireData){
            const { className } = this.options;
            const commonClass = className + '_expire';
            let box, btn, label;

            this.expireWrap = createElement.call(this,{
                tag : 'div',
                className : commonClass + '_wrap'
            });

            if(Array.isArray(expireData)){
                console.log('expireData 여러개 생성');

                const that = this;

                expireData.map((e) => {
                    box = createElement.call(that, {
                        tag : 'p', 
                        className : commonClass + '_box'
                    });
                    
                    btn = createElement.call(that, {
                        tag : 'input',
                        type : 'checkbox', 
                        name : commonClass + '_chk', 
                        className : e.className, 
                        id : e.id,
                        label : e.date
                    });

                    label = createElement.call(that,{
                        tag : 'label',
                        label : commonClass + '_label', 
                        id : e.id,
                        text : e.label
                    });

                    box.append(btn, label);
                    this.expireWrap.append(box);
                });

            }else{
                console.log('expireData 한개 생성');

                box = createElement.call(this, {
                    tag : 'p',
                     className : commonClass + '_box'
                });

                btn = createElement.call(this,{
                    tag : 'input',
                    type : 'checkbox', 
                    className : commonClass + '_chk', 
                    id : expireData.id,
                    label : expireData.date
                });

                label = createElement.call(this, {
                    tag : 'label',
                    label : commonClass + '_label', 
                    id : expireData.id,
                    text : expireData.label
                });

                box.append(btn, label);
                this.expireWrap.append(box);
            }
        } // expired

        this.setAttribute();
        this.layoutAppend(); 

        /**
         * 돔 생성, 버튼 생성하기 위해 호출 시 .call(this) 추가해야 함
         * @param {Object} 
         * @param tag 생성할 태그네임
         * @param className 추가할 클래스 명(복수일 경우 쉼표로 구분)
         * @param type 버튼 타입 (버튼일 경우 사용)
         * @param label 버튼 명 (버튼 일 경우 사용)
         * @usage
         *      title = createElement({ tag : 'p', className : 'title,title-red,title-required' });
         *      button = createElement({ tag : 'button', className : 'cancel', type : 'button', label : '취소버튼' });
         */
        function createElement({ 
            tag = 'div', 
            id, 
            className, 
            name, 
            type = 'button', 
            label = '버튼', 
            text 
        }){

            const el = document.createElement(tag);

            // 클래스
            if(className){
                const classNames = className.split(',');

                // 클래스가 여러개일 경우
                if(classNames.length > 1){
                    classNames.map((k) =>  el.classList.add(k));

                }else{
                    el.classList.add(className);
                }
            }

            // 네임
            if(name){
                el.name = name;
            }

            // 아이디
            if(id && tag !== 'label'){
                el.id = id;
            }

            if(text){
                el.innerText = text;
            }
            
            if(tag === 'button'){
                el.setAttribute('type', (type !== '') ? type : 'button');
                el.LayerPopup = this;
                el.innerText = (label !== '') ? label : '버튼';
            }

            // radio 설정
            if(expired){
                if(type === 'radio' || type === 'checkbox'){
                    el.value = label;
                    el.setAttribute('type', type);
                    el.dataset.type = 'expired';
                    el.LayerPopup = this;
                }
                
                if(tag === 'label'){
                    el.setAttribute('for', id);
                }
            }

            return el;

        } // createElement

        function defaultButtons(){
            this.done = createElement.call(this, {
                tag : 'button', 
                className : 'done', 
                type : 'submit',
                label : '확인'
            });

            this.cancel = createElement.call(this, {
                tag : 'button', 
                className : 'cancel', 
                label : '취소'
            });

            this.buttonsWrap.append(this.done, this.cancel);
            
        } // defaultButtons

    } // create

    setAttribute(){
        const { dim } = this.options;
        const otherPopup = findOtherPopup('[data-type="layerPopup"');

        this.wrap.style.zIndex = (otherPopup) ? Number(otherPopup.style.zIndex) + 1 : 1000;
        this.wrap.dataset.type = 'layerPopup';

        if(dim) {
            this.dim.dataset.type = 'dim';
        }

        function findOtherPopup(name){
            const target = document.querySelector(name);
            
            if(target){
                return target;
            }

            return false;
        }
    }

    layoutAppend(){
        const { appendPosition, title, dim, expired, expireData } = this.options;

        this.container.append(this.content);

        if(title) {
            this.header.append(this.title);
        }
        
        // 만료일
        if(expired && expireData){
            this.footer.append(this.expireWrap);
        }

        this.footer.append(this.buttonsWrap);

        if(title){
            this.wrap.append(this.header, this.container, this.footer);

        }else{
            this.wrap.append(this.container, this.footer);
        }
        
        this.setContent();
        this.attachEvent();

        document.querySelector(appendPosition).append(this.wrap);
        if(dim && this.dim) document.body.append(this.dim);
    }

    setContent(){
        console.log('setContent');
        const { title, content } = this.options;
        let outputContent = content;

        // [TODO] 아이콘 넣을 수 있나?
        if(title !== '') {
            this.title.innerText = title;
        }

        // 문자
        if(typeof content === 'string'){
            outputContent = wordBreak(content);
            this.content.innerHTML = outputContent;

        }else{
        // 객체
            this.content.append(outputContent);
        }

        // [D] \n를 <br>로 변환
        function wordBreak(text, org = '\n', dest = '<br>'){
            return text.split(org).join(dest);
        }
    }

    attachEvent(){
        const that = this;
        const { customButton, button, expired, expireData } = this.options;
        const buttons = this.buttonsWrap.childNodes;        

        // 커스텀 버튼
        if(customButton){
            if(button === ''){
                defaultButtonCaller.call(this);

            }else if(buttons.length > 1){
            // 여러개
                console.log('여러개');
                Array.from(buttons).map(el => {
                    button.find(({className, event}) => {
                        if(event === ''){
                            console.log('event가 비어있습니다. 기본이벤트로 대체합니다.');
                            event = that.handleDefaultClick;
                        }

                        if(el.className === className){
                            el.addEventListener('click', event);
                        }
                    });
                });

            }else{
            // 한개
                console.log('한개 이벤트');
                let event = (Array.isArray(button))? button[0].event : button.event;

                if(!event || event === ''){
                    console.log('event가 비어있습니다. 기본이벤트로 대체합니다.');
                    event = this.handleDefaultClick;
                }

                buttons[0].addEventListener('click', event);
            }

        }else{
        // 기본 버튼 (2개)
            defaultButtonCaller.call(this);
        }           
                
        // 만료일
        if(expired && expireData){
            const expireBox = this.expireWrap.childNodes;

            if(expireBox.length > 1){
                console.log('여러개');

                Array.from(expireBox).map(({childNodes}) => {
                    Array.from(childNodes).find(e => {
                        if(e.tagName.toLowerCase() === 'input'){
                            e.addEventListener('click', handleCheckbox);
                        }
                    });
                });

                // [D] 체크 겹치지 않게
                function handleCheckbox({ target }){
                    const expire = this.LayerPopup.expireWrap.childNodes;

                    Array.from(expire).map(({childNodes}) => {
                        Array.from(childNodes).find(e => {
                            if(e.tagName.toLowerCase() === 'input' && e.id !== target.id) {
                                e.checked = false;
                            }
                        });
                    });
                }
            }
        } // expired

        function defaultButtonCaller(){
            const that = this;

            if(this.buttonsWrap.childNodes.length > 1){
                const buttons = this.buttonsWrap.childNodes;

                Array.from(buttons).map(el => {
                    el.addEventListener('click', that.handleDefaultClick);
                });
            }
        }
    } // attachEvent

    // [TODO] dettachEvent가 필요한가?
    dettachEvent(){
        console.log('dettachEvent');
        const that = this;
        const buttons = this.buttonsWrap.childNodes;

        Array.from(buttons).map(el => {
            el.removeEventListener('click', that.handleDefaultClick);
        });
    }

    handleDefaultClick({ target }){
        const { LayerPopup } = target;
        const { options, expireWrap } = LayerPopup;
        const { expired, expireData } = options;

        if(LayerPopup.callback && LayerPopup.callback !== ''){
            let result = (target.classList.value === 'done') ? true : false;
            LayerPopup.callback(result);
        }

        if(expired && expireData){
            const expire = expireWrap.childNodes;
                Array.from(expire).map(({childNodes}) => {
                    Array.from(childNodes).map(e => {
                        if(e.tagName.toLowerCase() === 'input'){
                            if(e.checked){
                                LayerPopup.handleExpire(e.value);
                            }
                        }
                    });

                });
        }

        LayerPopup.close();
    }

    handleExpire(day){        
        const { className } = this.options;
        let i = 0;
        let uniqueNumber = new Date().getMinutes();
        
        for(; i < 4; i++){
            uniqueNumber += String(Math.floor(Math.random() * 9));
        }

        this.uniqueName = className + uniqueNumber;
        this.setCookie(this.uniqueName, day);
    }

    setCookie(value, days){
        const date = new Date();

        date.setDate(date.getDate() + Number(days));
        document.cookie = this.uniqueName + "=" + escape(value) + "; path=/; expires=" + date.toUTCString() + ";"
    }
    
    getCookie(name){
        var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return value? value[2] : null;
    }

    open(){
        if(this.uniqueName && this.getCookie(this.uniqueName)){
            console.log(this.uniqueName,'로 쿠키 적용 중입니다.');

        }else{
            const { dim } = this.options; 

            if(dim && this.dim) {
                this.dim.classList.add('on');
            }
            
            this.wrap.classList.add('on');
        }
    }

    close(){
        const { expireWrap } = this;
        const { dim, expired, expireData } = this.options;

        this.wrap.classList.remove('on');

        if(dim && this.dim) {
            const layer = document.querySelectorAll('[data-type="layerPopup"]');
            const reg = /on/;
            let i = 0;

            // 팝업이 여러개일때 딤처리
            Array.from(layer).map(({classList}) => {
                if(!reg.test(classList.value)){
                    i ++;
                }
            });

            if(layer.length === i){
                this.dim.classList.remove('on');
            }
        }

        if(expired && expireData){
            resetChecked();

            function resetChecked(){
                const expire = expireWrap.childNodes;
                Array.from(expire).map(({childNodes}) => {
                    Array.from(childNodes).map(e => {
                        if(e.tagName.toLowerCase() === 'input' && e.checked){
                            e.checked = false;
                        }
                    });
                });

            } // resetChecked

        } // expired
    } // close

    remove(){
        this.wrap.remove();
        this.dim.remove();
    }



}