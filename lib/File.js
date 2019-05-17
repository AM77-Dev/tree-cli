module.exports = class File {
    
    constructor(){
        this._name =  ""
        this._size =  0
        this._owner =  ""
        this._group =  ""
        this._permissions =  {}
        this._type =  {}
        this._created_at =  ""
        this._last_modification =  ""
    }

    set name(_name){
        this._name = _name
    }
    get name(){
        return this._name
    }

    set size(_size){
        this._size = _size
    }
    get size(){
        return this._size
    }

    set owner(_owner){
        this._owner = _owner
    }
    get owner(){
        return this._owner
    }
    
    set group(_group){
        this._group = _group
    }
    get group(){
        return this._group
    }

    set permissions(_permissions){
        this._permissions = _permissions
    }
    get permissions(){
        return this._permissions
    }

    set type(_type){
        this._type = _type
    }
    get type(){
        return this._type
    }

    set created_at(_created_at){
        this._created_at = _created_at
    }
    get created_at(){
        return this._created_at
    }

    set last_modification(_last_modification){
        this._last_modification = _last_modification
    }
    get last_modification(){
        return this._last_modification
    }

}