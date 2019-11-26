class LayerPopup{
    // [D] callback은 기본 확인, 취소 버튼 쓸 때 true, false 값을 리턴 받을 수 있다.
    constructor(options, callback){
        this.name = "LayerPopup";

        this.options = Object.assign({}, {
            // default 옵션   
            appendPosition : 'body', // id나 class값 가능
            className : 'popup', 
            
            title : '타이틀',
            content : '팝업 메세지를 입력해주세요.\n메세지는 텍스트나 객체도 가능합니다.', // 메세지나 객체 삽입
            dim : true, // true or false 
            
            
            // expired 여부
            // -- 몇 일
            expired : false,           
            expiredData : 
            [
                {
                    date : 1,
                    image : '',
                    className : 'close_expired',
                    id : 'day',
                    label : '하루간보지않기'
                },
                {
                    date : 30,
                    image : '',
                    className : 'close',
                    id : 'thirtyDays',
                    label : '30일간보지않기'
                }
            ],

            // {
            //     date : 1,
            //     image : '',
            //     className : 'chk_expired',
            //     id : 'thirtyDays',
            //     label : '하루간보지않기'
            // },
             // 기본이 하루
            // expiryDate : [30, 1], 
            //2개까지 가능?

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
        const { className, customButton, title, dim, expired } = this.options;

        // 기본
        this.wrap = createElement({className : className + '_wrap'});
        this.header = createElement({className : className + '_header'});
        this.container = createElement({className : className + '_container'});
        this.footer = createElement({className : className + '_footer'});
        this.content = createElement({tag : 'p', className : 'content'});

        this.buttonsWrap = createElement({tag : 'div', className : 'buttons_wrap'});

        // 버튼
        if(customButton){
            const that = this;
            const { button } = this.options;

            // 버튼 여러개
            if(Array.isArray(button)){
                console.log('여러개',button);

                this.buttons = [];
                
                button.map((e) => {
                    that.buttonsWrap.append(
                        createElement.call(that, { 
                            tag : 'button', 
                            type : e.type, 
                            className : e.className, 
                            label : e.label 
                        })
                    );
                    // that.buttons.push(createElement.call(that, { 
                    //     tag : 'button', 
                    //     type : e.type, 
                    //     className : e.className, 
                    //     label : e.label 
                    // }));
                });                
                
            // 버튼 한개
            }else{
                const btn = createElement.call(this, { 
                    tag : 'button', 
                    type : button.type, 
                    className : button.className, 
                    label : button.label 
                });

                this.buttonsWrap.append(btn);
                // this.buttonsWrap.append(
                //     createElement.call(this, { 
                //         tag : 'button', 
                //         type : button.type, 
                //         className : button.className, 
                //         label : button.label 
                //     })
                // );
                // this.buttons = btn;

            }

        }else{
            // 기본 버튼
            this.done = createElement.call(this, {tag : 'button', className : 'done', label : '확인'});
            this.cancel = createElement.call(this, {tag : 'button', className : 'cancel', label : '취소'});

            this.buttonsWrap.append(this.done, this.cancel);

            // console.log(this.buttonWrap);
            // this.buttonsWrap(this.done, this.cancel);

            // this.buttons = [this.done, this.cancel];
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
        if(expired){
            const { expiredData } = this.options;
            const commonClass = 'chk_expired';
            let result, wrap, btn, label;

            if(Array.isArray(expiredData)){
                const that = this;
                result = [];

                expiredData.map((e) => {
                    wrap = createElement.call(that, {tag : 'p', className : commonClass + '_wrap'});
                    btn = createElement.call(that, {
                        tag : 'input',
                        type : 'checkbox', 
                        name : commonClass, 
                        className : e.className, 
                        id : e.id,
                        label : e.date
                    });
                    label = createElement.call(that,{
                        tag : 'label',
                        label : commonClass, 
                        id : e.id,
                        text : e.label
                    });

                    wrap.append(btn, label);
                    result.push(wrap);
                });

            }else{
                wrap = createElement.call(this, {tag : 'p', className : commonClass + '_wrap'});

                btn = createElement.call(this,{
                    tag : 'input',
                    type : 'checkbox', 
                    className : commonClass, 
                    id : expiredData.id,
                    label : expiredData.date
                });

                label = createElement.call(this, {
                    tag : 'label',
                    label : commonClass, 
                    id : expiredData.id,
                    text : expiredData.label
                });

                wrap.append(btn, label);
                result = wrap;
            }

            this.expiredBtns = result;
        }

        this.setAttr();
        this.append(); 

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
        function createElement({ tag = 'div', id, className, name, type, label, text }){
            const el = document.createElement(tag);

            // 클래스
            if(className){
                className = className.split(',');

                // 클래스가 여러개일 경우
                if(className.length > 1){
                    className.map((k) =>  el.classList.add(k));

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
            
            // 버튼 설정
            if(type){
                el.setAttribute('type', type);
            }

            if(tag === 'button'){
                el.LayerPopup = this;

                if(label){
                    el.innerText = label
                }
            }

            // radio 설정
            if(expired){
                if(type === 'radio' || type === 'checkbox'){
                    el.value = label;
                    el.dataset.type = 'expired';
                    el.LayerPopup = this;
                }
                
                if(tag === 'label'){
                    el.setAttribute('for', id);
                }
            }



            return el;
        }
    } // create

    setAttr(){
        const { dim, expired } = this.options;
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

    append(){
        const { appendPosition, title, dim, expired } = this.options;

        this.container.append(this.content);

        if(title !== '') {
            this.header.append(this.title);
        }
        
        // 만료일
        if(expired){
            if(Array.isArray(this.expiredBtns)){
                this.expiredBtns.map((e) => {
                    this.footer.append(e);
                });

            }else{
                this.footer.append(this.expiredBtns);
            }
        }

        this.footer.append(this.buttonsWrap);

        this.wrap.append(this.header, this.container, this.footer);
        
        this.setContent();
        this.attachEvent();

        document.querySelector(appendPosition).append(this.wrap);
        if(dim && this.dim) document.body.append(this.dim);
    }

    setContent(){
        const { title, content } = this.options;
        const outputContent = (typeof content === 'string') ? wordBreak(content, '\n', '<br>') 
                                                            : content;

        if(title !== '') {
            this.title.innerText = title;
        }
        this.content.innerHTML = outputContent;

        // \n -> <br>
        function wordBreak(text, org, dest){
            return text.split(org).join(dest);
        }
    }

    attachEvent(){
        const that = this;
        const { customButton, button, expired } = this.options;
        
        // 버튼
        if(customButton){
            if(Array.isArray(this.buttons)){
                this.buttons.map(el => {
                    button.find((e) => {
                        if(el.className === e.className){
                            el.addEventListener('click',e.event);
                        }
                    });
                });

            }else{
                this.buttons.addEventListener('click', button.event);
            }

        }else{
        // 기본
            if(Array.isArray(this.buttons)){
                this.buttons.map(el => {
                    el.addEventListener('click', that.handleDefaultClick);
                });
            }
        }    
        
        
        if(expired){
            if(Array.isArray(this.expiredBtns)){
                this.expiredBtns.map(el => {
                    Array.from(el.childNodes).find((e) => {
                        if(e.tagName.toLowerCase() === 'input'){
                            e.addEventListener('click', handlePreventOverlap);
                        }
                    });
                });


                // [D] 체크 겹치지 않게
                function handlePreventOverlap({ target }){
                    this.LayerPopup.expiredBtns.map((el) => {
                        Array.from(el.childNodes).find((e) => {
                            if(e.tagName.toLowerCase() === 'input' && e.id !== target.id) {
                                e.checked = false;
                            }
                        });
                    });
                }
            }
        }

    }

    // [TODO] dettachEvent가 필요한가?
    dettachEvent(){
        console.log('dettachEvent');
        const that = this;

        this.buttons.map(el => {
            el.removeEventListener('click', that.handleDefaultClick);
        });
    }

    handleDefaultClick({ target }){
        const { LayerPopup } = target;
        const { expiredBtns } = LayerPopup;
        const { expired } = LayerPopup.options;
        
        if(LayerPopup.callback && LayerPopup.callback !== ''){
            let result = (target.classList.value === 'done') ? true : false;
            LayerPopup.callback(result);
        }

        // 만료
        if(expired){
            this.uniqueCookieName = '';
            let expiryDate = 0;

            if(Array.isArray(expiredBtns)){
                expiredBtns.map(el => {
                    Array.from(el.childNodes).find(e => {
                        if(e.tagName.toLowerCase() === 'input' && e.checked) {
                            expiryDate = e.value;
                            console.log(expiryDate);
                            LayerPopup.setCookie(true, expiryDate);

                        }
                    });
                });

            }else{



            }

            
        }
        LayerPopup.close();
    }

    

    setCookie(value, days){
        const date = new Date();
        this.uniqueName = this.options.className + date.getHours() + date.getMinutes() + date.getSeconds();

        date.setDate(date.getDate() + Number(days));
        document.cookie = this.uniqueName + "=" + escape(value) + "; path=/; expires=" + date.toUTCString() + ";"
    }
    
    // [TODO] 작업해야함
    getCookie(name){
        var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return value? value[2] : null;
    }

    open(){
        if(this.uniqueName && this.getCookie(this.uniqueName)){
            console.log('쿠키네임:',this.uniqueName,'로 쿠키 적용 중입니다.');

        }else{
            const { dim } = this.options; 

            if(dim && this.dim) {
                this.dim.classList.add('on');
            }
            
            this.wrap.classList.add('on');
        }
    }

    close(){
        const { dim } = this.options; 

        if(dim && this.dim) {
            this.dim.classList.remove('on');
        }

        this.wrap.classList.remove('on');
    }

    remove(){
        this.wrap.remove();
        this.dim.remove();
    }



}