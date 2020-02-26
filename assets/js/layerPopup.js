/**
 * @author yoonseo.lee <okayoon.lee@gmail.com>
 * @version 1.0.0
 * @since 2019.11
 * @file 레이어팝업 플러그인
 * @copyright yoonseo.lee 2019.11
 * 
 * @see https://github.com/jsdoc/jsdoc/issues/819
 */

 class LayerPopup{

    /**
     * 레이어팝업 생성, 삽입, 삭제, 커스텀 클래스
     * @param {object} parameters - 옵션 
     * @param {function} callbackFunc - 기본 버튼 클릭 시 실행될 콜백함수 
     */
    constructor(parameters, callbackFunc){
        
        /**
         * @member LayerPopup#name
         * @prop {string} name 생성자 이름
         * @prop {string} name 생성자 이름
         * @prop {string} options 생성자 이름
         */
        this.name = "LayerPopup";        
        this.options = {
            appendPosition : 'body', 
            className : 'popup', 
            title : 'title',
            content : 'please write your message...',
            
            button : true,
            dim : true,
            scroll : true,
            
            expire : false,           
            expireData : {
                date : 1,
                id : 'day',
                label : '하루동안보지않기'
            },

            closeButton : true,
            closeButtonData : {
                src : '',
                label : 'x'
            },

            customButton : false,
            customButtonData : [
                {
                    type : '',
                    className : '',
                    label : '',
                    event : '',
                }
            ]
        };

        if(parameters){
            if(typeof parameters === 'object'){
                this.options = Object.assign({}, this.options, parameters);
                this.callback = callbackFunc || '';
    
            }else if(typeof parameters === 'function'){
                this.callback = parameters;
    
            }else{
                console.log('error : 옵션 값을 확인해주세요.');
                return false;
            }
        }
        
        this._initialize();
    }   

    /**
     * 레이어 팝업 객체 생성 및 삽입 컨트롤
     * @this LayerPopup
     */
    _initialize(){
        const {
            className, 
            closeButton, 
            closeButtonData, 
            button, 
            customButton,
            title, 
            dim, 
            expire, 
            expireData
        } = this.options;

        const _createElement = this._createElement;

        this.wrap = _createElement({
            className : className + '_wrap'
        });    

        this.wrapInner = _createElement({
            className : className + '_inner'
        });           

        this.container = _createElement({
            className : className + '_container'
        });        

        this.content = _createElement({
            tag : 'div', 
            className : className + '_content'
        });
        
        this.dim = document.querySelector('[data-type="dim"]');

        if(dim && !this.dim) {
            this.dim = _createElement({
                className : className + '_dim' 
            });
        }

        if(title || closeButton){
            this.header = _createElement({
                className : className + '_header'
            });
        }

        if(title) {
            this.title = _createElement({
                tag : 'p', 
                className : className + '_title'
            });
        }

        if(closeButton){
            const closeLabel = (closeButtonData.label === '') 
                ? 'x' 
                : closeButtonData.label;

            this.closeButton = _createElement({
                tag : 'button',
                className : className + '_close',
                label : closeLabel,
                src : closeButtonData.src
            });
        }

        if(button || expire){
            this.buttonsWrap = _createElement({
                tag : 'div', 
                className : className + '_buttons_wrap'
            });

            this.footer = _createElement({
                className : className + '_footer'
            });
        }

        if(button){
            if(customButton){
                const that = this;
                const {customButtonData} = this.options;
    
                if(customButtonData === ''){
                    defaultButtons.call(this);
    
                }else if(Array.isArray(customButtonData) && customButtonData.length > 1){
                    customButtonData.map(e => {
                        let key = this.getRandomNumber();
                        e.key = key;
    
                        let el = _createElement.call(that, { 
                            tag : 'button', 
                            type : e.type, 
                            className : (e.className) ? e.className : key,                         
                            label : e.label
                        });
    
                        that.buttonsWrap.append(el);
                    });                
    
                }else{
                    const key = this.getRandomNumber();
                    let btn = (Array.isArray(customButtonData)) 
                        ? customButtonData[0] 
                        : customButtonData;
                    const {type, className, label, event} = btn;
                    btn.key = key;

                    const el = _createElement.call(this, { 
                        tag : 'button', 
                        type : type, 
                        className : (className) ? className : key, 
                        label : label
                    });
                    
                    this.buttonsWrap.append(el);
                }
    
            }else{
                defaultButtons.call(this);
            }
        }

        if(expire && expireData){
            const {className} = this.options;
            const prefix = className + '_expire';
            let expireBox, 
                expireBtn, 
                expireLabel;

            this.expireWrap = _createElement.call(this,{
                tag : 'div',
                className : prefix + '_wrap'
            });

            if(Array.isArray(expireData)){
                const that = this;

                expireData.map(({className, id, date, label}) => {
                    expireBox = _createElement.call(that, {
                        tag : 'p', 
                        className : prefix + '_box'
                    }); 

                    expireBtn = _createElement.call(that, {
                        tag : 'input',
                        type : 'checkbox', 
                        name : prefix + '_chk', 
                        className : className, 
                        id : id,
                        label : date
                    });

                    expireLabel = _createElement.call(that,{
                        tag : 'label',
                        label : prefix + '_label', 
                        id : id,
                        text : label
                    });

                    expireBox.append(expireBtn, expireLabel);
                    this.expireWrap.append(expireBox);
                });

            }else{
                expireBox = _createElement.call(this, {
                    tag : 'p',
                    className : prefix + '_box'
                });

                expireBtn = _createElement.call(this,{
                    tag : 'input',
                    type : 'checkbox', 
                    className : prefix + '_chk', 
                    id : expireData.id,
                    label : expireData.date
                });

                expireLabel = _createElement.call(this, {
                    tag : 'label',
                    label : prefix + '_label', 
                    id : expireData.id,
                    text : expireData.label
                });

                expireBox.append(expireBtn, expireLabel);
                this.expireWrap.append(expireBox);
            }
        } // expired

        this._setAttribute();
        this._layoutAppend(); 


        // 기본 버튼 생성(확인, 취소)
        function defaultButtons(){
            this.done = _createElement.call(this, {
                tag : 'button', 
                className : className + '_button_done', 
                type : 'submit',
                label : 'confirm'
            });

            this.cancel = _createElement.call(this, {
                tag : 'button', 
                className : className + '_button_cancel', 
                label : 'cancel'
            });

            this.buttonsWrap.append(this.done, this.cancel);
        }
    } // initialize


    /**
     * 객체 생성하는 함수, 버튼 생성할때는 호출 시 .call(this) 바인딩해줘야 함.
     * @param {string} tag 객체 tagName (default = div)
     * @param {string} id 객체 id
     * @param {string} className  객체 class
     * @param {string} name 객체 name
     * @param {string} type 객체 종류 (default = button)
     * @param {label} label label 텍스트 (default = 버튼)
     * @param {string} src 버튼 이미지 주소
     * @param {string} text 버튼 텍스트
     * @return {object} 레이어팝업 객체
     * @example
     * title = _createElement({ 
     *      tag : 'p', 
     *      className : 'title,title-red,title-required' 
     * });
     *      
     * button = _createElement.call(this,{ 
     *      tag : 'button', 
     *      className : 'cancel',
     *      type : 'button', 
     *      label : '취소버튼' 
     * });
     */
    _createElement({ 
        tag = 'div', 
        id, 
        className, 
        name, 
        type = 'button', 
        label = '버튼', 
        src,
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
            
            if(src && src !== ''){
                el.style.backgroundImage = 'url(' + src + ')';
                el.classList.add('bg');
            }
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
    } // _createElement


    /**
     * 옵션에 따라 객체 속성 컨트롤
     * @this LayerPopup
     */
    _setAttribute(){
        const {dim} = this.options;
        const {style, dataset} = this.wrap;

        style.zIndex = 1000;
        dataset.type = 'layerPopup';

        if(dim) {
            this.dim.dataset.type = 'dim';
        }
    }

    /**
     * 레이어팝업 객체 삽입하는 함수
     * @throws 선언 순서가 변경되면 안됨
     */
    _layoutAppend(){
        const { appendPosition, title, dim, closeButton, button, expire, expireData} = this.options;

        if(title){
            this.header.append(this.title);
        }

        if(closeButton){
            this.header.append(this.closeButton);
        }

        this.container.append(this.content);
        
        if(expire && expireData){
            this.footer.append(this.expireWrap);
        }

        if(button || expire){
            this.footer.append(this.buttonsWrap);
        }

        if(this.header){
            this.wrapInner.append(this.header); 
        }

        this.wrapInner.append(this.container); 

        if(button || expire){
            this.wrapInner.append(this.footer); 
        }

        this.wrap.append(this.wrapInner);
        
        this.setContent();
        this.attachEvent();

        if(appendPosition !== ''){
            let target = document.querySelector(appendPosition); 
            if(target === '' || !target) {
                target = document.querySelector('body');
            }

            target.append(this.wrap);
        }

        if(dim && this.dim) document.body.append(this.dim);
    }

    // 타이틀, 콘텐츠 세팅
    setContent(){
        const {title, content} = this.options;
        let outputContent = content;
        let outputTitle = content;

        if(title) {
            if(typeof title === 'string'){
                outputTitle = wordBreak(title);
                this.title.innerHTML = outputTitle;

            }else{
                this.title.append(outputTitle);
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
        const {closeButton, customButton, button, customButtonData, expire, expireData} = this.options;

        if(closeButton){
            this.closeButton.addEventListener('click', () => {
                this.close();
            });
        }

        if(button){
            const buttonNodes = this.buttonsWrap.childNodes;        

            if(customButton){
                if(customButtonData === ''){
                    defaultButtonCaller.call(this);
    
                }else if(customButtonData.length > 1){
                    Array.from(buttonNodes).map(el => {
                        customButtonData.find((e) => {
                            if(e.event && typeof e.event === 'function'){
                                if(el.className === e.key || el.className === e.className){
                                    el.addEventListener('click', e.event);
                                    el.event = e.event;
                                }
    
                            }else{
                                console.log('event가 비어있습니다. 기본이벤트로 대체합니다.');
                                e.event = that.handleDefaultClick;
                            }
                        });
                    });

                }else{
                    let event = customButtonData.event
                    const button = buttonNodes[0];

                    if(Array.isArray(customButtonData)){
                        event = customButtonData[0].event;
                    }
    
                    if(!event || typeof event !== 'function' || event === ''){
                        console.log('event가 비어있습니다. 기본이벤트로 대체합니다.');
                        event = this.handleDefaultClick;
                    }

                    button.event = event;
                    button.addEventListener('click', event);
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
            }
        }else{
            if(expire && expireData){
                if(expireData.length > 1) {
                    return false;
                }
                
                const expireBox = this.expireWrap.childNodes;
                
                Array.from(expireBox[0].childNodes).map((el) => {
                    el.addEventListener('click', ({target}) => {
                        if(target.tagName.toLowerCase() === 'input'){
                            that.handleExpire(target.value);
                            that.close();
                        }
                        
                    });
                });
                
            }
        }

        // 기본 버튼 이벤트 호출러
        function defaultButtonCaller(){
            const that = this;

            if(this.buttonsWrap.childNodes.length > 1){
                const buttons = this.buttonsWrap.childNodes;

                Array.from(buttons).map(el => {
                    el.addEventListener('click', that.handleDefaultClick);
                    el.event = that.handleDefaultClick;
                });
            }
        }
    } // attachEvent


    // 기본 버튼 이벤트 @callback
    handleDefaultClick({ target }){
        const {LayerPopup} = target;
        const {options, expireWrap} = LayerPopup;
        const {button, expire, expireData} = options;
        const btnClass = target.classList.value;
        let result = (btnClass.search('done') > 0) ? true : false;

        if(button){
            if(LayerPopup.callback && LayerPopup.callback !== ''){
                LayerPopup.callback(result);
            }
        }

        if(expire && expireData){
            const expire = expireWrap.childNodes;
                Array.from(expire).map(({childNodes}) => {
                    Array.from(childNodes).map(e => {
                        if(e.tagName.toLowerCase() === 'input'){
                            if(e.checked && result){
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
        let randomNumber = this.getRandomNumber();
        
        this.uniqueName = className + randomNumber;
        this.setCookie(this.uniqueName, day);
    }

    getRandomNumber(){
        let num = new Date().getMinutes();

        let i = 0;
        for(; i < 4; i++){
            num += String(Math.floor(Math.random() * 9));  
        }

        return num;
    }

    // 쿠키 세팅
    setCookie(value, days){
        const date = new Date();

        date.setDate(date.getDate() + Number(days));
        document.cookie = this.uniqueName + "=" + escape(value) + "; path=/; expires=" + date.toUTCString() + ";"
    }

    // 쿠키 가져오기
    getCookie(name){
        const value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return value ? value[2] : null;
    }

    // 팝업 열기
    open(){
        if(this.uniqueName && this.getCookie(this.uniqueName)){
            console.log(this.uniqueName,'로 쿠키 적용 중입니다.');

        }else{
            const {dim, scroll} = this.options; 

            if(!scroll){
                this.setBodyScroll(false);
            }

            setZindex.call(this);
            
            if(dim && this.dim) {
                this.dim.classList.add('on');
            }
            
            this.wrap.classList.add('on');

            // zindex 설정
            function setZindex(){
                const otherPopup = document.querySelectorAll('[data-type="layerPopup"].on');

                if(otherPopup){
                    if(!this.wrap.classList.contains('on')){
                        this.wrap.style.zIndex =  Number(this.wrap.style.zIndex) + Number(otherPopup.length);
                    }
                }
            }
        }
    }

    // 팝업 닫기
    close(isExpireState){
        const {expireWrap} = this;
        const {dim, scroll, expire, expireData} = this.options;

        if(!scroll){
            this.setBodyScroll(true);
        }

        this.wrap.style.zIndex = 1000;
        this.wrap.classList.remove('on');

        if(dim && this.dim) {
            const layer = document.querySelectorAll('[data-type="layerPopup"]');
            let i = 0;

            // 팝업이 여러개일때 딤처리
            Array.from(layer).map(({classList}) => {
                if(!classList.contains('on')){
                    i ++;
                }
            });

            if(layer.length === i){
                this.dim.classList.remove('on');
            }
        }

        if(expire && expireData){
            resetChecked(this);

            function resetChecked(LayerPopup){
                const child = expireWrap.childNodes;
                Array.from(child).map(({childNodes}) => {
                    Array.from(childNodes).map(e => {
                        if(e.tagName.toLowerCase() === 'input' && e.checked){
                            e.checked = false;

                            if(isExpireState){
                                LayerPopup.handleExpire(e.value);
                            }
                        }
                    });
                });

            } 
        }
    }

    setBodyScroll(isState){
        if(isState){
            document.body.style.removeProperty('overflow');

        }else{
            document.body.style.overflow = 'hidden';
        }
    }

    remove(){
        const otherPopup = document.querySelectorAll('[data-type="layerPopup"].on');

        if(otherPopup){
            this.dim.remove();
        }

        this.dettachEvent();
        this.wrap.remove();

        this.name,
        this.options,
        this.callback,
        this.dim,
        this.wrap,
        this.wrapInner,
        this.header,
        this.container,
        this.footer,
        this.content,
        this.title,
        this.closeButton,
        this.buttonsWrap,
        this.done,
        this.cancel,
        this.expireWrap,
        this.uniqueName = null;
    }
    
    dettachEvent(){
        const buttonNodes = this.buttonsWrap.childNodes;
            
        Array.from(buttonNodes).map(el => {
            el.removeEventListener('click', el.event);
        });
    }
}