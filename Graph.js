const fs = require('fs');
const node = require("./NodeClass.js");


class GraphClean {
    constructor(data) {

        this.GraphContent = data;
        this.NodeList = new Array();
    }

/*     This function take an array of elements and creates graph nodes out of that array */
    createNodes() {
        let values = this.GraphContent;
        //console.log('this.GraphContent -------------   ' + JSON.stringify(this.GraphContent));
        //console.log('createNodes   ' + JSON.stringify(values));
        for (let i = 0; i < values.length; i++) {

            let ident = i;
            let name = values[i].name;
            //creation of an instance
            let nodeInstance = new node(ident, name);
            //console.log('Node   ' + i + '  with name = '+ JSON.stringify(name));
            nodeInstance.setChildren(values[i].children);
            //adding to the Node List
            this.NodeList.push(nodeInstance);
        }
        //console.log('this.NodeList   ' + JSON.stringify(this.NodeList));
        //console.log("NodeList : ",this.NodeList);
    }


    FindTaskDuration(node) {
        let index = this.NodeList.indexOf(node);
        let val = Object.values(this.GraphContent);

        return val[index].duration;
    }

    FindTaskname(node) {
        let index = this.NodeList.indexOf(node);
        let val = Object.values(this.GraphContent);

        return val[index].name;
    }

    FindTaskId(node) {
        let index = this.NodeList.indexOf(node);
        return index;
    }

    // i think this is a pretty good code ..
    SetNodeParents() {
        //let values = Array.from(Object.values(this.GraphContent));
        let values = Object.values(this.GraphContent);
        //console.log('SetNodeParents   ' + JSON.stringify(values[0]));
        //console.log('data length     ' + values.length );
        for (let i = 0; i < values.length; i++) {
            let links = values[i].children;
            //console.log('links   for ' + i + '     =      ' + JSON.stringify(links));
            //console.log('this.NodeList   ' + JSON.stringify(this.NodeList));
            if (links.length != 0) {
                for (let j = 0; j < links.length; j++) {
                    let childNode = this.NodeList[links[j]];
                    childNode.setParents(i);
                    //console.log(`parents for ${childNode.name} are :`,childNode.parents);
                }
            }
        }
    }

    //finding roots of the graph
    FindRoots() {
        let roots = new Array();
        for (let i = 0; i < this.NodeList.length; i++) {
            if (this.NodeList[i].parents.length == []) {
                roots.push(this.NodeList[i]);
            }
        }
        return roots;
    }

    ReleaseParent(parent) {
        let childnodes = parent.getChildren();
        console.log('trying to release parent  ' + parent.name + '    ,   childnodes   ' + JSON.stringify(childnodes));
        for (let i = 0; i < childnodes.length; i++) {
            let nodeParents = this.NodeList[childnodes[i]].parents;

            if (nodeParents.includes(parent.id)) {
                let parentIndex = (element) => element == parent;
                nodeParents.splice(parentIndex, 1);
            }
            console.log('nodeParents    for  ' + childnodes[i]+ '  ------>>>>>>>>>>>>>>>>>>' + JSON.stringify(nodeParents));
        }
    }

    ShowSuccessors(node) {
        let succs = node.getChildren();
        let selectedSuccs = [];

        for (let i = 0; i < succs.length; i++) {
            let parentsArray = this.NodeList[succs[i]].parents;

            if (parentsArray.length === 0) {
                selectedSuccs.push(this.NodeList[succs[i]]);
            }
        }
        return selectedSuccs;
    }

    ExecuteNode(node, funct) {
        console.log('executing node ....  ' + node.name);
        //node.task.then(funct);
        node.task.then(funct);
    }

    ExecuteTaskNode(node, funct) {
       return new Promise((resolve, reject) => {
            console.log('executing node ....  ' + node.name);
            resolve(node.name)
        });
    }
    
}

module.exports = GraphClean;