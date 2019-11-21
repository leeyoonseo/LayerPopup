class LayerPopup{
    constructor(options, callback){
        this.options = Object.assign({}, {
            // default 옵션   
            
            appendPosition : 'body', // id나 class값 가능
            className : 'popup', // 같은게 있으면 data-popup-id 값을 조정하자
            title : '타이틀',
            content : '팝업 메세지를 입력해주세요.\n메세지는 텍스트나 객체도 가능합니다.', // 메세지나 객체 삽입
            dim : true, // true or false 
            
            
            // expired 여부
            // -- 몇 일
            expired : true,
            expiryDate : 30,
            // expiryDate : [30, 1], 2개까지 가능?

            custom : false, // true 일때
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
    
        this.callback = callback;

        this.init();
    }

    // z-index도 1씩 증가해야 할 듯

    init(){
        console.log('init'); 
        this.create();

    }

    create(){
        console.log('create');
        const { className, custom } = this.options;
       
        this.dim = createElement({className : className + '_dim'});
        this.wrap = createElement({className : className + '_wrap'});
        this.header = createElement({className : className + '_header'});
        this.container = createElement({className : className + '_container'});
        this.footer = createElement({className : className + '_footer'});
        this.title = createElement({tag : 'p', className : 'title'});
        this.text = createElement({tag : 'p', className : 'text'});

        // btn
        if(custom){
            const { button } = this.options;
            console.log('custom true, button');

        }else{
            const done = createElement({tag : 'button', className : 'done', label : '확인'});
            const cancel = createElement({tag : 'button', className : 'cancel', label : '취소'});

            this.buttons = [done, cancel];
        }

        this.append(); 

        function createElement({ tag = 'div', type, className, label }){
            const el = document.createElement(tag);

            if(className){
                el.classList.add(className);
            }
            
            if(tag === 'button'){
                if(type){

                }else{
                    el.setAttribute('type', 'button');
                }
            }

            if(label){
                el.innerText = label
            }

            return el;
        }
    }

    append(){
        console.log('append');
        const { appendPosition } = this.options;

        this.container.append(this.text);
        this.header.append(this.title);

        if(this.buttons.length > 1){
            this.buttons.map(el => this.footer.append(el));
        }

        this.wrap.append(this.header, this.container, this.footer);
        
        this.setContent();

        document.querySelector(appendPosition).append(this.wrap);
    }

    setContent(){
        console.log('setContent');
        const { title, content } = this.options;

        // \n 처리




        
        // output = wordBreak(data, '\n', '<br>');
        
        /**
         * 메세지 줄 바꿈 
         * @param {String} text 수정할 메세지
         * @param {String} org 수정되어야 할 문자열 (\n)
         * @param {String} dest 수정되는 문자열 (<br>)
         */
        function wordBreak(text, org, dest){
            return text.split(org).join(dest);
        }


    }


    setStyle(){

    }

    

    attachEvent(){
        console.log('attach');
    }

    dettachEvent(){
        console.log('dettach');
    }

    open(){
        console.log('open');

    }



}