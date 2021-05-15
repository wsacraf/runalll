const gp = require('./Graph.js');

var data = require('./tasks.json');
let compGraph = new gp(data['Components']);

//creates instances of node class with all properties except for the parents
compGraph.createNodes();

//sets the parents for each node
compGraph.SetNodeParents();
//console.log("nodelist :",Graph.NodeList);

//gets the roots index
let compRoot = compGraph.FindRoots();



/* We take the array of components and the name of
a component and returns an array of all sections of that particular component */

function getSection(data, componentKey) {
    let components = data['Components'];
    //console.log('data   ' + JSON.stringify(data));
    let i = 0, found = false;
    while (i < components.length & !found) {
        if (components[i].name == componentKey) {
            found = true
        }
        else {
            i = i + 1;
        }
    }
    return components[i].sections;
}

// ------------ Execution ----------------
function Executor(array) {
    let subArray = new Array();
    for (let i = 0; i < array.length; i++) {
        //compGraph.ExecuteNode(array[i], (value) => {
            //console.log('array[i]   ' + JSON.stringify(array[i]) );
            var compSections = getSection(data, array[i].name);
            let sectionGraph = new gp(compSections);
            //console.log('sectionGraph   ' + JSON.stringify(sectionGraph) );
            //creates instances of node class with all properties except for the parents
            sectionGraph.createNodes();
            //sets the parents for each node
            sectionGraph.SetNodeParents();
            //console.log("nodelist :",Graph.NodeList);
            //gets the roots index
            let sectionRoots = sectionGraph.FindRoots();
            //console.log('sectionRoots        ' + JSON.stringify(sectionRoots) );
            SectionExecutor(sectionRoots, compSections, sectionGraph)
            
            //process.exit()
            compGraph.ReleaseParent(array[i]);
            subArray = compGraph.ShowSuccessors(array[i]);
            
            if (subArray.length != 0) {
                console.log('Going to next component ' + subArray[0].name );
                //console.log('Dependants tasks of ' + "\x1b[34m%s\x1b[0m", `${value} are now being launched in parallel.`)
                Executor(subArray);
            }
        //})
    }
}

function SectionExecutor(sectionArray, compSections, sectionGraph) {
    let subArray = new Array();
    console.log('getting inside SectionExecutor    ');
    for (let i = 0; i < sectionArray.length; i++) {
        console.log('getting inside SectionExecutor  inside loop  ');
        //sectionGraph.ExecuteNode(sectionArray[i], (value) => {
            console.log('getting inside SectionExecutor  inside loop  !!!!!!!!!!!!!!!! ');
            var secDesignations = getDesignation(compSections, sectionArray[i].name);
            let designationGraph = new gp(secDesignations);
            designationGraph.createNodes();
            designationGraph.SetNodeParents();
            let designationRoot = designationGraph.FindRoots();
            console.log('designationRoots       ' + JSON.stringify(designationRoot));
            DesignationExecutor(designationRoot, secDesignations, designationGraph)
            sectionGraph.ReleaseParent(sectionArray[i]);
            subArray = sectionGraph.ShowSuccessors(sectionArray[i]);
            
            if (subArray.length != 0) {
                console.log('Going to next section ' + subArray[0].name );
                //console.log('Dependants sections of ' + "\x1b[34m%s\x1b[0m", `${value} are now being launched in parallel.`)
                SectionExecutor(subArray, compSections, sectionGraph);
            }
        //})
    }
}
function getDesignation(compSections, sectionKey) {
    let i = 0, found = false;
    while (i < compSections.length & !found) {
        if (compSections[i].name == sectionKey) {
            found = true
        }
        else {
            i = i + 1;
        }
    }
    return compSections[i].designations;
}



function getTask(secDesignations, designationKey) {
    let i = 0, found = false;
    while (i < secDesignations.length & !found) {
        if (secDesignations[i].name == designationKey) {
            found = true
        }
        else {
            i = i + 1;
        }
    }
    console.log(' designation key =  ' + designationKey + ' and tasks[0].name = ' + JSON.stringify(secDesignations[i].tasks[0].name) );
    return secDesignations[i].tasks;
}

function DesignationExecutor(designationArray, secDesignations, designationGraph) {
    let subArray = new Array();
    for (let i = 0; i < designationArray.length; i++) {
        //designationGraph.ExecuteNode(designationArray[i], (value) => {
            var designationTasks = getTask(secDesignations, designationArray[i].name);
            let taskGraph = new gp(designationTasks);
            taskGraph.createNodes();
            taskGraph.SetNodeParents();
            let taskRoot = taskGraph.FindRoots();
            TaskExecutor(taskRoot, designationTasks, taskGraph)
            designationGraph.ReleaseParent(designationArray[i]);
            subArray = designationGraph.ShowSuccessors(designationArray[i]);
            if (subArray.length != 0) {
                console.log('Going to next designation ' + subArray[0].name );
                //console.log('Dependant designations of ' + "\x1b[34m%s\x1b[0m", `${value} are now being launched in parallel.`)
                DesignationExecutor(subArray,secDesignations, designationGraph);
            }
        //})
    }
}


///////////////
Executor(compRoot);
/* var myCallback = function(data) {
    console.log('got data: ');
  };
  var usingItNow = function(callback) {
    callback('get it?');
  };
  usingItNow(myCallback); */
///////////////


function TaskExecutor(taskArray, designationTasks, taskGraph) {

    //tasks should be executed here .... 

    let subArray = new Array();
    for (let i = 0; i < taskArray.length; i++) {
        console.log(`${taskArray[i].name} is now executing.`);
        taskGraph.ExecuteNode(taskArray[i])
        console.log(`${taskArray[i].name}  is now finished ms`); //+ JSON.stringify(array[i])
        taskGraph.ReleaseParent(taskArray[i]);
        subArray = taskGraph.ShowSuccessors(taskArray[i]);

        if (subArray.length != 0) {
            console.log('Dependants tasks of ' + "\x1b[34m%s\x1b[0m", `${taskArray[i].name} are now being launched in parallel.`)
            TaskExecutor(subArray, designationTasks, taskGraph);
        } 
    }


    console.log('Task root name =  ' + JSON.stringify(taskArray) );

}

/* function TaskExecutor(taskArray, designationTasks) {
    let subArray = new Array();
    for (let i = 0; i < taskArray.length; i++) {
        Graph.ExecuteNode(taskArray[i], (value) => {
           let taskGraph = new gp(getTask(designationTasks, taskArray[i].name));
           taskGraph.createNodes();
           taskGraph.SetNodeParents();
            let taskRoot = taskGraph.FindRoots();
            TaskExecutor(taskRoot)

            console.log('1       ' );
            process.exit()


            Graph.ReleaseParent(taskArray[i]);
            subArray = Graph.ShowSuccessors(taskArray[i]);
            if (subArray.length != 0) {
                console.log('Dependants tasks of ' + "\x1b[34m%s\x1b[0m", `${value} are now being launched in parallel.`)
                Executor(subArray);
            }
            else {
                return;
            }
        })
    }
} */
