const { json, forEach } = require('mathjs');
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
console.log("componenets: " + JSON.stringify(compRoot))


// ------------ Execution ----------------
Executor = async function (array) {
    let subArray = new Array();
    const comp_result = array.map((component) => {
        compGraph.ExecuteNode(component, (value) => {
            console.log('array[i]   ' + JSON.stringify(component));
            var compSections = getSection(data, component.name);
            let sectionGraph = new gp(compSections);
            // console.log('sectionGraph   ' + JSON.stringify(sectionGraph) );
            //creates instances of node class with all properties except for the parents
            sectionGraph.createNodes();
            //sets the parents for each node
            sectionGraph.SetNodeParents();
            // console.log("nodelist :",sectionGraph.NodeList);
            //gets the roots index
            let sectionRoots = sectionGraph.FindRoots();
            console.log('sectionRoots        ' + JSON.stringify(sectionRoots));
            SectionExecutor(sectionRoots, compSections, sectionGraph).then((value) => {
                console.log('return from section executor promise   ' + value);
                compGraph.ReleaseParent(component);
                subArray = compGraph.ShowSuccessors(component);
                if (subArray.length != 0) {
                    console.log('Going to next component ' + subArray[0].name);
                    //console.log('Dependants tasks of ' + "\x1b[34m%s\x1b[0m", `${value} are now being launched in parallel.`)
                    //await(Executor(subArray));
                    Executor(subArray)
                } else {
                    return
                }

            })
        })
    })
    Promise.all(comp_result).then((values) => {
        return values
    }
    )

}


/* We take the array of components and the name of
a component and returns an array of all sections of that particular component */

function getSection(data, componentKey) {
    let components = data['Components'];
    //  console.log('data   ' + JSON.stringify(data));
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

SectionExecutor = async function (sectionArray, compSections, sectionGraph) {
    // return new Promise((resolve, reject) => {
    let subArray = new Array();
    // console.log('getting inside SectionExecutor    ' + sectionArray[0].name);

    let section_result = sectionArray.map((section) => {
        // console.log('getting inside SectionExecutor  inside loop  ' + i + ' >> ' + sectionArray[i].name);
        sectionGraph.ExecuteNode(section, (value) => {
            //  console.log('getting inside SectionExecutor  inside loop  !!!!!!!!!!!!!!!! ' + sectionArray[i].name);
            var secDesignations = getDesignation(compSections, section.name);
            let designationGraph = new gp(secDesignations);
            designationGraph.createNodes();
            designationGraph.SetNodeParents();
            let designationRoot = designationGraph.FindRoots();
            //  console.log('designationRoots       ' + JSON.stringify(designationRoot));
            DesignationExecutor(designationRoot, secDesignations, designationGraph).then((value) => {
                console.log('return from designation executor promise   ' + value);

                sectionGraph.ReleaseParent(section);
                subArray = sectionGraph.ShowSuccessors(section);
                if (subArray.length != 0) {
                    console.log('Going to next section ' + subArray[0].name);
                    //console.log('Dependants sections of ' + "\x1b[34m%s\x1b[0m", `${value} are now being launched in parallel.`)
                    // return(await(SectionExecutor(subArray, compSections, sectionGraph)))
                    SectionExecutor(subArray, compSections, sectionGraph).then(
                        (v) => v
                    );
                } else {
                    new Promise(resolve => {
                        resolve("\t\t This is first promise");

                    });
                }
            })
        })
    })
    Promise.all(section_result).then((values) => {
        new Promise(resolve => {
            resolve(values);

        });
    }
    )

    //  });
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


DesignationExecutor = async function (designationArray, secDesignations, designationGraph) {
    //return new Promise((resolve, reject) => {
    let subArray = new Array();
    let design_result = designationArray.map((designation) => {
        designationGraph.ExecuteNode(designation, (value) => {
            var designationTasks = getTask(secDesignations, designation.name);
            let taskGraph = new gp(designationTasks);
            taskGraph.createNodes();
            taskGraph.SetNodeParents();
            let taskRoot = taskGraph.FindRoots();
            TaskExecutor(taskRoot, designationTasks, taskGraph).then((value) => {
                designationGraph.ReleaseParent(designation);
                subArray = designationGraph.ShowSuccessors(designation);
                if (subArray.length != 0) {
                    console.log('Going to next designation ' + subArray[0].name);
                    //console.log('Dependant designations of ' + "\x1b[34m%s\x1b[0m", `${value} are now being launched in parallel.`)
                    //  await(DesignationExecutor(subArray, secDesignations, designationGraph));
                    DesignationExecutor(subArray, secDesignations, designationGraph).then(
                        (v) => v
                    );
                } else {
                    new Promise(resolve => {

                        resolve("\t\t This is first promise");

                    });
                }
            })
        })

    })
    Promise.all(design_result).then((values) => {
        new Promise(resolve => {
            resolve(values);

        });
    }
    )

    //  })

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
    // console.log(' designation key =  ' + designationKey + ' and tasks[0].name = ' + JSON.stringify(secDesignations[i].tasks[0].name));
    return secDesignations[i].tasks;
}

executeTask = async function (task, designationTasks, taskGraph) {
    return taskGraph.ExecuteTaskNode(task, (value) => {
        console.log(`${task.name}  is now finished ms`); //+ JSON.stringify(array[i])
        taskGraph.ReleaseParent(task);
        subArray = taskGraph.ShowSuccessors(taskArray[i]);
        resolve(subArray)
    })
}

TaskExecutor = async function (taskArray, designationTasks, Graph) {
    console.log("I entered TaskExecutor " + JSON.stringify(taskArray))
    let subArray = new Array();
    var results = taskArray.map((task) => {
        Graph.ExecuteNode(task, (value) => {
            Graph.ReleaseParent(task);
            subArray = Graph.ShowSuccessors(task);
            console.log("subArray " + JSON.stringify(subArray))
            if (subArray.length != 0) {
                console.log('Dependants tasks of ' + "\x1b[34m%s\x1b[0m", `${value} are now being launched in parallel.`)
                TaskExecutor(subArray, designationTasks, Graph).then(
                    (v) => v
                );
            }
            else {
                console.log("subArray of task " + task.name + " is empty");
                new Promise(resolve => {
                    resolve("task");

                });;
            }
        })
    });
    console.log("results are:" + JSON.stringify(results))
    Promise.all(results).then(values => {
        return new Promise(resolve => {
            console.log("task executor results done");
            resolve(values);

        });
    })
}


TaskExecutor2 = async function (taskArray, designationTasks, taskGraph) {
    // new Promise((resolve, reject) => {
    if (taskArray != undefined && taskArray != null && taskArray.length > 0) {
        console.log("ligne 285:" + JSON.stringify(taskArray))
        var task_result = taskArray.map((task) => {
            executeTask(task, designationTasks, taskGraph).then((successors) => {
                if (successors.length != 0) {
                    // await(TaskExecutor2(successors, designationTasks, taskGraph));
                    TaskExecutor2(successors, designationTasks, taskGraph)

                } else {
                    new Promise(resolve => {
                        resolve("values");

                    });
                }
            });
        });

        Promise.all(task_result).then(
            values => {
                new Promise(resolve => {
                    resolve(values);

                });
            }
        );

    } else
        new Promise(resolve => {
            resolve("values");

        });


    //  await(rou)

    // });

}

///////////////
//Executor(compRoot);
///////////////



/* var p1 = new Promise((resolve, reject) => {
    console.log("P1")
    setTimeout(resolve, 5000, 'un');
});

var p3 = new Promise((resolve, reject) => {
    console.log("P3")
    var p2 = new Promise((resolve, reject) => {
        console.log("P2")
        setTimeout(resolve, 500, 'deux');
    });

    p2.then(v => {
        setTimeout(resolve, 500, 'trois' + "-" + v);
    })

});
var p4 = new Promise((resolve, reject) => {
    console.log("P4")
    setTimeout(resolve, 500, 'quatre');
}); */





let tasksArray = [1, 2, 3]

var arrayP = [];
function recursiveMe(tasksArray) {
    console.log("hello " + tasksArray[0])
    execute(tasksArray[0]).then(values=>{
        console.log("then of execute")
        tasksArray.splice(0, 1)
        console.log("new length = "+tasksArray.length)
        if (tasksArray.length > 0) {
            return recursiveMe(tasksArray)
        }
        else {
            return new Promise((resolve, reject) => {
                setTimeout(resolve, 500, 'done');
            })
        }
    })
  

    /* if (index == 3) {
         console.log("I entered if with count" + index)
         return new Promise((resolve, reject) => {
             setTimeout(resolve, 500, index);
         })
     }
     else {
         console.log("I entered else with count" + index)
         return recursiveMe(index + 1)
     }*/
}

//var output = recursiveMe(tasksArray)
var p1 = new Promise((resolve, reject) => {
    console.log("P1")
    setTimeout(resolve, 5000, 'un');
});


execute = function (val) {
   return( new Promise((resolve, reject) => {
        console.log(val)
        setTimeout(resolve, 5000, val);
    }));
 }


var output=recursiveMe(tasksArray)

console.log("output =" + JSON.stringify(output))
output.then(values => {
    console.log("values: " + values);
}
)
/* Promise.all(arrayP).then(values => {
    //console.log("our array is :" + JSON.stringify(arrayP))
    console.log("values" + values);
}, reason => {
    console.log(reason)
}); */

