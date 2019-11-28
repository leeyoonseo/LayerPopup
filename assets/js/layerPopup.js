/**
 * Layer Popup
 * @author yoonseo.lee(2019.11)
 */
class LayerPopup{

    /**
     * constructor
     * @param {Object} parameters - 옵션 
     * @param {Function} callbackFunction - 기본버튼에 대한 콜백함수 
     */
    constructor(parameters, callbackFunction){
        this.name = "LayerPopup";

        this.options = Object.assign({}, {
            appendPosition : 'body', 
            className : 'popup', 
            title : '타이틀',
            content : '팝업 메세지를 입력해주세요.\n메세지는 텍스트나 객체도 가능합니다.',
            dim : true,
            
            expire : false,           
            expireData : {
                date : 1,
                id : 'day',
                label : '하루간보지않기'
            },

            closeButton : true,
            customButton : false,
            button : [
                {
                    type : '',
                    className : '',
                    label : '',
                    event : '',
                }
            ]
        }, parameters);
        
        this.callback = callbackFunction || '';
        this.createElement();
    }

    // 레이어 팝업 객체 생성
    createElement(){
        const {className, closeButton, customButton, title, dim, expire, expireData}= this.options;

        // 무조건 생성
        this.wrap = createElement({
            className : className + '_wrap'
        });

        this.header = createElement({
            className : className + '_header'
        });

        this.container = createElement({
            className : className + '_container'
        });

        this.footer = createElement({
            className : className + '_footer'
        });

        this.content = createElement({
            tag : 'div', 
            className : className + '_content'
        });

        this.buttonsWrap = createElement({
            tag : 'div', 
            className : className + '_buttons_wrap'
        });

        // 조건 생성
        if(title) {
            this.title = createElement({
                tag : 'p', 
                className : className + '_title'
            });
        }
        
        if(closeButton){
            this.closeButton = createElement({
                tag : 'button',
                className : className + '_close',
                label : 'x'
            });
            console.log(closeButton,this.closeButton);
        }

        if(customButton){
            const that = this;
            const {button} = this.options;

            if(button === ''){
                defaultButtons.call(this);

            }else if(Array.isArray(button) && button.length > 1){
                button.map(({type, className, label}) => {
                    let el = createElement.call(that, { 
                        tag : 'button', 
                        type : type, 
                        className : className, 
                        label : label 
                    });

                    that.buttonsWrap.append(el);
                });                

            }else{
                let btn = (Array.isArray(button)) 
                    ? button[0] 
                    : button;
                const {btnType, btnClassName, btnLabel} = btn;

                const el = createElement.call(this, { 
                    tag : 'button', 
                    type : btnType, 
                    className : btnClassName, 
                    label : btnLabel 
                });
                
                this.buttonsWrap.append(el);
            }

        }else{
            defaultButtons.call(this);
        }        

        this.dim = document.querySelector('[data-type="dim"]');
        if(dim && !this.dim) {
            this.dim = createElement({
                className : className + '_dim' 
            });
        }

        if(expire && expireData){
            const {className} = this.options;
            const prefix = className + '_expire';
            let expireBox, 
                expireBtn, 
                expireLabel;

            this.expireWrap = createElement.call(this,{
                tag : 'div',
                className : prefix + '_wrap'
            });

            if(Array.isArray(expireData)){
                const that = this;

                expireData.map(({className, id, date, label}) => {
                    expireBox = createElement.call(that, {
                        tag : 'p', 
                        className : prefix + '_box'
                    });
                    
                    expireBtn = createElement.call(that, {
                        tag : 'input',
                        type : 'checkbox', 
                        name : prefix + '_chk', 
                        className : className, 
                        id : id,
                        label : date
                    });

                    expireLabel = createElement.call(that,{
                        tag : 'label',
                        label : prefix + '_label', 
                        id : id,
                        text : label
                    });

                    expireBox.append(expireBtn, expireLabel);
                    this.expireWrap.append(expireBox);
                });

            }else{
                expireBox = createElement.call(this, {
                    tag : 'p',
                     className : prefix + '_box'
                });

                expireBtn = createElement.call(this,{
                    tag : 'input',
                    type : 'checkbox', 
                    className : prefix + '_chk', 
                    id : expireData.id,
                    label : expireData.date
                });

                expireLabel = createElement.call(this, {
                    tag : 'label',
                    label : prefix + '_label', 
                    id : expireData.id,
                    text : expireData.label
                });

                expireBox.append(expireBtn, expireLabel);
                this.expireWrap.append(expireBox);
            }
        } // expired

        this.setAttribute();
        this.layoutAppend(); 

        /**
         * 돔 생성, 버튼 생성하기 위해 호출 시 .call(this) 추가해야 함
         * @param {Object} 
         * @param tag 객체 tag
         * @param id 객체 id
         * @param className 객체 class(복수일 경우 쉼표로 구분)
         * @param name 객체 name
         * @param type 객체 type (input, button)
         * @param label 객체 label (button 텍스트, label 텍스트)
         * @usage
         *      title = createElement({ 
         *          tag : 'p', 
         *          className : 'title,title-red,title-required' 
         *      });
         *      
         *      button = createElement({ 
         *          tag : 'button', 
         *          className : 'cancel',
         *          type : 'button', 
         *          label : '취소버튼' 
         *      });
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

            if(className){
                const splitClassName = className.split(',');

                if(splitClassName.length > 1){
                    splitClassName.map(e =>  el.classList.add(e));

                }else{
                    el.classList.add(className);
                }
            }

            if(name){
                el.name = name;
            }

            if(id && tag !== 'label'){
                el.id = id;
            }

            if(tag === 'label' && text){
                el.innerText = text;
            }
            
            if(tag === 'button'){
                el.setAttribute('type', (type !== '') ? type : 'button');
                el.LayerPopup = this;
                el.innerText = (label !== '') ? label : '버튼';
            }

            if(expire){
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

        // 기본 버튼 생성(확인, 취소)
        function defaultButtons(){
            this.done = createElement.call(this, {
                tag : 'button', 
                className : className + '_button_done', 
                type : 'submit',
                label : '확인'
            });

            this.cancel = createElement.call(this, {
                tag : 'button', 
                className : className + '_button_cancel', 
                label : '취소'
            });

            this.buttonsWrap.append(this.done, this.cancel);
        } // defaultButtons
    } // create

    // 객체 속성 부여
    setAttribute(){
        const {dim} = this.options;
        const otherPopup = findOtherPopup('[data-type="layerPopup"');

        this.wrap
            .style
            .zIndex = (otherPopup) 
            ? Number(otherPopup.style.zIndex) + 1 
            : 1000;

        this.wrap
            .dataset
            .type = 'layerPopup';

        if(dim) {
            this.dim
                .dataset
                .type = 'dim';
        }

        /**
         * name에 해당하는 객체 찾기
         * @param {String} name - 찾으려는 객체의 id, class, tagName
         * @return {Object, Boolean} 타겟이 있으면 타겟 객체, 없으면 false 
         */
        function findOtherPopup(name){
            const target = document.querySelector(name);
            
            if(target){
                return target;
            }

            return false;
        }
    }

    // 레이어팝업 객체 삽입
    layoutAppend(){
        const {appendPosition, title, dim, closeButton, expire, expireData} = this.options;

        this.container.append(this.content);
        
        if(expire && expireData){
            this.footer.append(this.expireWrap);
        }

        this.footer.append(this.buttonsWrap);

        if(title){
            this.header.append(this.title);
        }

        if(closeButton){
            this.header.append(this.closeButton);
        }

        this.wrap.append(
            this.header, 
            this.container, 
            this.footer
        );
        
        this.setContent();
        this.attachEvent();

        document.querySelector(appendPosition).append(this.wrap);
        if(dim && this.dim) document.body.append(this.dim);
    }

    // 타이틀, 콘텐츠 세팅
    setContent(){
        const {title, content} = this.options;
        let outputContent = content;

        if(title) {
            if(typeof title === 'string'){
                this.title.innerHTML = title;

            }else{
                this.title.append(title);
            }
        }

        if(typeof content === 'string'){
            outputContent = wordBreak(content);
            this.content.innerHTML = outputContent;

        }else{
            this.content.append(outputContent);
        }

        // [D] \n를 <br>로 변환
        function wordBreak(text, org = '\n', dest = '<br>'){
            return text.split(org).join(dest);
        }
    }

    // 이벤트 바인딩
    attachEvent(){
        const that = this;
        const {closeButton, customButton, button, expire, expireData} = this.options;
        const buttons = this.buttonsWrap.childNodes;        

        if(closeButton){
            this.closeButton.addEventListener('click', () => {
                this.close();
            });
        }

        if(customButton){
            if(button === ''){
                defaultButtonCaller.call(this);

            }else if(buttons.length > 1){
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
                let event = (Array.isArray(button))
                    ? button[0].event 
                    : button.event;

                if(!event || event === ''){
                    console.log('event가 비어있습니다. 기본이벤트로 대체합니다.');
                    event = this.handleDefaultClick;
                }

                buttons[0].addEventListener('click', event);
            }

        }else{
            defaultButtonCaller.call(this);
        }           
                
        if(expire && expireData){
            const expireBox = this.expireWrap.childNodes;

            if(expireBox.length > 1){
                Array.from(expireBox).map(({childNodes}) => {
                    Array.from(childNodes).find(e => {
                        if(e.tagName.toLowerCase() === 'input'){
                            e.addEventListener('click', handleCheckbox);
                        }
                    });
                });

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

        // 기본 버튼 이벤트 호출러
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

    // 기본 버튼 이벤트
    handleDefaultClick({ target }){
        const {LayerPopup} = target;
        const {options, expireWrap} = LayerPopup;
        const {expire, expireData} = options;

        if(LayerPopup.callback && LayerPopup.callback !== ''){
            let result = (target.classList.value === 'done') ? true : false;
            LayerPopup.callback(result);
        }

        if(expire && expireData){
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

    // 만료일 설정
    handleExpire(day){        
        const { className } = this.options;
        let i = 0;
        let randomNumber = new Date().getMinutes();
        
        for(; i < 4; i++){
            randomNumber += String(Math.floor(Math.random() * 9));  
        }

        this.uniqueName = className + randomNumber;
        this.setCookie(this.uniqueName, day);
    }

    // 쿠키 세팅
    setCookie(value, days){
        const date = new Date();

        date.setDate(date.getDate() + Number(days));
        document.cookie = this.uniqueName + "=" + escape(value) + "; path=/; expires=" + date.toUTCString() + ";"
    }

    // 쿠키 가져오기
    getCookie(name){
        var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return value? value[2] : null;
    }

    // 팝업 열기
    open(){
        if(this.uniqueName && this.getCookie(this.uniqueName)){
            console.log(this.uniqueName,'로 쿠키 적용 중입니다.');

        }else{
            const {dim} = this.options; 

            if(dim && this.dim) {
                this.dim.classList.add('on');
            }
            
            this.wrap.classList.add('on');
        }
    }

    // 팝업 닫기
    close(){
        const {expireWrap} = this;
        const {dim, expire, expireData} = this.options;

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

        if(expire && expireData){
            resetChecked();

            function resetChecked(){
                const child = expireWrap.childNodes;
                Array.from(child).map(({childNodes}) => {
                    Array.from(childNodes).map(e => {
                        if(e.tagName.toLowerCase() === 'input' && e.checked){
                            e.checked = false;
                        }
                    });
                });

            } 
        }
    }

    // [TODO] remove, dettachEvent.. 할당했던거 다 지울것!!
    // remove(){
    //     this.wrap.remove();
    //     this.dim.remove();
    // }

    // dettachEvent(){
    //     console.log('dettachEvent');
    //     const that = this;
    //     const buttons = this.buttonsWrap.childNodes;

    //     Array.from(buttons).map(el => {
    //         el.removeEventListener('click', that.handleDefaultClick);
    //     });
    // }
}