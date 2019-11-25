class LayerPopup{
    constructor(options, callback){
        this.name = "LayerPopup";

        this.options = Object.assign({}, {
            // default 옵션   
            appendPosition : 'body', // id나 class값 가능
            className : 'popup', 
            
            title : '',
            content : '팝업 메세지를 입력해주세요.\n메세지는 텍스트나 객체도 가능합니다.', // 메세지나 객체 삽입
            dim : true, // true or false 
            
            
            // expired 여부
            // -- 몇 일
            expired : true,
            expiryDate : 30,
            // expiryDate : [30, 1], 
            //2개까지 가능?

            customButton : false, // true 일때
            button : [
                {
                    type : '',
                    className : '',
                    label : '',
                    event : '',
                }
            ],
            // todos
            // 1. 커스텀 여부
            // -- 버튼 
            /// 
        }, options);
        
        this.callback = callback || '';
        this.init();
    }


    // z-index도 1씩 증가해야 할 듯

    init(){
        console.log('init'); 
        const { className } = this.options;

        // class가 같은 팝업 처리
        this.dim = document.querySelector('[data-type="dim"]');
        
        if(this.dim){
            this.same = true;
        }

        this.create();
    }

    create(){
        console.log('create');
        const { className, customButton, title, dim, expired, expiryDate } = this.options;

        // 기본
        this.wrap = createElement({className : className + '_wrap'});
        this.header = createElement({className : className + '_header'});
        this.container = createElement({className : className + '_container'});
        this.footer = createElement({className : className + '_footer'});
        this.content = createElement({tag : 'p', className : 'content'});

        // 버튼
        if(customButton){
            const { button } = this.options;
            console.log('customButton true, button');

        }else{
            this.done = createElement.call(this, {tag : 'button', className : 'done', label : '확인'});
            this.cancel = createElement.call(this, {tag : 'button', className : 'cancel', label : '취소'});

            this.buttons = [this.done, this.cancel];
        }

        // 배경
        if(dim && !this.dim) {
            this.dim = createElement({className : className + '_dim' });
        }

        if(title !== ''){
            this.title = createElement({tag : 'p', className : 'title'});
        }

        // 만료 설정
        if(expired){
            console.log('expiryDate',expiryDate);
            if(Array.isArray(expiryDate)){
                console.log('여러개');

            }else{
                console.log('한개');

            }

            // this.expireEls = [];
        }

        this.setAttr();
        this.append(); 


        /**
         * 돔 생성
         * @param {Object} 
         * @param tag 생성할 태그네임
         * @param className 추가할 클래스 명(복수일 경우 쉼표로 구분)
         * @param type 버튼 타입 (버튼일 경우 사용)
         * @param label 버튼 명 (버튼 일 경우 사용)
         * @usage
         *      title = createElement({ tag : 'p', className : 'title,title-red,title-required' });
         *      button = createElement({ tag : 'button', className : 'cancel', type : 'button', label : '취소버튼' });
         */
        function createElement({ tag = 'div', className, type = 'button', label }){
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
            
            // 버튼 설정
            if(tag === 'button'){
                el.setAttribute('type', type);
                el.LayerPopup = this;

                if(label){
                    el.innerText = label
                }
            }

            return el;
        }
    } // create

    setAttr(){
        const { dim } = this.options;

        this.wrap.dataset.type = 'layerPopup';


        const other = findOtherPopup('[data-type="layerPopup"');
        
        if(other){
            console.dir();
            this.wrap.style.zIndex = Number(other.style.zIndex) + 1;

        }else{
            this.wrap.style.zIndex = 1000;
        }

        
        // this.wrap.style.zIndex = (isFirstPopup) ?  '1000' : '1000' +  
        
        if(dim) {
            this.dim.dataset.type = 'dim'
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
        console.log('append');
        const { appendPosition, title, dim } = this.options;

        this.container.append(this.content);

        if(title !== '') {
            this.header.append(this.title);
        }

        if(this.buttons.length > 1){
            this.buttons.map(el => this.footer.append(el));
        }

        this.wrap.append(this.header, this.container, this.footer);
        
        this.setContent();
        // this.bindEvents(true);

        this.attachEvent();

        document.querySelector(appendPosition).append(this.wrap);
        if(dim && this.dim) document.body.append(this.dim);
    }

    setContent(){
        console.log('setContent');
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
        console.log('attachEvent');
        const that = this;

        this.buttons.map(el => {
            el.addEventListener('click', that.handleDefaultClick);
        });
    }

    dettachEvent(){
        console.log('dettachEvent');
        const that = this;

        this.buttons.map(el => {
            el.removeEventListener('click', that.handleDefaultClick);
        });
    }

    handleDefaultClick({ target }){
        console.log('handleDefaultClick');
        const { LayerPopup } = target;

        let state = (target.classList.value === 'done') ? true : false;
            
        if(LayerPopup.callback !== ''){
            LayerPopup.callback(state);
        } 

        LayerPopup.close();
    }
    
    open(){
        console.log('open');
        const { dim } = this.options; 

        if(dim && this.dim) {
            this.dim.classList.add('on');
        }
        
        this.wrap.classList.add('on');
    }

    close(){
        console.log('close');
        const { dim } = this.options; 

        if(dim && this.dim) {
            this.dim.classList.remove('on');
        }

        this.wrap.classList.remove('on');
    }

    remove(){
        console.log('remove');
        this.wrap.remove();
        this.dim.remove();
    }



}