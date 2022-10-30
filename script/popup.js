class Popup{
    constructor(className){
        this._className = className;
        this.popup = document.querySelector(`.${className}`);
        this._EscapeUp = this._EscapeUp.bind(this);
    }

    _EscapeUp(event){
        if(event.key  === 'Escape'){
            this.close();
        }
    }

    open(){
        this.popup.classList.add('popup_active');
        document.addEventListener('keyup', this._EscapeUp);
    }
    close(){
        this.popup.classList.remove('popup_active');
        document.removeEventListener('keyup', this._EscapeUp);
    }
    setEventListener(){
        this.popup.addEventListener('click', (event) => {
            if(event.target.classList.contains(this._className) || event.target.closest('.popup__close')){
                this.close();
            }
        })
    }
}