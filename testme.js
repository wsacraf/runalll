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


/* function ExecutorTest(array) {
    let subArray = new Array();
    var compo_result = array.map((component) => {
        compGraph.ExecuteNode(component, (value) => {
            var compSections = getSection(data, component.name);
            let sectionGraph = new gp(compSections);
            sectionGraph.createNodes();
            sectionGraph.SetNodeParents();
            let sectionRoots = sectionGraph.FindRoots();
            SectionExecutor(sectionRoots, compSections, sectionGraph).then((value) => {
                console.log('return from section executor promise   ' + value);
                compGraph.ReleaseParent(component);
                subArray = compGraph.ShowSuccessors(component);
                if (subArray.length != 0) {
                    console.log('Going to next component ' + subArray[0].name);
                    ExecutorTest(subArray);
                } else {
                    return
                }
            })
        })
    });

    const componentsresults = await Promise.all(compo_result);
    console.log(componentsresults);


} */

// ------------ Execution ----------------
function Executor(array) {
    let subArray = new Array();
    
    for (let i = 0; i < array.length; i++) {
        compGraph.ExecuteNode(array[i], (value) => {
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
            SectionExecutor(sectionRoots, compSections, sectionGraph).then((value) => {
                console.log('return from section executor promise   ' + value);
                compGraph.ReleaseParent(array[i]);
                subArray = compGraph.ShowSuccessors(array[i]);
                if (subArray.length != 0) {
                    console.log('Going to next component ' + subArray[0].name);
                    //console.log('Dependants tasks of ' + "\x1b[34m%s\x1b[0m", `${value} are now being launched in parallel.`)
                    Executor(subArray);
                } else {
                    return
                }

            })
        })
    }
}

SectionExecutor = function (sectionArray, compSections, sectionGraph) {
    return new Promise((resolve, reject) => {
        let subArray = new Array();
        console.log('getting inside SectionExecutor    ' + sectionArray[0].name);
        let ress;
        for (let i = 0; i < sectionArray.length; i++) {
            console.log('getting inside SectionExecutor  inside loop  ' + i + ' >> ' + sectionArray[i].name);
            sectionGraph.ExecuteNode(sectionArray[i], (value) => {
                console.log('getting inside SectionExecutor  inside loop  !!!!!!!!!!!!!!!! ' + sectionArray[i].name);
                var secDesignations = getDesignation(compSections, sectionArray[i].name);
                let designationGraph = new gp(secDesignations);
                designationGraph.createNodes();
                designationGraph.SetNodeParents();
                let designationRoot = designationGraph.FindRoots();
                console.log('designationRoots       ' + JSON.stringify(designationRoot));
                DesignationExecutor(designationRoot, secDesignations, designationGraph).then((value) => {
                    console.log('return from designation executor promise   ' + value);
                    
                    sectionGraph.ReleaseParent(sectionArray[i]);
                    subArray = sectionGraph.ShowSuccessors(sectionArray[i]);
                    if (subArray.length != 0) {
                        console.log('Going to next section ' + subArray[0].name);
                        //console.log('Dependants sections of ' + "\x1b[34m%s\x1b[0m", `${value} are now being launched in parallel.`)
                        SectionExecutor(subArray, compSections, sectionGraph).then((value) => {
                            resolve('we are done 1')
                        })
                    } else {
                        console.log('before resolve   ' + sectionArray.length);
                        //resolve('section done ! ' + sectionArray[i].name )
                        if(i==sectionArray.length - 1){
                            resolve('we are done 2')
                        }
                    }
                    
                })
            })
        }
    });
}



DesignationExecutor = function (designationArray, secDesignations, designationGraph) {
    return new Promise((resolve, reject) => {
        let subArray = new Array();
        console.log('getting inside DesignationExecutor   ' + designationArray.length);
        for (let i = 0; i < designationArray.length; i++) {
            console.log('getting inside designationExecutor  inside loop  ' + i);
            designationGraph.ExecuteNode(designationArray[i], (value) => {
                console.log('getting inside SectionExecutor  inside loop  !!!!!!!!!!!!!!!! ' + designationArray[i].name);
            })
        }
        console.log('before resolve   ' + designationArray[0].name);
        resolve('designation done ! ' + designationArray[0].name)
    });
}






function SectionExecutor1(sectionArray, compSections, sectionGraph) {
    let subArray = new Array();
    console.log('getting inside SectionExecutor    ' + sectionArray.length);
    for (let i = 0; i < sectionArray.length; i++) {
        console.log('getting inside SectionExecutor  inside loop  ' + i);
        sectionGraph.ExecuteNode(sectionArray[i], (value) => {
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
            }else{
                return
            }
        })
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
        designationGraph.ExecuteNode(designationArray[i], (value) => {
            var designationTasks = getTask(secDesignations, designationArray[i].name);
            let taskGraph = new gp(designationTasks);
            taskGraph.createNodes();
            taskGraph.SetNodeParents();
            let taskRoot = taskGraph.FindRoots();
            //TaskExecutor(taskRoot, designationTasks, taskGraph)
            TaskExecutor2(taskRoot, designationTasks, taskGraph)

            process.exit()


            designationGraph.ReleaseParent(designationArray[i]);
            subArray = designationGraph.ShowSuccessors(designationArray[i]);
            if (subArray.length != 0) {
                console.log('Going to next designation ' + subArray[0].name );
                //console.log('Dependant designations of ' + "\x1b[34m%s\x1b[0m", `${value} are now being launched in parallel.`)
                DesignationExecutor(subArray,secDesignations, designationGraph);
            }else{
                return
            }
        })
    }
}


function executeTask(task, designationTasks, taskGraph){
    return taskGraph.ExecuteTaskNode(task, (value) => {
        console.log(`${taskArray[i].name}  is now finished ms`); //+ JSON.stringify(array[i])
        taskGraph.ReleaseParent(taskArray[i]);
        subArray = taskGraph.ShowSuccessors(taskArray[i]);
        resolve(subArray)
    })
}

function TaskExecutor2(taskArray, designationTasks, taskGraph):Pr {
    var task_result = taskArray.map((task) => {
        executeTask(task).then((successors) => {
            if (successors.length != 0) {
                await TaskExecutor2(successors, designationTasks, taskGraph);
            } else {
                resolve('tasks done');
            }
        });
    });

    const tasksresults = await Promise.all(task_result);
    return tasksresults;
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
        taskGraph.ExecuteTaskNode(taskArray[i])
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
