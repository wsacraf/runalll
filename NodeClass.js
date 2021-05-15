class NodeClass {
    constructor(id, name) {
        this.parents = [];
        this.children = [];
        this.name = name;
        this.id = id;
        this.start = false;
        this.finish = false;

        this.task = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.name)
            }, 100);
        });

        this.task1 = function(){
            setTimeout(() => {
                console.log('task executed ... ' + this.name)
            }, 7000);
        };
    }


    setParents(Parent) {
        this.parents.push(Parent)
    }

    setChildren(childrenArray) {
        this.children = childrenArray;
    }

    getParents() {
        return this.parents;
    }

    getChildren() {
        return this.children;
    }

}

module.exports = NodeClass;